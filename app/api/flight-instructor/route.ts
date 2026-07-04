import { buildLocalInstructorReport } from "@/lib/flightInstructor/localReport";
import { FLIGHT_INSTRUCTOR_SYSTEM_PROMPT } from "@/lib/flightInstructor/prompt";
import type { FlightInstructorReport, FlightInstructorRequest } from "@/lib/flightInstructor/types";
import { localEvaluate } from "@/lib/evaluate/localEvaluate";
import { requireUser } from "@/lib/auth/requireUser";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  let body: FlightInstructorRequest & {
    memoryContext?: {
      yesterdaySummary?: string | null;
      topPronunciationMistakes?: string[];
      recurringWeakAreas?: string[];
    };
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const {
    transcript,
    question,
    modelAnswer,
    type,
    keywords,
    answerMode = "peel",
    memoryContext,
    scores,
    icaoLevel,
    azureWeakWords,
  } = body;

  if (!transcript?.trim() || !modelAnswer) {
    return Response.json({ error: "transcript and modelAnswer required" }, { status: 400 });
  }

  const local = localEvaluate({
    transcript,
    question,
    modelAnswer,
    type,
    keywords,
    answerMode,
  });

  if (scores) {
    local.scores = { ...local.scores, ...scores };
  }
  if (icaoLevel && local.icaoLevel) {
    local.icaoLevel.overall = icaoLevel as typeof local.icaoLevel.overall;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(buildLocalInstructorReport(local, question, modelAnswer));
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        temperature: 0.45,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: FLIGHT_INSTRUCTOR_SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              type,
              question,
              modelAnswer,
              keywords: keywords ?? [],
              answerMode,
              candidateTranscript: transcript,
              localScores: local.scores,
              localStrengths: local.strengths,
              localImprovements: local.improvements,
              missingKeywords: local.missingKeywords,
              azureWeakWords: azureWeakWords ?? [],
              memoryContext: memoryContext ?? {},
            }),
          },
        ],
      }),
    });

    if (!res.ok) {
      console.error("Flight instructor OpenAI error:", await res.text());
      return Response.json(buildLocalInstructorReport(local, question, modelAnswer));
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(raw) as FlightInstructorReport;

    const report: FlightInstructorReport = {
      ...parsed,
      source: "openai",
      icaoEvaluation: {
        ...parsed.icaoEvaluation,
        disclaimer:
          parsed.icaoEvaluation?.disclaimer ??
          "This is a training estimate — not an official SDEA/ANAC rating.",
      },
      improvedAnswer: {
        studentVersion: parsed.improvedAnswer?.studentVersion ?? transcript,
        coachVersion: parsed.improvedAnswer?.coachVersion ?? local.suggestedAnswer ?? modelAnswer,
        whatChanged: parsed.improvedAnswer?.whatChanged ?? [],
      },
    };

    return Response.json(report);
  } catch (e) {
    console.error(e);
    return Response.json(buildLocalInstructorReport(local, question, modelAnswer));
  }
}

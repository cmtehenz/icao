import { localEvaluate } from "@/lib/evaluate/localEvaluate";
import { ensurePart1SuggestedAnswer } from "@/lib/evaluate/peel";
import { estimateIcaoLevel } from "@/lib/evaluate/icaoLevel";
import type { EvaluateFeedback, EvaluateRequest } from "@/lib/evaluate/types";
import { requireUser } from "@/lib/auth/requireUser";

const SYSTEM_PROMPT = `You are an ICAO English exam coach for helicopter pilots (SDEA/ANAC).
Evaluate the candidate's spoken answer (provided as transcript from speech recognition).
Return ONLY valid JSON with this shape:
{
  "scores": { "overall": 0-100, "structure": 0-100, "content": 0-100, "phraseology": 0-100, "pronunciation": 0-100 },
  "summary": "2 sentences in Portuguese",
  "strengths": ["..."],
  "improvements": ["..."],
  "missingKeywords": ["..."],
  "suggestedAnswer": "improved answer in English — REQUIRED for part1"
}
Rules:
- Compare against the model answer and question.
- For part1: accept paraphrases — same ideas, aviation keywords, and clear structure matter more than matching the model word-for-word.
- For part1 level4/level5 (answerMode): short clear sentences are enough — do NOT require PEEL connectors.
- For part1 peel mode: accept connectors from the connector bank (Openers, Idea 1–3, Example, Conclusion).
- STT often mishears aviation terms (message→missed approach, wrong way→runway). Score ideas generously when meaning is clear.
- For part2-readback: score by clearance ELEMENTS (callsign, altitude, squawk, route/fix, contact, frequency) — digits or spoken numbers are equivalent; callsign at start OR end is OK; proceed + VORTAC counts even without FLL.
- For part2-interaction: check problem, intention, request, MAYDAY/PAN if needed.
- For part2-reported: check reported speech grammar (past tense, third person).
- For part1 suggestedAnswer: base it on modelAnswer; keep the same ideas and aviation vocabulary; fix grammar only.
- pronunciation score: infer from transcript vs expected terms; if homophones suggest good aviation intent, do not crush vocabulary score.
- Remember: official ICAO rating uses 6 criteria and overall level = LOWEST criterion (Operational = Level 4 minimum for pilots).`;

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  let body: EvaluateRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { transcript, question, modelAnswer, type, keywords } = body;
  const answerMode = body.answerMode ?? "peel";
  if (!transcript?.trim() || !modelAnswer) {
    return Response.json({ error: "transcript and modelAnswer required" }, { status: 400 });
  }

  const local = localEvaluate({ transcript, question, modelAnswer, type, keywords, answerMode });
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return Response.json(local);
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
        temperature: 0.3,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              type,
              question,
              modelAnswer,
              keywords: keywords ?? [],
              answerMode,
              candidateTranscript: transcript,
            }),
          },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("OpenAI error:", err);
      return Response.json({ ...local, summary: `${local.summary} (IA indisponível, usando score local)` });
    }

    const data = await res.json();
    const raw = data.choices?.[0]?.message?.content;
    const parsed = JSON.parse(raw) as Omit<EvaluateFeedback, "transcript" | "source">;

    const feedback: EvaluateFeedback = {
      transcript: local.transcript,
      rawTranscript: local.rawTranscript,
      source: "openai",
      scores: parsed.scores ?? local.scores,
      summary: parsed.summary ?? local.summary,
      strengths: [...new Set([...(local.strengths ?? []), ...(parsed.strengths ?? [])])],
      improvements: parsed.improvements ?? local.improvements,
      missingKeywords: parsed.missingKeywords ?? local.missingKeywords,
      suggestedAnswer:
        type === "part1"
          ? ensurePart1SuggestedAnswer(modelAnswer, parsed.suggestedAnswer)
          : parsed.suggestedAnswer,
      readbackElements: local.readbackElements,
    };

    if (type === "part2-readback" && local.readbackElements) {
      feedback.scores = {
        ...feedback.scores,
        content: local.scores.content,
        structure: local.scores.structure,
        phraseology: local.scores.phraseology,
      };
    }

    feedback.icaoLevel = estimateIcaoLevel(feedback.scores, type);

    return Response.json(feedback);
  } catch (e) {
    console.error(e);
    return Response.json(local);
  }
}

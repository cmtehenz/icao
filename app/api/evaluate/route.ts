import { localEvaluate } from "@/lib/evaluate/localEvaluate";
import { estimateIcaoLevel } from "@/lib/evaluate/icaoLevel";
import type { EvaluateFeedback, EvaluateRequest } from "@/lib/evaluate/types";

const SYSTEM_PROMPT = `You are an ICAO English exam coach for helicopter pilots (SDEA/ANAC).
Evaluate the candidate's spoken answer (provided as transcript from speech recognition).
Return ONLY valid JSON with this shape:
{
  "scores": { "overall": 0-100, "structure": 0-100, "content": 0-100, "phraseology": 0-100, "pronunciation": 0-100 },
  "summary": "2 sentences in Portuguese",
  "strengths": ["..."],
  "improvements": ["..."],
  "missingKeywords": ["..."],
  "suggestedAnswer": "optional improved short answer in English"
}
Rules:
- Compare against the model answer and question.
- For part2-readback: check clearance elements, numbers, callsign ANAC 123.
- For part2-interaction: check problem, intention, request, MAYDAY/PAN if needed.
- For part2-reported: check reported speech grammar (past tense, third person).
- For part1: check PEEL structure (opener, 3 ideas, example, conclusion), ~80-120 words ideal.
- pronunciation score: infer from likely misheard words in transcript vs expected aviation terms; note you only have text not audio.
- Remember: official ICAO rating uses 6 criteria and overall level = LOWEST criterion (Operational = Level 4 minimum for pilots).`;

export async function POST(request: Request) {
  let body: EvaluateRequest;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { transcript, question, modelAnswer, type, keywords } = body;
  if (!transcript?.trim() || !modelAnswer) {
    return Response.json({ error: "transcript and modelAnswer required" }, { status: 400 });
  }

  const local = localEvaluate({ transcript, question, modelAnswer, type, keywords });
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
      transcript: transcript.trim(),
      source: "openai",
      scores: parsed.scores ?? local.scores,
      summary: parsed.summary ?? local.summary,
      strengths: parsed.strengths ?? local.strengths,
      improvements: parsed.improvements ?? local.improvements,
      missingKeywords: parsed.missingKeywords ?? local.missingKeywords,
      suggestedAnswer: parsed.suggestedAnswer,
      icaoLevel: estimateIcaoLevel(parsed.scores ?? local.scores, type),
    };

    return Response.json(feedback);
  } catch (e) {
    console.error(e);
    return Response.json(local);
  }
}

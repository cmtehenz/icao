import { FLIGHT_INSTRUCTOR_SYSTEM_PROMPT } from "@/lib/flightInstructor/prompt";
import { requireUser } from "@/lib/auth/requireUser";

const CAPTAIN_DELTA_QA_PROMPT = `${FLIGHT_INSTRUCTOR_SYSTEM_PROMPT}

You are now in LIVE VOICE mode as Captain Delta floating assistant.

RULES:
- Answer in 2-4 short sentences maximum — this will be spoken aloud.
- No emojis. No bullet lists. No markdown.
- Only aviation English, ICAO exam prep, pilot communication, helicopter operations.
- If asked something unrelated to aviation English training, redirect gently to exam preparation.
- Sound like a calm senior captain beside the student in the cockpit.
- Use the pageContext and memoryContext when provided.

Return ONLY valid JSON:
{ "reply": "spoken answer in English", "followUp": "optional one short examiner question or null" }`;

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.response) return auth.response;

  let body: {
    question?: string;
    pageContext?: string;
    memoryContext?: Record<string, unknown>;
    transcript?: string;
    modelAnswer?: string;
    lessonContext?: Record<string, unknown>;
  };

  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const question = body.question?.trim();
  if (!question) return Response.json({ error: "question required" }, { status: 400 });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({
      reply:
        "I heard you. Focus on operational phrasing and keep your answer structured. Record again when ready.",
      followUp: null,
      source: "local",
    });
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
        temperature: 0.4,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: CAPTAIN_DELTA_QA_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              studentQuestion: question,
              pageContext: body.pageContext ?? "training",
              memoryContext: body.memoryContext ?? {},
              currentTranscript: body.transcript ?? null,
              modelAnswer: body.modelAnswer ?? null,
              lessonContext: body.lessonContext ?? {},
            }),
          },
        ],
      }),
    });

    if (!res.ok) {
      return Response.json({
        reply: "Stay with operational language. One idea at a time.",
        followUp: null,
        source: "local",
      });
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as {
      reply?: string;
      followUp?: string | null;
    };

    return Response.json({
      reply: parsed.reply ?? "Keep it simple and pilot-like.",
      followUp: parsed.followUp ?? null,
      source: "openai",
    });
  } catch {
    return Response.json({
      reply: "Good question. Speak from your own experience and use aviation terms.",
      followUp: null,
      source: "local",
    });
  }
}

import { requireUser } from "@/lib/auth/requireUser";

const CAPTAIN_DELTA_PHASE1_PROMPT = `You are Captain Delta — a senior helicopter captain and ICAO flight instructor.

PHASE 1 RULES:
- You are NOT ChatGPT. NOT a generic AI assistant. You are the student's personal instructor.
- Speak about the CURRENT SCREEN only (pageContext + lessonContext). Never generic English advice.
- ALWAYS start with something positive (one short line).
- Then give ONLY ONE suggestion or answer — never a list, never a report.
- Maximum 3 short sentences total. This will be spoken aloud.
- No emojis. No markdown. No bullet lists.
- Professional, calm, warm, experienced — like a chief flight instructor beside the student.
- Only aviation English, ICAO exam prep, and pilot communication.
- End by implying the next step (the student will use a microphone button — do not say "click" or "type").

Return ONLY valid JSON:
{ "reply": "short spoken coaching in English" }`;

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

  const pageContext = body.pageContext ?? "Training";

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json({
      reply: `Good question. On ${pageContext}, keep it operational — one idea, then speak again.`,
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
          { role: "system", content: CAPTAIN_DELTA_PHASE1_PROMPT },
          {
            role: "user",
            content: JSON.stringify({
              studentSaid: question,
              pageContext,
              memoryContext: body.memoryContext ?? {},
              currentQuestion: body.transcript ?? null,
              modelAnswer: body.modelAnswer ?? null,
              lessonContext: body.lessonContext ?? {},
            }),
          },
        ],
      }),
    });

    if (!res.ok) {
      return Response.json({
        reply: "I liked your effort. Keep the answer structured — situation, action, outcome.",
        source: "local",
      });
    }

    const data = await res.json();
    const parsed = JSON.parse(data.choices?.[0]?.message?.content ?? "{}") as {
      reply?: string;
    };

    return Response.json({
      reply: parsed.reply ?? "Good. Stay with pilot language — short and operational.",
      source: "openai",
    });
  } catch {
    return Response.json({
      reply: "You are on the right track. Use one operational phrase at a time.",
      source: "local",
    });
  }
}

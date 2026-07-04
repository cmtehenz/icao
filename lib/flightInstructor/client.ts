import type { FlightInstructorReport, FlightInstructorRequest } from "@/lib/flightInstructor/types";
import { buildMemoryContextForPrompt } from "@/lib/flightInstructor/memory";

export async function fetchFlightInstructorReport(
  req: FlightInstructorRequest,
): Promise<FlightInstructorReport> {
  const memoryContext = buildMemoryContextForPrompt();

  const res = await fetch("/api/flight-instructor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...req,
      memoryContext: {
        yesterdaySummary: memoryContext.yesterdaySummary,
        topPronunciationMistakes: memoryContext.topPronunciationMistakes,
        recurringWeakAreas: memoryContext.recurringWeakAreas,
      },
    }),
  });

  if (!res.ok) {
    throw new Error("Flight instructor unavailable");
  }

  return res.json() as Promise<FlightInstructorReport>;
}

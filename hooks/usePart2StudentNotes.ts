"use client";

import { useEffect, useState } from "react";

/** Ephemeral scratchpad notes — cleared when the scenario changes. */
export function usePart2StudentNotes(scenarioId: string) {
  const [studentNotes, setStudentNotes] = useState("");

  useEffect(() => {
    setStudentNotes("");
  }, [scenarioId]);

  return { studentNotes, setStudentNotes };
}

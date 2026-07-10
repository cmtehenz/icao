"use client";

import { useSearchParams } from "next/navigation";
import FlashcardApp from "@/components/FlashcardApp";
import Part1MissionApp from "@/components/part1/Part1MissionApp";

/** Mission mode by default; library browse only with ?browse=1 */
export default function Part1PageClient() {
  const searchParams = useSearchParams();
  if (searchParams.get("browse") === "1") return <FlashcardApp />;
  return <Part1MissionApp />;
}

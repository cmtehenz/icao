"use client";

import { useSearchParams } from "next/navigation";
import Part2TrainerApp from "@/components/Part2Trainer/Part2TrainerApp";
import Part2MissionApp from "@/components/part2/Part2MissionApp";

/** Today's full Part 2 exam by default; fragmented browse with ?browse=1 */
export default function Part2PageClient() {
  const searchParams = useSearchParams();
  if (searchParams.get("browse") === "1") return <Part2TrainerApp />;
  return <Part2MissionApp />;
}

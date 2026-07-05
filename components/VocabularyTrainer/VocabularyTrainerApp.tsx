"use client";

import { useSearchParams } from "next/navigation";
import VocabularyTrainerMode from "@/components/VocabularyTrainer/VocabularyTrainerMode";
import "@/app/vocabulario/vocab-studio.css";

/** TAXI leg — content only; chrome lives in MissionFocusLayout. */
export default function VocabularyTrainerApp() {
  const searchParams = useSearchParams();
  const initialTermId = searchParams.get("term") ?? undefined;

  return (
    <div className="wrap vocab-flight-deck">
      <VocabularyTrainerMode initialTermId={initialTermId} />
    </div>
  );
}

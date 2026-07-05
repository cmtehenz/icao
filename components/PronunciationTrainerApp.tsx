"use client";

import PronunciationWordsMode from "@/components/Part2Trainer/PronunciationWordsMode";

/** ENGINE START leg — content only; chrome lives in MissionFocusLayout. */
export default function PronunciationTrainerApp() {
  return (
    <div className="wrap pronunciation-flight-deck">
      <PronunciationWordsMode />
    </div>
  );
}

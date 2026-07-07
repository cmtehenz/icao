"use client";

import WordMissionMode from "@/components/WordMission/WordMissionMode";
import "@/app/vocabulario/vocab-studio.css";

export default function WordMissionApp() {
  return (
    <div className="wrap word-mission-wrap vocab-flight-deck pronunciation-flight-deck">
      <WordMissionMode />
    </div>
  );
}

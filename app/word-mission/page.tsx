import { Suspense } from "react";
import WordMissionApp from "@/components/WordMission/WordMissionApp";

export const dynamic = "force-dynamic";

export default function WordMissionPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap word-mission-wrap">
          <p className="sub">Loading Word Mission…</p>
        </div>
      }
    >
      <WordMissionApp />
    </Suspense>
  );
}

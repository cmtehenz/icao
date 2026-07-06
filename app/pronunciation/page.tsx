import { Suspense } from "react";
import PronunciationTrainerApp from "@/components/PronunciationTrainerApp";

export const dynamic = "force-dynamic";

export default function PronunciationPage() {
  return (
    <Suspense
      fallback={
        <div className="wrap pronunciation-flight-deck">
          <p className="sub">Loading pronunciation…</p>
        </div>
      }
    >
      <PronunciationTrainerApp />
    </Suspense>
  );
}

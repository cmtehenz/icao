import { Suspense } from "react";
import Part2TrainerApp from "@/components/Part2Trainer/Part2TrainerApp";

export default function Part2Page() {
  return (
    <Suspense fallback={<div className="wrap"><p>Carregando…</p></div>}>
      <Part2TrainerApp />
    </Suspense>
  );
}

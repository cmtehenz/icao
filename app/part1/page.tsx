import { Suspense } from "react";
import FlashcardApp from "@/components/FlashcardApp";

export default function Part1Page() {
  return (
    <Suspense fallback={<div className="wrap"><p>Carregando…</p></div>}>
      <FlashcardApp />
    </Suspense>
  );
}

import { Suspense } from "react";
import Part2PageClient from "@/components/part2/Part2PageClient";

export default function Part2Page() {
  return (
    <Suspense fallback={<div className="wrap"><p>Carregando…</p></div>}>
      <Part2PageClient />
    </Suspense>
  );
}

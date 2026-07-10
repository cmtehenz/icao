import { Suspense } from "react";
import Part1PageClient from "@/components/part1/Part1PageClient";

export default function Part1Page() {
  return (
    <Suspense fallback={<div className="wrap"><p>Loading Part 1…</p></div>}>
      <Part1PageClient />
    </Suspense>
  );
}

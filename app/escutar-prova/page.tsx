import { Suspense } from "react";
import FullExamListeningApp from "@/components/FullExamListening/FullExamListeningApp";
import "./full-exam-listening.css";

export default function EscutarProvaPage() {
  return (
    <Suspense fallback={<div className="wrap"><p>Carregando…</p></div>}>
      <FullExamListeningApp />
    </Suspense>
  );
}

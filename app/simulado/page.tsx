import { Suspense } from "react";
import SimuladoApp from "@/components/Simulado/SimuladoApp";
import "./simulado.css";

export default function SimuladoPage() {
  return (
    <Suspense fallback={<div className="wrap"><p>Carregando…</p></div>}>
      <SimuladoApp />
    </Suspense>
  );
}

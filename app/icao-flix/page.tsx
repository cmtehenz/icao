import { Suspense } from "react";
import IcaoFlixApp from "@/components/icaoFlix/IcaoFlixApp";
import "./icao-flix.css";

export default function IcaoFlixPage() {
  return (
    <Suspense fallback={<div className="wrap"><p>Carregando…</p></div>}>
      <IcaoFlixApp />
    </Suspense>
  );
}

import { Suspense } from "react";
import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <div className="auth-page-login">
      <div className="auth-page-brand">
        <span className="auth-page-logo">✈</span>
        <h1>ICAO Delta</h1>
        <p className="sub">Treino SDEA/ICAO — provas reais de helicóptero</p>
      </div>
      <Suspense fallback={<p>Carregando…</p>}>
        <AuthForm />
      </Suspense>
    </div>
  );
}

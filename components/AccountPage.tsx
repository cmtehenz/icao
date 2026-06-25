"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import EvaluationAudioPlayer from "@/components/EvaluationAudioPlayer";

type EvaluationRow = {
  id: string;
  type: string;
  question: string;
  transcript: string;
  overallScore: number;
  icaoLevel: number | null;
  pronunciationScore: number;
  summary: string;
  hasAudio: boolean;
  createdAt: string;
};

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [evaluations, setEvaluations] = useState<EvaluationRow[]>([]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/evaluations?limit=15")
      .then((r) => (r.ok ? r.json() : { evaluations: [] }))
      .then((d) => setEvaluations(d.evaluations ?? []))
      .catch(() => setEvaluations([]));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="wrap account-page">
        <p>Carregando…</p>
      </div>
    );
  }

  return (
    <div className="wrap account-page">
      <header className="account-head">
        <div>
          <h1>Olá, {user.name || user.email.split("@")[0]}</h1>
          <p className="sub">{user.email} · dados sincronizados no servidor</p>
        </div>
        <button
          type="button"
          className="btn secondary"
          onClick={async () => {
            await logout();
            router.push("/login");
            router.refresh();
          }}
        >
          Sair
        </button>
      </header>

      <section className="account-section">
        <h2>Atalhos</h2>
        <div className="account-links">
          <Link href="/pronunciation" className="btn green">
            Banco de pronúncia
          </Link>
          <Link href="/" className="btn secondary">
            Part 1
          </Link>
          <Link href="/part2" className="btn secondary">
            Part 2
          </Link>
        </div>
      </section>

      <section className="account-section">
        <h2>Últimas notas (Voice Coach)</h2>
        {evaluations.length === 0 ? (
          <p className="sub">Nenhuma avaliação salva ainda. Grave no Voice Coach para salvar suas notas.</p>
        ) : (
          <ul className="evaluation-history">
            {evaluations.map((ev) => (
              <li key={ev.id} className="evaluation-item">
                <div className="evaluation-top">
                  <span className="evaluation-type">{ev.type}</span>
                  {ev.icaoLevel != null && (
                    <span className="evaluation-icao">ICAO {ev.icaoLevel}</span>
                  )}
                  <span className="evaluation-score">{ev.overallScore}%</span>
                </div>
                <p className="evaluation-question">{ev.question}</p>
                {ev.transcript && (
                  <p className="evaluation-transcript">
                    <strong>Você disse:</strong> {ev.transcript}
                  </p>
                )}
                {ev.hasAudio && (
                  <EvaluationAudioPlayer
                    evaluationId={ev.id}
                    className="exam-audio evaluation-audio"
                  />
                )}
                <p className="evaluation-meta">
                  pronúncia {ev.pronunciationScore}% ·{" "}
                  {new Date(ev.createdAt).toLocaleString("pt-BR")}
                  {ev.hasAudio ? " · áudio salvo" : ""}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

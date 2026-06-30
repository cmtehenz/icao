"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import EvaluationAudioPlayer from "@/components/EvaluationAudioPlayer";
import PronunciationVaultClearButton from "@/components/PronunciationVaultClearButton";
import DailyStudyGoal from "@/components/study/DailyStudyGoal";
import StudyCalendar from "@/components/study/StudyCalendar";
import { usePronunciationVault } from "@/hooks/usePronunciationVault";

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
  const { total: vaultTotal } = usePronunciationVault();
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
          <h1>Conta</h1>
          <p className="sub">
            {user.name || user.email.split("@")[0]} · {user.email}
          </p>
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

      <p className="account-back-home">
        <Link href="/">← Voltar ao início</Link>
      </p>

      <StudyCalendar />

      <DailyStudyGoal compact />

      <section className="account-section">
        <h2>Banco de pronúncia</h2>
        <p className="sub">
          {vaultTotal > 0
            ? `${vaultTotal} palavra${vaultTotal > 1 ? "s" : ""} salva${vaultTotal > 1 ? "s" : ""} para treinar.`
            : "Nenhuma palavra no banco."}
        </p>
        <div className="account-links">
          <Link href="/pronunciation" className="btn green">
            Abrir pronúncia
          </Link>
          <PronunciationVaultClearButton className="btn orange" />
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

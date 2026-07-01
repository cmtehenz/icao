"use client";

import { useMemo, useState } from "react";
import VocabRecordingsList from "@/components/VocabularyTrainer/VocabRecordingsList";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import { ICAO_VOCABULARY, getLevelText, type IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { isDueForReview, isMastered, pronunciationScore } from "@/utils/spacedRepetition";

export default function ShadowingMode() {
  const { getProgress, recordAttempt } = useVocabularyProgress();
  const azure = useAzureSpeech();
  const [activeItem, setActiveItem] = useState<IcaoVocabularyItem | null>(null);
  const [level, setLevel] = useState<1 | 2 | 3 | 4>(1);
  const [phase, setPhase] = useState<"idle" | "listening" | "waiting" | "recording" | "result">("idle");
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [audioNote, setAudioNote] = useState<string | null>(null);

  const dueList = useMemo(
    () => ICAO_VOCABULARY.filter((item) => isDueForReview(getProgress(item.id))),
    [getProgress],
  );

  const list = dueList.length ? dueList : ICAO_VOCABULARY.slice(0, 16);

  const startShadowing = async (item: IcaoVocabularyItem) => {
    setActiveItem(item);
    setLastScore(null);
    setAudioNote(null);
    azure.clear();
    const text = getLevelText(item, level);
    setPhase("listening");
    try {
      await azure.speak(text);
      setPhase("waiting");
      await new Promise((r) => setTimeout(r, 1000));
      setPhase("recording");
      await azure.startRecording(text);
    } catch {
      setPhase("idle");
    }
  };

  const stopShadowing = async () => {
    if (!activeItem || phase !== "recording") return;
    const referenceText = getLevelText(activeItem, level);
    const { assessment, audioBlob } = await azure.stopRecording();
    const score = assessment
      ? pronunciationScore(
          assessment.accuracyScore,
          assessment.fluencyScore,
          assessment.completenessScore,
        )
      : 0;
    setLastScore(score);
    const outcome = await recordAttempt(
      activeItem.id,
      assessment,
      level,
      activeItem.term,
      referenceText,
      audioBlob,
    );
    if (outcome.audioSaved) {
      setAudioNote("Gravação salva — ouça abaixo.");
    } else if (outcome.audioError) {
      setAudioNote(outcome.audioError);
    }
    setPhase("result");
  };

  const progress = activeItem ? getProgress(activeItem.id) : null;

  return (
    <div className="vocab-studio-shadowing">
      <header className="vocab-studio-shadowing-head">
        <h2>Shadowing</h2>
        <p>Ouça o Azure, espere 1 segundo e repita — avaliação automática de pronúncia.</p>
      </header>

      <div className="vocab-studio-levels" role="tablist" aria-label="Nível">
        {([1, 2, 3, 4] as const).map((l) => (
          <button
            key={l}
            type="button"
            role="tab"
            aria-selected={level === l}
            className={`vocab-studio-level-tab ${level === l ? "active" : ""}`}
            onClick={() => setLevel(l)}
          >
            Nível {l}
          </button>
        ))}
      </div>

      {activeItem && progress ? (
        <div className="vocab-studio-shadow-active">
          <div className="vocab-studio-hero">
            <h3 className="vocab-studio-hero-term">
              {activeItem.term}
              <WordPhoneticHint word={activeItem.term} className="vault-word-phonetic" />
            </h3>
            <p className="vocab-studio-hero-meaning">{activeItem.meaning}</p>
            <p className="vocab-studio-practice-text">{getLevelText(activeItem, level)}</p>
          </div>

          <p className="vocab-studio-shadow-phase">
            {phase === "listening" && "🔊 Azure está falando…"}
            {phase === "waiting" && "⏳ Prepare-se…"}
            {phase === "recording" && "● Repita agora — toque em Parar quando terminar"}
            {phase === "result" && lastScore !== null && `Resultado: ${lastScore} pontos`}
          </p>

          {audioNote && <p className="voice-coach-warn">{audioNote}</p>}

          {phase === "recording" && (
            <button type="button" className="btn orange" onClick={stopShadowing}>
              ⏹ Parar e avaliar
            </button>
          )}

          {phase === "result" && (
            <div className="vocab-recorder-actions">
              <button type="button" className="btn green" onClick={() => startShadowing(activeItem)}>
                Shadow de novo
              </button>
              <button
                type="button"
                className="btn secondary"
                onClick={() => {
                  setActiveItem(null);
                  setPhase("idle");
                  azure.clear();
                }}
              >
                Voltar à lista
              </button>
            </div>
          )}

          <VocabRecordingsList recordings={progress.recordings} />
        </div>
      ) : (
        <div className="vocab-studio-shadowing-grid">
          {list.map((item) => {
            const p = getProgress(item.id);
            const due = isDueForReview(p);
            const mastered = isMastered(p);
            return (
              <article key={item.id} className="vocab-studio-shadow-card">
                <span className="vocab-studio-shadow-card-term">
                  {item.term}
                  <WordPhoneticHint word={item.term} className="vault-word-phonetic" />
                </span>
                <p className="vocab-studio-shadow-card-meaning">{item.meaning}</p>
                <div className="vocab-studio-hero-stats">
                  {due && <span>Revisar</span>}
                  {mastered && <span>Dominado</span>}
                  <span>{p.masteryLevel}/5</span>
                </div>
                <button type="button" className="btn green btn-sm" onClick={() => startShadowing(item)}>
                  Iniciar shadow
                </button>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

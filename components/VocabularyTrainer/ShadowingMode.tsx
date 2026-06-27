"use client";

import { useMemo, useState } from "react";
import VocabRecordingsList from "@/components/VocabularyTrainer/VocabRecordingsList";
import VocabularyCard from "@/components/VocabularyTrainer/VocabularyCard";
import { ICAO_VOCABULARY, getLevelText, type IcaoVocabularyItem } from "@/data/icaoVocabulary";
import { useAzureSpeech } from "@/hooks/useAzureSpeech";
import { useVocabularyProgress } from "@/hooks/useVocabularyProgress";
import { isDueForReview, pronunciationScore } from "@/utils/spacedRepetition";

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
    <div className="vocab-shadowing">
      <header className="part2-mode-head">
        <span className="badge">Shadowing Mode</span>
        <span className="part2-counter">Listen → wait 1s → repeat → evaluate</span>
      </header>

      <div className="vocab-level-picker">
        {([1, 2, 3, 4] as const).map((l) => (
          <button
            key={l}
            type="button"
            className={`filter-chip ${level === l ? "active" : ""}`}
            onClick={() => setLevel(l)}
          >
            Level {l}
          </button>
        ))}
      </div>

      {activeItem && progress ? (
        <article className="card card-essential part2-card vocab-practice-card">
          <VocabularyCard item={activeItem} progress={progress} trainingLevel={level} />
          <p className="vocab-shadowing-phase">
            {phase === "listening" && "🔊 Azure is speaking…"}
            {phase === "waiting" && "⏳ Get ready…"}
            {phase === "recording" && "● Repeat now — tap Stop when done"}
            {phase === "result" && lastScore !== null && `Result: ${lastScore} points`}
          </p>
          {audioNote && <p className="voice-coach-warn">{audioNote}</p>}
          {phase === "recording" && (
            <button type="button" className="btn orange" onClick={stopShadowing}>
              ⏹ Stop & evaluate
            </button>
          )}
          {phase === "result" && (
            <div className="voice-coach-actions">
              <button type="button" className="btn green" onClick={() => startShadowing(activeItem)}>
                Shadow again
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
                Back
              </button>
            </div>
          )}
          <VocabRecordingsList recordings={progress.recordings} />
        </article>
      ) : (
        <ul className="vault-word-list vocab-term-list">
          {(dueList.length ? dueList : ICAO_VOCABULARY.slice(0, 12)).map((item) => (
            <li key={item.id} className="vault-word-item vocab-term-item">
              <VocabularyCard item={item} progress={getProgress(item.id)} compact />
              <button type="button" className="btn green btn-sm" onClick={() => startShadowing(item)}>
                Start shadowing
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

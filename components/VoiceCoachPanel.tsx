"use client";

import { useState } from "react";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { errorTypeLabel, collectVaultWordCandidates, useUnscriptedPronunciation } from "@/lib/azure/pronunciation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";
import { estimateIcaoLevel } from "@/lib/evaluate/icaoLevel";
import { saveEvaluationRecord } from "@/lib/evaluate/saveEvaluation";
import { recordPart2RecordingScore } from "@/lib/part2Warmup";
import { tryRecordStudyActivity, studyActivityRejectReason } from "@/lib/studyActivityRecord";
import { addWordsToVault } from "@/lib/pronunciationVault";
import { markPart1CoachDone, isPart1CardInTodayMission } from "@/lib/part1DailyMission";
import type { Part2MissionKind } from "@/lib/part2DailyMission";
import { tryMarkPart2DailyMissionPractice } from "@/lib/part2MissionComplete";
import AnswerComparePanel from "@/components/AnswerComparePanel";
import AudioCompareReplay from "@/components/study/AudioCompareReplay";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import IcaoLevelPanel from "@/components/IcaoLevelPanel";
import YouGlishLink from "@/components/YouGlishLink";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  keywords?: string[];
  situationId?: string;
  cardNum?: string;
  modelAudioUrl?: string;
  recordingBlocked?: boolean;
  recordingBlockedMessage?: string;
  embedded?: boolean;
};

function buildAzureExtras(azureResult: AzurePronunciationResult) {
  const mispronounced = collectVaultWordCandidates(azureResult);
  return {
    accuracyScore: azureResult.accuracyScore,
    fluencyScore: azureResult.fluencyScore,
    completenessScore: azureResult.completenessScore,
    prosodyScore: azureResult.prosodyScore,
    weakWords: mispronounced.map((w) => w.word),
    mispronouncedWords: mispronounced,
  };
}

export default function VoiceCoachPanel({
  question,
  modelAnswer,
  evaluateType,
  keywords = [],
  situationId,
  cardNum,
  modelAudioUrl,
  recordingBlocked = false,
  recordingBlockedMessage,
  embedded = false,
}: Props) {
  const speech = useSpeechRecognition("en-US");
  const azure = useAzurePronunciation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<EvaluateFeedback | null>(null);
  const [vaultSaved, setVaultSaved] = useState<string | null>(null);
  const [audioSaveNote, setAudioSaveNote] = useState<string | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);
  const [open, setOpen] = useState(embedded);

  const runContentEvaluation = async (
    transcript: string,
    azureResult?: AzurePronunciationResult,
    audioBlob?: Blob | null,
  ) => {
    setLoading(true);
    setFeedback(null);
    setVaultSaved(null);
    setAudioSaveNote(null);
    setActivityNote(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          question,
          modelAnswer,
          type: evaluateType,
          keywords,
        }),
      });
      const data = (await res.json()) as EvaluateFeedback;

      if (azureResult) {
        const azureExtras = buildAzureExtras(azureResult);
        const unscripted = useUnscriptedPronunciation(evaluateType);
        const pronunciationScore = unscripted
          ? Math.round(
              azureResult.accuracyScore * 0.55 +
                azureResult.fluencyScore * 0.3 +
                azureResult.prosodyScore * 0.15,
            )
          : azureResult.accuracyScore;
        data.scores.pronunciation = pronunciationScore;
        data.scores.overall = Math.round(
          data.scores.content * 0.35 +
            data.scores.structure * 0.25 +
            data.scores.phraseology * 0.15 +
            pronunciationScore * 0.25,
        );
        data.azurePronunciation = azureExtras;
        data.summary = unscripted
          ? `Pronúncia Azure (fala livre): ${pronunciationScore}/100. ${data.summary}`
          : `Pronúncia Azure: ${azureResult.accuracyScore}/100 (accuracy). ${data.summary}`;
        if (azureExtras.weakWords.length) {
          data.improvements = [
            `Pronúncia: pratique — ${azureExtras.weakWords.join(", ")}.`,
            ...data.improvements,
          ];
        }
        data.icaoLevel = estimateIcaoLevel(data.scores, evaluateType, {
          accuracyScore: azureResult.accuracyScore,
          fluencyScore: azureResult.fluencyScore,
          completenessScore: azureResult.completenessScore,
        });
      }

      setFeedback(data);

      if (azureResult && evaluateType.startsWith("part2")) {
        recordPart2RecordingScore(azureResult.accuracyScore);
        const part2MissionKind: Part2MissionKind =
          evaluateType === "part2-readback"
            ? "readback"
            : evaluateType === "part2-interaction"
              ? "interaction"
              : "reported";
        const ctx = {
          accuracy: azureResult.accuracyScore,
          recognizedText: azureResult.recognizedText,
          situationId,
          part2MissionKind,
        };
        const missionDone = tryMarkPart2DailyMissionPractice({
          part2MissionKind,
          situationId,
          accuracy: azureResult.accuracyScore,
          recognizedText: azureResult.recognizedText,
        });
        const counted = tryRecordStudyActivity("shadowPart2", ctx);
        setActivityNote(
          missionDone || counted ? null : studyActivityRejectReason("shadowPart2", ctx),
        );
      }

      if (
        azureResult &&
        evaluateType === "part1" &&
        cardNum &&
        isPart1CardInTodayMission(cardNum) &&
        data.scores.overall >= 50
      ) {
        markPart1CoachDone(cardNum);
      }

      if (user) {
        const saved = await saveEvaluationRecord({
          type: evaluateType,
          question,
          transcript,
          scores: data.scores,
          icaoLevel: data.icaoLevel?.overall,
          icaoCriteria: data.icaoLevel?.criteria,
          summary: data.summary,
          audioBlob: azureResult ? audioBlob : undefined,
        });
        if (azureResult && audioBlob && saved && !saved.audioSaved) {
          setAudioSaveNote(
            saved.audioError ??
              "Nota salva, mas o áudio não foi armazenado. Verifique BLOB_READ_WRITE_TOKEN na Vercel.",
          );
        } else if (azureResult && !audioBlob) {
          setAudioSaveNote(
            "Nota salva, mas a gravação de áudio não foi capturada neste dispositivo.",
          );
        }
      }

      if (azureResult && data.azurePronunciation?.mispronouncedWords.length) {
        const { added, updated, total } = addWordsToVault(
          data.azurePronunciation.mispronouncedWords,
          question.slice(0, 80),
        );
        const n = added + updated;
        if (n > 0) {
          setVaultSaved(
            `${n} palavra${n > 1 ? "s" : ""} salva${n > 1 ? "s" : ""} — total ${total} no banco (menu Pronúncia)`,
          );
        }
      }
    } catch {
      setFeedback({
        scores: { overall: 0, structure: 0, content: 0, phraseology: 0, pronunciation: 0 },
        transcript,
        summary: "Erro ao avaliar. Tente novamente.",
        strengths: [],
        improvements: [],
        missingKeywords: [],
        source: "local",
      });
    } finally {
      setLoading(false);
    }
  };

  const evaluateWithBrowser = async () => {
    const text = speech.finalTranscript || speech.transcript;
    if (!text.trim()) {
      speech.start();
      return;
    }
    await runContentEvaluation(text);
  };

  const evaluateWithAzure = async () => {
    if (azure.assessing) {
      azure.stop();
      return;
    }
    azure.clear();
    await azure.start(modelAnswer, evaluateType);
  };

  const finishAzure = async () => {
    const { assessment, audioBlob } = await azure.stop();
    const text = assessment?.recognizedText ?? "";
    if (!text.trim()) {
      setFeedback({
        scores: { overall: 0, structure: 0, content: 0, phraseology: 0, pronunciation: 0 },
        transcript: "",
        summary: "Nenhuma fala detectada pelo Azure. Fale mais alto e tente de novo.",
        strengths: [],
        improvements: [],
        missingKeywords: [],
        source: "local",
      });
      return;
    }
    await runContentEvaluation(text, assessment ?? undefined, audioBlob);
    setLastAudioBlob(audioBlob);
  };

  if (!open && !embedded) {
    return (
      <button
        type="button"
        className={`btn purple voice-coach-toggle ${recordingBlocked ? "disabled" : ""}`}
        onClick={() => setOpen(true)}
        title={recordingBlocked ? recordingBlockedMessage : undefined}
      >
        🎤 Falar e corrigir
      </button>
    );
  }

  const unscripted = useUnscriptedPronunciation(evaluateType);

  return (
    <div className={`voice-coach-panel ${embedded ? "embedded" : ""}`}>
      {!embedded && (
        <div className="voice-coach-head">
          <h3>🎤 Coach de voz</h3>
          <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(false)}>
            Fechar
          </button>
        </div>
      )}

      {recordingBlocked && (
        <p className="voice-coach-warn voice-coach-blocked">
          {recordingBlockedMessage ?? "Complete o warm-up de pronúncia antes de gravar."}
        </p>
      )}

      {azure.configured ? (
        <p className="voice-coach-azure-badge">
          ✓ Azure Speech ativo — pronúncia real por áudio
          {unscripted
            ? " (Part 1: fala livre — avalia ideias e keywords, não texto idêntico)"
            : " (compara com a resposta modelo)"}
        </p>
      ) : (
        <p className="voice-coach-warn">
          Azure não configurado — usando transcrição do navegador. Adicione{" "}
          <code>AZURE_SPEECH_KEY</code> e <code>AZURE_SPEECH_REGION</code> no <code>.env.local</code>.
        </p>
      )}

      <div className="voice-coach-actions">
        {azure.configured ? (
          <>
            {!azure.assessing ? (
              <button
                type="button"
                className="btn green"
                onClick={evaluateWithAzure}
                disabled={recordingBlocked}
              >
                ● Gravar (Azure)
              </button>
            ) : (
              <button type="button" className="btn orange" onClick={finishAzure}>
                ⏹ Parar e avaliar
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            className={`btn ${speech.listening ? "orange" : "green"}`}
            onClick={speech.toggle}
            disabled={!speech.supported || recordingBlocked}
          >
            {speech.listening ? "⏹ Parar" : "● Gravar (navegador)"}
          </button>
        )}

        {!azure.configured && (
          <>
            <button type="button" className="btn secondary" onClick={speech.clear}>
              Limpar
            </button>
            <button
              type="button"
              className="btn purple"
              onClick={evaluateWithBrowser}
              disabled={loading || !speech.transcript.trim()}
            >
              {loading ? "Analisando…" : "Corrigir com IA"}
            </button>
          </>
        )}
      </div>

      {(speech.error || azure.error) && (
        <p className="voice-coach-error">{speech.error || azure.error}</p>
      )}

      {(azure.result?.recognizedText || speech.transcript) && (
        <div className="voice-coach-transcript">
          <strong>Transcrição:</strong>
          <p>{azure.result?.recognizedText || speech.transcript}</p>
        </div>
      )}

      {azure.result && !feedback && !loading && (
        <div className="voice-coach-azure-scores">
          <div className="voice-score">
            <strong>{azure.result.accuracyScore}</strong>
            <span>accuracy</span>
          </div>
          <div className="voice-score">
            <strong>{azure.result.fluencyScore}</strong>
            <span>fluency</span>
          </div>
          <div className="voice-score">
            <strong>{azure.result.completenessScore}</strong>
            <span>completeness</span>
          </div>
          <div className="voice-score">
            <strong>{azure.result.prosodyScore}</strong>
            <span>prosody</span>
          </div>
        </div>
      )}

      {feedback && (
        <div className="voice-coach-feedback">
          {feedback.icaoLevel && <IcaoLevelPanel rating={feedback.icaoLevel} />}

          <div className="voice-coach-scores">
            <div className="voice-score overall">
              <strong>{feedback.scores.overall}</strong>
              <span>geral</span>
            </div>
            <div className="voice-score">
              <strong>{feedback.scores.content}</strong>
              <span>conteúdo</span>
            </div>
            <div className="voice-score">
              <strong>{feedback.scores.structure}</strong>
              <span>estrutura</span>
            </div>
            <div className="voice-score">
              <strong>{feedback.scores.phraseology}</strong>
              <span>fraseologia</span>
            </div>
            <div className="voice-score">
              <strong>{feedback.scores.pronunciation}</strong>
              <span>pronúncia</span>
            </div>
          </div>

          {feedback.azurePronunciation && (
            <div className="voice-coach-azure-detail">
              <strong>Azure Pronunciation Assessment</strong>
              <p>
                Accuracy {feedback.azurePronunciation.accuracyScore} · Fluency{" "}
                {feedback.azurePronunciation.fluencyScore} · Completeness{" "}
                {feedback.azurePronunciation.completenessScore} · Prosody{" "}
                {feedback.azurePronunciation.prosodyScore}
              </p>
              {feedback.azurePronunciation.weakWords.length > 0 && (
                <p>Resumo: {feedback.azurePronunciation.weakWords.join(", ")}</p>
              )}
            </div>
          )}

          <p className="voice-coach-summary">{feedback.summary}</p>

          {evaluateType === "part1" && feedback.transcript && (
            <AnswerComparePanel
              transcript={feedback.transcript}
              modelAnswer={modelAnswer}
              keywords={keywords}
              azureAccuracy={feedback.azurePronunciation?.accuracyScore}
            />
          )}

          {audioSaveNote && <p className="voice-coach-warn">{audioSaveNote}</p>}
          {activityNote && <p className="voice-coach-warn">{activityNote}</p>}

          {evaluateType.startsWith("part2") && lastAudioBlob && (
            <AudioCompareReplay
              modelText={modelAnswer}
              modelAudioUrl={modelAudioUrl}
              userAudioBlob={lastAudioBlob}
              modelLabel="Modelo"
              userLabel="Sua gravação"
            />
          )}

          {feedback.strengths.length > 0 && (
            <div className="voice-coach-list good">
              <strong>Pontos fortes</strong>
              <ul>
                {feedback.strengths.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {feedback.improvements.length > 0 && (
            <div className="voice-coach-list">
              <strong>Melhorar</strong>
              <ul>
                {feedback.improvements.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {feedback.suggestedAnswer && (
            <div className="part2-model-answer">
              <h3>Sugestão de resposta</h3>
              <p>{feedback.suggestedAnswer}</p>
            </div>
          )}

          {feedback.azurePronunciation && (
            <div className="voice-coach-mispronounced">
              <h3>Palavras com erro de pronúncia</h3>
              {feedback.azurePronunciation.mispronouncedWords.length > 0 ? (
                <ul className="mispronounced-list">
                  {feedback.azurePronunciation.mispronouncedWords.map((w) => (
                    <li
                      key={`${w.word}-${w.accuracyScore}`}
                      className={`mispronounced-item ${w.accuracyScore < 60 ? "bad" : "warn"}`}
                    >
                      <span className="mispronounced-word">
                        {w.word}
                        <WordPhoneticHint word={w.word} className="vault-word-phonetic" />
                      </span>
                      <span className="mispronounced-score">{w.accuracyScore}%</span>
                      <span className="mispronounced-error">{w.errorLabel}</span>
                      <YouGlishLink word={w.word} compact />
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mispronounced-none">
                  Nenhuma palavra com erro detectada — boa pronúncia nesta gravação.
                </p>
              )}
              {vaultSaved && <p className="vault-saved-banner">{vaultSaved}</p>}
            </div>
          )}
        </div>
      )}

      {!speech.supported && !azure.configured && (
        <p className="voice-coach-footnote">Use Chrome ou Edge no desktop.</p>
      )}
    </div>
  );
}

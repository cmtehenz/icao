"use client";

import { useState } from "react";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { errorTypeLabel, getMispronouncedWords, isScriptedAssessment } from "@/lib/azure/pronunciation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";
import { estimateIcaoLevel } from "@/lib/evaluate/icaoLevel";
import { saveEvaluationRecord } from "@/lib/evaluate/saveEvaluation";
import { addWordsToVault } from "@/lib/pronunciationVault";
import IcaoLevelPanel from "@/components/IcaoLevelPanel";
import YouGlishLink from "@/components/YouGlishLink";
import { useAuth } from "@/components/AuthProvider";

type Props = {
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  keywords?: string[];
};

function buildAzureExtras(azureResult: AzurePronunciationResult) {
  const mispronounced = getMispronouncedWords(azureResult.words);
  return {
    accuracyScore: azureResult.accuracyScore,
    fluencyScore: azureResult.fluencyScore,
    completenessScore: azureResult.completenessScore,
    prosodyScore: azureResult.prosodyScore,
    weakWords: mispronounced.map((w) => w.word),
    mispronouncedWords: mispronounced.map((w) => ({
      word: w.word,
      accuracyScore: w.accuracyScore,
      errorType: w.errorType ?? "None",
      errorLabel: errorTypeLabel(w.errorType),
    })),
  };
}

export default function VoiceCoachPanel({
  question,
  modelAnswer,
  evaluateType,
  keywords = [],
}: Props) {
  const speech = useSpeechRecognition("en-US");
  const azure = useAzurePronunciation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<EvaluateFeedback | null>(null);
  const [vaultSaved, setVaultSaved] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const runContentEvaluation = async (
    transcript: string,
    azureResult?: AzurePronunciationResult,
    audioBlob?: Blob | null,
  ) => {
    setLoading(true);
    setFeedback(null);
    setVaultSaved(null);
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
        data.scores.pronunciation = azureResult.accuracyScore;
        data.scores.overall = Math.round(
          data.scores.content * 0.3 +
            data.scores.structure * 0.25 +
            data.scores.phraseology * 0.2 +
            azureResult.accuracyScore * 0.25,
        );
        data.azurePronunciation = azureExtras;
        data.summary = `Pronúncia Azure: ${azureResult.accuracyScore}/100 (accuracy). ${data.summary}`;
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

      if (user) {
        void saveEvaluationRecord({
          type: evaluateType,
          question,
          transcript,
          scores: data.scores,
          icaoLevel: data.icaoLevel?.overall,
          icaoCriteria: data.icaoLevel?.criteria,
          summary: data.summary,
          audioBlob: azureResult ? audioBlob : undefined,
        });
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
  };

  if (!open) {
    return (
      <button type="button" className="btn purple voice-coach-toggle" onClick={() => setOpen(true)}>
        🎤 Falar e corrigir
      </button>
    );
  }

  const scripted = isScriptedAssessment(evaluateType);

  return (
    <div className="voice-coach-panel">
      <div className="voice-coach-head">
        <h3>🎤 Coach de voz</h3>
        <button type="button" className="btn secondary btn-sm" onClick={() => setOpen(false)}>
          Fechar
        </button>
      </div>

      {azure.configured ? (
        <p className="voice-coach-azure-badge">
          ✓ Azure Speech ativo — pronúncia real por áudio
          {scripted ? " (modo scripted: compare com o modelo)" : " (modo livre para Part 1)"}
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
              <button type="button" className="btn green" onClick={evaluateWithAzure}>
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
            disabled={!speech.supported}
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
                      <span className="mispronounced-word">{w.word}</span>
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

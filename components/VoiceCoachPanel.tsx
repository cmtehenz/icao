"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useAzurePronunciation } from "@/hooks/useAzurePronunciation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import {
  collectCoachVaultCandidates,
  collectVaultWordCandidates,
  errorTypeLabel,
  useUnscriptedPronunciation,
  type VaultWordCandidate,
} from "@/lib/azure/pronunciation";
import type { AzurePronunciationResult } from "@/lib/azure/pronunciation";
import type { EvaluateFeedback, EvaluateType } from "@/lib/evaluate/types";
import { estimateIcaoLevel } from "@/lib/evaluate/icaoLevel";
import { saveEvaluationRecord } from "@/lib/evaluate/saveEvaluation";
import { recordPart2RecordingScore } from "@/lib/part2Warmup";
import { tryRecordStudyActivity, studyActivityRejectReason } from "@/lib/studyActivityRecord";
import { addManualWordsToVault, addWordsToVault } from "@/lib/pronunciationVault";
import Link from "next/link";
import { markPart1CoachDone, isPart1CardInTodayMission, tryMarkPart1ShadowComplete } from "@/lib/part1DailyMission";
import { recordPart1CoachAttempt } from "@/lib/part1CoachHistory";
import type { Part2MissionKind } from "@/lib/part2DailyMission";
import { tryMarkPart2DailyMissionPractice } from "@/lib/part2MissionComplete";
import { recordPart2ItemScore } from "@/lib/part2/progress";
import CoachAnswerGuide, { type Part1CoachGuide } from "@/components/study/CoachAnswerGuide";
import AnswerComparePanel from "@/components/AnswerComparePanel";
import AudioCompareReplay from "@/components/study/AudioCompareReplay";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import IcaoLevelPanel from "@/components/IcaoLevelPanel";
import YouGlishLink from "@/components/YouGlishLink";
import { useAuth } from "@/components/AuthProvider";
import FlightInstructorReportPanel from "@/components/FlightInstructor/FlightInstructorReportPanel";
import { fetchFlightInstructorReport } from "@/lib/flightInstructor/client";
import { buildLocalInstructorReport } from "@/lib/flightInstructor/localReport";
import { recordInstructorSession } from "@/lib/flightInstructor/memory";
import {
  loadPart1CoachDebriefCache,
  savePart1CoachDebriefCache,
} from "@/lib/part1Mastery/coachDebriefCache";
import type { FlightInstructorReport } from "@/lib/flightInstructor/types";
import { emitCaptainDeltaAfterAnswer } from "@/lib/captainDelta/events";
import { useCaptainDeltaCoachBridge } from "@/hooks/useCaptainDeltaCoachBridge";
import CaptainDeltaTarget from "@/components/CaptainDelta/Visual/CaptainDeltaTarget";
import { keywordTargetId } from "@/lib/captainDelta/visual/types";
import { emitCaptainDeltaSessionRecord } from "@/lib/captainDelta/memory/events";
import CaptainDeltaConfidencePrompt from "@/components/CaptainDelta/Memory/CaptainDeltaConfidencePrompt";
import {
  createConversation,
  resolveQuestionContext,
} from "@/lib/humanExaminer/buildConversation";
import {
  loadConversation,
  saveConversation,
  saveConversationMetrics,
  clearConversation,
} from "@/lib/humanExaminer/conversationStore";
import type { ConversationState } from "@/lib/humanExaminer/types";
import {
  buildConversationProgress,
  deriveConversationPhase,
  presenceFromPhase,
} from "@/lib/aiPresence/conversationPresence";
import { emitAIPresenceClearHex, emitAIPresenceUpdate } from "@/lib/aiPresence/events";
import { processHexAnswerSafe } from "@/lib/aiPresence/processHexAnswer";
import ExaminerPresencePanel from "@/components/aiPresence/ExaminerPresencePanel";
import type { ConversationSessionPhase } from "@/lib/aiPresence/types";

const EXAMINER_THINKING_MS = 500;
const CONVERSATION_CLOSE_MS = 1400;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

type Props = {
  question: string;
  modelAnswer: string;
  evaluateType: EvaluateType;
  keywords?: string[];
  situationId?: string;
  cardNum?: string;
  /** Part 1 answer depth — affects content/structure scoring. */
  answerMode?: "level4" | "level5" | "peel";
  /** Part 1: optional basic / ICAO 5 answer examples (show/hide in coach). */
  part1Guide?: Part1CoachGuide;
  coachShowKeywords?: boolean;
  coachBasicOpen?: boolean;
  modelAudioUrl?: string;
  recordingBlocked?: boolean;
  recordingBlockedMessage?: string;
  embedded?: boolean;
  /** Daily Part 1 flight — one debrief completes the leg; no multi-turn HEX loop. */
  missionLegMode?: boolean;
  missionContinueHref?: string;
  missionContinueLabel?: string;
  /** Daily leg marked complete — keep debrief visible, hide record UI. */
  legComplete?: boolean;
};

function buildAzureExtras(
  azureResult: AzurePronunciationResult,
  transcript: string,
  modelAnswer: string,
  evaluateType: EvaluateType,
) {
  const mispronounced =
    evaluateType === "part1" || evaluateType.startsWith("part3") || evaluateType.startsWith("part4")
      ? collectCoachVaultCandidates(transcript, modelAnswer, azureResult)
      : collectVaultWordCandidates(azureResult);
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
  answerMode = "peel",
  situationId,
  cardNum,
  modelAudioUrl,
  part1Guide,
  coachShowKeywords = true,
  coachBasicOpen = false,
  recordingBlocked = false,
  recordingBlockedMessage,
  embedded = false,
  missionLegMode = false,
  missionContinueHref,
  missionContinueLabel,
  legComplete = false,
}: Props) {
  const speech = useSpeechRecognition("en-US");
  const azure = useAzurePronunciation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<EvaluateFeedback | null>(null);
  const [instructorReport, setInstructorReport] = useState<FlightInstructorReport | null>(null);
  const [instructorLoading, setInstructorLoading] = useState(false);
  const [firstAttempt, setFirstAttempt] = useState<EvaluateFeedback | null>(null);
  const [vaultSaved, setVaultSaved] = useState<string | null>(null);
  const [audioSaveNote, setAudioSaveNote] = useState<string | null>(null);
  const [activityNote, setActivityNote] = useState<string | null>(null);
  const [lastAudioBlob, setLastAudioBlob] = useState<Blob | null>(null);
  const [trainWords, setTrainWords] = useState<VaultWordCandidate[]>([]);
  const [manualWord, setManualWord] = useState("");
  const [open, setOpen] = useState(embedded);
  const [followUpContext, setFollowUpContext] = useState<{
    originalQuestion: string;
    followUpQuestion: string;
    previousTranscript: string;
    examiner?: boolean;
  } | null>(null);
  const [hexConversation, setHexConversation] = useState<ConversationState | null>(null);
  const [showExaminerThinking, setShowExaminerThinking] = useState(false);
  const [closingActive, setClosingActive] = useState(false);
  const [displayExaminerLine, setDisplayExaminerLine] = useState<string | null>(null);
  const [confidenceQuestionId, setConfidenceQuestionId] = useState<string | null>(null);
  const guideRef = useRef<HTMLDivElement>(null);
  const thinkingTimerRef = useRef<number | null>(null);

  const isHexPart1 = evaluateType === "part1" && !!cardNum && !missionLegMode;
  const hexExamining = isHexPart1 && !!hexConversation && !hexConversation.complete;
  const showHexPresence = isHexPart1 && (hexExamining || closingActive);
  const speakingActive = speech.listening || azure.assessing;
  const hexCtx = cardNum ? resolveQuestionContext(cardNum) : null;
  const hexProgress =
    hexConversation && hexCtx
      ? buildConversationProgress(hexConversation, hexCtx)
      : null;

  const conversationPhase: ConversationSessionPhase = deriveConversationPhase({
    hexActive: isHexPart1 && !!hexConversation,
    hexComplete: !!hexConversation?.complete,
    loading,
    azureAssessing: azure.assessing,
    examinerThinking: showExaminerThinking,
    closingActive,
    instructorLoading,
    hasInstructorReport: !!instructorReport,
    hasExaminerFollowUp: !!(displayExaminerLine || followUpContext?.followUpQuestion),
  });

  useEffect(() => {
    if (!isHexPart1) {
      emitAIPresenceClearHex();
      return;
    }
    emitAIPresenceUpdate(presenceFromPhase(conversationPhase));
  }, [isHexPart1, conversationPhase]);

  useEffect(() => {
    return () => {
      if (thinkingTimerRef.current) window.clearTimeout(thinkingTimerRef.current);
      emitAIPresenceClearHex();
    };
  }, []);

  useEffect(() => {
    if (!legComplete || !missionLegMode || !cardNum) return;
    if (feedback || instructorReport) return;
    const cached = loadPart1CoachDebriefCache(cardNum);
    if (!cached) return;
    setFeedback(cached.feedback);
    setInstructorReport(cached.report);
  }, [legComplete, missionLegMode, cardNum, feedback, instructorReport]);

  useEffect(() => {
    if (!isHexPart1 || !cardNum) {
      setHexConversation(null);
      return;
    }
    const loaded = loadConversation(cardNum);
    if (loaded && !loaded.complete) {
      setHexConversation(loaded);
    } else {
      if (loaded?.complete) clearConversation(cardNum);
      setHexConversation(createConversation(cardNum));
    }
  }, [cardNum, isHexPart1]);

  const addWordToVault = (word: string) => {
    const { added, updated, total } = addManualWordsToVault(word, question.slice(0, 80));
    const n = added + updated;
    if (n > 0) {
      setVaultSaved(
        `“${word}” no banco de pronúncia — total ${total}. Abra Pronúncia para treinar.`,
      );
    }
  };

  const addManualWord = () => {
    const trimmed = manualWord.trim();
    if (!trimmed) return;
    addWordToVault(trimmed);
    setManualWord("");
  };

  const runContentEvaluation = async (
    transcript: string,
    azureResult?: AzurePronunciationResult,
    audioBlob?: Blob | null,
  ) => {
    setLoading(true);
    setFeedback(null);
    setInstructorReport(null);
    setVaultSaved(null);
    setAudioSaveNote(null);
    setActivityNote(null);
    setTrainWords([]);
    const evalQuestion = followUpContext?.followUpQuestion ?? question;
    if (isHexPart1 && hexExamining) {
      thinkingTimerRef.current = window.setTimeout(
        () => setShowExaminerThinking(true),
        EXAMINER_THINKING_MS,
      );
    }
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transcript,
          question: evalQuestion,
          modelAnswer,
          type: evaluateType,
          keywords,
          answerMode,
        }),
      });
      const data = (await res.json()) as EvaluateFeedback;

      const vaultCandidates = collectCoachVaultCandidates(
        transcript,
        modelAnswer,
        azureResult ?? null,
      );

      if (azureResult) {
        const azureExtras = buildAzureExtras(azureResult, transcript, modelAnswer, evaluateType);
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
        data.azurePronunciation = {
          ...azureExtras,
          // Prefer model words Azure failed to hear (practice, pilots) over STT garbage
          weakWords: vaultCandidates.map((w) => w.word),
          mispronouncedWords: vaultCandidates,
        };
        data.summary = unscripted
          ? `Pronúncia Azure (fala livre): ${pronunciationScore}/100. ${data.summary}`
          : `Pronúncia Azure: ${azureResult.accuracyScore}/100 (accuracy). ${data.summary}`;
        if (vaultCandidates.length) {
          data.improvements = [
            `Pronúncia: pratique — ${vaultCandidates.map((w) => w.word).join(", ")}.`,
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

      let skipCaptainDebrief = false;
      let hexCompleteThisTurn = false;
      if (isHexPart1 && cardNum) {
        const ctx = resolveQuestionContext(cardNum);
        if (ctx) {
          const base = hexConversation ?? createConversation(cardNum);
          const hexResult = processHexAnswerSafe(
            base,
            ctx,
            data.transcript,
            data.scores.overall,
          );
          saveConversation(hexResult.state);
          setHexConversation(hexResult.state);

          if (!hexResult.state.complete) {
            skipCaptainDebrief = true;
            const line = hexResult.examinerLine ?? "Tell me more.";
            setDisplayExaminerLine(line);
            setFollowUpContext({
              originalQuestion: question,
              followUpQuestion: line,
              previousTranscript: data.transcript,
              examiner: true,
            });
            if (data.icaoLevel?.overall) {
              recordPart1CoachAttempt(cardNum, data.scores.overall, data.icaoLevel.overall);
            }
            tryAgain(true);
          } else {
            hexCompleteThisTurn = true;
            const closingLine =
              hexResult.examinerLine ?? "Thank you. Let's move to the next question.";
            setDisplayExaminerLine(closingLine);
            setClosingActive(true);
            emitAIPresenceUpdate(presenceFromPhase("conversation_closing"));
            await sleep(CONVERSATION_CLOSE_MS);
            setClosingActive(false);
            if (hexResult.metrics) {
              saveConversationMetrics(cardNum, hexResult.metrics);
            }
          }
        }
      }

      if (!skipCaptainDebrief) {
      setInstructorLoading(true);
      try {
        const report = user
          ? await fetchFlightInstructorReport({
              transcript: data.transcript,
              question: evalQuestion,
              modelAnswer,
              type: evaluateType,
              keywords,
              answerMode,
              cardNum,
              situationId,
              scores: data.scores,
              icaoLevel: data.icaoLevel?.overall,
              azureWeakWords: data.azurePronunciation?.weakWords,
              followUpContext: followUpContext ?? undefined,
            })
          : buildLocalInstructorReport(data, evalQuestion, modelAnswer, keywords);
        setInstructorReport(report);
        if (missionLegMode && cardNum) {
          savePart1CoachDebriefCache({
            cardNum,
            feedback: data,
            report,
            savedAt: new Date().toISOString(),
          });
        }
        emitCaptainDeltaAfterAnswer({ report, transcript: data.transcript });
        const sessionLabel = cardNum
          ? `Question ${cardNum}`
          : situationId
            ? `${evaluateType} · ${situationId}`
            : evaluateType;
        const sessionQid = cardNum
          ? `part1-${cardNum}`
          : situationId
            ? `${evaluateType}-${situationId}`
            : evaluateType;
        emitCaptainDeltaSessionRecord({
          type: evaluateType,
          cardNum,
          situationId,
          question: evalQuestion,
          label: sessionLabel,
          transcript: data.transcript,
          overallScore: data.scores.overall,
          icaoLevel: data.icaoLevel?.overall ?? report.icaoBands.estimatedLevel,
          report,
        });
        setConfidenceQuestionId(sessionQid);
        if (followUpContext && !followUpContext.examiner) {
          setFollowUpContext(null);
        }
        recordInstructorSession({
          type: evaluateType,
          cardNum,
          situationId,
          question: evalQuestion,
          transcript: data.transcript,
          overallScore: data.scores.overall,
          icaoLevel: data.icaoLevel?.overall ?? report.icaoBands.estimatedLevel,
          report,
        });
      } catch {
        const report = buildLocalInstructorReport(data, evalQuestion, modelAnswer, keywords);
        setInstructorReport(report);
        if (missionLegMode && cardNum) {
          savePart1CoachDebriefCache({
            cardNum,
            feedback: data,
            report,
            savedAt: new Date().toISOString(),
          });
        }
      } finally {
        setInstructorLoading(false);
      }
      }

      if (evaluateType === "part1" && cardNum && data.icaoLevel?.overall && !skipCaptainDebrief) {
        recordPart1CoachAttempt(cardNum, data.scores.overall, data.icaoLevel.overall);
      }

      if (azureResult && evaluateType.startsWith("part2")) {
        recordPart2RecordingScore(azureResult.accuracyScore);
        const part2MissionKind: Part2MissionKind =
          evaluateType === "part2-readback"
            ? "readback"
            : evaluateType === "part2-interaction"
              ? "interaction"
              : "reported";
        if (situationId) {
          recordPart2ItemScore(situationId, part2MissionKind, data.scores.overall);
        }
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

      const shouldMarkPart1LegComplete =
        evaluateType === "part1" &&
        cardNum &&
        isPart1CardInTodayMission(cardNum) &&
        !skipCaptainDebrief &&
        (missionLegMode ||
          (data.scores.overall >= 50 &&
            (!!azureResult || !!data.transcript.trim()) &&
            (!isHexPart1 || hexCompleteThisTurn)));

      if (shouldMarkPart1LegComplete) {
        markPart1CoachDone(cardNum);
        tryMarkPart1ShadowComplete(cardNum);
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

      if (vaultCandidates.length) {
        const { added, updated, total } = addWordsToVault(
          vaultCandidates,
          question.slice(0, 80),
        );
        const n = added + updated;
        if (n > 0) {
          setVaultSaved(
            `${n} palavra${n > 1 ? "s" : ""} salva${n > 1 ? "s" : ""} no banco de pronúncia (ex.: practice, pilots) — total ${total}. Abra Pronúncia para treinar.`,
          );
        }
        setTrainWords(vaultCandidates);
      } else {
        setTrainWords([]);
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
      if (thinkingTimerRef.current) {
        window.clearTimeout(thinkingTimerRef.current);
        thinkingTimerRef.current = null;
      }
      setShowExaminerThinking(false);
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

  const tryAgain = (keepFollowUp = false) => {
    if (feedback && !firstAttempt) {
      setFirstAttempt(feedback);
    }
    setFeedback(null);
    setInstructorReport(null);
    setVaultSaved(null);
    setTrainWords([]);
    if (!keepFollowUp) {
      setFollowUpContext(null);
    }
    setConfidenceQuestionId(null);
    azure.clear();
    speech.clear();
  };

  const answerFollowUp = (followUpQuestion: string) => {
    if (feedback) {
      setFollowUpContext({
        originalQuestion: question,
        followUpQuestion,
        previousTranscript: feedback.transcript,
      });
    }
    tryAgain(true);
  };

  const scrollToGuide = useCallback(() => {
    guideRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, []);

  useCaptainDeltaCoachBridge({
    question,
    modelAnswer,
    evaluateType,
    keywords,
    questionLabel: cardNum ? `Question ${cardNum}` : situationId,
    recordingBlocked,
    loading,
    hasFeedback: !!(instructorReport && feedback) && !hexExamining,
    canCompareAttempts: !!(firstAttempt && feedback),
    azureAssessing: azure.assessing,
    speechListening: speech.listening,
    onStartAzure: () => void evaluateWithAzure(),
    onStopAzure: () => void finishAzure(),
    onSpeechToggle: speech.toggle,
    onTryAgain: () => {
      if (followUpContext?.examiner) {
        tryAgain(true);
        return;
      }
      if (instructorReport?.followUpQuestion) {
        answerFollowUp(instructorReport.followUpQuestion);
      } else {
        tryAgain();
      }
    },
    onShowKeywords: scrollToGuide,
    onShowHint: scrollToGuide,
    onShowModel: scrollToGuide,
    azureConfigured: azure.configured,
  });

  const attemptCompare =
    firstAttempt && feedback ? { first: firstAttempt, second: feedback } : null;

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
      ) : null}

      {evaluateType === "part1" && part1Guide && !legComplete ? (
        <div ref={guideRef}>
          {speakingActive && !missionLegMode ? (
            <div className="voice-coach-speaking-mode" aria-live="polite">
              <p className="voice-coach-speaking-kicker">● Speaking — scripts hidden</p>
              <p className="voice-coach-speaking-hint">
                Answer from memory. Structure:{" "}
                {part1Guide.memoryLabels?.join(" → ") ?? keywords.join(" → ")}
              </p>
            </div>
          ) : null}
          <CoachAnswerGuide
            guide={part1Guide}
            showKeywords={coachShowKeywords}
            basicDefaultOpen={coachBasicOpen}
            disableReadingInterrupt={missionLegMode}
          />
          {speakingActive && missionLegMode ? (
            <p className="voice-coach-recording-note" aria-live="polite">
              ● Recording — examples stay open. Try from memory; paraphrase is fine.
            </p>
          ) : null}
        </div>
      ) : null}

      {!legComplete && (
      <div className="voice-coach-actions">
        {azure.configured ? (
          <>
            {!azure.assessing ? (
              <button
                type="button"
                className="btn green"
                data-record-source="legacy"
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
      )}

      {(speech.error || azure.error) && !legComplete && (
        <p className="voice-coach-error">{speech.error || azure.error}</p>
      )}

      {(azure.result?.recognizedText || speech.transcript) && (
        <CaptainDeltaTarget id="student-transcript" as="div" className="voice-coach-transcript">
          <strong>Transcrição:</strong>
          <p>{azure.result?.recognizedText || speech.transcript}</p>
        </CaptainDeltaTarget>
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

      {showHexPresence && hexProgress && (
        <ExaminerPresencePanel
          progress={hexProgress}
          phase={conversationPhase}
          examinerLine={displayExaminerLine ?? followUpContext?.followUpQuestion}
          showThinking={showExaminerThinking || (loading && hexExamining)}
        />
      )}

      {followUpContext && !feedback && !showHexPresence && (
        <div
          className={`fi-followup-banner ${followUpContext.examiner ? "hex-examiner-banner" : ""}`}
        >
          <strong>
            {followUpContext.examiner ? "🎙️ Examiner" : "👨‍✈️ Captain Delta — follow-up"}
          </strong>
          <p>{followUpContext.followUpQuestion}</p>
        </div>
      )}

      {instructorLoading && !hexExamining && !closingActive && (
        <p className="fi-loading hex-captain-preparing">
          🟣 Captain Delta is preparing your debrief…
        </p>
      )}

      {instructorReport && feedback && (
        <>
          {confidenceQuestionId && (
            <CaptainDeltaConfidencePrompt
              questionId={confidenceQuestionId}
              onSelect={() => setConfidenceQuestionId(null)}
            />
          )}
          <FlightInstructorReportPanel
          report={instructorReport}
          feedback={feedback}
          onTryAgain={() => tryAgain()}
          onAnswerFollowUp={isHexPart1 ? undefined : answerFollowUp}
          attemptCompare={attemptCompare}
          followUpBanner={followUpContext?.followUpQuestion ?? null}
          suppressFollowUp={isHexPart1}
          hideTryAgain={legComplete}
        />
        {missionLegMode && missionContinueHref ? (
          <div className="part1-coach-continue-bar">
            <Link href={missionContinueHref} className="btn purple btn-large">
              {missionContinueLabel ?? "Continue flight"}
            </Link>
            <p className="sub">
              Today&apos;s leg is complete for this question. You can record again to improve, or
              continue the flight.
            </p>
          </div>
        ) : null}
        </>
      )}

      {instructorReport && feedback && (
        <div className="voice-coach-mispronounced fi-pronunciation-extra">
          {evaluateType.startsWith("part2") && lastAudioBlob && (
            <AudioCompareReplay
              modelText={modelAnswer}
              modelAudioUrl={modelAudioUrl}
              userAudioBlob={lastAudioBlob}
              modelLabel="Modelo"
              userLabel="Sua gravação"
            />
          )}
          {trainWords.length > 0 && (
            <>
              <h3>Treinar pronúncia</h3>
              <ul className="mispronounced-list">
                {trainWords.map((w) => (
                  <li
                    key={`${w.word}-${w.errorLabel}`}
                    className={`mispronounced-item ${w.accuracyScore < 60 ? "bad" : "warn"}`}
                  >
                    <span className="mispronounced-word">{w.word}</span>
                    <button type="button" className="btn secondary btn-sm" onClick={() => addWordToVault(w.word)}>
                      + Banco
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
          {vaultSaved && <p className="vault-saved-banner">{vaultSaved}</p>}
          <Link href="/word-mission" className="btn secondary btn-sm">
            Abrir Pronúncia →
          </Link>
        </div>
      )}

      {feedback && !instructorReport && !instructorLoading && (
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

          {feedback.rawTranscript && (
            <p className="voice-coach-warn voice-coach-stt-note">
              Azure ouviu: «{feedback.rawTranscript}» — termos de aviação foram corrigidos na
              avaliação de conteúdo (ex.: missed approach, runway).
            </p>
          )}

          {evaluateType === "part1" && feedback.transcript && (
            <AnswerComparePanel
              transcript={feedback.transcript}
              modelAnswer={modelAnswer}
              keywords={keywords}
              azureAccuracy={feedback.azurePronunciation?.accuracyScore}
            />
          )}

          {evaluateType === "part2-readback" && feedback.readbackElements?.length ? (
            <div className="readback-elements-panel">
              <h3>Elementos da clearance</h3>
              <p className="answer-compare-hint">
                Readback correto = todos os dados da autorização. Não precisa repetir palavra por palavra.
              </p>
              <ul className="readback-elements-list">
                {feedback.readbackElements.map((el) => (
                  <li key={el.id} className={el.found ? "found" : "missing"}>
                    <CaptainDeltaTarget id={keywordTargetId(el.label)} as="span">
                      <span aria-hidden>{el.found ? "✓" : "○"}</span> {el.label}
                    </CaptainDeltaTarget>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

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

          <div className="voice-coach-mispronounced">
            <h3>Treinar pronúncia</h3>
            <p className="mispronounced-none">
              Quando o Azure ouve errado (practice → “Brett see”, pilots → “pallets”), usamos as
              palavras do <strong>modelo</strong> que faltaram na transcrição — não o erro do
              microfone. Adicione ao banco e treine em Pronúncia.
            </p>
            {trainWords.length > 0 ? (
              <ul className="mispronounced-list">
                {trainWords.map((w) => (
                  <li
                    key={`${w.word}-${w.errorLabel}`}
                    className={`mispronounced-item ${w.accuracyScore < 60 ? "bad" : "warn"}`}
                  >
                    <span className="mispronounced-word">
                      {w.word}
                      <WordPhoneticHint word={w.word} className="vault-word-phonetic" />
                    </span>
                    <span className="mispronounced-error">{w.errorLabel}</span>
                    <button
                      type="button"
                      className="btn secondary btn-sm"
                      onClick={() => addWordToVault(w.word)}
                    >
                      + Banco
                    </button>
                    <YouGlishLink word={w.word} compact />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mispronounced-none">
                Nenhuma palavra fraca detectada automaticamente — adicione manualmente abaixo.
              </p>
            )}

            <div className="vault-manual-add-inline">
              <label htmlFor="coach-vault-manual">
                Adicionar palavra manualmente (ex.: practice, pilots)
              </label>
              <div className="vault-manual-add-row">
                <input
                  id="coach-vault-manual"
                  type="text"
                  value={manualWord}
                  onChange={(e) => setManualWord(e.target.value)}
                  placeholder="practice, pilots, confident"
                  autoComplete="off"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addManualWord();
                    }
                  }}
                />
                <button type="button" className="btn green btn-sm" onClick={addManualWord}>
                  Adicionar
                </button>
              </div>
            </div>

            {vaultSaved && <p className="vault-saved-banner">{vaultSaved}</p>}
            <Link href="/word-mission" className="btn secondary btn-sm">
              Abrir Pronúncia →
            </Link>
          </div>
        </div>
      )}

      {!speech.supported && !azure.configured && (
        <p className="voice-coach-footnote">Use Chrome ou Edge no desktop.</p>
      )}
    </div>
  );
}

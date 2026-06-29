"use client";

import { compareTranscriptToModel } from "@/lib/evaluate/compareAnswer";
import { highlightConnectors } from "@/utils/highlightConnectors";

type Props = {
  transcript: string;
  modelAnswer: string;
  azureAccuracy?: number;
};

export default function AnswerComparePanel({ transcript, modelAnswer, azureAccuracy }: Props) {
  const compare = compareTranscriptToModel(transcript, modelAnswer);

  if (!transcript.trim()) return null;

  return (
    <div className="answer-compare-panel">
      <h3>Comparação — modelo vs. o que o Azure ouviu</h3>

      {compare.unreliableTranscript && (
        <p className="answer-compare-warn">
          A transcrição diverge muito do modelo ({compare.overlapPercent}% das palavras batem).
          Isso costuma ser <strong>pronúncia</strong>, não conteúdo errado — o microfone “adivinha”
          palavras parecidas (<em>wingding</em> em vez de <em>wind</em>, <em>Dobbs</em> em vez de{" "}
          <em>doubts</em>). Treine as palavras em vermelho no banco de pronúncia e grave de novo
          olhando a resposta modelo.
        </p>
      )}

      <div className="answer-compare-stats">
        <span>Palavras em comum: <strong>{compare.overlapPercent}%</strong></span>
        {azureAccuracy !== undefined && (
          <span>Pronúncia Azure: <strong>{azureAccuracy}%</strong></span>
        )}
      </div>

      <div className="answer-compare-columns">
        <div className="answer-compare-col model">
          <h4>Resposta modelo (fale assim)</h4>
          <p className="answer-compare-text">{highlightConnectors(compare.spokenModel)}</p>
        </div>
        <div className="answer-compare-col heard">
          <h4>Azure ouviu</h4>
          <p className="answer-compare-text answer-compare-heard">{transcript}</p>
        </div>
      </div>

      {(compare.missingContentWords.length > 0 || compare.extraContentWords.length > 0) && (
        <div className="answer-compare-words">
          {compare.missingContentWords.length > 0 && (
            <div className="answer-compare-word-group missing">
              <strong>Faltaram no áudio (modelo)</strong>
              <p>{compare.missingContentWords.join(", ")}</p>
            </div>
          )}
          {compare.extraContentWords.length > 0 && (
            <div className="answer-compare-word-group extra">
              <strong>Palavras estranhas (provável erro de pronúncia)</strong>
              <p>{compare.extraContentWords.join(", ")}</p>
            </div>
          )}
          {compare.matchedContentWords.length > 0 && (
            <div className="answer-compare-word-group matched">
              <strong>Acertou</strong>
              <p>{compare.matchedContentWords.join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

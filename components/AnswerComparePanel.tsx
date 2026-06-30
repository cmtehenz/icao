"use client";

import { compareTranscriptToModel } from "@/lib/evaluate/compareAnswer";
import { highlightConnectors } from "@/utils/highlightConnectors";

type Props = {
  transcript: string;
  modelAnswer: string;
  keywords?: string[];
  azureAccuracy?: number;
};

export default function AnswerComparePanel({
  transcript,
  modelAnswer,
  keywords = [],
  azureAccuracy,
}: Props) {
  const compare = compareTranscriptToModel(transcript, modelAnswer, keywords);

  if (!transcript.trim()) return null;

  return (
    <div className="answer-compare-panel">
      <h3>Ideias e keywords — não precisa ser palavra por palavra</h3>
      <p className="answer-compare-hint">
        O coach avalia se você cobriu o tema e as keywords do card. Reformular com suas palavras é
        OK — use a resposta modelo só como guia de estrutura.
      </p>

      {compare.unreliableTranscript && (
        <p className="answer-compare-warn">
          Poucas keywords/ideias detectadas
          {keywords.length > 0 && (
            <>
              {" "}
              ({compare.keywordCoveragePercent}% das keywords; {compare.overlapPercent}% de overlap
              com o modelo)
            </>
          )}
          . Pode ser pronúncia (o microfone “adivinha” palavras parecidas) ou conteúdo faltando —
          treine termos difíceis no banco de pronúncia e tente incluir as keywords em vermelho.
        </p>
      )}

      <div className="answer-compare-stats">
        {keywords.length > 0 && (
          <span>
            Keywords: <strong>{compare.keywordCoveragePercent}%</strong>
          </span>
        )}
        <span>
          Termos do modelo: <strong>{compare.overlapPercent}%</strong>
        </span>
        {azureAccuracy !== undefined && (
          <span>
            Pronúncia Azure: <strong>{azureAccuracy}%</strong>
          </span>
        )}
      </div>

      {keywords.length > 0 && (
        <div className="answer-compare-words">
          {compare.matchedKeywords.length > 0 && (
            <div className="answer-compare-word-group matched">
              <strong>Keywords que você usou</strong>
              <p>{compare.matchedKeywords.join(", ")}</p>
            </div>
          )}
          {compare.missingKeywords.length > 0 && (
            <div className="answer-compare-word-group missing">
              <strong>Keywords para incluir na próxima tentativa</strong>
              <p>{compare.missingKeywords.join(", ")}</p>
            </div>
          )}
        </div>
      )}

      <div className="answer-compare-columns">
        <div className="answer-compare-col model">
          <h4>Guia de estrutura (modelo)</h4>
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
              <strong>Termos do modelo que faltaram (opcional)</strong>
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
              <strong>Termos que bateram com o modelo</strong>
              <p>{compare.matchedContentWords.join(", ")}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

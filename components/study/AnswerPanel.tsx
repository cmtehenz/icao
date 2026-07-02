import {
  LEVEL4_CONNECTOR_GUIDE,
  getMemoryIcons,
  getStudyTips,
  inferLevel4Steps,
} from "@/lib/studyGuide";
import { highlightConnectors } from "@/utils/highlightConnectors";
import type { Card } from "@/lib/types";
import { formatIdea } from "@/lib/utils";

function IdeaLine({ text }: { text: string }) {
  const parsed = formatIdea(text);
  if (!parsed) {
    return <p className="idea">{highlightConnectors(text)}</p>;
  }
  return (
    <p className="idea">
      <b>{parsed.label}</b>
      {highlightConnectors(parsed.rest)}
    </p>
  );
}

function StudyConnectorGuide() {
  return (
    <div className="answer-level-extra answer-connector-guide">
      <h4>Conectores fáceis (ICAO 4)</h4>
      <p className="answer-level-hint">Use 1 conector por frase — não precisa decorar todos.</p>
      <ul className="answer-connector-list">
        {LEVEL4_CONNECTOR_GUIDE.map((slot) => (
          <li key={slot.slot} className="answer-connector-item">
            <span className="answer-connector-slot">{slot.slot}</span>
            <span className="answer-connector-phrases">{slot.connectors.join(" · ")}</span>
            <span className="answer-connector-hint">{slot.hint}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function EasyStudyPanel({ card }: { card: Card }) {
  const steps = inferLevel4Steps(card);
  const icons = getMemoryIcons(card);
  const example = card.level4Example ?? card.example;
  const fullAnswer = card.answerLevel4 ?? card.answer;

  return (
    <div className="answer show answer-panel answer-panel-level4 answer-panel-easy">
      <h3>Modo fácil — ICAO 4</h3>
      <p className="answer-level-hint">Decore as keywords e os conectores — não o texto inteiro.</p>

      <div className="answer-memory-map" aria-label="Mapa mental">
        {icons.map((icon, i) => (
          <span key={`${icon}-${i}`} className="answer-memory-icon">
            {icon}
            {i < icons.length - 1 && <span className="arrow">→</span>}
          </span>
        ))}
      </div>
      <p className="answer-memory-labels">{card.memoryLabels.join(" → ")}</p>

      <ol className="answer-level-steps">
        {steps.map((step) => (
          <li key={step.label} className="answer-level-step">
            <span className="answer-level-step-label">{step.label}</span>
            <p>{highlightConnectors(step.sentence)}</p>
          </li>
        ))}
      </ol>

      <StudyConnectorGuide />

      {example ? (
        <div className="answer-level-extra">
          <h4>Exemplo — vale muitos pontos</h4>
          <p>{highlightConnectors(example)}</p>
        </div>
      ) : null}

      {card.answerExtra ? (
        <div className="answer-level-extra">
          <h4>Se quiser falar um pouco mais</h4>
          <p>{highlightConnectors(card.answerExtra)}</p>
        </div>
      ) : null}

      <div className="answer-level-extra answer-study-tips">
        <h4>Dicas para estudar</h4>
        <p className="answer-study-tips-text">{getStudyTips(card)}</p>
      </div>

      <div className="answer-level-full">
        <h4>Resposta completa (40–50 s)</h4>
        <p className="answer-text">{highlightConnectors(fullAnswer)}</p>
      </div>

      <div className="word-meta">
        <span>{fullAnswer.split(/\s+/).filter(Boolean).length} words</span>
        <span>Target: 40–50 seconds</span>
      </div>
    </div>
  );
}

type Props = {
  card: Card;
  show: boolean;
  connectorSet?: string;
};

export default function AnswerPanel({ card, show, connectorSet }: Props) {
  if (!show) return null;

  if (connectorSet === "level4") {
    return <EasyStudyPanel card={card} />;
  }

  if (connectorSet === "level5" && card.answerLevel5) {
    return (
      <div className="answer show answer-panel answer-panel-level5">
        <h3>Resposta modelo — ICAO 5</h3>
        <p className="answer-level-hint">
          Mesma história, com mais detalhe e vocabulário — ideal para 50–60 segundos.
        </p>
        <p className="answer-text answer-text-level5">{highlightConnectors(card.answerLevel5)}</p>
        <StudyConnectorGuide />
        <div className="answer-level-extra answer-study-tips">
          <h4>Dicas para estudar</h4>
          <p className="answer-study-tips-text">{getStudyTips(card)}</p>
        </div>
        <div className="answer-level-full">
          <h4>Keywords</h4>
          <p className="answer-memory-labels">{card.memoryLabels.join(" → ")}</p>
        </div>
        <div className="word-meta">
          <span>{card.answerLevel5.split(/\s+/).filter(Boolean).length} words</span>
          <span>Target: 50–60 seconds</span>
        </div>
      </div>
    );
  }

  if (connectorSet === "level5") {
    return (
      <div className="answer show answer-panel answer-panel-level5">
        <h3>Resposta modelo — ICAO 5</h3>
        <p className="answer-text answer-text-level5">{highlightConnectors(card.answer)}</p>
        <div className="word-meta">
          <span>{card.answer.split(/\s+/).filter(Boolean).length} words</span>
          <span>Target: 50–60 seconds</span>
        </div>
      </div>
    );
  }

  return (
    <div className="answer show answer-panel">
      <h3>Resposta modelo — PEEL</h3>
      <div className="answer-blocks">
        <div className="block blue-b">
          <h4>Opener</h4>
          <p>{highlightConnectors(card.opener)}</p>
        </div>
        <div className="block orange-b">
          <h4>Ideas</h4>
          {card.ideas.map((idea) => (
            <IdeaLine key={idea} text={idea} />
          ))}
        </div>
        <div className="block purple-b">
          <h4>Example</h4>
          <p>{highlightConnectors(card.example)}</p>
        </div>
        <div className="block green-b">
          <h4>Conclusion</h4>
          <p>{highlightConnectors(card.conclusion)}</p>
        </div>
      </div>
      <StudyConnectorGuide />
      <div className="answer-level-extra answer-study-tips">
        <h4>Dicas para estudar</h4>
        <p className="answer-study-tips-text">{getStudyTips(card)}</p>
      </div>
      <div className="word-meta">
        <span>{card.targetWords} words</span>
        <span>Target: 35–60 seconds</span>
      </div>
    </div>
  );
}

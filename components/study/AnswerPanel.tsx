import { highlightConnectors } from "@/utils/highlightConnectors";
import type { Card } from "@/lib/types";
import { formatIdea } from "@/lib/utils";

function IdeaLine({ text }: { text: string }) {
  const parsed = formatIdea(text);
  if (!parsed) {
    return (
      <p className="idea">
        {highlightConnectors(text)}
      </p>
    );
  }
  return (
    <p className="idea">
      <b>{parsed.label}</b>
      {highlightConnectors(parsed.rest)}
    </p>
  );
}

type Props = {
  card: Card;
  show: boolean;
};

export default function AnswerPanel({ card, show }: Props) {
  if (!show) return null;
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
      <div className="word-meta">
        <span>{card.targetWords} words</span>
        <span>Target: 35–60 seconds</span>
      </div>
    </div>
  );
}

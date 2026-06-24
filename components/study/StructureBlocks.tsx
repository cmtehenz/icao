import { highlightConnectors } from "@/utils/highlightConnectors";
import type { Card } from "@/lib/types";
import { formatIdea } from "@/lib/utils";

function IdeaLine({ text }: { text: string }) {
  const parsed = formatIdea(text);
  if (!parsed) return <p className="idea">{highlightConnectors(text)}</p>;
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

export default function StructureBlocks({ card, show }: Props) {
  if (!show) return null;
  return (
    <div className="structure-blocks-study">
      <div className="block blue-b">
        <h3>Opener</h3>
        <p>{highlightConnectors(card.opener)}</p>
      </div>
      <div className="block orange-b">
        <h3>Ideas</h3>
        {card.ideas.map((idea) => (
          <IdeaLine key={idea} text={idea} />
        ))}
      </div>
      <div className="block purple-b">
        <h3>Example</h3>
        <p>{highlightConnectors(card.example)}</p>
      </div>
      <div className="block green-b">
        <h3>Conclusion</h3>
        <p>{highlightConnectors(card.conclusion)}</p>
      </div>
    </div>
  );
}

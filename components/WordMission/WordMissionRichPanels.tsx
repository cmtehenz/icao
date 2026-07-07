"use client";

import Link from "next/link";
import { lookupDevKnowledgeByTerm } from "@/lib/knowledge/devKnowledge";
import {
  richPanelsForStep,
  type RichPanelSection,
  type WordMissionRichContent,
} from "@/lib/wordMission/lesson/richContent";
import type { WordMissionStepId } from "@/lib/wordMission/lesson/types";

function ProseBlock({ text }: { text: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <>
      {paragraphs.map((para, i) => (
        <p key={i} className="word-mission-rich-para">
          {para}
        </p>
      ))}
    </>
  );
}

function PanelBody({ section }: { section: RichPanelSection }) {
  if (section.body) return <ProseBlock text={section.body} />;
  if (section.bullets?.length) {
    return (
      <ul className="word-mission-rich-list">
        {section.bullets.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }
  if (section.quotes?.length) {
    return (
      <ol className="word-mission-rich-quotes">
        {section.quotes.map((quote) => (
          <li key={quote}>
            <span className="word-mission-radio-quote">{quote}</span>
          </li>
        ))}
      </ol>
    );
  }
  if (section.chips?.length) {
    return (
      <div className="word-mission-rich-chips">
        {section.chips.map((chip) => {
          const entry = lookupDevKnowledgeByTerm(chip);
          if (entry) {
            return (
              <Link
                key={chip}
                href={`/word-mission?term=${entry.id}`}
                className="word-mission-rich-chip"
              >
                {chip}
              </Link>
            );
          }
          return (
            <span key={chip} className="word-mission-rich-chip word-mission-rich-chip--static">
              {chip}
            </span>
          );
        })}
      </div>
    );
  }
  if (section.links?.length) {
    return (
      <ul className="word-mission-rich-links">
        {section.links.map((ref) => (
          <li key={ref.label}>
            {ref.href ? (
              <a href={ref.href} target="_blank" rel="noopener noreferrer">
                {ref.label}
              </a>
            ) : (
              ref.label
            )}
          </li>
        ))}
      </ul>
    );
  }
  return null;
}

type Props = {
  stepId: WordMissionStepId;
  richContent?: WordMissionRichContent;
};

export default function WordMissionRichPanels({ stepId, richContent }: Props) {
  const panels = richPanelsForStep(stepId, richContent);
  if (!panels.length) return null;

  return (
    <div className="word-mission-rich-panels">
      {panels.map((section) => (
        <section key={section.id} className="word-mission-rich-panel">
          <h4 className="word-mission-rich-panel-title">{section.title}</h4>
          <PanelBody section={section} />
        </section>
      ))}
    </div>
  );
}

export function InstructorProse({ text }: { text: string }) {
  return <ProseBlock text={text} />;
}

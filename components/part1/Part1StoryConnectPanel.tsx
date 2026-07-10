"use client";

import { useMemo, useState } from "react";
import MemoryFlow from "@/components/study/MemoryFlow";
import {
  getStoryConnectSections,
  STORY_CLOSE_CONNECTOR,
  STORY_FULL_CONNECTOR,
} from "@/lib/part1Mastery/anchorBuild";
import type { Card } from "@/lib/types";

type Props = {
  card: Card;
  keywords: string[];
  onComplete: () => void;
};

export default function Part1StoryConnectPanel({ card, keywords, onComplete }: Props) {
  const sections = useMemo(() => getStoryConnectSections(card, keywords), [card, keywords]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visited, setVisited] = useState<Set<number>>(() => new Set([0]));
  const [showHint, setShowHint] = useState(false);

  const isFullStep = activeIndex >= sections.length;
  const active = sections[activeIndex];
  const allSectionsVisited = sections.every((s) => visited.has(s.index));

  const markVisited = (index: number) => {
    setVisited((prev) => new Set(prev).add(index));
  };

  const goNext = () => {
    markVisited(activeIndex);
    setShowHint(false);
    if (activeIndex < sections.length - 1) {
      setActiveIndex(activeIndex + 1);
    } else {
      setActiveIndex(sections.length);
    }
  };

  return (
    <section className="part1-story-connect">
      <p className="part1-story-connect-lead">
        Connect your four anchors into one answer — <strong>one section at a time</strong>, then
        the full story. Use your own words.
      </p>

      <MemoryFlow
        memory={card.memory}
        memoryLabels={card.memoryLabels}
        memoryIcons={card.memoryIcons}
        expanded
      />

      <div className="part1-story-connect-tabs">
        {sections.map((section) => (
          <button
            key={section.index}
            type="button"
            className={`part1-story-connect-tab${activeIndex === section.index ? " is-active" : ""}${visited.has(section.index) ? " is-done" : ""}`}
            onClick={() => {
              setActiveIndex(section.index);
              setShowHint(false);
            }}
          >
            {section.label}
          </button>
        ))}
        <button
          type="button"
          className={`part1-story-connect-tab${isFullStep ? " is-active" : ""}`}
          onClick={() => {
            setActiveIndex(sections.length);
            setShowHint(false);
          }}
        >
          Full answer
        </button>
      </div>

      {!isFullStep && active ? (
        <article className="part1-story-connect-card card">
          <p className="part1-story-connect-connector">{active.connector}</p>
          <p className="part1-story-connect-prompt">
            Say <strong>1–2 sentences</strong> about {active.label}. Keywords:{" "}
            {active.keywords.join(" · ")}
          </p>
          <button
            type="button"
            className="btn secondary btn-sm"
            onClick={() => setShowHint((v) => !v)}
          >
            {showHint ? "Hide hint" : "Need a hint?"}
          </button>
          {showHint ? (
            <div className="part1-story-connect-hints">
              <p className="part1-story-connect-hints-kicker">
                Say it your way — pick one pattern (paraphrase is fine):
              </p>
              <ul className="part1-story-connect-hint-list">
                {active.hints.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ) : null}
          <button type="button" className="btn purple" onClick={goNext}>
            I spoke this part — next
          </button>
        </article>
      ) : (
        <article className="part1-story-connect-card card">
          <p className="part1-story-connect-connector">{STORY_FULL_CONNECTOR}</p>
          <p className="part1-story-connect-prompt">
            Now say the <strong>full answer</strong> aloud — all four anchors, example, and close.
          </p>
          <ul className="part1-story-connect-keywords">
            {keywords.map((kw) => (
              <li key={kw}>{kw}</li>
            ))}
          </ul>
          <p className="part1-story-connect-example">
            {STORY_FULL_CONNECTOR} {card.level4Example ?? card.example}
          </p>
          <p className="part1-story-connect-close">
            {STORY_CLOSE_CONNECTOR} {card.conclusion}
          </p>
          <button
            type="button"
            className="btn purple btn-large"
            disabled={!allSectionsVisited}
            onClick={onComplete}
          >
            {allSectionsVisited
              ? "I spoke the full answer — solo coach"
              : "Complete each section first"}
          </button>
        </article>
      )}
    </section>
  );
}

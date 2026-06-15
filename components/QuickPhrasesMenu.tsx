"use client";

import { useMemo, useState } from "react";
import { CATEGORIES } from "@/lib/categories";
import { CARDS } from "@/lib/cards";
import { ESSENTIAL_CARD_NUMS } from "@/lib/essential";
import type { ConnectorSetId } from "@/lib/connectors";
import { personalizeCard } from "@/lib/personalize";
import type { PilotProfile } from "@/lib/profile";
import { getSimplePhrases, getSimplePhrasesText } from "@/lib/simplePhrases";

type Props = {
  open: boolean;
  essentialOnly?: boolean;
  profile: PilotProfile;
  connectorSet: ConnectorSetId;
  currentNum?: string;
  onClose: () => void;
  onSelect?: (cardIndex: number) => void;
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    /* ignore */
  }
}

export default function QuickPhrasesMenu({
  open,
  essentialOnly = false,
  profile,
  connectorSet,
  currentNum,
  onClose,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(currentNum ?? null);

  const items = useMemo(() => {
    const pool = essentialOnly
      ? ESSENTIAL_CARD_NUMS.map((num) => CARDS.find((c) => c.num === num)!).filter(Boolean)
      : CARDS;

    const q = search.toLowerCase().trim();
    return pool
      .map((card) => {
        const personalized = personalizeCard(card, profile, connectorSet);
        const phrases = getSimplePhrases(personalized);
        return {
          card: personalized,
          idx: CARDS.findIndex((c) => c.num === card.num),
          phrases,
        };
      })
      .filter(({ card, phrases }) => {
        if (!q) return true;
        const blob = [
          card.num,
          card.question,
          CATEGORIES[card.category],
          ...phrases.map((p) => p.text),
        ]
          .join(" ")
          .toLowerCase();
        return blob.includes(q);
      });
  }, [essentialOnly, profile, connectorSet, search]);

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide phrases-modal" onClick={(e) => e.stopPropagation()}>
        <h2>4 frases por pergunta</h2>
        <p className="modal-sub">
          Resumo oral rápido: abertura, dois pontos e fechamento. Toque numa frase para copiar ou
          abra a pergunta para praticar.
        </p>

        <input
          className="search phrases-search"
          placeholder="Buscar pergunta ou frase..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="phrases-list">
          {items.length === 0 ? (
            <p className="phrases-empty">Nenhuma pergunta encontrada.</p>
          ) : (
            items.map(({ card, idx, phrases }) => {
              const isOpen = expanded === card.num;
              return (
                <article key={card.num} className={`phrases-item ${isOpen ? "open" : ""}`}>
                  <button
                    type="button"
                    className="phrases-item-head"
                    onClick={() => setExpanded(isOpen ? null : card.num)}
                  >
                    <span className="phrases-item-num">#{card.num}</span>
                    <span className="phrases-item-q">{card.question}</span>
                    <span className="phrases-item-tag">{CATEGORIES[card.category]}</span>
                  </button>

                  {isOpen && (
                    <div className="phrases-item-body">
                      <ol className="phrases-four">
                        {phrases.map((phrase) => (
                          <li key={phrase.label}>
                            <button
                              type="button"
                              className="phrase-line"
                              onClick={() => copyText(phrase.text)}
                              title="Copiar frase"
                            >
                              <span className="phrase-label">{phrase.label}</span>
                              <span className="phrase-text">{phrase.text}</span>
                            </button>
                          </li>
                        ))}
                      </ol>
                      <div className="phrases-item-actions">
                        <button
                          type="button"
                          className="btn secondary"
                          onClick={() => copyText(getSimplePhrasesText(card))}
                        >
                          Copiar as 4
                        </button>
                        {onSelect && (
                          <button
                            type="button"
                            className="btn purple"
                            onClick={() => {
                              onSelect(idx);
                              onClose();
                            }}
                          >
                            Praticar esta
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}

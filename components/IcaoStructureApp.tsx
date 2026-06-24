"use client";

import { useEffect, useMemo, useState } from "react";
import AppNav from "@/components/AppNav";
import IcaoFormulaBanner from "@/components/IcaoFormulaBanner";
import { CATEGORIES } from "@/lib/categories";
import { CARDS } from "@/lib/cards";
import { getIcaoStructure, getKeywords, estimateStructureWords } from "@/lib/icaoStructure";
import { loadConnectorSet } from "@/lib/connectors";
import { personalizeCard } from "@/lib/personalize";
import { loadProfile } from "@/lib/profile";


export default function IcaoStructureApp() {
  const [search, setSearch] = useState("");
  const [current, setCurrent] = useState(0);
  const [expanded, setExpanded] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = localStorage.getItem("icao_theme");
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("icao_theme", theme);
  }, [theme]);

  const cards = useMemo(() => {
    const q = search.toLowerCase().trim();
    return CARDS.filter((c) => {
      const blob = [c.question, c.num, CATEGORIES[c.category], ...(c.keywords ?? [])]
        .join(" ")
        .toLowerCase();
      return !q || blob.includes(q);
    });
  }, [search]);

  const card = useMemo(() => {
    if (!cards.length) return null;
    const idx = Math.min(current, cards.length - 1);
    const profile = loadProfile();
    const connectorSet = loadConnectorSet();
    return personalizeCard(cards[idx], profile, connectorSet);
  }, [cards, current]);

  const structure = card ? getIcaoStructure(card) : [];
  const keywords = card ? getKeywords(card) : [];
  const wordEstimate = card ? estimateStructureWords(card) : 0;

  const go = (delta: number) => {
    if (!cards.length) return;
    setCurrent((prev) => (prev + delta + cards.length) % cards.length);
    setExpanded(true);
  };

  return (
    <>
      <AppNav />
      <IcaoFormulaBanner />

      <div className="structure-wrap">
        <header className="structure-header">
          <div>
            <h1>ICAO 4</h1>
            <p className="structure-sub">
              ICAO Delta · {CARDS.length} perguntas PEEL — keywords + fórmula de 4 passos (~30–45 s).
            </p>
          </div>
          <button
            type="button"
            className="btn icon-btn secondary"
            onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        </header>

        <div className="structure-toolbar">
          <input
            className="search"
            placeholder="Buscar pergunta..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrent(0);
            }}
          />
        </div>

        <main className="structure-main">
          <aside className="structure-sidebar">
            {cards.length === 0 ? (
              <p>No questions found.</p>
            ) : (
              cards.map((c, i) => (
                <button
                  key={c.num}
                  type="button"
                  className={`list-btn ${i === current ? "active" : ""}`}
                  onClick={() => {
                    setCurrent(i);
                    setExpanded(true);
                  }}
                >
                  <b>
                    {c.num}. {c.question}
                  </b>
                  <div className="list-meta">
                    <span className="list-tag">{CATEGORIES[c.category]}</span>
                  </div>
                </button>
              ))
            )}
          </aside>

          {card && (
            <article className="structure-card">
              <div className="structure-card-head">
                <span className="card-num">QUESTION #{card.num}</span>
                <span className="category-badge">{CATEGORIES[card.category]}</span>
                <span className="structure-counter">
                  {current + 1} / {cards.length}
                </span>
              </div>

              <h2 className="question">{card.question}</h2>

              <section className="structure-keywords">
                <h3>Keywords</h3>
                <ul className="keywords-list">
                  {keywords.map((kw) => (
                    <li key={kw}>{kw}</li>
                  ))}
                </ul>
              </section>

              <div className="structure-toggle-row">
                <button
                  type="button"
                  className="btn purple"
                  onClick={() => setExpanded((e) => !e)}
                >
                  {expanded ? "Ocultar estrutura ICAO 4" : "Ver estrutura ICAO 4"}
                </button>
                <span className="structure-word-meta">~{wordEstimate} words · {RESPONSE_TARGET}</span>
              </div>

              {expanded && (
                <section className="structure-blocks">
                  <h3>Estrutura ICAO 4</h3>
                  {structure.map((block) => (
                    <div key={block.step} className={`structure-block ${block.color}-b`}>
                      <div className="structure-block-head">
                        <span className="structure-step-num">{block.step}</span>
                        <div>
                          <strong>{block.label}</strong>
                          <span className="structure-block-hint">({block.hint})</span>
                        </div>
                      </div>
                      <p className="structure-block-example">
                        <span className="structure-example-label">Example:</span> {block.example}
                      </p>
                    </div>
                  ))}
                </section>
              )}

              <div className="nav-row">
                <button type="button" className="btn secondary" onClick={() => go(-1)}>
                  ← Previous
                </button>
                <button type="button" className="btn secondary" onClick={() => go(1)}>
                  Next →
                </button>
              </div>
            </article>
          )}
        </main>
      </div>
    </>
  );
}

const RESPONSE_TARGET = "30–45 sec";

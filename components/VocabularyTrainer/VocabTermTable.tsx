"use client";

import type { IcaoVocabularyItem } from "@/data/icaoVocabulary";
import WordPhoneticHint from "@/components/WordPhoneticHint";
import type { VocabItemProgress } from "@/utils/spacedRepetition";
import { isDueForReview, isMastered } from "@/utils/spacedRepetition";

type Props = {
  terms: IcaoVocabularyItem[];
  getProgress: (id: string) => VocabItemProgress;
  activeId?: string;
  onSelect: (item: IcaoVocabularyItem) => void;
};

function statusLabel(progress: VocabItemProgress): { text: string; tone: "due" | "learning" | "mastered" | "new" } {
  if (isMastered(progress)) return { text: "Dominado", tone: "mastered" };
  if (isDueForReview(progress)) return { text: "Revisar", tone: "due" };
  if (progress.attempts > 0) return { text: "Aprendendo", tone: "learning" };
  return { text: "Novo", tone: "new" };
}

export default function VocabTermTable({ terms, getProgress, activeId, onSelect }: Props) {
  if (!terms.length) {
    return (
      <div className="vocab-studio-empty">
        <p>Nenhum termo neste filtro.</p>
        <p className="sub">Tente outra categoria ou filtro de status.</p>
      </div>
    );
  }

  return (
    <div className="vocab-studio-table-wrap">
      <table className="vocab-studio-table">
        <thead>
          <tr>
            <th>Termo</th>
            <th>Significado</th>
            <th>Mastery</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((item) => {
            const progress = getProgress(item.id);
            const status = statusLabel(progress);
            const active = item.id === activeId;
            return (
              <tr
                key={item.id}
                className={`vocab-studio-row ${active ? "active" : ""} tone-${status.tone}`}
                onClick={() => onSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSelect(item);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={active}
              >
                <td className="vocab-studio-cell-term">
                  <span className="vocab-studio-term-en">
                    {item.term}
                    <WordPhoneticHint word={item.term} className="vault-word-phonetic" />
                  </span>
                  <span className="vocab-studio-term-cat">{item.category}</span>
                </td>
                <td className="vocab-studio-cell-meaning">{item.meaning}</td>
                <td className="vocab-studio-cell-mastery">
                  <div className="vocab-studio-mastery-bar" aria-hidden>
                    <div
                      className="vocab-studio-mastery-fill"
                      style={{ width: `${(progress.masteryLevel / 5) * 100}%` }}
                    />
                  </div>
                  <span>{progress.masteryLevel}/5</span>
                </td>
                <td className="vocab-studio-cell-status">
                  <span className={`vocab-studio-status vocab-studio-status-${status.tone}`}>
                    {status.text}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

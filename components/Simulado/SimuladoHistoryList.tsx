"use client";

import { useMemo } from "react";
import { loadSimuladoHistoryPage } from "@/lib/simulado/progress";

type Props = {
  page: number;
  totalSimulations: number;
  onPageChange: (page: number) => void;
  onOpenReport: (id: string) => void;
};

export default function SimuladoHistoryList({
  page,
  totalSimulations,
  onPageChange,
  onOpenReport,
}: Props) {
  const data = useMemo(
    () => loadSimuladoHistoryPage(page),
    [page, totalSimulations],
  );

  if (data.total === 0) return null;

  const from = (data.page - 1) * data.pageSize + 1;
  const to = Math.min(data.page * data.pageSize, data.total);

  return (
    <section className="sim-history">
      <div className="sim-history-head">
        <h2>Histórico</h2>
        <span className="sim-history-count">{data.total} simulados salvos</span>
      </div>
      <p className="sim-history-hint">Toque em um simulado para ver o relatório completo.</p>
      <ul>
        {data.items.map((h) => (
          <li key={h.id}>
            <button type="button" className="sim-history-row" onClick={() => onOpenReport(h.id)}>
              <span>{new Date(h.date).toLocaleDateString("pt-BR")}</span>
              <span>{h.examVersion} · Nível {h.estimatedLevel}</span>
              <strong>{h.overallScore}/100</strong>
            </button>
          </li>
        ))}
      </ul>
      {data.totalPages > 1 && (
        <nav className="sim-history-pagination" aria-label="Paginação do histórico">
          <button
            type="button"
            className="btn secondary btn-sm"
            disabled={data.page <= 1}
            onClick={() => onPageChange(data.page - 1)}
          >
            ← Anterior
          </button>
          <span className="sim-history-page-info">
            {from}–{to} de {data.total} · página {data.page}/{data.totalPages}
          </span>
          <button
            type="button"
            className="btn secondary btn-sm"
            disabled={data.page >= data.totalPages}
            onClick={() => onPageChange(data.page + 1)}
          >
            Próxima →
          </button>
        </nav>
      )}
    </section>
  );
}

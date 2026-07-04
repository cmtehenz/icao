"use client";

import type { FullExamId } from "@/lib/fullExamListening/types";
import { useExamOfflinePack } from "@/hooks/useExamOfflinePack";

type Props = {
  examId: FullExamId;
};

export default function ExamOfflineControls({ examId }: Props) {
  const { status, downloading, progress, error, download, cancel, remove } =
    useExamOfflinePack(examId);

  const pct =
    progress && progress.total > 0
      ? Math.round((progress.done / progress.total) * 100)
      : 0;

  return (
    <div className="fel-offline">
      {status.ready ? (
        <div className="fel-offline-ready">
          <span className="fel-offline-badge" title="Voz Azure neural em cache">
            ✓ Pronto offline
          </span>
          <button type="button" className="btn secondary btn-sm" onClick={() => void remove()}>
            Apagar cache
          </button>
        </div>
      ) : downloading ? (
        <div className="fel-offline-progress">
          <div className="fel-offline-bar" aria-hidden>
            <div className="fel-offline-bar-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="fel-offline-label">
            Baixando {pct}% · {progress?.label ?? "…"}
          </p>
          <button type="button" className="btn secondary btn-sm" onClick={cancel}>
            Cancelar
          </button>
        </div>
      ) : (
        <button
          type="button"
          className="btn secondary btn-sm fel-offline-download"
          onClick={() => void download()}
        >
          ⬇ Baixar para offline
        </button>
      )}
      {error && <p className="fel-offline-error">{error}</p>}
      {!status.ready && !downloading && (
        <p className="fel-offline-hint">
          Gera as vozes Azure (Jenny/Guy) e guarda os áudios ATC neste aparelho — mesma qualidade,
          sem internet.
        </p>
      )}
    </div>
  );
}

"use client";

import type { ReactNode } from "react";

type Props = {
  onPrevious?: () => void;
  onNext?: () => void;
  previousLabel?: string;
  nextLabel?: string;
  children?: ReactNode;
};

/** Uma ação primária + navegação secundária compacta. */
export default function StudyCardToolbar({
  onPrevious,
  onNext,
  previousLabel = "← Anterior",
  nextLabel = "Próximo →",
  children,
}: Props) {
  return (
    <div className="study-card-toolbar">
      {children != null && children !== false && (
        <div className="study-card-toolbar-primary">{children}</div>
      )}
      {(onPrevious || onNext) && (
        <div className="study-card-toolbar-nav">
          {onPrevious && (
            <button type="button" className="btn-text" onClick={onPrevious}>
              {previousLabel}
            </button>
          )}
          {onNext && (
            <button type="button" className="btn-text" onClick={onNext}>
              {nextLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

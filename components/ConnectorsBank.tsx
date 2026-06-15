"use client";

import { CONNECTOR_GROUPS } from "@/lib/connectors";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ConnectorsBank({ open, onClose }: Props) {
  if (!open) return null;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal modal-wide" onClick={(e) => e.stopPropagation()}>
        <h2>🔗 Connector Bank</h2>
        <p className="modal-sub">
          Tap a phrase to copy it. Use these connectors to build natural ICAO 5 answers.
        </p>
        <div className="connector-grid">
          {CONNECTOR_GROUPS.map((group) => (
            <div key={group.title} className={`block ${group.color}-b`}>
              <h3>{group.title}</h3>
              <div className="chips">
                {group.items.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="chip chip-btn"
                    onClick={() => copy(item)}
                    title="Click to copy"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

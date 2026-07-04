"use client";

import { useState } from "react";
import { isSimuladoPartEnabled } from "@/lib/simulado/config";
import type { SimulationMode, SimuladoPart } from "@/lib/simulado/types";

const MODES: Array<{ mode: SimulationMode; label: string; desc: string }> = [
  { mode: "full", label: "Full Exam", desc: "Parts 1–4 · SDEA structure" },
  { mode: "part1", label: "Part 1 only", desc: "Aviation Topics" },
  { mode: "part2", label: "Part 2 only", desc: "Interacting as a Pilot" },
  { mode: "part3", label: "Part 3 only", desc: "Unexpected Situations" },
  { mode: "part4", label: "Part 4 only", desc: "Picture Description" },
];

type Props = {
  onSelect: (mode: SimulationMode, customParts?: SimuladoPart[]) => void;
};

function togglePart(part: SimuladoPart, selected: SimuladoPart[]): SimuladoPart[] {
  if (!isSimuladoPartEnabled(part)) return selected;
  return selected.includes(part) ? selected.filter((p) => p !== part) : [...selected, part].sort();
}

export default function SimuladoModeSelect({ onSelect }: Props) {
  const [customParts, setCustomParts] = useState<SimuladoPart[]>([]);

  return (
    <div className="sim-mode-select">
      <h2>Escolha o modo</h2>
      <div className="sim-mode-grid">
        {MODES.map((m) => (
          <button
            key={m.mode}
            type="button"
            className="sim-mode-card"
            onClick={() => onSelect(m.mode)}
          >
            <strong>{m.label}</strong>
            <span>{m.desc}</span>
          </button>
        ))}
      </div>

      <div className="sim-custom-block">
        <h3>Custom exam</h3>
        <p>Combine any parts — e.g. Part 1 + Part 2, Part 2 + Part 4:</p>
        <div className="sim-custom-parts">
          {([1, 2, 3, 4] as SimuladoPart[]).map((p) => (
            <button
              key={p}
              type="button"
              className={`sim-part-chip${customParts.includes(p) ? " active" : ""}`}
              onClick={() => setCustomParts((s) => togglePart(p, s))}
            >
              Part {p}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="btn green"
          disabled={!customParts.length}
          onClick={() => onSelect("custom", customParts)}
        >
          Iniciar custom exam
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { isSimuladoPartEnabled, SIMULADO_PARTS_COMING_SOON } from "@/lib/simulado/config";
import type { SimulationMode, SimuladoPart } from "@/lib/simulado/types";

const MODES: Array<{ mode: SimulationMode; label: string; desc: string; disabled?: boolean }> = [
  { mode: "full", label: "Full Exam", desc: "Parts 1–2 (Part 3 e 4 em breve)" },
  { mode: "part1", label: "Part 1 only", desc: "Aviation Topics" },
  { mode: "part2", label: "Part 2 only", desc: "Interacting as a Pilot" },
  { mode: "part3", label: "Part 3 only", desc: "Unexpected Situations", disabled: true },
  { mode: "part4", label: "Part 4 only", desc: "Picture Description", disabled: true },
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
            className={`sim-mode-card${m.disabled ? " sim-mode-card-disabled" : ""}`}
            disabled={m.disabled}
            onClick={() => !m.disabled && onSelect(m.mode)}
          >
            <strong>{m.label}</strong>
            <span>{m.desc}</span>
            {m.disabled && <span className="sim-coming-soon">Em breve</span>}
          </button>
        ))}
      </div>

      <div className="sim-custom-block">
        <h3>Custom exam</h3>
        <p>Selecione qualquer combinação de partes disponíveis:</p>
        <div className="sim-custom-parts">
          {([1, 2, 3, 4] as SimuladoPart[]).map((p) => {
            const disabled = SIMULADO_PARTS_COMING_SOON.includes(p);
            return (
              <button
                key={p}
                type="button"
                className={`sim-part-chip${customParts.includes(p) ? " active" : ""}${disabled ? " disabled" : ""}`}
                disabled={disabled}
                title={disabled ? "Parte em breve" : undefined}
                onClick={() => setCustomParts((s) => togglePart(p, s))}
              >
                Part {p}
                {disabled && " · em breve"}
              </button>
            );
          })}
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

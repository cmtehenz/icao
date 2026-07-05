import type { SimuladoPart } from "@/lib/simulado/types";

/** Parts available in the Simulado / Examiner flow. */
export const SIMULADO_ACTIVE_PARTS: readonly SimuladoPart[] = [1, 2, 3, 4];

export const SIMULADO_PARTS_COMING_SOON: readonly SimuladoPart[] = [];

export function isSimuladoPartEnabled(part: SimuladoPart): boolean {
  return SIMULADO_ACTIVE_PARTS.includes(part);
}

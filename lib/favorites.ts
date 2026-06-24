const FAVORITES_KEY = "icao_delta_favorites_v1";

export function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function saveFavorites(nums: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(nums));
}

export function toggleFavorite(nums: string[], num: string): string[] {
  const next = nums.includes(num) ? nums.filter((n) => n !== num) : [...nums, num];
  saveFavorites(next);
  return next;
}

export function isFavorite(nums: string[], num: string): boolean {
  return nums.includes(num);
}

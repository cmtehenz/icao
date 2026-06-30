/** Shared date-based rotation helpers for daily study queues. */

export function daysSinceEpoch(dateKey: string): number {
  const ms = new Date(`${dateKey}T12:00:00`).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

/** Pick `count` consecutive items from a ring, offset by day. */
export function pickDailySlice<T>(items: T[], count: number, dateKey: string, salt = 0): T[] {
  if (!items.length || count <= 0) return [];
  const n = items.length;
  const start = (daysSinceEpoch(dateKey) + salt) % n;
  const result: T[] = [];
  for (let i = 0; i < Math.min(count, n); i += 1) {
    result.push(items[(start + i) % n]!);
  }
  return result;
}

/** Fixed chunks (e.g. 4 cards per day from 12 in 3-day cycles). */
export function pickDailyChunks<T>(items: T[], chunkSize: number, dateKey: string): T[] {
  if (!items.length || chunkSize <= 0) return [];
  const chunks = Math.max(1, Math.ceil(items.length / chunkSize));
  const chunkIndex = daysSinceEpoch(dateKey) % chunks;
  const start = chunkIndex * chunkSize;
  return items.slice(start, start + chunkSize);
}

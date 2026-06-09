/**
 * Upcoming posting slots: 08:00 and 18:00 Asia/Bangkok (UTC+7), as ISO strings.
 * 08:00 Bangkok = 01:00 UTC, 18:00 Bangkok = 11:00 UTC (Thailand has no DST).
 * Slots within ~10 minutes of `nowIso` are skipped (Facebook requires >=10 min lead).
 * Pure — the caller supplies `nowIso`.
 */
export function nextSlots(nowIso: string, count: number): string[] {
  const now = Date.parse(nowIso);
  const out: string[] = [];
  const d = new Date(now);
  let day = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  while (out.length < count) {
    for (const hUtc of [1, 11]) {
      if (out.length >= count) break;
      const t = day + hUtc * 3600_000;
      if (t > now + 600_000) out.push(new Date(t).toISOString());
    }
    day += 86_400_000;
  }
  return out;
}

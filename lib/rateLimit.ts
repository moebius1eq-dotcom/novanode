const bucket = new Map<string, number[]>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const existing = bucket.get(key) ?? [];
  const recent = existing.filter((ts) => now - ts <= windowMs);

  if (recent.length >= limit) {
    bucket.set(key, recent);
    return true;
  }

  recent.push(now);
  bucket.set(key, recent);
  return false;
}

export function clientKey(ip: string | null | undefined, action: string): string {
  return `${action}:${ip ?? "unknown"}`;
}

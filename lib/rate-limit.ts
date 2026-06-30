// Lightweight in-memory fixed-window rate limiter.
//
// NOTE: state lives in the process, so it does not coordinate across multiple
// serverless instances. It's a pragmatic first line of defense against casual
// spam/abuse, not a distributed guarantee. Swap for Upstash/Redis if you need
// limits enforced across instances.

interface Window {
  count: number
  resetAt: number
}

const buckets = new Map<string, Window>()

export interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || now >= existing.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (existing.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
    }
  }

  existing.count += 1
  return { allowed: true, retryAfterSeconds: 0 }
}

// Opportunistic cleanup so the map doesn't grow unbounded.
export function pruneRateLimitBuckets() {
  const now = Date.now()
  for (const [key, window] of buckets) {
    if (now >= window.resetAt) buckets.delete(key)
  }
}

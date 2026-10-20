/**
 * In-memory sliding-window rate limiter for server actions and API route handlers.
 * Preserves rate-limit counters across module hot-reloads using globalThis.
 * Automatically cleans up stale entries to prevent memory leaks.
 */

interface RateLimitConfig {
  /** Maximum number of allowed requests in the sliding window */
  limit: number;
  /** Duration of the sliding window in milliseconds (default: 60,000 ms = 1 minute) */
  windowMs: number;
}

export interface RateLimitResult {
  /** Whether the request is permitted */
  success: boolean;
  /** Configured maximum limit */
  limit: number;
  /** Remaining permitted requests in the current window */
  remaining: number;
  /** Time remaining in milliseconds until the earliest recorded request expires */
  resetMs: number;
}

interface WindowRecord {
  timestamps: number[];
  lastUpdated: number;
}

declare const globalThis: {
  __ernsRateLimitStore?: Map<string, WindowRecord>;
  __ernsRateLimitLastCleanup?: number;
} & typeof global;

if (!globalThis.__ernsRateLimitStore) {
  globalThis.__ernsRateLimitStore = new Map<string, WindowRecord>();
}

/**
 * Periodically purge keys that haven't been touched in over 10 minutes
 */
function cleanupStaleEntries(now: number) {
  const store = globalThis.__ernsRateLimitStore;
  if (!store) return;

  const lastCleanup = globalThis.__ernsRateLimitLastCleanup || 0;
  // Run cleanup at most once every 5 minutes
  if (now - lastCleanup < 5 * 60 * 1000) return;

  globalThis.__ernsRateLimitLastCleanup = now;
  const staleThreshold = 10 * 60 * 1000; // 10 minutes

  for (const [key, record] of store.entries()) {
    if (now - record.lastUpdated > staleThreshold) {
      store.delete(key);
    }
  }
}

/**
 * Checks and records a request against a sliding-window rate limit.
 *
 * @param key Unique key to identify the actor (e.g. `user_123:listing-create` or `ip_1.2.3.4:upload`)
 * @param config Limit and window duration
 * @returns RateLimitResult with pass/fail and remaining budget
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig = { limit: 5, windowMs: 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const store = globalThis.__ernsRateLimitStore!;
  const windowMs = config.windowMs;
  const limit = config.limit;

  cleanupStaleEntries(now);

  let record = store.get(key);

  if (!record) {
    record = { timestamps: [], lastUpdated: now };
    store.set(key, record);
  }

  // Filter timestamps to only keep those within the sliding window
  const windowStart = now - windowMs;
  record.timestamps = record.timestamps.filter((ts) => ts > windowStart);
  record.lastUpdated = now;

  const currentCount = record.timestamps.length;

  if (currentCount >= limit) {
    const oldestTimestamp = record.timestamps[0] || now;
    const resetMs = Math.max(0, oldestTimestamp + windowMs - now);

    return {
      success: false,
      limit,
      remaining: 0,
      resetMs,
    };
  }

  // Record this request
  record.timestamps.push(now);
  const remaining = Math.max(0, limit - record.timestamps.length);
  const oldestTimestamp = record.timestamps[0] || now;
  const resetMs = Math.max(0, oldestTimestamp + windowMs - now);

  return {
    success: true,
    limit,
    remaining,
    resetMs,
  };
}

/**
 * Resets/clears the rate limit counter for a specific key (e.g. after successful login).
 */
export function resetRateLimit(key: string): void {
  globalThis.__ernsRateLimitStore?.delete(key);
}


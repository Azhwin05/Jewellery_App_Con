/**
 * Format a rate change percentage for display.
 * e.g. 0.8 → "+0.8%", -0.3 → "-0.3%"
 */
export function formatRateChange(percent: number): string {
  const sign = percent >= 0 ? '+' : '';
  return `${sign}${percent.toFixed(1)}%`;
}

/**
 * Determine if rate change is up or down.
 */
export function isRateUp(changePercent: number): boolean {
  return changePercent >= 0;
}

/**
 * Format a time-ago string for rate updates.
 */
export function formatLastUpdated(isoString: string): string {
  const now = Date.now();
  const updated = new Date(isoString).getTime();
  const diffSec = Math.floor((now - updated) / 1000);

  if (diffSec < 10) return 'Updated just now';
  if (diffSec < 60) return `Updated ${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `Updated ${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  return `Updated ${diffHr}h ago`;
}

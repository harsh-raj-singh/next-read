/**
 * Format a Unix timestamp as a relative time string (e.g., "2 hours ago")
 */
export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor(Date.now() / 1000) - timestamp

  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ] as const

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds)
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`
    }
  }

  return 'just now'
}

/**
 * Extract domain from URL, fallback to Hacker News domain
 */
export function extractDomain(url: string | null | undefined): string {
  if (!url) return 'news.ycombinator.com'
  try {
    return new URL(url).hostname.replace('www.', '')
  } catch {
    return 'news.ycombinator.com'
  }
}

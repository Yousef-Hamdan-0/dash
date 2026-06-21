export function normalizeExternalUrl(value: string | null | undefined): string | null {
  const raw = value?.trim()
  if (!raw) return null

  try {
    const url = new URL(raw)
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null
  } catch {
    return null
  }
}

export function normalizeLinkHref(value: string | null | undefined): string | null {
  const raw = value?.trim()
  if (!raw) return null
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw
  return normalizeExternalUrl(raw)
}

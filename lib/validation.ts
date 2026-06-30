// Shared, dependency-free validators. Safe to import anywhere (incl. middleware).

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value)
}

/**
 * Allowlist of admin emails, read from the ADMIN_EMAILS env var
 * (comma-separated). When unset/empty, the allowlist is disabled and any
 * authenticated Supabase user is treated as an admin (previous behavior).
 */
export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)

  if (allowed.length === 0) return true
  return !!email && allowed.includes(email.toLowerCase())
}

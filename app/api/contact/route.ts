import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'
import { getSiteSettings } from '@/lib/supabase/queries'
import { createPublicClient } from '@/lib/supabase/public'
import { isSupabaseConfigured } from '@/lib/supabase/config'
import { isValidEmail } from '@/lib/validation'
import { rateLimit, pruneRateLimitBuckets } from '@/lib/rate-limit'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Max submissions per IP per window
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 60_000

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  return req.headers.get('x-real-ip')?.trim() || 'unknown'
}

function textField(value: unknown, maxLength: number) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : ''
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(req: NextRequest) {
  pruneRateLimitBuckets()
  const { allowed, retryAfterSeconds } = rateLimit(
    `contact:${getClientIp(req)}`,
    RATE_LIMIT,
    RATE_WINDOW_MS
  )
  if (!allowed) {
    return NextResponse.json(
      { error: 'Too many requests. Please try again shortly.' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
    )
  }

  let body: Record<string, unknown>

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const name = textField(body.name, 120)
  const email = textField(body.email, 254).toLowerCase()
  const phone = textField(body.phone, 40)
  const project = textField(body.project, 160)
  const message = textField(body.message, 3000)
  const source = body.source === 'services' ? 'services' : 'website'

  if (!name || !email || !phone || !project || !message) {
    return NextResponse.json({ error: 'Name, email, phone, project, and message are required' }, { status: 400 })
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const supabase = createPublicClient()
  const { error: databaseError } = await supabase.from('clients').insert({
    name,
    email,
    phone: phone || null,
    service: project,
    message,
    source,
  })

  if (databaseError) {
    console.error('contact insert:', databaseError.message)
    return NextResponse.json({ error: 'Could not save request' }, { status: 500 })
  }

  const safe = {
    name: escapeHtml(name),
    email: escapeHtml(email),
    phone: escapeHtml(phone || 'Not provided'),
    project: escapeHtml(project),
    message: escapeHtml(message),
  }
  const settings = await getSiteSettings()
  const toEmail = settings?.contact_email || process.env.CONTACT_EMAIL
  const fromEmail = settings?.from_email || 'onboarding@resend.dev'

  if (toEmail && resend) {
    try {
      await resend.emails.send({
        from: `DASH Studio <${fromEmail}>`,
        to: toEmail,
        subject: `New ${safe.project} request from ${safe.name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${safe.name}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <p><strong>Phone:</strong> ${safe.phone}</p>
          <p><strong>Project:</strong> ${safe.project}</p>
          <p><strong>Message:</strong> ${safe.message}</p>
        `,
      })
    } catch (error) {
      console.error('contact email:', error)
    }
  }

  return NextResponse.json({ success: true })
}

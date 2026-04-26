import { Resend } from 'resend'
import { NextRequest, NextResponse } from 'next/server'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { name, email, project, message } = await req.json()

  if (!name || !email || !project || !message) {
    return NextResponse.json({ error: 'All fields required' }, { status: 400 })
  }

  await resend.emails.send({
    from:    'DASH Studio <onboarding@resend.dev>',
    to:      process.env.CONTACT_EMAIL!,
    subject: `New message from ${name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Project:</strong> ${project}</p>
      <p><strong>Message:</strong> ${message}</p>
    `,
  })

  return NextResponse.json({ success: true })
}
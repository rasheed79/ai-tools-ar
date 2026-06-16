import { NextRequest, NextResponse } from 'next/server'

const RESEND_API = 'https://api.resend.com'
const RESEND_AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID ?? ''

export async function POST(req: NextRequest) {
  let email: string | undefined
  try {
    const body = await req.json()
    email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : undefined
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'invalid_email' }, { status: 422 })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey || apiKey === 're_your_key_here') {
    console.error('RESEND_API_KEY not configured')
    return NextResponse.json({ error: 'service_unavailable' }, { status: 503 })
  }

  if (RESEND_AUDIENCE_ID) {
    const res = await fetch(`${RESEND_API}/v1/audiences/${RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`Resend contacts error ${res.status}: ${err}`)
      return NextResponse.json({ error: 'subscription_failed' }, { status: 502 })
    }
  } else {
    const res = await fetch(`${RESEND_API}/v1/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'دليل أدوات AI <newsletter@daleel-adawat.com>',
        to: [email],
        subject: 'مرحباً بك في نشرة أدوات AI بالعربية',
        html: '<div dir="rtl"><h2>أهلاً وسهلاً!</h2><p>ستصلك آخر أخبار أدوات الذكاء الاصطناعي بالعربية مباشرة إلى بريدك.</p></div>',
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error(`Resend email error ${res.status}: ${err}`)
      return NextResponse.json({ error: 'subscription_failed' }, { status: 502 })
    }
  }

  return NextResponse.json({ ok: true })
}

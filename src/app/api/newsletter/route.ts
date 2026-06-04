import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const email = formData.get('email')?.toString().trim()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'بريد إلكتروني غير صالح' }, { status: 400 })
  }

  const RESEND_KEY = process.env.RESEND_API_KEY
  if (!RESEND_KEY) {
    console.error('RESEND_API_KEY not set')
    return NextResponse.redirect(new URL('/?subscribed=error', req.url))
  }

  const res = await fetch('https://api.resend.com/contacts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      audience_id: process.env.RESEND_AUDIENCE_ID ?? '',
      unsubscribed: false,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Resend error', res.status, body)
    return NextResponse.redirect(new URL('/?subscribed=error', req.url))
  }

  return NextResponse.redirect(new URL('/?subscribed=1', req.url))
}

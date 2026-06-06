'use client'

import { useState } from 'react'

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function NewsletterForm() {
  const [status, setStatus] = useState<Status>('idle')
  const [email, setEmail] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="font-cairo text-success font-semibold py-3">
        ✓ تم الاشتراك! ستصلك آخر الأخبار قريباً.
      </p>
    )
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="flex gap-3 max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="بريدك الإلكتروني"
          required
          disabled={status === 'loading'}
          className="flex-1 bg-surface border border-border rounded-sm px-4 py-2.5 text-text font-cairo text-sm placeholder:text-muted focus:outline-none focus:border-accent transition-colors duration-150 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-accent text-bg font-cairo font-bold text-sm px-6 py-2.5 rounded-sm hover:brightness-110 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? '...' : 'اشترك'}
        </button>
      </form>
      {status === 'error' && (
        <p className="font-cairo text-error text-sm mt-2">حدث خطأ، حاول مجدداً.</p>
      )}
    </div>
  )
}

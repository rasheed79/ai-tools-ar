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
        console.error('Subscribe failed:', res.status, await res.text())
        setStatus('error')
      }
    } catch (err) {
      console.error('Subscribe fetch error:', err)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-green-600 font-medium py-3">
        ✓ تم الاشتراك! ستصلك آخر الأخبار قريباً.
      </p>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="بريدك الإلكتروني"
        required
        disabled={status === 'loading'}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-right disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? '...' : 'اشترك'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-sm mt-2 w-full text-center">
          حدث خطأ، حاول مجدداً.
        </p>
      )}
    </form>
  )
}

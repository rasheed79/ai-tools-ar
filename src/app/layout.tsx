import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'أدوات الذكاء الاصطناعي بالعربية', template: '%s | أدوات AI' },
  description: 'دليل أدوات الذكاء الاصطناعي بالعربية — أسعار بعملتك المحلية، مقارنات، بدائل مجانية',
  alternates: {
    languages: {
      'ar': process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-tools-ar.pages.dev',
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,300&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Cairo:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9928258270334822"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-bg text-text font-cairo antialiased">
        <header style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '0 32px',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <a href="/" style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700, fontSize: 18,
            color: 'var(--text)', textDecoration: 'none', cursor: 'pointer',
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'inline-block' }} />
            أدوات AI
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <nav style={{ display: 'flex', gap: 24 }}>
              <a href="/tools" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.15s' }}>جميع الأدوات</a>
              <a href="/compare" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.15s' }}>مقارنة</a>
              <a href="/best/%D9%83%D8%AA%D8%A7%D8%A8%D8%A9" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none', cursor: 'pointer', transition: 'color 0.15s' }}>أفضل الأدوات</a>
            </nav>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              width: 200,
              cursor: 'text',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, color: 'var(--text-muted)' }}>ابحث عن أداة...</span>
            </div>
          </div>
        </header>

        <main className="max-w-content mx-auto px-6 py-0">
          {children}
        </main>

        <footer className="border-t border-border mt-16 py-8 px-6 text-center text-sm text-muted font-cairo">
          <p>© 2026 دليل أدوات AI — دليل أدوات الذكاء الاصطناعي بالعربية</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 24, justifyContent: 'center' }}>
            <a href="/about" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'Cairo', sans-serif", fontSize: 13 }}>عن الموقع</a>
            <a href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'Cairo', sans-serif", fontSize: 13 }}>سياسة الخصوصية</a>
            <a href="/tools" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontFamily: "'Cairo', sans-serif", fontSize: 13 }}>جميع الأدوات</a>
          </div>
        </footer>
      </body>
    </html>
  )
}

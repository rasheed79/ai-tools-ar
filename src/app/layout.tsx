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
          {/* nav — right side in RTL */}
          <nav style={{ display: 'flex', gap: 28, listStyle: 'none' }}>
            <a href="/best/%D9%83%D8%AA%D8%A7%D8%A8%D8%A9" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}>أفضل الأدوات</a>
            <a href="/tools" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--text-muted)', textDecoration: 'none' }}>مقارنة</a>
            <a href="/tools" style={{ fontFamily: "'Cairo', sans-serif", fontSize: 14, color: 'var(--accent)', textDecoration: 'none' }}>جميع الأدوات</a>
          </nav>

          {/* logo + search — left side in RTL */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* search box */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
              padding: '6px 14px',
              width: 220,
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 14 }}>⌕</span>
              <span style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, color: 'var(--text-muted)' }}>ابحث عن أداة...</span>
            </div>
            {/* logo */}
            <a href="/" style={{
              display: 'flex', alignItems: 'center', gap: 8,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 700, fontSize: 18,
              color: 'var(--text)', textDecoration: 'none',
            }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: 'var(--accent)', display: 'inline-block' }} />
              أدوات AI
            </a>
          </div>
        </header>

        <main className="max-w-content mx-auto px-6 py-0">
          {children}
        </main>

        <footer className="border-t border-border mt-16 py-8 px-6 text-center text-sm text-muted font-cairo">
          <p>© 2026 أدوات AI — دليل أدوات الذكاء الاصطناعي بالعربية</p>
        </footer>
      </body>
    </html>
  )
}

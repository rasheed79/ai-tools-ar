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
        <header className="bg-surface border-b border-border h-[60px] px-8 flex items-center justify-between">
          <nav className="flex gap-7 font-cairo text-sm">
            <a href="/tools" className="text-muted hover:text-text transition-colors duration-150">جميع الأدوات</a>
            <a href="/tools" className="text-muted hover:text-text transition-colors duration-150">مقارنة</a>
            <a href="/best/%D9%83%D8%AA%D8%A7%D8%A8%D8%A9" className="text-muted hover:text-text transition-colors duration-150">أفضل الأدوات</a>
          </nav>
          <a href="/" className="flex items-center gap-2 font-jakarta font-bold text-lg text-text no-underline">
            <span className="w-2 h-2 rounded-full bg-accent" />
            أدوات AI
          </a>
        </header>

        <main className="max-w-content mx-auto px-6 pt-0 pb-8">
          {children}
        </main>

        <footer className="border-t border-border mt-16 py-8 px-6 text-center text-sm text-muted font-cairo">
          <p>© 2026 أدوات AI — دليل أدوات الذكاء الاصطناعي بالعربية</p>
        </footer>
      </body>
    </html>
  )
}

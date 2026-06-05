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
      <body className="bg-white text-gray-900 font-sans antialiased">
        <header className="border-b border-gray-200 py-4 px-6 flex items-center justify-between">
          <a href="/" className="text-xl font-bold text-blue-600">أدوات AI</a>
          <nav className="flex gap-6 text-sm">
            <a href="/tools" className="hover:text-blue-600">جميع الأدوات</a>
            <a href="/tools" className="hover:text-blue-600">مقارنة</a>
            <a href="/best/writing" className="hover:text-blue-600">أفضل الأدوات</a>
          </nav>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">{children}</main>
        <footer className="border-t border-gray-200 py-8 px-6 text-center text-sm text-gray-500 mt-16">
          <p>© 2026 أدوات AI — دليل أدوات الذكاء الاصطناعي بالعربية</p>
        </footer>
      </body>
    </html>
  )
}

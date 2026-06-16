import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'عن الموقع',
  description: 'دليل أدوات الذكاء الاصطناعي بالعربية — من نحن وما هدفنا',
}

export default function AboutPage() {
  return (
    <div style={{ padding: '40px 0', maxWidth: 680 }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 11,
        color: 'var(--accent)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--accent)' }} />
        من نحن
      </div>

      <h1 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 36,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 24,
        lineHeight: 1.2,
      }}>
        دليل <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>أدوات الذكاء الاصطناعي</em> بالعربية
      </h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {[
          {
            q: 'ما هذا الموقع؟',
            a: 'دليل عربي متخصص لأدوات الذكاء الاصطناعي. نراجع كل أداة ونعرض أسعارها بالعملة المحلية (ريال، جنيه، درهم) مع مقارنات تفصيلية وبدائل مجانية.',
          },
          {
            q: 'لماذا بالعربية تحديداً؟',
            a: 'أغلب مصادر أدوات AI باللغة الإنجليزية. المستخدم العربي يحتاج مرجعاً يفهم سياقه — يعرف أن السعودي يحسب بالريال والمصري بالجنيه، ويقدّر الأدوات المجانية أولاً.',
          },
          {
            q: 'كيف نختار الأدوات؟',
            a: 'نركّز على الأدوات الشهيرة والمفيدة فعلاً. نتحقق من الأسعار الحقيقية، نجرّب الأدوات، ونكتب وصفاً أمينًا يشمل المميزات والعيوب.',
          },
          {
            q: 'هل الموقع مربوط بشركات الأدوات؟',
            a: 'بعض الروابط روابط شركاء (affiliate). إذا اشتريت من خلالها نحصل على عمولة صغيرة دون تكلفة إضافية عليك. هذا يساعدنا في استمرار الموقع. نُشير دائماً لروابط الشركاء بوضوح.',
          },
          {
            q: 'كيف أتواصل معك؟',
            a: 'عبر البريد الإلكتروني: contact@daleel-adawat.com — نرحّب بالاقتراحات والأدوات التي تريد مراجعتها.',
          },
        ].map(({ q, a }) => (
          <div
            key={q}
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
            }}
          >
            <h2 style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 16,
              fontWeight: 700,
              color: 'var(--text)',
              marginBottom: 10,
            }}>
              {q}
            </h2>
            <p style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 14,
              color: 'var(--text-muted)',
              lineHeight: 1.75,
              margin: 0,
            }}>
              {a}
            </p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
        <Link href="/tools" style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 14,
          fontWeight: 700,
          color: 'var(--accent)',
          textDecoration: 'none',
        }}>
          تصفح الأدوات ←
        </Link>
        <span style={{ color: 'var(--border)', margin: '0 16px' }}>|</span>
        <Link href="/privacy" style={{
          fontFamily: "'Cairo', sans-serif",
          fontSize: 14,
          color: 'var(--text-muted)',
          textDecoration: 'none',
        }}>
          سياسة الخصوصية
        </Link>
      </div>
    </div>
  )
}

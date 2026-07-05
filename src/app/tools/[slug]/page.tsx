import { supabase } from '@/lib/supabase'
import { buildJsonLd } from '@/lib/seo'
import { convertCurrency, FALLBACK_RATES } from '@/lib/currency'
import type { Tool } from '@/lib/database.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 86400

type Props = { params: Promise<{ slug: string }> }

async function getTool(slug: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()
  if (error || !data) return null
  return data as Tool
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) return { title: 'أداة غير موجودة' }
  return {
    title: `${tool.name_ar} — مراجعة وأسعار`,
    description: tool.description_ar,
  }
}

const CURRENCY_LABELS: Record<string, string> = {
  SAR: 'ريال سعودي',
  EGP: 'جنيه مصري',
  AED: 'درهم إماراتي',
  MAD: 'درهم مغربي',
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params
  const tool = await getTool(slug)
  if (!tool) notFound()

  const jsonLd = buildJsonLd(tool)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd)
            .replace(/</g, '\\u003c')
            .replace(/>/g, '\\u003e')
            .replace(/&/g, '\\u0026'),
        }}
      />
      <article>
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <h1
              className="font-cairo font-bold text-text mb-1"
              style={{ fontSize: '36px', lineHeight: 1.2 }}
            >
              {tool.name_ar}
            </h1>
            <p
              className="font-jakarta text-muted"
              style={{ fontSize: '14px' }}
            >
              {tool.name}
            </p>
          </div>
          <span
            className="font-jakarta font-medium flex-shrink-0 mt-1"
            style={{
              fontSize: '12px',
              padding: '4px 14px',
              borderRadius: 'var(--radius-sm)',
              ...(tool.is_free_tier
                ? {
                    backgroundColor: 'rgba(76,175,125,0.12)',
                    color: 'var(--success)',
                    border: '1px solid rgba(76,175,125,0.3)',
                  }
                : {
                    backgroundColor: 'rgba(232,160,64,0.12)',
                    color: 'var(--accent)',
                    border: '1px solid rgba(232,160,64,0.3)',
                  }),
            }}
          >
            {tool.pricing}
          </span>
        </div>

        <p
          className="font-cairo text-muted mb-10"
          style={{ fontSize: '16px', lineHeight: 1.7 }}
        >
          {tool.description_ar}
        </p>

        {/* Long-form review */}
        {tool.review_ar && (
          <section className="mb-10">
            <h2 className="font-cairo font-semibold text-text text-xl mb-4">مراجعة {tool.name_ar}</h2>
            <p
              className="font-cairo text-muted"
              style={{ fontSize: '15px', lineHeight: 1.9 }}
            >
              {tool.review_ar}
            </p>
          </section>
        )}

        {/* Pricing section */}
        {tool.price_from && (
          <section
            className="rounded-md p-6 mb-8"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            <h2 className="font-cairo font-semibold text-text text-xl mb-5">
              الأسعار بعملتك المحلية
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(CURRENCY_LABELS).map(([currency, label]) => {
                const rate = FALLBACK_RATES[currency] ?? 1
                const price = convertCurrency(tool.price_from!, rate)
                return (
                  <div
                    key={currency}
                    className="text-center p-4 rounded-md"
                    style={{
                      backgroundColor: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <p
                      className="font-mono font-medium text-accent mb-1"
                      style={{ fontSize: '22px', fontVariantNumeric: 'tabular-nums' }}
                    >
                      {price}
                    </p>
                    <p className="font-cairo text-muted text-sm">{label}/شهر</p>
                  </div>
                )
              })}
            </div>
            <p
              className="font-cairo text-muted mt-4"
              style={{ fontSize: '12px' }}
            >
              * الأسعار تقريبية، من ${tool.price_from} USD/شهر
            </p>
          </section>
        )}

        {/* Features */}
        {tool.features?.ar?.length > 0 && (
          <section className="mb-8">
            <h2 className="font-cairo font-semibold text-text text-xl mb-4">أبرز المميزات</h2>
            <ul className="space-y-2">
              {tool.features.ar.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-3 font-cairo text-muted" style={{ fontSize: '14px' }}>
                  <span className="text-success mt-0.5 flex-shrink-0">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Use cases */}
        {tool.use_cases?.length > 0 && (
          <section className="mb-10">
            <h2 className="font-cairo font-semibold text-text text-xl mb-4">مناسبة لـ</h2>
            <div className="flex flex-wrap gap-2">
              {tool.use_cases.map((uc: string) => (
                <a
                  key={uc}
                  href={`/best/${uc}`}
                  className="font-cairo text-muted no-underline hover:text-text transition-colors duration-150"
                  style={{
                    fontSize: '13px',
                    padding: '5px 14px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {uc}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-3">
          <a
            href={tool.affiliate_url ?? tool.official_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-cairo font-bold text-sm no-underline hover:brightness-110 transition-all duration-150"
            style={{
              backgroundColor: 'var(--accent)',
              color: '#0F1117',
              padding: '12px 28px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            جرّب الأداة ←
          </a>
          <a
            href={`/tools?compare=${tool.slug}`}
            className="font-cairo font-bold text-sm no-underline text-text hover:border-accent hover:text-accent transition-colors duration-150"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '12px 28px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            قارن مع أداة أخرى
          </a>
          <a
            href={`/alt/${tool.slug}`}
            className="font-cairo font-bold text-sm no-underline text-muted hover:text-text transition-colors duration-150"
            style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              padding: '12px 28px',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            بدائل مجانية
          </a>
        </div>
      </article>
    </>
  )
}

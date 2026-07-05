import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { convertCurrency, FALLBACK_RATES } from '@/lib/currency'
import { buildCompareVerdict } from '@/lib/verdict'

export const revalidate = 3600

type Props = { params: Promise<{ pair: string }> }

async function getTwoTools(slugA: string, slugB: string): Promise<[Tool, Tool] | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .in('slug', [slugA, slugB])
  if (error || !data || data.length < 2) return null
  const a = (data as Tool[]).find((t) => t.slug === slugA)
  const b = (data as Tool[]).find((t) => t.slug === slugB)
  if (!a || !b) return null
  return [a, b]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params
  const [slugA, slugB] = pair.split('-vs-')
  const tools = await getTwoTools(slugA, slugB)
  const nameA = tools?.[0]?.name_ar ?? slugA
  const nameB = tools?.[1]?.name_ar ?? slugB
  return {
    title: `${nameA} مقابل ${nameB} — مقارنة`,
    description: `مقارنة تفصيلية بين ${nameA} و${nameB} — الأسعار، المميزات، والأفضل لاستخدامك`,
  }
}

const USE_CASES = ['كتابة', 'تسويق', 'تعليم', 'برمجة', 'تصميم', 'فيديو', 'صوت', 'بحث', 'عمل', 'إبداع']

const CATEGORY_AR: Record<string, string> = {
  writing: 'كتابة',
  image: 'صور',
  code: 'برمجة',
  video: 'فيديو',
  audio: 'صوت',
}

export default async function ComparePage({ params }: Props) {
  const { pair } = await params
  const parts = pair.split('-vs-')
  if (parts.length !== 2) notFound()
  const [slugA, slugB] = parts

  const tools = await getTwoTools(slugA, slugB)
  if (!tools) notFound()
  const [toolA, toolB] = tools

  const sarRate = FALLBACK_RATES['SAR']
  const verdict = buildCompareVerdict(toolA, toolB)

  const rows: { label: string; a: React.ReactNode; b: React.ReactNode }[] = [
    {
      label: 'السعر',
      a: toolA.is_free_tier ? (
        <span className="text-success font-semibold font-cairo">مجاني</span>
      ) : toolA.price_from ? (
        <div className="font-cairo">
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '15px', color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
            ${toolA.price_from}/شهر
          </span>
          <br />
          <span className="text-muted text-xs">({convertCurrency(toolA.price_from, sarRate)} ريال)</span>
        </div>
      ) : <span className="text-muted">—</span>,
      b: toolB.is_free_tier ? (
        <span className="text-success font-semibold font-cairo">مجاني</span>
      ) : toolB.price_from ? (
        <div className="font-cairo">
          <span style={{ fontFamily: "'Geist Mono', monospace", fontSize: '15px', color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
            ${toolB.price_from}/شهر
          </span>
          <br />
          <span className="text-muted text-xs">({convertCurrency(toolB.price_from, sarRate)} ريال)</span>
        </div>
      ) : <span className="text-muted">—</span>,
    },
    {
      label: 'الفئة',
      a: <span className="font-cairo text-muted text-sm">{CATEGORY_AR[toolA.category] ?? toolA.category}</span>,
      b: <span className="font-cairo text-muted text-sm">{CATEGORY_AR[toolB.category] ?? toolB.category}</span>,
    },
    {
      label: 'طبقة مجانية',
      a: toolA.is_free_tier
        ? <span className="text-success text-lg">✓</span>
        : <span className="text-error text-lg opacity-60">✕</span>,
      b: toolB.is_free_tier
        ? <span className="text-success text-lg">✓</span>
        : <span className="text-error text-lg opacity-60">✕</span>,
    },
    {
      label: 'أبرز المميزات',
      a: (
        <ul className="space-y-1.5">
          {toolA.features?.ar?.slice(0, 3).map((f: string, i: number) => (
            <li key={i} className="font-cairo text-muted text-sm flex items-start gap-2">
              <span className="text-success flex-shrink-0 mt-0.5">•</span>{f}
            </li>
          ))}
        </ul>
      ),
      b: (
        <ul className="space-y-1.5">
          {toolB.features?.ar?.slice(0, 3).map((f: string, i: number) => (
            <li key={i} className="font-cairo text-muted text-sm flex items-start gap-2">
              <span className="text-success flex-shrink-0 mt-0.5">•</span>{f}
            </li>
          ))}
        </ul>
      ),
    },
  ]

  return (
    <div>
      {/* Header */}
      <div
        className="mb-8"
        style={{ fontFamily: "'Geist Mono', monospace", fontSize: '11px', color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}
      >
        مقارنة مفصّلة
      </div>
      <h1
        className="font-cairo font-bold text-text mb-2"
        style={{ fontSize: '32px' }}
      >
        {toolA.name_ar}
        <span className="text-muted font-light mx-3" style={{ fontSize: '24px' }}>vs</span>
        {toolB.name_ar}
      </h1>
      <p className="font-cairo text-muted mb-8" style={{ fontSize: '15px', lineHeight: 1.8 }}>
        {verdict}
      </p>

      {/* Use case pills */}
      <section className="mb-8">
        <p className="font-cairo text-muted text-sm mb-3">تصفح حسب الاستخدام:</p>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc) => (
            <a
              key={uc}
              href={`/best/${encodeURIComponent(uc)}`}
              className="font-cairo text-muted text-sm no-underline hover:text-text transition-colors duration-150"
              style={{
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

      {/* Compare table */}
      <div
        className="overflow-x-auto rounded-md mb-8"
        style={{ border: '1px solid var(--border)' }}
      >
        <table className="w-full border-collapse">
          <thead>
            <tr style={{ backgroundColor: 'var(--surface-2)', borderBottom: '1px solid var(--border)' }}>
              <th
                className="font-cairo text-muted font-medium text-sm text-right p-4"
                style={{ width: '33%' }}
              >
                المعيار
              </th>
              <th className="font-cairo text-text font-semibold text-center p-4">
                {toolA.name_ar}
              </th>
              <th className="font-cairo text-text font-semibold text-center p-4">
                {toolB.name_ar}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.label}
                style={{
                  backgroundColor: i % 2 === 0 ? 'var(--surface)' : 'transparent',
                  borderBottom: i < rows.length - 1 ? '1px solid var(--border)' : undefined,
                }}
              >
                <td className="font-cairo text-text font-medium text-sm p-4">{row.label}</td>
                <td className="p-4 text-center">{row.a}</td>
                <td className="p-4 text-center">{row.b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-wrap gap-3">
        <a
          href={toolA.affiliate_url ?? toolA.official_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 font-cairo font-bold text-sm no-underline text-center hover:brightness-110 transition-all duration-150"
          style={{
            backgroundColor: 'var(--accent)',
            color: '#0F1117',
            padding: '13px 24px',
            borderRadius: 'var(--radius-sm)',
            minWidth: 160,
          }}
        >
          جرّب {toolA.name_ar}
        </a>
        <a
          href={toolB.affiliate_url ?? toolB.official_url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="flex-1 font-cairo font-bold text-sm no-underline text-center text-text hover:border-accent hover:text-accent transition-colors duration-150"
          style={{
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: '13px 24px',
            borderRadius: 'var(--radius-sm)',
            minWidth: 160,
          }}
        >
          جرّب {toolB.name_ar}
        </a>
      </div>
    </div>
  )
}

import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { buildBestIntro } from '@/lib/verdict'

export const revalidate = 86400

type Props = { params: Promise<{ useCase: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { useCase } = await params
  const decoded = decodeURIComponent(useCase)
  return {
    title: `أفضل أدوات AI لـ${decoded}`,
    description: `أفضل أدوات الذكاء الاصطناعي لـ${decoded} — مقارنة شاملة بالأسعار والمميزات`,
  }
}

async function getToolsByUseCase(decoded: string): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .contains('use_cases', [decoded])
    .order('is_free_tier', { ascending: false })
  if (error || !data) return []
  return data as Tool[]
}

const PRICING_STYLE = (tool: Tool): React.CSSProperties => {
  if (tool.is_free_tier) return { color: 'var(--success)' }
  if (tool.pricing?.toLowerCase() === 'freemium') return { color: 'var(--text-muted)' }
  return { color: 'var(--accent)' }
}

export default async function BestToolsPage({ params }: Props) {
  const { useCase } = await params
  const decoded = decodeURIComponent(useCase)
  const tools = await getToolsByUseCase(decoded)

  if (!tools.length) notFound()

  const intro = buildBestIntro(decoded, tools)

  return (
    <div style={{ padding: '40px 0' }}>
      {/* eyebrow */}
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
        قائمة مختارة
      </div>

      <h1 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 36,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 8,
        lineHeight: 1.2,
      }}>
        أفضل أدوات AI لـ<em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>{decoded}</em>
      </h1>

      <p style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 15,
        color: 'var(--text-muted)',
        lineHeight: 1.8,
        marginBottom: 40,
      }}>
        {intro}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {tools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              padding: '20px 24px',
              textDecoration: 'none',
              transition: 'border-color 0.2s',
              cursor: 'pointer',
            }}
            className="card-hover"
          >
            {/* rank number */}
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 22,
              fontWeight: 700,
              color: i === 0 ? 'var(--accent)' : 'var(--border)',
              width: 32,
              flexShrink: 0,
              lineHeight: 1,
              paddingTop: 2,
            }}>
              {i + 1}
            </span>

            {/* content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                <span style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 17,
                  fontWeight: 700,
                  color: 'var(--text)',
                }}>
                  {tool.name_ar}
                </span>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 12,
                  color: 'var(--text-muted)',
                }}>
                  {tool.name}
                </span>
                {tool.is_free_tier && (
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: 'rgba(76,175,125,0.12)',
                    color: 'var(--success)',
                    border: '1px solid rgba(76,175,125,0.3)',
                  }}>
                    مجاني
                  </span>
                )}
              </div>
              <p style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 14,
                color: 'var(--text-muted)',
                lineHeight: 1.65,
                margin: 0,
              }}>
                {tool.description_ar}
              </p>
            </div>

            {/* price */}
            <div style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 14,
              fontWeight: 500,
              flexShrink: 0,
              fontVariantNumeric: 'tabular-nums',
              paddingTop: 2,
              ...PRICING_STYLE(tool),
            }}>
              {tool.is_free_tier && !tool.price_from
                ? 'مجاني'
                : tool.price_from
                ? `$${tool.price_from}/شهر`
                : '—'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

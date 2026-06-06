import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import Link from 'next/link'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'جميع أدوات الذكاء الاصطناعي',
  description: 'دليل شامل لأدوات AI بالعربية — مراجعات، أسعار، ومقارنات',
}

const CATEGORY_LABELS: Record<string, string> = {
  writing: 'كتابة',
  image:   'صور',
  code:    'برمجة',
  video:   'فيديو',
  audio:   'صوت',
}

const CATEGORY_ORDER = ['writing', 'image', 'code', 'video', 'audio']

function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  const s = size
  switch (category) {
    case 'writing':
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    case 'image':
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    case 'code':
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
    case 'video':
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
    case 'audio':
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/></svg>
    default:
      return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
  }
}

async function getAllTools(): Promise<Tool[]> {
  const { data, error } = await supabase.from('tools').select('*').order('name').limit(100)
  if (error || !data) return []
  return data as Tool[]
}

export default async function ToolsPage({ searchParams }: { searchParams: Promise<{ compare?: string; category?: string }> }) {
  const { compare, category: filterCat } = await searchParams
  const tools = await getAllTools()

  const byCategory = tools.reduce<Record<string, Tool[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  const orderedCategories = [
    ...CATEGORY_ORDER.filter(c => byCategory[c]),
    ...Object.keys(byCategory).filter(c => !CATEGORY_ORDER.includes(c)),
  ]

  const displayCategories = filterCat
    ? orderedCategories.filter(c => c === filterCat)
    : orderedCategories

  return (
    <div style={{ padding: '40px 0' }}>
      {/* header */}
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
        الدليل الشامل
      </div>

      <h1 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 36,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 8,
        lineHeight: 1.2,
      }}>
        جميع أدوات <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>الذكاء الاصطناعي</em>
      </h1>

      <p style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        color: 'var(--text-muted)',
        marginBottom: 40,
      }}>
        {tools.length} أداة في {orderedCategories.length} تصنيف
      </p>

      {compare && (
        <div style={{
          marginBottom: 24,
          padding: '12px 16px',
          fontFamily: "'Cairo', sans-serif",
          fontSize: 14,
          color: 'var(--accent)',
          backgroundColor: 'rgba(232,160,64,0.08)',
          border: '1px solid rgba(232,160,64,0.3)',
          borderRadius: 'var(--radius-md)',
        }}>
          اختر أداة للمقارنة مع <strong>{compare}</strong>
        </div>
      )}

      {/* category filter bar */}
      <div style={{
        display: 'flex',
        gap: 8,
        marginBottom: 40,
        flexWrap: 'wrap',
      }}>
        <Link href="/tools" style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '6px 16px',
          borderRadius: 'var(--radius-sm)',
          fontFamily: "'Cairo', sans-serif",
          fontSize: 13,
          textDecoration: 'none',
          cursor: 'pointer',
          backgroundColor: !filterCat ? 'rgba(232,160,64,0.12)' : 'var(--surface)',
          border: !filterCat ? '1px solid var(--accent)' : '1px solid var(--border)',
          color: !filterCat ? 'var(--accent)' : 'var(--text-muted)',
        }}>الكل</Link>
        {orderedCategories.map(cat => (
          <Link key={cat} href={`/tools?category=${cat}`} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 16px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: "'Cairo', sans-serif",
            fontSize: 13,
            textDecoration: 'none',
            cursor: 'pointer',
            backgroundColor: filterCat === cat ? 'rgba(232,160,64,0.12)' : 'var(--surface)',
            border: filterCat === cat ? '1px solid var(--accent)' : '1px solid var(--border)',
            color: filterCat === cat ? 'var(--accent)' : 'var(--text-muted)',
          }}>
            <span style={{ opacity: 0.7, display: 'flex' }}>
              <CategoryIcon category={cat} size={13} />
            </span>
            {CATEGORY_LABELS[cat] ?? cat}
          </Link>
        ))}
      </div>

      {/* categories + grids */}
      {displayCategories.map(category => (
        <section key={category} style={{ marginBottom: 48 }}>
          {/* section heading */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
            paddingBottom: 14,
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ color: 'var(--accent)', display: 'flex' }}>
              <CategoryIcon category={category} size={16} />
            </span>
            <h2 style={{
              fontFamily: "'Cairo', sans-serif",
              fontSize: 18,
              fontWeight: 600,
              color: 'var(--text)',
              margin: 0,
            }}>
              {CATEGORY_LABELS[category] ?? category}
            </h2>
            <span style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: 11,
              color: 'var(--text-muted)',
              marginRight: 'auto',
            }}>
              {byCategory[category]?.length} أداة
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {byCategory[category]?.map((tool) => (
              <Link
                key={tool.slug}
                href={compare && tool.slug !== compare
                  ? `/compare/${compare}-vs-${tool.slug}`
                  : `/tools/${tool.slug}`}
                className="card-hover"
                style={{
                  display: 'block',
                  textDecoration: 'none',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <div style={{
                      fontFamily: "'Cairo', sans-serif",
                      fontSize: 15,
                      fontWeight: 700,
                      color: 'var(--text)',
                      marginBottom: 2,
                    }}>
                      {tool.name_ar}
                    </div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 11,
                      color: 'var(--text-muted)',
                    }}>
                      {tool.name}
                    </div>
                  </div>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-sm)',
                    flexShrink: 0,
                    marginTop: 2,
                    ...(tool.is_free_tier
                      ? { backgroundColor: 'rgba(76,175,125,0.12)', color: 'var(--success)', border: '1px solid rgba(76,175,125,0.3)' }
                      : tool.pricing?.toLowerCase() === 'freemium'
                      ? { backgroundColor: 'rgba(139,143,168,0.12)', color: 'var(--text-muted)', border: '1px solid rgba(139,143,168,0.3)' }
                      : { backgroundColor: 'rgba(232,160,64,0.12)', color: 'var(--accent)', border: '1px solid rgba(232,160,64,0.3)' }),
                  }}>
                    {tool.pricing}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                  margin: 0,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}>
                  {tool.description_ar}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

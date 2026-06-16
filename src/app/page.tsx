import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import Link from 'next/link'

export const revalidate = 3600

const CATEGORY_LABELS: Record<string, string> = {
  writing: 'كتابة',
  image:   'صور',
  code:    'كود',
  video:   'فيديو',
  audio:   'صوت',
}

function CategoryIcon({ category, size = 18 }: { category: string; size?: number }) {
  const s = size
  switch (category) {
    case 'writing':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
      )
    case 'image':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
        </svg>
      )
    case 'code':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
        </svg>
      )
    case 'video':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>
        </svg>
      )
    case 'audio':
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      )
    default:
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
        </svg>
      )
  }
}

async function getTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9)
  if (error || !data) return []
  return data as Tool[]
}

async function getAllCategories(): Promise<string[]> {
  const { data } = await supabase.from('tools').select('category')
  if (!data) return []
  return [...new Set(data.map((t) => t.category))]
}

async function getToolCount(): Promise<number> {
  const { count } = await supabase.from('tools').select('*', { count: 'exact', head: true })
  return count ?? 0
}

export default async function HomePage() {
  const [tools, categories, toolCount] = await Promise.all([getTools(), getAllCategories(), getToolCount()])

  return (
    <div>
      {/* ── Hero ── */}
      <section style={{
        padding: '72px 32px 56px',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 -24px',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          opacity: 0.3,
          maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontFamily: "'Geist Mono', monospace",
            fontSize: 12,
            color: 'var(--accent)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ display: 'inline-block', width: 24, height: 1, background: 'var(--accent)' }} />
            المرجع العربي لأدوات الذكاء الاصطناعي
          </div>

          <div style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.15,
            color: 'var(--text)',
            maxWidth: 680,
            marginBottom: 20,
          }}>
            دليل <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>أدوات الذكاء الاصطناعي</em>
            <br />بالعربية
          </div>

          <div style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 17,
            color: 'var(--text-muted)',
            maxWidth: 520,
            lineHeight: 1.7,
            marginBottom: 36,
          }}>
            أسعار بعملتك المحلية · مقارنات تفصيلية · بدائل مجانية
            <br />كل ما تحتاجه في مكان واحد
          </div>

          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Link href="/tools" style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              padding: '11px 28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent)',
              color: '#0F1117',
              transition: 'filter 0.15s',
              cursor: 'pointer',
            }}>
              اكتشف الأدوات ←
            </Link>
            <Link href="/compare" style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              padding: '11px 28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
              cursor: 'pointer',
            }}>
              مقارنة أداتين
            </Link>
          </div>

          <div style={{
            display: 'flex',
            gap: 40,
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid var(--border)',
          }}>
            {[
              { num: toolCount > 0 ? `${toolCount}+` : '—', label: 'أداة مُراجَعة' },
              { num: categories.length > 0 ? `${categories.length}` : '5', label: 'تصنيف' },
              { num: '6',    label: 'عملات محلية' },
              { num: 'يومياً', label: 'تحديث الأسعار' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 28, fontWeight: 500, color: 'var(--accent)', letterSpacing: '-0.02em' }}>{num}</div>
                <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category bar ── */}
      <div style={{
        margin: '0 -24px',
        padding: '16px 32px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        scrollbarWidth: 'none',
      }}>
        <Link href="/tools" style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '6px 16px',
          borderRadius: 'var(--radius-sm)',
          fontFamily: "'Cairo', sans-serif",
          fontSize: 13,
          whiteSpace: 'nowrap',
          textDecoration: 'none',
          backgroundColor: 'rgba(232,160,64,0.12)',
          border: '1px solid var(--accent)',
          color: 'var(--accent)',
          cursor: 'pointer',
        }}>الكل</Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/tools?category=${cat}`} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 16px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: "'Cairo', sans-serif",
            fontSize: 13,
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            cursor: 'pointer',
          }}>
            <span style={{ opacity: 0.7, display: 'flex' }}>
              <CategoryIcon category={cat} size={13} />
            </span>
            {CATEGORY_LABELS[cat] ?? cat}
          </Link>
        ))}
      </div>

      {/* ── Tools section ── */}
      <div style={{ padding: '40px 0', margin: '0 -24px', paddingLeft: 32, paddingRight: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 20, fontWeight: 600, color: 'var(--text)' }}>
            أبرز الأدوات
          </div>
          <div style={{ fontFamily: "'Geist Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>
            {tools.length > 0 ? `${tools.length} أداة` : '250 أداة'}
          </div>
        </div>

        {tools.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '64px 32px',
            border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)',
            fontFamily: "'Cairo', sans-serif", color: 'var(--text-muted)',
          }}>
            لا توجد أدوات بعد — أضف بيانات في Supabase
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Link href="/tools" style={{
            fontFamily: "'Cairo', sans-serif",
            fontSize: 14,
            color: 'var(--accent)',
            textDecoration: 'none',
            cursor: 'pointer',
          }}>
            عرض جميع الأدوات ←
          </Link>
        </div>
      </div>
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <a
      href={`/tools/${tool.slug}`}
      className="card-hover"
      style={{
        display: 'block',
        textDecoration: 'none',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: 20,
        transition: 'border-color 0.2s, transform 0.2s',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
            {tool.name_ar}
          </div>
          <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'var(--text-muted)' }}>
            {tool.name}
          </div>
        </div>
        <div style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          flexShrink: 0,
          color: 'var(--text-muted)',
        }}>
          <CategoryIcon category={tool.category} size={18} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 11, fontWeight: 500,
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          ...(tool.is_free_tier
            ? { backgroundColor: 'rgba(76,175,125,0.12)', color: 'var(--success)', border: '1px solid rgba(76,175,125,0.3)' }
            : tool.pricing?.toLowerCase() === 'freemium'
            ? { backgroundColor: 'rgba(139,143,168,0.12)', color: 'var(--text-muted)', border: '1px solid rgba(139,143,168,0.3)' }
            : { backgroundColor: 'rgba(232,160,64,0.12)', color: 'var(--accent)', border: '1px solid rgba(232,160,64,0.3)' }),
        }}>
          {tool.pricing}
        </span>
        <span style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: 11, fontWeight: 500,
          padding: '3px 10px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--surface-2)',
          color: 'var(--text-muted)',
          border: '1px solid var(--border)',
        }}>
          {CATEGORY_LABELS[tool.category] ?? tool.category}
        </span>
      </div>

      <div style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 13,
        color: 'var(--text-muted)',
        lineHeight: 1.65,
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>
        {tool.description_ar}
      </div>

      <div style={{
        marginTop: 16, paddingTop: 14,
        borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: "'Geist Mono', monospace",
          fontSize: 14, fontWeight: 500,
          color: tool.is_free_tier ? 'var(--success)' : 'var(--accent)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {tool.is_free_tier && !tool.price_from ? 'مجاني' : tool.price_from ? `من $${tool.price_from}/شهر` : '—'}
        </div>
        <div style={{ fontFamily: "'Cairo', sans-serif", fontSize: 12, color: 'var(--text-muted)' }}>
          عرض التفاصيل →
        </div>
      </div>
    </a>
  )
}

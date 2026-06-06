import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import Link from 'next/link'

export const revalidate = 3600

const CATEGORY_ICONS: Record<string, string> = {
  writing: '✍',
  image:   '🖼',
  code:    '💻',
  video:   '🎬',
  audio:   '🎙',
}

const CATEGORY_LABELS: Record<string, string> = {
  writing: 'كتابة',
  image:   'صور',
  code:    'كود',
  video:   'فيديو',
  audio:   'صوت',
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

export default async function HomePage() {
  const [tools, categories] = await Promise.all([getTools(), getAllCategories()])

  return (
    <div>
      {/* ── Hero ── exact match to preview */}
      <section style={{
        padding: '72px 0 56px',
        borderBottom: '1px solid var(--border)',
        position: 'relative',
        overflow: 'hidden',
        margin: '0 -24px',
        paddingLeft: 32,
        paddingRight: 32,
      }}>
        {/* grid background */}
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
          {/* eyebrow */}
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

          {/* title */}
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

          {/* subtitle */}
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

          {/* CTA buttons — no newsletter in hero, matches preview */}
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
            }}>
              اكتشف الأدوات ←
            </Link>
            <Link href="/tools" style={{
              fontFamily: "'Cairo', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              padding: '11px 28px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border)',
            }}>
              مقارنة أداتين
            </Link>
          </div>

          {/* stats */}
          <div style={{
            display: 'flex',
            gap: 40,
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid var(--border)',
          }}>
            {[
              { num: '250+', label: 'أداة مُراجَعة' },
              { num: '12',   label: 'تصنيف' },
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
        }}>الكل</Link>
        {categories.map((cat) => (
          <Link key={cat} href={`/tools?category=${cat}`} style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 16px',
            borderRadius: 'var(--radius-sm)',
            fontFamily: "'Cairo', sans-serif",
            fontSize: 13,
            whiteSpace: 'nowrap',
            textDecoration: 'none',
            color: 'var(--text-muted)',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
          }}>
            {CATEGORY_ICONS[cat] ?? ''} {CATEGORY_LABELS[cat] ?? cat}
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
          }}>
            عرض جميع الأدوات ←
          </Link>
        </div>
      </div>
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  const icon = CATEGORY_ICONS[tool.category] ?? '🤖'

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
        transition: 'border-color 0.15s, transform 0.15s',
      }}
    >
      {/* top: name+EN left, icon right — RTL so icon is visual-left */}
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
          width: 40, height: 40, fontSize: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          backgroundColor: 'var(--surface-2)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-sm)',
          flexShrink: 0,
        }}>
          {icon}
        </div>
      </div>

      {/* badges row */}
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

      {/* description */}
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

      {/* footer */}
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

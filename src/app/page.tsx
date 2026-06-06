import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

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
      {/* ── Hero ── */}
      <section
        className="relative border-b border-border overflow-hidden -mx-6 px-6"
        style={{ paddingTop: '72px', paddingBottom: '64px' }}
      >
        {/* grid background */}
        <div
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
          }}
        />

        <div className="relative z-10 max-w-[680px]">
          {/* eyebrow */}
          <div
            className="flex items-center gap-3 mb-5"
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '12px',
              color: 'var(--accent)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            <span className="inline-block w-6 h-px bg-accent flex-shrink-0" />
            المرجع العربي لأدوات الذكاء الاصطناعي
          </div>

          {/* h1 */}
          <h1
            className="font-cairo font-bold text-text mb-5"
            style={{ fontSize: 'clamp(36px, 5vw, 52px)', lineHeight: 1.15 }}
          >
            دليل{' '}
            <span className="text-accent">أدوات الذكاء الاصطناعي</span>
            {' '}بالعربية
          </h1>

          <p
            className="font-cairo text-muted mb-9"
            style={{ fontSize: '17px', lineHeight: 1.7, maxWidth: 520 }}
          >
            أسعار بعملتك المحلية · مقارنات تفصيلية · بدائل مجانية
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-3 mb-10">
            <Link
              href="/tools"
              className="font-cairo font-bold text-sm no-underline transition-all duration-150 hover:brightness-110"
              style={{
                backgroundColor: 'var(--accent)',
                color: '#0F1117',
                padding: '11px 28px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              اكتشف الأدوات ←
            </Link>
            <Link
              href="/tools"
              className="font-cairo font-bold text-sm no-underline transition-colors duration-150 hover:border-accent hover:text-accent"
              style={{
                backgroundColor: 'var(--surface)',
                color: 'var(--text)',
                border: '1px solid var(--border)',
                padding: '11px 28px',
                borderRadius: 'var(--radius-sm)',
              }}
            >
              مقارنة أداتين
            </Link>
          </div>

          <NewsletterForm />

          {/* stats */}
          <div className="flex flex-wrap gap-10 mt-12 pt-8 border-t border-border">
            {[
              { num: `${tools.length > 0 ? '250+' : '—'}`, label: 'أداة مُراجَعة' },
              { num: '12', label: 'تصنيف' },
              { num: '6',  label: 'عملات محلية' },
              { num: 'يومياً', label: 'تحديث الأسعار' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: '28px',
                    fontWeight: 500,
                    color: 'var(--accent)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {num}
                </div>
                <div className="font-cairo text-muted text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category pills ── */}
      {categories.length > 0 && (
        <div
          className="-mx-6 px-6 py-4 flex gap-2 overflow-x-auto"
          style={{ borderBottom: '1px solid var(--border)', scrollbarWidth: 'none' }}
        >
          <Link
            href="/tools"
            className="font-cairo text-sm no-underline whitespace-nowrap transition-colors duration-150"
            style={{
              padding: '6px 18px',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'var(--accent-dim, rgba(232,160,64,0.12))',
              border: '1px solid var(--accent)',
              color: 'var(--accent)',
            }}
          >
            الكل
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/tools?category=${cat}`}
              className="font-cairo text-sm no-underline whitespace-nowrap text-muted hover:text-text transition-colors duration-150"
              style={{
                padding: '6px 18px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
              }}
            >
              {CATEGORY_ICONS[cat] ?? ''} {CATEGORY_LABELS[cat] ?? cat}
            </Link>
          ))}
        </div>
      )}

      {/* ── Tools grid ── */}
      <section className="pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cairo font-semibold text-text text-xl">أبرز الأدوات</h2>
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '12px',
              color: 'var(--text-muted)',
            }}
          >
            {tools.length} أداة
          </span>
        </div>

        {tools.length === 0 ? (
          <div
            className="text-center py-16 font-cairo text-muted"
            style={{ border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}
          >
            لا توجد أدوات بعد — أضف بيانات في Supabase
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/tools"
            className="font-cairo text-accent text-sm no-underline hover:underline"
          >
            عرض جميع الأدوات ←
          </Link>
        </div>
      </section>
    </div>
  )
}

function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group block no-underline card-hover transition-colors duration-150"
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '20px',
      }}
    >
      {/* top row: icon + name + badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div
            className="flex-shrink-0 flex items-center justify-center text-xl"
            style={{
              width: 40,
              height: 40,
              backgroundColor: 'var(--surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)',
            }}
          >
            {CATEGORY_ICONS[tool.category] ?? '🤖'}
          </div>
          <div>
            <div className="font-cairo font-bold text-text" style={{ fontSize: '15px' }}>
              {tool.name_ar}
            </div>
            <div
              className="font-jakarta text-muted mt-0.5"
              style={{ fontSize: '11px' }}
            >
              {tool.name}
            </div>
          </div>
        </div>
        <span
          className="font-jakarta font-medium flex-shrink-0"
          style={{
            fontSize: '11px',
            padding: '3px 10px',
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

      {/* category badge */}
      <div className="mb-3">
        <span
          className="font-jakarta text-muted"
          style={{
            fontSize: '11px',
            padding: '2px 8px',
            borderRadius: 'var(--radius-sm)',
            backgroundColor: 'var(--surface-2)',
            border: '1px solid var(--border)',
          }}
        >
          {CATEGORY_LABELS[tool.category] ?? tool.category}
        </span>
      </div>

      {/* description */}
      <p
        className="font-cairo text-muted line-clamp-3"
        style={{ fontSize: '13px', lineHeight: 1.65 }}
      >
        {tool.description_ar}
      </p>

      {/* footer: price */}
      {tool.price_from && (
        <div
          className="mt-4 pt-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--accent)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            من ${tool.price_from}/شهر
          </span>
        </div>
      )}

    </Link>
  )
}

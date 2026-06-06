import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import Link from 'next/link'
import NewsletterForm from '@/components/NewsletterForm'

export const revalidate = 3600

async function getTools(): Promise<Tool[]> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(9)

  if (error || !data) return []
  return data as Tool[]
}

export default async function HomePage() {
  const tools = await getTools()

  return (
    <div>
      {/* Hero */}
      <section className="relative py-20 border-b border-border overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 50% 0%, black 0%, transparent 100%)',
          }}
        />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-5 font-mono text-accent text-xs uppercase tracking-widest">
            <span className="inline-block w-6 h-px bg-accent" />
            المرجع العربي لأدوات الذكاء الاصطناعي
          </div>

          <h1 className="font-cairo font-bold text-text mb-5" style={{ fontSize: '52px', lineHeight: 1.15, maxWidth: 680 }}>
            دليل <span className="text-accent">أدوات الذكاء الاصطناعي</span> بالعربية
          </h1>

          <p className="font-cairo text-muted mb-9" style={{ fontSize: '17px', maxWidth: 520, lineHeight: 1.7 }}>
            أسعار بعملتك المحلية · مقارنات تفصيلية · بدائل مجانية
          </p>

          <div className="mb-12">
            <NewsletterForm />
          </div>

          <div className="flex gap-10 pt-8 border-t border-border">
            {[
              { num: '250+', label: 'أداة مُراجَعة' },
              { num: '12',   label: 'تصنيف' },
              { num: '6',    label: 'عملات محلية' },
              { num: 'يومياً', label: 'تحديث الأسعار' },
            ].map(({ num, label }) => (
              <div key={label}>
                <div className="font-mono text-accent font-medium" style={{ fontSize: '28px', letterSpacing: '-0.02em' }}>{num}</div>
                <div className="font-cairo text-muted text-sm mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="pt-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-cairo font-semibold text-text text-xl">أبرز الأدوات</h2>
          <span className="font-mono text-muted text-xs">{tools.length} أداة</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="block no-underline bg-surface border border-border rounded-md p-5 hover:border-accent transition-colors duration-150"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-cairo font-bold text-text text-base">{tool.name_ar}</div>
                  <div className="font-jakarta text-muted mt-0.5" style={{ fontSize: '11px' }}>{tool.name}</div>
                </div>
                <span className={`font-jakarta font-medium text-xs px-2.5 py-0.5 rounded-sm border ${
                  tool.is_free_tier
                    ? 'bg-success/10 text-success border-success/30'
                    : 'bg-accent/10 text-accent border-accent/30'
                }`}>
                  {tool.pricing}
                </span>
              </div>

              <p className="font-cairo text-muted text-sm line-clamp-3" style={{ lineHeight: 1.65 }}>
                {tool.description_ar}
              </p>

              {tool.price_from && (
                <div className="mt-3.5 pt-3.5 border-t border-border">
                  <span className="font-mono text-accent font-medium text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
                    من ${tool.price_from}/شهر
                  </span>
                </div>
              )}
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/tools" className="font-cairo text-accent text-sm no-underline hover:underline">
            عرض جميع الأدوات ←
          </Link>
        </div>
      </section>
    </div>
  )
}

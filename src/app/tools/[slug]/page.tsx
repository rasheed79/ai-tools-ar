import { supabase } from '@/lib/supabase'
import { buildJsonLd } from '@/lib/seo'
import { convertCurrency, FALLBACK_RATES } from '@/lib/currency'
import type { Tool } from '@/lib/database.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const revalidate = 86400

type Props = { params: { slug: string } }

async function getTool(slug: string): Promise<Tool | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !data) return null
  return data as Tool
}

export async function generateStaticParams() {
  const { data, error } = await supabase.from('tools').select('slug')
  if (error || !data?.length) {
    console.error('generateStaticParams: Supabase error or empty', error)
    return []
  }
  return data.map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tool = await getTool(params.slug)
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
  const tool = await getTool(params.slug)
  if (!tool) notFound()

  const jsonLd = buildJsonLd(tool)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">{tool.name_ar}</h1>
            <p className="text-gray-500 mt-1">{tool.name}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            tool.is_free_tier ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {tool.pricing}
          </span>
        </div>

        <p className="text-lg text-gray-700 mb-8">{tool.description_ar}</p>

        {tool.price_from && (
          <section className="bg-gray-50 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">الأسعار بعملتك المحلية</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(CURRENCY_LABELS).map(([currency, label]) => {
                const rate = FALLBACK_RATES[currency] ?? 1
                const price = convertCurrency(tool.price_from!, rate)
                return (
                  <div key={currency} className="text-center">
                    <p className="text-2xl font-bold text-blue-600">{price}</p>
                    <p className="text-sm text-gray-500">{label}/شهر</p>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              * الأسعار تقريبية، من ${tool.price_from} USD/شهر
            </p>
          </section>
        )}

        {tool.features?.ar?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">أبرز المميزات</h2>
            <ul className="space-y-2">
              {tool.features.ar.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tool.use_cases?.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">مناسبة لـ</h2>
            <div className="flex flex-wrap gap-2">
              {tool.use_cases.map((uc) => (
                <a
                  key={uc}
                  href={`/best/${uc}`}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-100"
                >
                  {uc}
                </a>
              ))}
            </div>
          </section>
        )}

        <div className="flex gap-4">
          <a
            href={tool.affiliate_url ?? tool.official_url}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            جرّب الأداة
          </a>
          <a
            href={`/tools/${tool.slug}-vs`}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            قارن مع أداة أخرى
          </a>
          <a
            href={`/alt/${tool.slug}`}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            بدائل مجانية
          </a>
        </div>
      </article>
    </>
  )
}

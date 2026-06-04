import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { convertCurrency, FALLBACK_RATES } from '@/lib/currency'

// Dynamic with edge caching — not SSG (avoids N^2 build explosion)
export const revalidate = 86400

type Props = { params: Promise<{ pair: string }> }

async function getTwoTools(slugA: string, slugB: string): Promise<[Tool, Tool] | null> {
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .in('slug', [slugA, slugB])

  if (error || !data || data.length < 2) return null
  const a = data.find((t) => t.slug === slugA) as Tool
  const b = data.find((t) => t.slug === slugB) as Tool
  if (!a || !b) return null
  return [a, b]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pair } = await params
  const [slugA, , slugB] = pair.split('-vs-')
  return {
    title: `${slugA} مقابل ${slugB} — مقارنة`,
    description: `مقارنة تفصيلية بين ${slugA} و${slugB} — الأسعار، المميزات، والأفضل لاستخدامك`,
  }
}

const USE_CASES = ['كتابة', 'تسويق', 'تعليم', 'برمجة', 'تصميم', 'فيديو', 'صوت']

export default async function ComparePage({ params }: Props) {
  const { pair } = await params
  const parts = pair.split('-vs-')
  if (parts.length !== 2) notFound()
  const [slugA, slugB] = parts

  const tools = await getTwoTools(slugA, slugB)
  if (!tools) notFound()
  const [toolA, toolB] = tools

  const sarRate = FALLBACK_RATES['SAR']

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        {toolA.name_ar} مقابل {toolB.name_ar}
      </h1>
      <p className="text-gray-500 mb-8">مقارنة تفصيلية — اختر الأنسب لاحتياجاتك</p>

      {/* Use case filter */}
      <section className="mb-8">
        <p className="text-sm text-gray-600 mb-3">فلتر حسب الاستخدام:</p>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc) => (
            <button
              key={uc}
              className="text-sm px-3 py-1 rounded-full border border-gray-300 hover:bg-blue-50 hover:border-blue-300"
            >
              {uc}
            </button>
          ))}
        </div>
      </section>

      {/* Comparison table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-right p-4 border border-gray-200 w-1/3">المعيار</th>
              <th className="text-center p-4 border border-gray-200">{toolA.name_ar}</th>
              <th className="text-center p-4 border border-gray-200">{toolB.name_ar}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border border-gray-200 font-medium">السعر</td>
              <td className="p-4 border border-gray-200 text-center">
                {toolA.is_free_tier ? (
                  <span className="text-green-600 font-semibold">مجاني</span>
                ) : toolA.price_from ? (
                  <span>${toolA.price_from}/شهر<br/>
                    <span className="text-sm text-gray-500">
                      ({convertCurrency(toolA.price_from, sarRate)} ريال)
                    </span>
                  </span>
                ) : '—'}
              </td>
              <td className="p-4 border border-gray-200 text-center">
                {toolB.is_free_tier ? (
                  <span className="text-green-600 font-semibold">مجاني</span>
                ) : toolB.price_from ? (
                  <span>${toolB.price_from}/شهر<br/>
                    <span className="text-sm text-gray-500">
                      ({convertCurrency(toolB.price_from, sarRate)} ريال)
                    </span>
                  </span>
                ) : '—'}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-4 border border-gray-200 font-medium">الفئة</td>
              <td className="p-4 border border-gray-200 text-center">{toolA.category}</td>
              <td className="p-4 border border-gray-200 text-center">{toolB.category}</td>
            </tr>
            <tr>
              <td className="p-4 border border-gray-200 font-medium">طبقة مجانية</td>
              <td className="p-4 border border-gray-200 text-center">
                {toolA.is_free_tier ? '✅' : '❌'}
              </td>
              <td className="p-4 border border-gray-200 text-center">
                {toolB.is_free_tier ? '✅' : '❌'}
              </td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-4 border border-gray-200 font-medium">أبرز المميزات</td>
              <td className="p-4 border border-gray-200">
                <ul className="space-y-1">
                  {toolA.features?.ar?.slice(0, 3).map((f, i) => (
                    <li key={i} className="text-sm">• {f}</li>
                  ))}
                </ul>
              </td>
              <td className="p-4 border border-gray-200">
                <ul className="space-y-1">
                  {toolB.features?.ar?.slice(0, 3).map((f, i) => (
                    <li key={i} className="text-sm">• {f}</li>
                  ))}
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex gap-4 mt-8">
        <a href={toolA.official_url} target="_blank" rel="noopener noreferrer nofollow"
          className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          جرّب {toolA.name_ar}
        </a>
        <a href={toolB.official_url} target="_blank" rel="noopener noreferrer nofollow"
          className="flex-1 text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700">
          جرّب {toolB.name_ar}
        </a>
      </div>
    </div>
  )
}

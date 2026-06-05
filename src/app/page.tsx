import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import Link from 'next/link'

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
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold mb-4">دليل أدوات الذكاء الاصطناعي بالعربية</h1>
        <p className="text-xl text-gray-600 mb-8">
          أسعار بعملتك المحلية · مقارنات تفصيلية · بدائل مجانية
        </p>
        <form className="flex gap-3 max-w-md mx-auto">
          <input
            type="email"
            name="email"
            placeholder="بريدك الإلكتروني"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-right"
          />
          <button
            type="submit"
            disabled
            className="bg-gray-400 text-white px-6 py-2 rounded-lg cursor-not-allowed"
          >
            قريباً
          </button>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">أبرز الأدوات</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-lg">{tool.name_ar}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  tool.is_free_tier ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {tool.pricing}
                </span>
              </div>
              <p className="text-gray-600 text-sm line-clamp-3">{tool.description_ar}</p>
              {tool.price_from && (
                <p className="text-blue-600 text-sm mt-3">
                  من ${tool.price_from}/شهر
                </p>
              )}
            </Link>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/tools" className="text-blue-600 hover:underline">
            عرض جميع الأدوات →
          </Link>
        </div>
      </section>
    </div>
  )
}

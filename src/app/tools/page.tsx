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
  image: 'صور',
  code: 'برمجة',
  video: 'فيديو',
  audio: 'صوت',
}

async function getAllTools(): Promise<Tool[]> {
  const { data, error } = await supabase.from('tools').select('*').order('name')
  if (error || !data) return []
  return data as Tool[]
}

export default async function ToolsPage() {
  const tools = await getAllTools()

  const byCategory = tools.reduce<Record<string, Tool[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">جميع أدوات الذكاء الاصطناعي</h1>

      {Object.entries(byCategory).map(([category, catTools]) => (
        <section key={category} className="mb-12">
          <h2 className="text-xl font-semibold mb-4 border-b pb-2">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {catTools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <h3 className="font-medium">{tool.name_ar}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    tool.is_free_tier ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mt-2 line-clamp-2">{tool.description_ar}</p>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

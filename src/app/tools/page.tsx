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
  const { data, error } = await supabase.from('tools').select('*').order('name').limit(100)
  if (error || !data) return []
  return data as Tool[]
}

export default async function ToolsPage({ searchParams }: { searchParams: Promise<{ compare?: string }> }) {
  const { compare } = await searchParams
  const tools = await getAllTools()

  const byCategory = tools.reduce<Record<string, Tool[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = []
    acc[t.category].push(t)
    return acc
  }, {})

  return (
    <div>
      <h1 className="font-cairo font-bold text-text mb-8" style={{ fontSize: '36px' }}>
        جميع أدوات الذكاء الاصطناعي
      </h1>

      {compare && (
        <div className="mb-6 p-3 text-sm font-cairo text-accent bg-accent/10 border border-accent/30 rounded-md">
          اختر أداة للمقارنة مع <strong>{compare}</strong>
        </div>
      )}

      {Object.entries(byCategory).map(([category, catTools]) => (
        <section key={category} className="mb-12">
          <h2 className="font-cairo font-semibold text-text text-xl mb-4 pb-3 border-b border-border">
            {CATEGORY_LABELS[category] ?? category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {catTools.map((tool) => (
              <Link
                key={tool.slug}
                href={compare && tool.slug !== compare
                  ? `/compare/${compare}-vs-${tool.slug}`
                  : `/tools/${tool.slug}`}
                className="block no-underline bg-surface border border-border rounded-md p-4 hover:border-accent transition-colors duration-150 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-cairo font-semibold text-text">{tool.name_ar}</span>
                  <span className={`font-jakarta font-medium text-xs px-2 py-0.5 rounded-sm border ${
                    tool.is_free_tier
                      ? 'bg-success/10 text-success border-success/30'
                      : 'bg-surface-2 text-muted border-border'
                  }`}>
                    {tool.pricing}
                  </span>
                </div>
                <p className="font-cairo text-muted text-sm line-clamp-2" style={{ lineHeight: 1.6 }}>
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

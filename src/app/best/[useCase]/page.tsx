import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ useCase: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { useCase } = await params
  const decoded = decodeURIComponent(useCase)
  return {
    title: `أفضل أدوات AI لـ${decoded}`,
    description: `أفضل أدوات الذكاء الاصطناعي لـ${decoded} — مقارنة شاملة بالأسعار والمميزات`,
  }
}

async function getToolsByUseCase(useCase: string): Promise<Tool[]> {
  const decoded = decodeURIComponent(useCase)
  const { data, error } = await supabase
    .from('tools')
    .select('*')
    .contains('use_cases', [decoded])
    .order('is_free_tier', { ascending: false })

  if (error || !data) return []
  return data as Tool[]
}

export default async function BestToolsPage({ params }: Props) {
  const { useCase } = await params
  const decoded = decodeURIComponent(useCase)
  const tools = await getToolsByUseCase(useCase)

  if (!tools.length) notFound()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">أفضل أدوات AI لـ{decoded}</h1>
      <p className="text-gray-500 mb-8">
        {tools.length} أداة — مرتبة من الأفضل للاستخدام
      </p>

      <div className="space-y-4">
        {tools.map((tool, i) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="flex items-start gap-4 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
          >
            <span className="text-2xl font-bold text-gray-300 w-8 shrink-0">{i + 1}</span>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-lg font-semibold">{tool.name_ar}</h2>
                {tool.is_free_tier && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    مجاني
                  </span>
                )}
              </div>
              <p className="text-gray-600 text-sm">{tool.description_ar}</p>
            </div>
            {tool.price_from && (
              <span className="text-blue-600 font-medium shrink-0">
                ${tool.price_from}/شهر
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

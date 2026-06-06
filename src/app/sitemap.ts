import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-tools-ar.pages.dev'

const USE_CASES = ['كتابة', 'تسويق', 'تعليم', 'برمجة', 'تصميم', 'فيديو', 'صوت', 'بحث', 'عمل', 'إبداع']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [toolsRes, comparisonsRes] = await Promise.all([
    supabase.from('tools').select('slug'),
    supabase.from('comparisons').select('tool_a_id, tool_b_id'),
  ])

  const tools = toolsRes.data ?? []
  const comparisons = comparisonsRes.data ?? []

  const toolById = new Map<string, string>()
  if (comparisons.length > 0) {
    const allIds = [...new Set(comparisons.flatMap((c) => [c.tool_a_id, c.tool_b_id]))]
    const { data: idRows } = await supabase.from('tools').select('id, slug').in('id', allIds)
    for (const row of idRows ?? []) toolById.set(row.id, row.slug)
  }

  const toolUrls: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${BASE_URL}/tools/${t.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const compareUrls: MetadataRoute.Sitemap = comparisons.flatMap((c) => {
    const slugA = toolById.get(c.tool_a_id)
    const slugB = toolById.get(c.tool_b_id)
    if (!slugA || !slugB) return []
    return [{
      url: `${BASE_URL}/compare/${slugA}-vs-${slugB}`,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }]
  })

  return [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, changeFrequency: 'daily', priority: 0.9 },
    ...USE_CASES.map((uc) => ({
      url: `${BASE_URL}/best/${encodeURIComponent(uc)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
    ...toolUrls,
    ...compareUrls,
  ]
}

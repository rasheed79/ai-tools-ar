import type { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://daleel-adawat.com'

const USE_CASES = ['كتابة', 'تسويق', 'تعليم', 'برمجة', 'تصميم', 'فيديو', 'صوت', 'بحث', 'عمل', 'إبداع']

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: toolsData } = await supabase.from('tools').select('slug').order('name')
  const tools = toolsData ?? []

  const toolUrls: MetadataRoute.Sitemap = tools.map((t) => ({
    url: `${BASE_URL}/tools/${t.slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const compareUrls: MetadataRoute.Sitemap = []
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      compareUrls.push({
        url: `${BASE_URL}/compare/${tools[i].slug}-vs-${tools[j].slug}`,
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })
    }
  }

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

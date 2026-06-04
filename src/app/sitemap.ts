import { supabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-tools-ar.pages.dev'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: tools } = await supabase.from('tools').select('slug,updated_at')

  const toolEntries: MetadataRoute.Sitemap = (tools ?? []).flatMap((t) => [
    {
      url: `${BASE_URL}/tools/${t.slug}`,
      lastModified: t.updated_at,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/alt/${t.slug}`,
      lastModified: t.updated_at,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ])

  const useCases = ['كتابة', 'تسويق', 'تعليم', 'برمجة', 'تصميم', 'فيديو', 'صوت', 'بحث', 'عمل', 'إبداع']
  const bestEntries: MetadataRoute.Sitemap = useCases.map((uc) => ({
    url: `${BASE_URL}/best/${encodeURIComponent(uc)}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, changeFrequency: 'daily', priority: 0.9 },
    ...toolEntries,
    ...bestEntries,
  ]
}

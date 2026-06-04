import type { MetadataRoute } from 'next'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-tools-ar.pages.dev'

// Static sitemap — dynamic tool pages added after indexing
export default function sitemap(): MetadataRoute.Sitemap {
  const useCases = ['كتابة', 'تسويق', 'تعليم', 'برمجة', 'تصميم', 'فيديو', 'صوت', 'بحث', 'عمل', 'إبداع']

  return [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, changeFrequency: 'daily', priority: 0.9 },
    ...useCases.map((uc) => ({
      url: `${BASE_URL}/best/${encodeURIComponent(uc)}`,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })),
  ]
}

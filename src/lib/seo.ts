import type { Tool } from './database.types'

export function buildSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function buildJsonLd(tool: Tool): object {
  const base: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description_ar,
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    inLanguage: 'ar',
    offers: {
      '@type': 'Offer',
      price: tool.price_from ?? 0,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    url: tool.official_url,
  }

  // Affiliate URLs must be disclosed — omit from structured data to avoid penalties
  return base
}

export const HREFLANG_REGIONS = [
  { lang: 'ar-SA', label: 'السعودية' },
  { lang: 'ar-EG', label: 'مصر' },
  { lang: 'ar-AE', label: 'الإمارات' },
  { lang: 'ar-MA', label: 'المغرب' },
  { lang: 'x-default', label: '' },
]

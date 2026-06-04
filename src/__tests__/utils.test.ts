import { convertCurrency } from '../lib/currency'
import { buildSlug, buildJsonLd } from '../lib/seo'
import type { Tool } from '../lib/database.types'

// ── convertCurrency ──────────────────────────────────────────────
describe('convertCurrency', () => {
  it('converts USD to SAR correctly', () => {
    expect(convertCurrency(20, 3.75)).toBe(75)
  })

  it('rounds to 2 decimal places', () => {
    expect(convertCurrency(10, 3.333)).toBe(33.33)
  })

  it('handles zero amount', () => {
    expect(convertCurrency(0, 3.75)).toBe(0)
  })

  it('handles rate of 1 (USD)', () => {
    expect(convertCurrency(49.99, 1)).toBe(49.99)
  })
})

// ── buildSlug ────────────────────────────────────────────────────
describe('buildSlug', () => {
  it('lowercases and replaces spaces with hyphens', () => {
    expect(buildSlug('Chat GPT')).toBe('chat-gpt')
  })

  it('removes non-ASCII characters (Arabic input stripped)', () => {
    expect(buildSlug('تشات GPT')).toBe('gpt')
  })

  it('collapses multiple hyphens', () => {
    expect(buildSlug('DALL--E 3')).toBe('dall-e-3')
  })

  it('trims leading and trailing hyphens', () => {
    expect(buildSlug('-test-')).toBe('test')
  })

  it('handles empty string', () => {
    expect(buildSlug('')).toBe('')
  })
})

// ── buildJsonLd ──────────────────────────────────────────────────
describe('buildJsonLd', () => {
  const mockTool: Tool = {
    id: 'abc-123',
    name: 'ChatGPT',
    slug: 'chatgpt',
    name_ar: 'تشات جي بي تي',
    category: 'writing',
    description_ar: 'مساعد ذكاء اصطناعي',
    pricing: 'freemium',
    price_from: 20,
    price_currency: 'USD',
    use_cases: ['كتابة'],
    official_url: 'https://chat.openai.com',
    affiliate_url: null,
    features: { ar: ['يكتب بالعربية'], en: ['Write'] },
    is_free_tier: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  }

  it('returns SoftwareApplication schema type', () => {
    const ld = buildJsonLd(mockTool) as Record<string, unknown>
    expect(ld['@type']).toBe('SoftwareApplication')
  })

  it('includes price in USD', () => {
    const ld = buildJsonLd(mockTool) as Record<string, unknown>
    const offers = ld['offers'] as Record<string, unknown>
    expect(offers['priceCurrency']).toBe('USD')
  })

  it('does NOT include affiliate_url in structured data', () => {
    const withAffiliate = { ...mockTool, affiliate_url: 'https://aff.link/xyz' }
    const ld = JSON.stringify(buildJsonLd(withAffiliate))
    expect(ld).not.toContain('aff.link')
  })

  it('uses schema.org context', () => {
    const ld = buildJsonLd(mockTool) as Record<string, unknown>
    expect(ld['@context']).toBe('https://schema.org')
  })
})

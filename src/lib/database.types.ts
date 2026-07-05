export type Tool = {
  id: string
  name: string
  slug: string
  name_ar: string
  category: 'writing' | 'image' | 'code' | 'video' | 'audio'
  description_ar: string
  review_ar: string | null
  pricing: 'مجاني' | 'مدفوع' | 'freemium'
  price_from: number | null
  price_currency: string
  use_cases: string[]
  official_url: string
  affiliate_url: string | null
  features: { ar: string[]; en: string[] }
  is_free_tier: boolean
  created_at: string
  updated_at: string
}

export type ExchangeRate = {
  currency: string
  rate: number
  updated_at: string
}

export type Comparison = {
  id: string
  tool_a_slug: string
  tool_b_slug: string
  created_at: string
}

// Minimal Database type — avoids Supabase returning 'never' for select queries
export type Database = {
  public: {
    Tables: {
      tools: {
        Row: Tool
        Insert: Partial<Tool>
        Update: Partial<Tool>
      }
      exchange_rates: {
        Row: ExchangeRate
        Insert: Partial<ExchangeRate>
        Update: Partial<ExchangeRate>
      }
      comparisons: {
        Row: Comparison
        Insert: Partial<Comparison>
        Update: Partial<Comparison>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

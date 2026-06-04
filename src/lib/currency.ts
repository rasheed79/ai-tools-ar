import { supabase } from './supabase'
import type { ExchangeRate } from './database.types'

export const FALLBACK_RATES: Record<string, number> = {
  SAR: 3.75,
  EGP: 48.5,
  AED: 3.67,
  MAD: 10.1,
  KWD: 0.307,
}

export function convertCurrency(amountUSD: number, rate: number): number {
  return Math.round(amountUSD * rate * 100) / 100
}

export function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat('ar', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

let cachedRates: Record<string, number> | null = null
let cacheTime = 0

export async function getRates(): Promise<Record<string, number>> {
  const now = Date.now()
  if (cachedRates && now - cacheTime < 3_600_000) return cachedRates

  const { data, error } = await supabase.from('exchange_rates').select('currency,rate')

  if (error || !data?.length) return FALLBACK_RATES

  cachedRates = Object.fromEntries((data as ExchangeRate[]).map((r) => [r.currency, r.rate]))
  cacheTime = now
  return cachedRates
}

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


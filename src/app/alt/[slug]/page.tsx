import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const revalidate = 86400

type Props = { params: Promise<{ slug: string }> }

async function getToolName(slug: string): Promise<string> {
  const { data } = await supabase.from('tools').select('name_ar').eq('slug', slug).single()
  return (data as { name_ar: string } | null)?.name_ar ?? slug
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = await getToolName(slug)
  return {
    title: `بدائل ${name} المجانية`,
    description: `أفضل البدائل المجانية والمدفوعة لـ${name} — مقارنة شاملة`,
  }
}

async function getAlternatives(slug: string): Promise<{ original: Tool; alts: Tool[] } | null> {
  const { data: originalData } = await supabase
    .from('tools')
    .select('*')
    .eq('slug', slug)
    .single()

  if (!originalData) return null
  const original = originalData as Tool

  const { data: altsData, error: altsError } = await supabase
    .from('tools')
    .select('*')
    .eq('category', original.category)
    .neq('slug', slug)
    .order('is_free_tier', { ascending: false })
    .limit(6)

  if (altsError) console.error('alts query failed:', altsError.message)
  return { original, alts: (altsData as Tool[]) ?? [] }
}

function altCountLabel(n: number): string {
  if (n === 1) return 'بديل واحد'
  if (n === 2) return 'بديلان'
  if (n >= 3 && n <= 10) return `${n} بدائل`
  return `${n} بديلاً`
}

function buildSummary(alts: Tool[]): string {
  const fullyFree = alts.filter((t) => t.is_free_tier && !t.price_from).length
  const freeTier = alts.filter((t) => t.is_free_tier && t.price_from).length
  const paidCount = alts.filter((t) => !t.is_free_tier).length
  const parts: string[] = []
  if (fullyFree > 0) parts.push(`${fullyFree} مجاني بالكامل`)
  if (freeTier > 0) parts.push(`${freeTier} فيه خطة مجانية`)
  if (paidCount > 0) parts.push(`${paidCount} ${paidCount === 1 ? 'مدفوع' : 'مدفوعة'}`)
  return parts.join(' · ')
}

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params
  const result = await getAlternatives(slug)
  if (!result) notFound()
  const { original, alts } = result

  return (
    <div style={{ padding: '40px 0' }}>
      <div style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 11,
        color: 'var(--accent)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <span style={{ display: 'inline-block', width: 20, height: 1, background: 'var(--accent)' }} />
        بدائل مجانية
      </div>

      <h1 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 36,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 8,
        lineHeight: 1.2,
      }}>
        بدائل <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>{original.name_ar}</em>
      </h1>

      <p style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        color: 'var(--text-muted)',
        marginBottom: 40,
      }}>
        {altCountLabel(alts.length)} — {buildSummary(alts)}
      </p>

      {alts.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '64px 32px',
          border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)',
          fontFamily: "'Cairo', sans-serif", color: 'var(--text-muted)',
        }}>
          لا توجد بدائل متاحة حالياً
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {alts.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="card-hover"
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 20,
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px 24px',
                textDecoration: 'none',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: "'Cairo', sans-serif",
                    fontSize: 17,
                    fontWeight: 700,
                    color: 'var(--text)',
                  }}>
                    {tool.name_ar}
                  </span>
                  <span style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 12,
                    color: 'var(--text-muted)',
                  }}>
                    {tool.name}
                  </span>
                  {tool.is_free_tier && (
                    <span style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '2px 10px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'rgba(76,175,125,0.12)',
                      color: 'var(--success)',
                      border: '1px solid rgba(76,175,125,0.3)',
                    }}>
                      {tool.price_from ? 'فيه خطة مجانية' : 'مجاني بالكامل'}
                    </span>
                  )}
                </div>
                <p style={{
                  fontFamily: "'Cairo', sans-serif",
                  fontSize: 14,
                  color: 'var(--text-muted)',
                  lineHeight: 1.65,
                  margin: 0,
                }}>
                  {tool.description_ar}
                </p>
              </div>
              <div style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 14,
                fontWeight: 500,
                flexShrink: 0,
                fontVariantNumeric: 'tabular-nums',
                paddingTop: 2,
                color: tool.is_free_tier ? 'var(--success)' : 'var(--accent)',
              }}>
                {tool.is_free_tier && !tool.price_from
                  ? 'مجاني'
                  : tool.price_from
                  ? `$${tool.price_from}/شهر`
                  : '—'}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

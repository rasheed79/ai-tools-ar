import type { Metadata } from 'next'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Tool } from '@/lib/database.types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'مقارنة أدوات الذكاء الاصطناعي',
  description: 'قارن بين أفضل أدوات AI — الأسعار، المميزات، والأنسب لاحتياجاتك',
}

async function getTopTools(): Promise<Tool[]> {
  const { data } = await supabase.from('tools').select('*').order('name').limit(10)
  return (data as Tool[]) ?? []
}

export default async function CompareLandingPage() {
  const tools = await getTopTools()

  const pairs: [Tool, Tool][] = []
  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      pairs.push([tools[i], tools[j]])
    }
  }

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
        مقارنات الأدوات
      </div>

      <h1 style={{
        fontFamily: "'Cairo', sans-serif",
        fontSize: 36,
        fontWeight: 700,
        color: 'var(--text)',
        marginBottom: 8,
        lineHeight: 1.2,
      }}>
        قارن بين <em style={{ fontStyle: 'normal', color: 'var(--accent)' }}>أدوات الذكاء الاصطناعي</em>
      </h1>

      <p style={{
        fontFamily: "'Geist Mono', monospace",
        fontSize: 13,
        color: 'var(--text-muted)',
        marginBottom: 40,
      }}>
        {pairs.length} مقارنة متاحة
      </p>

      {pairs.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {pairs.map(([a, b]) => (
            <Link
              key={`${a.slug}-vs-${b.slug}`}
              href={`/compare/${a.slug}-vs-${b.slug}`}
              className="card-hover"
              style={{
                display: 'block',
                textDecoration: 'none',
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                transition: 'border-color 0.2s',
                cursor: 'pointer',
              }}
            >
              <div style={{
                fontFamily: "'Cairo', sans-serif",
                fontSize: 14,
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 4,
              }}>
                {a.name_ar} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>مقابل</span> {b.name_ar}
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 11,
                color: 'var(--text-muted)',
              }}>
                {a.name} vs {b.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

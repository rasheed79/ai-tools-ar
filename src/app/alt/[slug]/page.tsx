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

export default async function AlternativesPage({ params }: Props) {
  const { slug } = await params
  const result = await getAlternatives(slug)
  if (!result) notFound()
  const { original, alts } = result

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">
        بدائل {original.name_ar}
      </h1>
      <p className="text-gray-500 mb-8">
        {altCountLabel(alts.length)} — مرتبة من الأفضل
      </p>

      {alts.length === 0 ? (
        <p className="text-gray-500">لا توجد بدائل متاحة حالياً.</p>
      ) : (
        <div className="space-y-4">
          {alts.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="flex items-start gap-4 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-semibold">{tool.name_ar}</h2>
                  {tool.is_free_tier && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      مجاني
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm">{tool.description_ar}</p>
              </div>
              <div className="text-left shrink-0">
                {tool.is_free_tier ? (
                  <span className="text-green-600 font-medium">مجاني</span>
                ) : tool.price_from ? (
                  <span className="text-blue-600 font-medium">${tool.price_from}/شهر</span>
                ) : (
                  <span className="text-green-600 font-medium">مجاني</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

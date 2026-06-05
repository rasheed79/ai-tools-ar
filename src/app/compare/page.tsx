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

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">مقارنة أدوات AI</h1>
      <p className="text-gray-600 mb-8">اختر أداتين للمقارنة:</p>

      {tools.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tools.map((a) =>
            tools
              .filter((b) => b.slug !== a.slug)
              .slice(0, 2)
              .map((b) => (
                <Link
                  key={`${a.slug}-vs-${b.slug}`}
                  href={`/compare/${a.slug}-vs-${b.slug}`}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md text-sm"
                >
                  {a.name_ar} مقابل {b.name_ar}
                </Link>
              ))
          )}
        </div>
      )}
    </div>
  )
}

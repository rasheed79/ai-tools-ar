import { createClient } from '@supabase/supabase-js'
import type { Database, Tool } from '../src/lib/database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

const supabase = createClient<Database>(supabaseUrl, supabaseKey)

type Issue = {
  slug: string
  field: string
  severity: 'error' | 'warning'
  problem: string
  fix: string
}

type Fix = {
  slug: string
  field: string
  value: string
}

// ---- Rules ----

const ARABIC_TYPOS: [RegExp, string][] = [
  [/الأصطناعي/g, 'الاصطناعي'],
  [/الأصطناعى/g, 'الاصطناعي'],
  [/اصطناعى/g, 'اصطناعي'],
  [/ذكاء اصطناعى/g, 'ذكاء اصطناعي'],
  [/تلقائى/g, 'تلقائي'],
  [/مجانى/g, 'مجاني'],
  [/بالكلى/g, 'بالكلي'],
  [/عالى/g, 'عالي'],
  [/اساسى/g, 'أساسي'],
  [/رئيسى/g, 'رئيسي'],
  [/ثانوى/g, 'ثانوي'],
  [/الاولى/g, 'الأولى'],
  [/اولا/g, 'أولاً'],
  [/ايضا/g, 'أيضاً'],
  [/دائما/g, 'دائماً'],
  [/احيانا/g, 'أحياناً'],
  [/الذكاء الاصطناعى/g, 'الذكاء الاصطناعي'],
]

const VALID_CATEGORIES = ['writing', 'image', 'code', 'video', 'audio']
const VALID_PRICING = ['مجاني', 'مدفوع', 'freemium']

const NAME_AR_CONSISTENCY: Record<string, string> = {
  'chatgpt': 'تشات جي بي تي',
  'gemini': 'جيميني',
  'claude': 'كلود',
  'midjourney': 'ميدجورني',
  'dalle-3': 'دالي 3',
  'perplexity': 'بيربلكسيتي',
  'github-copilot': 'جيت هاب كوبايلوت',
  'elevenlabs': 'إيليفن لابس',
  'runway': 'رانواي',
  'notion-ai': 'نوشن AI',
}

// ---- Audit functions ----

function auditTypos(tool: Tool): Issue[] {
  const issues: Issue[] = []
  const fields: (keyof Tool)[] = ['description_ar', 'name_ar']

  for (const field of fields) {
    const val = tool[field] as string
    if (!val) continue
    for (const [pattern, correct] of ARABIC_TYPOS) {
      if (pattern.test(val)) {
        issues.push({
          slug: tool.slug,
          field,
          severity: 'error',
          problem: `خطأ إملائي: ${pattern.source} → ${correct}`,
          fix: val.replace(new RegExp(pattern.source, 'g'), correct),
        })
      }
      pattern.lastIndex = 0
    }
  }

  if (tool.features?.ar) {
    for (const [i, feat] of tool.features.ar.entries()) {
      for (const [pattern, correct] of ARABIC_TYPOS) {
        if (pattern.test(feat)) {
          issues.push({
            slug: tool.slug,
            field: `features.ar[${i}]`,
            severity: 'error',
            problem: `خطأ إملائي في الميزات: ${pattern.source}`,
            fix: feat.replace(new RegExp(pattern.source, 'g'), correct),
          })
        }
        pattern.lastIndex = 0
      }
    }
  }

  return issues
}

function auditConsistency(tool: Tool): Issue[] {
  const issues: Issue[] = []

  if (!VALID_CATEGORIES.includes(tool.category)) {
    issues.push({
      slug: tool.slug,
      field: 'category',
      severity: 'error',
      problem: `تصنيف غير صحيح: "${tool.category}"`,
      fix: `يجب أن يكون أحد: ${VALID_CATEGORIES.join(' | ')}`,
    })
  }

  if (!VALID_PRICING.includes(tool.pricing)) {
    issues.push({
      slug: tool.slug,
      field: 'pricing',
      severity: 'error',
      problem: `نوع سعر غير صحيح: "${tool.pricing}"`,
      fix: `يجب أن يكون أحد: ${VALID_PRICING.join(' | ')}`,
    })
  }

  if (tool.pricing === 'مجاني' && tool.is_free_tier !== true) {
    issues.push({
      slug: tool.slug,
      field: 'is_free_tier',
      severity: 'warning',
      problem: 'pricing=مجاني لكن is_free_tier=false',
      fix: 'true',
    })
  }

  if (tool.pricing === 'مدفوع' && tool.is_free_tier === true) {
    issues.push({
      slug: tool.slug,
      field: 'is_free_tier',
      severity: 'warning',
      problem: 'pricing=مدفوع لكن is_free_tier=true — تعارض',
      fix: 'false',
    })
  }

  const expectedName = NAME_AR_CONSISTENCY[tool.slug]
  if (expectedName && tool.name_ar !== expectedName) {
    issues.push({
      slug: tool.slug,
      field: 'name_ar',
      severity: 'warning',
      problem: `اسم عربي غير متسق: "${tool.name_ar}" (المتوقع: "${expectedName}")`,
      fix: expectedName,
    })
  }

  return issues
}

function auditFormat(tool: Tool): Issue[] {
  const issues: Issue[] = []

  if (!tool.description_ar || tool.description_ar.trim().length < 20) {
    issues.push({
      slug: tool.slug,
      field: 'description_ar',
      severity: 'warning',
      problem: 'وصف قصير جداً (أقل من 20 حرف)',
      fix: 'أضف وصفاً أطول',
    })
  }

  if (!tool.official_url || !tool.official_url.startsWith('https://')) {
    issues.push({
      slug: tool.slug,
      field: 'official_url',
      severity: 'error',
      problem: `رابط غير صحيح: "${tool.official_url}"`,
      fix: 'يجب أن يبدأ بـ https://',
    })
  }

  if (!tool.use_cases || tool.use_cases.length === 0) {
    issues.push({
      slug: tool.slug,
      field: 'use_cases',
      severity: 'warning',
      problem: 'لا توجد حالات استخدام',
      fix: 'أضف على الأقل حالة استخدام واحدة',
    })
  }

  if (!tool.features?.ar || tool.features.ar.length === 0) {
    issues.push({
      slug: tool.slug,
      field: 'features.ar',
      severity: 'warning',
      problem: 'لا توجد ميزات عربية',
      fix: 'أضف على الأقل ميزة واحدة',
    })
  }

  return issues
}

function applyTypoFixes(tool: Tool): Fix[] {
  const fixes: Fix[] = []

  const fields: (keyof Tool)[] = ['description_ar', 'name_ar']
  for (const field of fields) {
    let val = tool[field] as string
    if (!val) continue
    let changed = false
    for (const [pattern, correct] of ARABIC_TYPOS) {
      const newVal = val.replace(new RegExp(pattern.source, 'g'), correct)
      if (newVal !== val) { val = newVal; changed = true }
    }
    if (changed) fixes.push({ slug: tool.slug, field: field as string, value: val })
  }

  return fixes
}

function generateSQL(tools: Tool[], allIssues: Map<string, Issue[]>): string {
  const lines: string[] = [
    '-- ================================================',
    '-- تقرير التصحيح التلقائي — audit-content.ts',
    `-- تاريخ: ${new Date().toISOString()}`,
    '-- ================================================',
    '',
    '-- تشغيل داخل Supabase SQL Editor',
    '',
  ]

  for (const tool of tools) {
    const issues = allIssues.get(tool.slug) || []
    if (issues.length === 0) continue

    lines.push(`-- ── ${tool.name} (${tool.slug}) ──────────────`)

    const autoFixes = applyTypoFixes(tool)

    for (const fix of autoFixes) {
      lines.push(`UPDATE tools SET ${fix.field} = '${fix.value.replace(/'/g, "''")}' WHERE slug = '${tool.slug}'; -- إملاء`)
    }

    for (const issue of issues) {
      if (issue.severity === 'error' && issue.field === 'is_free_tier') {
        lines.push(`UPDATE tools SET is_free_tier = ${issue.fix} WHERE slug = '${tool.slug}'; -- تعارض pricing`)
      }
      if (issue.severity === 'warning' && issue.field === 'name_ar' && NAME_AR_CONSISTENCY[tool.slug]) {
        lines.push(`-- UPDATE tools SET name_ar = '${issue.fix}' WHERE slug = '${tool.slug}'; -- راجع يدوياً`)
      }
    }

    lines.push('')
  }

  return lines.join('\n')
}

// ---- Main ----

async function main() {
  console.log('🔍 جاري فحص المحتوى...\n')

  const { data: tools, error } = await supabase
    .from('tools')
    .select('*')
    .order('name') as { data: Tool[] | null; error: unknown }

  if (error) {
    console.error('خطأ في الاتصال بـ Supabase:', error.message)
    process.exit(1)
  }

  if (!tools || tools.length === 0) {
    console.log('لا توجد أدوات في قاعدة البيانات.')
    return
  }

  console.log(`فحص ${tools.length} أداة...\n`)

  const allIssues = new Map<string, Issue[]>()
  let totalErrors = 0
  let totalWarnings = 0

  for (const tool of tools) {
    const issues = [
      ...auditTypos(tool),
      ...auditConsistency(tool),
      ...auditFormat(tool),
    ]

    if (issues.length > 0) {
      allIssues.set(tool.slug, issues)
      for (const i of issues) {
        if (i.severity === 'error') totalErrors++
        else totalWarnings++
      }
    }
  }

  // ---- Print report ----
  if (allIssues.size === 0) {
    console.log('✅ لا توجد أخطاء. المحتوى سليم.')
    return
  }

  console.log('═══════════════════════════════════════')
  console.log('            تقرير الفحص')
  console.log('═══════════════════════════════════════\n')

  for (const [slug, issues] of allIssues) {
    const tool = tools.find(t => t.slug === slug)!
    console.log(`📦 ${tool.name} (${slug})`)
    for (const issue of issues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️'
      console.log(`   ${icon} [${issue.field}] ${issue.problem}`)
      if (issue.field !== 'description_ar' && issue.field !== 'use_cases' && issue.field !== 'features.ar') {
        console.log(`      → ${issue.fix}`)
      }
    }
    console.log()
  }

  console.log('═══════════════════════════════════════')
  console.log(`الملخص: ${totalErrors} خطأ، ${totalWarnings} تحذير`)
  console.log(`الأدوات المتأثرة: ${allIssues.size} / ${tools.length}`)
  console.log('═══════════════════════════════════════\n')

  const sql = generateSQL(tools, allIssues)
  const fs = await import('fs')
  const outPath = 'scripts/fixes.sql'
  fs.writeFileSync(outPath, sql, 'utf8')
  console.log(`✅ ملف SQL جاهز: ${outPath}`)
  console.log('   افتحه في Supabase SQL Editor ونفّذه.')
}

main()

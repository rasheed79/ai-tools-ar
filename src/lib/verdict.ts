import type { Tool } from './database.types'

function cheaper(a: Tool, b: Tool): Tool | null {
  if (a.is_free_tier && !b.is_free_tier) return a
  if (b.is_free_tier && !a.is_free_tier) return b
  if (a.price_from == null || b.price_from == null) return null
  if (a.price_from === b.price_from) return null
  return a.price_from < b.price_from ? a : b
}

export function buildCompareVerdict(a: Tool, b: Tool): string {
  const cheap = cheaper(a, b)
  const featCountA = a.features?.ar?.length ?? 0
  const featCountB = b.features?.ar?.length ?? 0
  const moreFeatures = featCountA !== featCountB ? (featCountA > featCountB ? a : b) : null

  const parts: string[] = []

  if (cheap) {
    parts.push(`${cheap.name_ar} أرخص من ${cheap === a ? b.name_ar : a.name_ar}`)
  } else if (a.is_free_tier && b.is_free_tier) {
    parts.push(`${a.name_ar} و${b.name_ar} كلاهما يقدم طبقة مجانية`)
  }

  if (moreFeatures) {
    parts.push(`${moreFeatures.name_ar} يغطي مميزات أوسع حسب وصف الأداة الرسمي`)
  }

  if (a.category === b.category) {
    parts.push(`كلاهما يخدم نفس المجال (${a.category === 'writing' ? 'الكتابة' : a.category === 'image' ? 'توليد الصور' : a.category === 'video' ? 'الفيديو' : a.category === 'audio' ? 'الصوت' : 'البرمجة'})، فالاختيار يعتمد على ميزانيتك وأي ميزة محددة تحتاجها أكثر`)
  }

  if (parts.length === 0) {
    parts.push(`${a.name_ar} و${b.name_ar} أداتان مختلفتان في الاستخدام، راجع الوصف والمميزات أدناه قبل الاختيار`)
  }

  return parts.join('. ') + '.'
}

export function buildBestIntro(useCase: string, tools: Tool[]): string {
  const free = tools.find((t) => t.is_free_tier)
  const cheapestPaid = tools
    .filter((t) => !t.is_free_tier && t.price_from != null)
    .sort((a, b) => (a.price_from ?? 0) - (b.price_from ?? 0))[0]

  const parts: string[] = [`اخترنا ${tools.length} من أقوى أدوات الذكاء الاصطناعي المناسبة لـ${useCase}، بترتيب يضع الخيارات المجانية أولاً.`]

  if (free) {
    parts.push(`لو تبي تبدأ بدون تكلفة، ${free.name_ar} يقدم طبقة مجانية فعلية تكفي للتجربة الجادة.`)
  }
  if (cheapestPaid && cheapestPaid !== free) {
    parts.push(`أرخص خيار مدفوع بالقائمة هو ${cheapestPaid.name_ar} بحوالي $${cheapestPaid.price_from} شهرياً.`)
  }

  return parts.join(' ')
}

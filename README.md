# أدوات AI بالعربية

دليل أدوات الذكاء الاصطناعي بالعربية — أسعار بعملتك المحلية، مقارنات، بدائل مجانية.

## متطلبات

- Node.js 18+
- حساب [Supabase](https://supabase.com) (free tier)
- حساب [Cloudflare](https://cloudflare.com) (للنشر)

## تشغيل محلي

```bash
# 1. نسخ متغيرات البيئة
cp .env.local.example .env.local
# عدّل .env.local وأضف بيانات Supabase

# 2. تثبيت المكتبات
npm install

# 3. إنشاء قاعدة البيانات
# افتح Supabase SQL Editor وشغّل: supabase/schema.sql ثم supabase/seed.sql

# 4. تشغيل خادم التطوير
npm run dev
```

الموقع يعمل على: http://localhost:3000

## النشر على Cloudflare

```bash
npm run deploy
```

تأكد من إضافة متغيرات البيئة في Cloudflare Workers dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_SITE_URL` (رابط الموقع الفعلي)

## هيكل المشروع

```
src/app/
  page.tsx              # الصفحة الرئيسية
  tools/[slug]/         # صفحة الأداة
  compare/[pair]/       # مقارنة أداتين
  alt/[slug]/           # بدائل الأداة
  best/[useCase]/       # أفضل أدوات لحالة استخدام
src/lib/
  supabase.ts           # Supabase client
  currency.ts           # تحويل العملات
  seo.ts                # JSON-LD و slugs
```

## الخطوات التالية

انظر [TODOS.md](TODOS.md) لقائمة المهام المخططة.

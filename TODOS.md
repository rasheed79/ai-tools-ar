# TODOS — موقع AI Tools بالعربية

## P1 — يمنع الشحن

*(لا يوجد — جميع عناصر P1 مكتملة)*

---

## P0 — الخطوات الفورية (دومين + إطلاق)

### D1: اشتري daleel-adawat.com
**ما:** شراء الدومين على Cloudflare Registrar
**التكلفة:** $10.46/سنة ثابت (at-cost, بدون markup)
**الخطوات:** domains.cloudflare.com → ابحث عن daleel-adawat.com → Purchase

### D2: اربط الدومين بـ Cloudflare Pages
**ما:** ربط daleel-adawat.com بالمشروع الحالي
**الخطوات:** Pages dashboard → Custom Domains → أضف daleel-adawat.com → SSL تلقائي
**ملاحظة:** أضف www كـ CNAME أيضاً

### D3: حدّث NEXT_PUBLIC_SITE_URL
**ما:** تغيير env var للدومين الجديد
**الملف:** `.env.local` → `NEXT_PUBLIC_SITE_URL=https://daleel-adawat.com`
**بعدها:** redeploy واحد

### D4: أضف الموقع لـ Google Search Console
**ما:** تسجيل الدومين الجديد + إرسال sitemap
**الخطوات:** search.google.com/search-console → Add property → Domain → أدخل daleel-adawat.com → أرسل sitemap.xml
**أهمية:** كل يوم تأخير = trust يضيع مع Google

### D5: افتح Telegram channel + Twitter/X
**ما:** قنوات نشر باسم الموقع
**Telegram:** @daleelAdawat أو اسم مشابه
**Twitter:** @daleel_adawat أو مشابه
**المحتوى:** "أداة AI اليوم" يومياً

---

## P1.5 — محتوى + AdSense

### C1: اكتب 20 صفحة أداة (بمساعدة Claude + مراجعة بشرية)
**ما:** وصول عدد صفحات كافٍ للتقدم لـ AdSense
**الإجراء:** Claude يكتب الصفحة → أنت تراجع السعر والميزات → تنشر
**المعدل المستهدف:** صفحة/يوم أو صفحتين
**يعتمد على:** D1-D3 مكتملة

### C2: تقدّم لـ Google AdSense
**متى:** بعد 20+ صفحة أصيلة + دومين مخصص
**الرابط:** google.com/adsense
**يعتمد على:** C1

### C3: بعد 100 صفحة — ابنِ أيجنت أتمتة المحتوى
**ما:** Claude API + GitHub Actions + PR workflow للنشر شبه-تلقائي
**الإجراء:** `/plan` لبناء spec كاملة عند الوصول لـ 100 صفحة
**يعتمد على:** C1 + AdSense approval

### C4: بعد AdSense approval — أتمتة نشر Twitter/Telegram
**ما:** نشر تلقائي عند كل صفحة جديدة على Twitter + Telegram
**التقنية:** Twitter API v2 + Telegram Bot API (مجانيان)
**يعتمد على:** C2 + C3

---

## P2 — يجب أن يصل نفس البرنامج

### T2: UGC تقييمات مستخدمين عرب
**ما:** نموذج تقييم بسيط في كل صفحة أداة + moderation بسيطة
**لماذا:** E-E-A-T signal لـ Google + محتوى جديد مجاني
**الإيجابيات:** Google تثق بالموقع أكثر، محتوى يتجدد تلقائياً
**السلبيات:** يحتاج moderation لمنع spam
**السياق:** لا تضفه قبل AdSense approval. عند الإضافة: Supabase table جديد للتقييمات + approval workflow بسيط في Supabase dashboard.
**الجهد:** M (بشري: يومان / CC: 30 دقيقة)
**الأولوية:** P2
**يعتمد على:** AdSense approval + traffic حقيقي

### T3: استراتيجية crawl budget وbacklinks
**ما:** نشر في مجتمعات عربية + طلب backlinks من مدونات تقنية عربية
**لماذا:** بدون backlinks، Google تُفهرس ببطء (10-30 صفحة/شهر بدل 30-50)
**الإيجابيات:** تسريع الفهرسة في الشهر الأول
**السلبيات:** يحتاج وقتاً يدوياً
**السياق:** المجتمعات المستهدفة: Twitter/X #ذكاء_اصطناعي، Reddit r/artificial بالعربي، مجموعات Facebook للمطورين العرب
**الجهد:** S (بشري: ساعات/أسبوع / CC: لا ينطبق)
**الأولوية:** P2
**يعتمد على:** أول deploy ناجح

---

### T7: Cloudflare KV لأسعار العملات
**ما:** استبدال in-memory cache (معطل في Workers) بـ Cloudflare KV
**لماذا:** cachedRates module-level var = dead code في Workers isolate environment
**السياق:** FALLBACK_RATES تكفي Phase 1. KV مطلوب عند تفعيل getRates() فعلاً.
**الجهد:** M (بشري: يوم / CC: 30 دقيقة)
**الأولوية:** P2 (بعد Phase 1 content)
**يعتمد على:** Cloudflare Workers KV binding setup

### T8: pagination في /tools page
**ما:** إضافة pagination لصفحة جميع الأدوات (حالياً: unbounded query)
**لماذا:** عند 200+ أداة، SELECT * بدون LIMIT يُرجع MB من البيانات في request واحد
**الجهد:** M (بشري: 3 ساعات / CC: 15 دقيقة)
**الأولوية:** P2 (عند >100 أداة)
**يعتمد على:** وصول 100+ أداة

---

## P3 — تتبع لاحق

### T4: API عام للبيانات للمطورين العرب
**ما:** Supabase REST API عام (read-only) لبيانات الأدوات
**لماذا:** يجعل الموقع منصة لمطورين عرب يبنون عليها
**الإيجابيات:** platform potential، backlinks تلقائية من مطورين
**السلبيات:** يحتاج rate limiting وتوثيق
**السياق:** Phase 3 فقط. Supabase يدعم public read API مجاناً.
**الجهد:** M (بشري: يوم / CC: 20 دقيقة)
**الأولوية:** P3
**يعتمد على:** 500+ أداة في قاعدة البيانات

### T5: مقارنة بالأسعار التاريخية
**ما:** تخزين أسعار الأدوات تاريخياً وعرض "رخص / غلّى مقارنة بالشهر الماضي"
**لماذا:** محتوى فريد لا يوجد عند أي منافس عربي
**الإيجابيات:** SEO signal قوي، engagement أعلى
**السلبيات:** يحتاج price_history table في Supabase
**الجهد:** M (بشري: يومان / CC: 30 دقيقة)
**الأولوية:** P3
**يعتمد على:** 3+ أشهر من بيانات الأسعار

### T6: ISR بدل SSG عند 5000+ صفحة
**ما:** الانتقال من SSG الكامل إلى ISR (on-demand revalidation)
**لماذا:** SSG بـ 5000+ صفحة = build time 30+ دقيقة، يحتاج حل
**السياق:** Cloudflare Pages لا يدعم ISR بشكل كامل مع Next.js. عند هذه النقطة قد يحتاج الانتقال لـ Vercel Pro أو Railway.
**الجهد:** L (بشري: أسبوع / CC: ساعتان)
**الأولوية:** P3
**يعتمد على:** وصول 5000+ صفحة

---

## Completed

### T1: Newsletter API + Form — مكتمل v0.0.0.0 (2026-06-05)
`/api/subscribe` edge route بـ Resend HTTP API. error logging صريح. `NewsletterForm` client component مع loading/success/error states. وُصل بالصفحة الرئيسية.

### P1 Autoplan fixes — مكتمل v0.0.0.0 (2026-06-05)
XSS في JSON-LD، compare undefined slug، force-dynamic → revalidate، getRates() dead code، env guard، hreflang، broken links، unbounded query.

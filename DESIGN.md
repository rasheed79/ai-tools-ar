# Design System — أدوات AI بالعربية

## Product Context
- **What this is:** دليل برمجي لأدوات الذكاء الاصطناعي باللغة العربية — programmatic SEO
- **Who it's for:** المستخدم العربي في منطقة MENA يريد مقارنة أدوات AI بلغته وبعملته
- **Space/industry:** AI tools directory — مقابل Futurepedia, TAAFT, Toolify
- **Project type:** Web app / SEO directory — بطاقات أدوات، صفحات مقارنة، صفحات بدائل

## Memorable Thing
> "هذا **المرجع** العربي لأدوات الذكاء الاصطناعي"

كل قرار تصميمي يخدم هذه الجملة. الموقع يبدو كمرجع لا كـ startup.

## Aesthetic Direction
- **Direction:** Industrial / Authoritative
- **Decoration level:** minimal — الطباعة والتباين يحملان كل العبء
- **Mood:** سلطة بصرية فورية. جاد، مقروء، موثوق. مثل قاموس تقني، لا مثل تطبيق SaaS.
- **Key differentiator:** كل منافس (Futurepedia, TAAFT, G2) يستخدم أبيض+أزرق+sans-serif. نلتقي بالمعكوس: داكن+ذهبي+serif للـ hero.

## Typography

### الخطوط

| الدور | الخط | الوزن | الاستخدام |
|-------|------|-------|-----------|
| Display / Hero (EN) | Fraunces | 700 | عناوين كبيرة إنجليزية |
| Hero / Headings (AR) | Cairo | 700 | عناوين عربية كبيرة |
| Body / UI | Cairo | 400, 600 | نصوص عربية، واجهة |
| Labels / Nav | Plus Jakarta Sans | 400, 500, 600 | عناصر الواجهة الإنجليزية، labels |
| Data / Prices | Geist Mono (tabular-nums) | 400, 500 | أسعار، أرقام، بيانات مقارنة |

### التحميل

```html
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;1,9..144,300&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Geist+Mono:wght@400;500&family=Cairo:wght@300;400;600;700&display=swap" rel="stylesheet">
```

### المقياس الطباعي

| المستوى | الحجم | الوزن | الاستخدام |
|---------|-------|-------|-----------|
| hero-ar | 52px | 700 Cairo | عنوان الصفحة الرئيسية بالعربية |
| hero-en | 56px | 700 Fraunces | عناوين إنجليزية كبيرة |
| h1 | 36px | 700 Cairo | عناوين الصفحات |
| h2 | 28px | 600 Cairo | عناوين الأقسام |
| h3 | 20px | 600 Cairo | عناوين الفقرات |
| body-lg | 17px | 400 Cairo | نص الـ hero subtitle |
| body | 15px | 400 Cairo | نص عادي |
| body-sm | 13px | 400 Cairo | وصف الكروت، labels |
| label | 13px | 500 Plus Jakarta Sans | UI labels, nav |
| caption | 11px | 400 Plus Jakarta Sans | meta، breadcrumbs |
| mono | 14px | 400 Geist Mono | أسعار، أرقام |
| mono-sm | 11-12px | 400 Geist Mono | hex colors، timestamps |

## Color System

### المتغيرات (CSS Custom Properties)

```css
:root {
  /* Backgrounds */
  --bg:           #0F1117;  /* أسود دافئ — الخلفية الأساسية */
  --surface:      #1A1D2E;  /* كحلي داكن — الكروت والـ header */
  --surface-2:    #222640;  /* أفتح قليلاً — hover states، inputs */

  /* Borders */
  --border:       #2D3154;  /* بوردر الكروت والفواصل */

  /* Text */
  --text:         #F2F0EB;  /* أبيض دافئ — النص الأساسي */
  --text-muted:   #8B8FA8;  /* نص ثانوي، وصف، labels */

  /* Accent — الذهبي */
  --accent:       #E8A040;  /* الـ CTA، الأسعار، التمييز، hover borders */
  --accent-dim:   rgba(232, 160, 64, 0.12); /* خلفية الـ accent badges */

  /* Semantic */
  --success:      #4CAF7D;  /* مجاني، تأكيد */
  --success-dim:  rgba(76, 175, 125, 0.12);
  --error:        #E85B4A;  /* خطأ، غير متاح */
  --error-dim:    rgba(232, 91, 74, 0.12);
  --warning:      #E8A040;  /* تحذير — نفس الـ accent */
  --warning-dim:  rgba(232, 160, 64, 0.12);
}
```

### Light Mode (toggle — ليس الافتراضي)

```css
.light-mode {
  --bg:           #F6F4EF;
  --surface:      #FFFFFF;
  --surface-2:    #EDEAE3;
  --border:       #D8D4C9;
  --text:         #18161A;
  --text-muted:   #6B6872;
  --accent:       #C47D10;
  --accent-dim:   rgba(196, 125, 16, 0.10);
  --success:      #2E8A58;
  --error:        #C93D2E;
}
```

## Spacing

- **Base unit:** 4px
- **Density:** comfortable
- **RTL note:** استخدم `margin-inline-start` / `padding-inline-end` بدل left/right

```
2xs  →  2px
xs   →  4px
sm   →  8px
md   →  16px
lg   →  24px
xl   →  32px
2xl  →  48px
3xl  →  64px
4xl  →  96px
```

## Layout

- **Approach:** Grid-disciplined
- **Grid:** 12 columns، gap: 16-24px
- **Max content width:** 1280px
- **Padding:** 24px (mobile: 16px)
- **Border radius:**
  - `--radius-sm: 4px` — buttons, badges, inputs
  - `--radius-md: 8px` — cards, modals
  - `--radius-lg: 12px` — containers كبيرة، panels

### Grid الكروت

| الشاشة | الأعمدة |
|--------|---------|
| Mobile (< 640px) | 1 عمود |
| Tablet (640–1024px) | 2 أعمدة |
| Desktop (> 1024px) | 3 أعمدة |

## Motion

- **Approach:** minimal-functional
- **Easing:** ease-out (دخول) · ease-in (خروج) · ease-in-out (حركة)
- **Duration:**
  - micro: 50ms — hover borders, color change
  - short: 150ms — card hover, button states
  - medium: 250ms — modal open
- لا scroll animations، لا bouncing effects

## RTL Rules

1. `html` دائماً `lang="ar" dir="rtl"`
2. استخدم logical properties: `margin-inline-start` لا `margin-left`
3. `[dir="rtl"] .icon-directional { transform: scaleX(-1); }` للأيقونات الاتجاهية
4. أسماء الأدوات الإنجليزية: `dir="ltr"` inline
5. الأسعار: `font-variant-numeric: tabular-nums` دائماً

## Badges System

```
badge-free     →  success-dim bg · success color · "مجاني"
badge-paid     →  accent-dim bg · accent color · "$XX/شهر"
badge-freemium →  surface-2 bg · text-muted color · "Freemium"
badge-category →  surface-2 bg · text-muted color · اسم التصنيف
```

## Decisions Log

| التاريخ | القرار | السبب |
|---------|--------|-------|
| 2026-06-06 | Dark mode كافتراضي | كل المنافسين فاتح. السوق العربي يتصفح ليلاً. ذهبي على داكن = سلطة |
| 2026-06-06 | Accent ذهبي (#E8A040) بدل أزرق | لا أحد في AI tools category يفعل هذا. يعطي "قيمة" لا "تقنية باردة" |
| 2026-06-06 | Fraunces serif للـ hero | كل directories تستخدم sans-serif. الـ serif يقول "مرجع" مثل موسوعة |
| 2026-06-06 | Cairo للعربية (لا Noto Naskh) | أوسع انتشاراً في MENA، أسرع تحميلاً، يدعم كل الأوزان |
| 2026-06-06 | Border-radius صغير (4-8px) | لا bubble-radius. المرجع يبدو حاداً ودقيقاً |
| 2026-06-06 | Plus Jakarta Sans للـ labels | لا Inter لا Roboto. مقروء، حديث، غير مبتذل |
| 2026-06-06 | Geist Mono للأسعار | tabular-nums للمقارنة. Mono = دقة وثقة في الأرقام |

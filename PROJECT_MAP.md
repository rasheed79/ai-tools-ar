## Stack
- **Framework:** Next.js 16 (App Router, TypeScript)
- **Deploy:** Cloudflare Pages via `@opennextjs/cloudflare` + Wrangler 4
- **DB:** Supabase (PostgreSQL) — tools, exchange_rates, comparisons tables
- **Styling:** Tailwind CSS v3
- **Email:** Resend HTTP API (newsletter subscribe)
- **Testing:** Jest + ts-jest

## Flow
- Browser → Cloudflare Pages (Workers) → Next.js App Router
- SSG pages: `/tools/[slug]`, `/compare/[pair]`, `/best/[useCase]`, `/alt/[slug]` — `revalidate: 3600`
- Homepage: server component fetches latest 9 tools from Supabase at build/revalidate
- `/api/subscribe` → Resend HTTP API → newsletter list
- Currency conversion: `src/lib/currency.ts` with `FALLBACK_RATES` (KV not yet wired)
- SEO: `src/lib/seo.ts`, robots.ts, sitemap.ts

## Decisions
- RTL Arabic-first UI (`<html lang="ar" dir="rtl">`)
- `revalidate: 3600` (ISR-like) over `force-dynamic` — Workers-compatible
- Supabase anon key only (no server secret) — all reads are public
- `auth: { persistSession: false }` — serverless-safe Supabase client
- Cloudflare over Vercel — cost (free tier); ISR migration planned at 5000+ pages
- Module-level Supabase singleton (throws at build if env missing)

## Audit 2026-07-05 (GSC + Supabase live check)
- Domain + Cloudflare Pages: ✅ live, working.
- Sitemap/robots: ✅ live. GSC property: ✅ already verified (was already done, contrary to old TODOS).
- **Affiliate links: ❌ real bottleneck.** 34 tools in Supabase, only 1 has `affiliate_url` filled — rest fall back to `official_url` (zero commission).
- **Search visibility: ❌ near zero.** 702 pages indexed, but avg position 37.8 (page 4). All top queries are about "حاسبة نهاية الخدمة" (App_01/mokafaa subdomain traffic) — the AI-tools directory content itself gets ~0 impressions/clicks. Site exists technically but invisible in search.
- 128 pages not indexed: 75 "discovered-not indexed" + 47 "crawled-not indexed" (likely thin/duplicate compare pages), 4x 404, 2x duplicate-no-canonical.

## Session 2026-07-05 — fixes applied + affiliate signup started
- Fixed: deleted duplicate `Jasper AI` row in Supabase (`jasper-ai` slug), kept `jasper`.
- Fixed: [sitemap.ts](src/app/sitemap.ts) now only lists same-category compare pairs (was ~528 pairs incl. nonsensical cross-category, e.g. audio vs image; now filtered).
- Fixed: replaced placeholder logo (colored dot + letter icon) with real brand logo — `public/logo.png` (header) + `src/app/icon.png` (favicon), both live.
- Added `impact-site-verification` meta tag to layout.tsx metadata for Impact.com media-property verification (Grammarly affiliate program uses Impact.com).
- Affiliate program signups: **Jasper AI — dead, program discontinued Jan 2025.** **Copy.ai — dead, program discontinued.** **Grammarly — in progress**, account + tax info + profile done on Impact.com, site verification submitted. QuillBot (`quillbot.com/affiliates`, via PartnerStack) still queued.
- Still need affiliate signups for: QuillBot, Writesonic, Rytr, Canva AI, Adobe Firefly, RunwayML, Synthesia, HeyGen, Pictory AI, Murf AI, Descript — verify each program is still live before spending time (2 of first 3 tried were already dead).

## Pending — priority order
1. Finish Grammarly Impact.com verification, then get real affiliate link into Supabase `affiliate_url`.
2. Sign up remaining live affiliate programs (see list above), fill `affiliate_url` for each.
3. Investigate why compare/best pages aren't ranking — thin content vs real backlinks needed.
4. Fix 4x 404 + 2x duplicate-canonical pages flagged by GSC.
5. T2: User reviews/ratings (UGC) — after AdSense approval
6. T3: Backlinks / Arabic community outreach (Telegram + X)
7. T7: Cloudflare KV for live exchange rates (fallback static rates in use now)
8. T8: Pagination on `/tools` page (needed at 100+ tools)
9. T4: Public read API for Arabic devs (Phase 3, 500+ tools)
10. T5: Historical price tracking (Phase 3, 3+ months data)
11. T6: Move to Vercel Pro / Railway for ISR at 5000+ pages

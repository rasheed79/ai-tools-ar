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
- **Full pricing audit of all 34 tools done against official sources** (see Pricing Audit below). 6 rows had wrong `price_from` — fixed via SQL.
- Affiliate program status:
  - **ElevenLabs — ✅ live**, `affiliate_url` already set (`try.elevenlabs.io/quowwx3u0oeu`), confirmed via PartnerStack.
  - **Jasper AI, Copy.ai — dead**, programs discontinued, do not retry.
  - **Grammarly — pending**, Impact.com account + tax info + profile + site verification all done, waiting on approval.
  - **QuillBot — pending**, applied via PartnerStack (quillbot.com/affiliates), awaiting approval.
  - **Descript — on hold**, applied via PartnerStack marketplace, blocked on PartnerStack Network application approval (was previously declined once, re-applied — profile now 94%+ complete to improve odds).
  - **Murf AI — on hold**, found on PartnerStack marketplace, applied, same Network approval block as Descript.
  - **HeyGen — blocked**, official affiliate program was merged into "Social Creator Program" requiring 5K+ social followers (doesn't fit an SEO/content site). Emailed `affiliates@heygen.com` directly requesting website-affiliate access instead of retrying the form.
  - Found real affiliate program links (not yet applied) for: Writesonic (`affiliates.writesonic.com`, 30% recurring), Rytr (`affiliates.rytr.me/signup`, 30% recurring 12mo), RunwayML (`affiliates.runwayml.com`, 20% recurring via Awin), Synthesia (`synthesia.getrewardful.com/signup`, 25% first 12mo), Adobe Firefly (via Adobe's general Partnerize-based affiliate program, not Firefly-specific).
  - **Canva — Canvassador program currently closed** for new applications, can't join right now.

## Pricing Audit 2026-07-05 (all 34 tools checked against official pricing pages)
Fixed (`price_from` was wrong):
- Adobe Firefly: $5 → $10 (Standard $9.99/mo)
- Copy.ai: $49 → $29 (repriced 2025, old $49 Pro tier no longer exists)
- Leonardo AI: $10 → $12 (Essential $12/mo; $10 was the annual-billing rate)
- Pictory AI: $23 → $25 (Starter $25/mo annual, $29/mo monthly — official site confirmed)
- Writesonic: $16 → $79 (repriced to enterprise-tier structure; official site confirmed Starter $79/mo, way off old figure)
- QuillBot: $10 → $8 (official annual rate $8.33/mo; no flat $10 tier exists)

Confirmed correct, no change: ChatGPT, Claude, Cursor, DALL-E 3, Descript, Gemini, GitHub Copilot, Grammarly, HeyGen, Ideogram, Midjourney, Murf AI, Perplexity, Replit AI, RunwayML, Rytr, Sora, Suno AI, Tabnine, v0, Jasper, Canva AI, ElevenLabs.

Flagged, needs content rewrite (not just a number): **Notion AI** — standalone AI add-on was discontinued; AI now bundled into Business plan ($20/seat), Plus ($10/seat) only gives a trial. **Flux AI** — Black Forest Labs has no official monthly subscription, it's pay-per-image; the $10/mo figure doesn't reflect their real pricing model.

## Pending — priority order
1. Wait on approvals: Grammarly (Impact.com), QuillBot/Descript/Murf AI (PartnerStack Network) — fill `affiliate_url` for each once approved.
2. Wait on HeyGen email reply (`affiliates@heygen.com`).
3. Apply directly on vendor sites: Writesonic, Rytr, RunwayML, Synthesia, Adobe Firefly (links found, not yet applied).
4. Retry Canva later — Canvassador program currently closed.
5. Still need to check: Pictory AI (no program found yet).
6. Rewrite Notion AI and Flux AI pricing sections to reflect their real pricing model (not just a number fix).
7. Investigate why compare/best pages aren't ranking — thin content vs real backlinks needed.
8. Fix 4x 404 + 2x duplicate-canonical pages flagged by GSC.
9. T2: User reviews/ratings (UGC) — after AdSense approval
10. T3: Backlinks / Arabic community outreach (Telegram + X)
11. T7: Cloudflare KV for live exchange rates (fallback static rates in use now)
12. T8: Pagination on `/tools` page (needed at 100+ tools)
13. T4: Public read API for Arabic devs (Phase 3, 500+ tools)
14. T5: Historical price tracking (Phase 3, 3+ months data)
15. T6: Move to Vercel Pro / Railway for ISR at 5000+ pages

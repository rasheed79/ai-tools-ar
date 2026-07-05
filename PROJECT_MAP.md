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
  - **Rytr — ✅ live**, instant approval (no review), `affiliate_url` set to `https://rytr.me?via=abdulrashid-abdulkarim`, 30% commission.
  - **Writesonic — pending**, applied via `affiliates.writesonic.com`, awaiting approval.
  - **Synthesia — ✅ live**, instant approval, `affiliate_url` set to `https://www.synthesia.io?via=abdulrashid`, 25% first 12mo.
  - **RunwayML — no public affiliate program.** `affiliates.runwayml.com` is invite-only (login for existing affiliates, not a signup form). Confirmed "Not an Affiliate" when logging in. Don't retry — no self-serve application exists as of 2026-07.
  - Adobe Firefly: general Adobe Partnerize-based affiliate program found, not yet applied.
  - Note: anon Supabase key *can* UPDATE `tools` rows via REST (RLS allows it), just not DELETE — no need for SQL editor to set affiliate_url going forward, only for deletes.
  - **Created `contact@daleel-adawat.com`** via Cloudflare Email Routing (forwards to gmail), confirmed working — needed for affiliate forms that reject gmail.com addresses (e.g. Synthesia).
  - **Canva — Canvassador program currently closed** for new applications, can't join right now.
  - **PartnerStack Network application — declined** ("Business could not be verified as genuine"). Blocks QuillBot/Descript/Murf AI from ever activating until re-approved. ElevenLabs unaffected (was active before decline). Root causes: domain too new (created June 2026), no business registration on file, LinkedIn is a personal profile not a company page, thin `/about` page. Don't mass-reapply — fix credibility signals first (see Credibility Tasks below), wait 1-2 months for domain age, then reapply once.

## Credibility Tasks (for PartnerStack re-application + affiliate trust generally)
1. Create a LinkedIn Company Page for "Daleel Adawat", link it from the site and from the PartnerStack profile (replace the personal LinkedIn link).
2. Flesh out `/about` page: real founder info, contact email, what the site actually does — not a placeholder.
3. Add real business registration info if one exists (Saudi freelance/commercial registration) to the PartnerStack profile.
4. Let domain age pass 1-2 months before reapplying to PartnerStack Network — reapplying immediately with the same signals will likely get declined again.

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
1. Apply directly on Adobe Firefly's general affiliate program (unaffected by PartnerStack decline).
2. Do Credibility Tasks (see above) — needed before any PartnerStack reapplication.
3. Wait on approvals: Grammarly (Impact.com), Writesonic — fill `affiliate_url` once approved.
4. Wait on HeyGen email reply (`affiliates@heygen.com`).
5. After credibility tasks + domain age improve: reapply once to PartnerStack Network — unlocks QuillBot, Descript, Murf AI.
6. Retry Canva later — Canvassador program currently closed.
7. Still need to check: Pictory AI (no program found yet).
8. Rewrite Notion AI and Flux AI pricing sections to reflect their real pricing model (not just a number fix).
9. Investigate why compare/best pages aren't ranking — thin content vs real backlinks needed.
10. Fix 4x 404 + 2x duplicate-canonical pages flagged by GSC.
11. T2: User reviews/ratings (UGC) — after AdSense approval
12. T3: Backlinks / Arabic community outreach (Telegram + X)
13. T7: Cloudflare KV for live exchange rates (fallback static rates in use now)
14. T8: Pagination on `/tools` page (needed at 100+ tools)
15. T4: Public read API for Arabic devs (Phase 3, 500+ tools)
16. T5: Historical price tracking (Phase 3, 3+ months data)
17. T6: Move to Vercel Pro / Railway for ISR at 5000+ pages

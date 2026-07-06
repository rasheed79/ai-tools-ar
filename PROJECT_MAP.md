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
  - **Grammarly — ❌ declined** (2026-07-06 email): "account did not meet the application criteria and was auto-rejected." Same likely root cause as PartnerStack decline (new domain, no business registration/LinkedIn company page). Don't retry until Credibility Tasks are done + domain age improves.
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

## Session 2026-07-06 — AdSense "low value content" fix + Adobe affiliate link found
- **AdSense rejected site** with "We found some policy violations — Low value content" (tool pages had only 1-line description + price table + feature bullets, no original prose).
- **Fixed:** added `review_ar` column to `tools` table (migration: `supabase/add-review-ar.sql`). Wrote and pushed a 150-220 word original Arabic review for all 32 tools currently in DB (via REST PATCH, `scripts/reviews.json` holds the source text). Rendered on `/tools/[slug]` under a "مراجعة" heading.
- **Fixed:** `/best/[useCase]` and `/compare/[pair]` were bare data tables/lists (same thin-content risk). Added `src/lib/verdict.ts` — generates a computed Arabic verdict paragraph per page (cheapest option, feature-count comparison, category framing) from existing tool fields, no per-page hand-written content needed.
- Verified live on production (daleel-adawat.com) after deploy: review text, best-page intro, and compare-page verdict all confirmed rendering.
- **Adobe Firefly affiliate — requested.** Signed up on Partnerize (`join.partnerize.com/adobe/en`), username `daleeladawat`, Publisher ID `1100l431755`. Joined the Adobe campaign — status "requested", awaiting Adobe's decision (same wait pattern as Grammarly/Writesonic). Tracking link once approved: `https://www.adobe.com/?sdid=49F59KY6`.
- **AdSense re-submitted:** consent message configured (Google's CMP, 3-choice option), Ads.txt added (`public/ads.txt`, was "Not found"), Ads settings confirmed (Auto ads enabled). All onboarding steps show green — site now fully in Google's manual review queue. No further action possible until Google emails a decision (1-14 days typical).
- `/about` page checked — already has real Q&A content, not a contributor to the low-value-content flag.
- **GSC 404 fix:** root cause found — `sitemap.ts` and the compare-page pills linked to `/best/صوت`, `/best/فيديو`, `/best/عمل`, but no tool's `use_cases` array had those exact strings (had "محتوى صوتي" etc instead), so the pages 404'd. Fixed `getToolsByUseCase` to substring-match, dropped "عمل" (no match even with substring), replaced hard `notFound()` with a friendly empty state. The other 2 flagged 404s (`/&`, `/$`) are bot-probe noise, not a site bug — left alone.
- **GSC duplicate-canonical fix:** site had zero `<link rel="canonical">` tags anywhere. Added `metadataBase` to root layout + explicit `alternates.canonical` on `/` and `/tools` (the two flagged URLs were `http://.../` and `/tools?category=code`).
- **Follow-up reminder — check back in ~1 week (around 2026-07-13):** click "Validate Fix" in GSC for both the 404 and duplicate-canonical reports, confirm they clear. Also check: AdSense decision email, Adobe Partnerize approval, Grammarly/Writesonic approvals, and whether any outreach posts (see below) got engagement.

## AI directory submissions (2026-07-06) — backlink strategy from research
Researched why the site isn't ranking (avg position 37.8): domain is <1 month old
(June 2026), and Google's own advocate (John Mueller) confirms new domains need
3-6 months minimum to accumulate trust signals regardless of content quality —
not a fixable-overnight problem. Manual social posting (Reddit/X) drives instant
traffic but doesn't build authority. Real backlink strategy: submit to AI tool
aggregator directories (same-niche authoritative sites) + pitch Arabic tech media.
- **Futurepedia: skip — costs $247-497, not free** (corrected earlier wrong info).
- **✅ Submitted to FutureTools.io** (futuretools.io) — free, editorial review by
  site owner Matt Wolfe pending.
- **Still to submit** (free, found via research): Toolify, There's An AI For That
  (TAAFT — 403'd on fetch, try direct), AIxploria. Full list:
  https://github.com/best-of-ai/ai-directories
- **Still to pitch**: aitnews.com (البوابة التقنية) and MAGNiTT — real Arabic tech
  media, short pitch about the directory launch (see chat for research/reasoning).
- **Paid backlinks verdict**: skip cheap ($<100) backlink services — research
  confirms these are link-farm risk, can actively hurt rankings. Small-budget
  paid Arabic articles (~$10-50, performance-gated e.g. TriDent) are lower-risk
  if tried, but not yet attempted.

## Pending — priority order
1. **Waiting on Google:** AdSense manual review decision (email notification).
2. **Waiting on Adobe:** campaign request submitted via Partnerize, awaiting approval.
3. Do Credibility Tasks (see above) — needed before any PartnerStack reapplication.
4. Wait on approval: Writesonic. (Grammarly declined 2026-07-06 — see above, don't retry yet.)
5. Wait on HeyGen email reply (`affiliates@heygen.com`).
6. After credibility tasks + domain age improve: reapply once to PartnerStack Network — unlocks QuillBot, Descript, Murf AI.
7. Retry Canva later — Canvassador program currently closed.
8. Still need to check: Pictory AI (no program found yet).
9. Rewrite Notion AI and Flux AI pricing sections to reflect their real pricing model (not just a number fix).
10. Real backlinks / Arabic community outreach — still the core traffic bottleneck (avg GSC position 37.8), content fix alone won't solve ranking. Posting schedule + full post text: `scripts/outreach-posts.md` and dashboard.
   - Submit to remaining free AI directories (Toolify, TAAFT, AIxploria) and pitch aitnews.com/MAGNiTT — see "AI directory submissions" section above.
   - **2026-07-06 status:** r/Saudi is dead (Restricted, 20 weekly visitors). r/arabs mods **declined** the promotion request outright — don't retry there. **✅ Posted successfully to r/saudiarabia** (81K weekly visitors, active) — text-post format, "Discussion" flair, rewritten as a discussion/question (not a raw link-drop) to satisfy their "Blogspam is not allowed" rule. Live post has 1 upvote so far. **✅ Posted the X/Twitter thread** (@Abo_Omr_jamali) — 4 tweets, link + hashtags on the last tweet only (X suppresses reach on tweets with external links, so kept the link off tweet 1). Telegram/Hasoub/Facebook not started yet — text ready in `scripts/outreach-posts.md`.
11. GSC 404 + duplicate-canonical — fixed in code (2026-07-06), needs "Validate Fix" click + wait for Google to confirm (~1 week).
12. T2: User reviews/ratings (UGC) — after AdSense approval
13. T3: Backlinks / Arabic community outreach (Telegram + X)
14. T7: Cloudflare KV for live exchange rates (fallback static rates in use now)
15. T8: Pagination on `/tools` page (needed at 100+ tools)
16. T4: Public read API for Arabic devs (Phase 3, 500+ tools)
17. T5: Historical price tracking (Phase 3, 3+ months data)
18. T6: Move to Vercel Pro / Railway for ISR at 5000+ pages

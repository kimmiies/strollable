# Strollable — Claude Code Context

> Read this file fully before touching any code. It is the single source of truth for decisions already made. Do not re-ask questions answered here.

---

## What this is

Strollable is a mobile-first, community-powered web app helping parents with strollers find accessible venues in Toronto. The three things that matter: step-free entry, accessible bathroom, change table. Everything else is secondary.

**North star metric:** % of stroller-accessible spots in a neighbourhood with accurate, community-verified data.

---

## Repo layout

```
projects/
├── strollable/
│   ├── app/                  ← Next.js app (work here)
│   │   └── src/
│   │       ├── app/          ← App Router pages + API routes
│   │       ├── components/   ← UI components (see below)
│   │       ├── hooks/        ← Custom React hooks
│   │       ├── lib/          ← Supabase, Google, Anthropic clients
│   │       ├── stores/       ← Zustand stores
│   │       └── types/        ← Shared TypeScript types (index.ts)
│   ├── supabase/migrations/  ← SQL migrations (do not modify without instruction)
│   └── context/              ← Strategy + design docs (read-only reference)
│       ├── CLAUDE.md         ← This file (also at repo root)
│       ├── Strategy/         ← PRD v1.4
│       └── Design/           ← Brand guidelines + design system HTML
```

The working directory for all code is `projects/strollable/app/`.

---

## Tech stack — fixed, do not change

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript — strict mode |
| Styling | Tailwind CSS v4 + CSS custom properties (no inline style objects unless necessary) |
| UI primitives | Radix UI (dialog, tabs, toast, avatar, label) |
| Icons | lucide-react — 20px / stroke 1.5 for UI, 16px for chips |
| State | Zustand (map store); React state for component-local UI |
| Forms | react-hook-form + zod |
| Auth + DB | Supabase (SSR client in server components, browser client in hooks/client components) |
| Location data | Google Places API (lib/google/places.ts) |
| Mapping | Google Maps JS API (lib/google/maps.ts) |
| AI summaries | Anthropic Claude API (lib/anthropic/summary.ts) |
| Hosting | Vercel |

**Next.js 16 note:** APIs and conventions differ from training data. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for current patterns.

---

## Design system — non-negotiable

All design tokens live in `src/app/globals.css`. Never hardcode hex values — always use CSS custom properties.

### Colour tokens
```css
--sage / --sage-light / --sage-deep
--cream / --warm-white / --mist
--ink / --ink-soft / --ink-faint
--terracotta / --terra-light
--butter / --butter-light
--sky / --sky-light
--amber / --amber-light
--error: #C0392B / --error-light: #FDECEA   ← add these if not present
```

### Spacing — 8pt grid
Use Tailwind spacing utilities (p-2, gap-4, etc.) which map to the 8pt grid. For values not in Tailwind defaults, use the CSS variables:
`--sp-2 / --sp-4 / --sp-6 / --sp-8 / --sp-12 / --sp-16 / --sp-20 / --sp-24 / --sp-32 / --sp-40 / --sp-48 / --sp-64`

### Border radius tokens
`--r-sm (8px)` — icon containers, checkboxes
`--r-md (14px)` — inputs, interactive cards, filter buttons
`--r-lg (24px)` — content cards
`--r-xl (32px)` — modals, bottom sheets
`--r-pill (100px)` — all pill shapes, buttons, CTAs

### Shadow tokens
`--shadow-sm` — chips, hover states
`--shadow-card` — establishment cards, list items
`--shadow-float` — modals, bottom sheets, map overlays

### Focus ring
`--focus-ring: 0 0 0 3px rgba(122,158,126,.35)` — applies to all interactive elements on :focus-visible

### Motion tokens (add to globals.css if not present)
```css
--ease-spring: cubic-bezier(.16,1,.3,1);
--ease-out: cubic-bezier(0,0,.2,1);
--dur-fast: 120ms;     /* hover states, chip toggles */
--dur-base: 200ms;     /* button presses, nav items */
--dur-slow: 350ms;     /* sheet entry, modal open */
```

### Touch targets
All interactive elements: `min-height: 44px` (--touch-min)
Contribute FAB: `52px` (--touch-fab)

### Typography
- Display / headings: `font-display` class → Fraunces, weight 300–400
- All UI text: DM Sans (body), weight 300 (default), 400 (labels/buttons), 500 (emphasis)
- Never use system fonts or Inter

### Fonts
Loaded in root layout via next/font. Use `font-display` class for Fraunces. DM Sans is the default body font.

---

## Component conventions

### File structure
```
components/
├── auth/           LoginForm, SignupForm
├── contribution/   ContributionForm, ContributionComplete
├── establishment/  EstablishmentCard, EstablishmentDetail, EstablishmentList,
│                   EstablishmentSheet, FeatureChip, FeatureChipRow, AiSummary
├── layout/         BottomNav, TopBar, TopNav
├── map/            MapContainer, MapControls, MapFilters, FilterPanel
├── profile/        BadgeCard
└── ui/             Generic primitives (Button, Input, Toast, etc.) — keep thin
```

### Rules
- `"use client"` only when component uses hooks, event handlers, or browser APIs
- Server components by default for anything that can be
- Props typed explicitly — no `any`
- `cn()` from `lib/utils` for conditional class merging (clsx + tailwind-merge)
- No default exports from `lib/` files — named exports only
- Components take typed props; no prop drilling beyond 2 levels (use Zustand or context)

---

## Feature verification states — core data model

```
unknown   → no submissions
reported  → 1–2 submissions (not yet consensus)
confirmed → 3+ agreeing submissions
disputed  → conflicting submissions
```

These map to visual states in FeatureChip: unknown (transparent border), reported (amber), confirmed-yes (mist/sage), confirmed-no (terra/terracotta), disputed (terra/terracotta).

**The v1 launch features are:** `step_free_entrance`, `accessible_bathroom`, `change_table`.
All others are v2. Feature chips should prioritise displaying these three first.

---

## Database schema (key tables)

```sql
establishments  (id, place_id, name, address, lat, lng, type, hours, phone, website, google_rating, google_data_json)
features        (id, establishment_id, feature_type, value, status, report_count, yes_count, no_count)
contributions   (id, user_id, establishment_id, feature_id, contribution_type, value, comment, photo_url, created_at)
users           (id, display_name, email, avatar_url, badge_flags, contribution_counts)
saved_places    (id, user_id, establishment_id, created_at)
```

Supabase RLS is enabled. Server-side operations use the service role client (`lib/supabase/server.ts`). Client-side uses the browser client (`lib/supabase/client.ts`).

---

## Page routes

```
/                       → redirects to /explore
(app)/explore           → Map + list view (main screen)
(app)/place/[placeId]   → Establishment detail
(app)/contribute/       → Contribution landing
(app)/contribute/[placeId] → Contribution flow (3 steps)
(app)/saved             → Saved places list
(app)/profile           → User profile + badges
(app)/notifications     → Activity feed
(auth)/login            → Login form
(auth)/signup           → Sign up form
(auth)/callback         → Supabase OAuth callback
```

---

## Mock data

During development without live APIs, use `lib/demo/data.ts` and `lib/demo/index.ts`. The demo module provides 10 Toronto establishments with pre-seeded feature data. API routes check for a `NEXT_PUBLIC_DEMO_MODE=true` env flag and return mock data when set.

---

## What's already built

- ✅ All page routes scaffolded
- ✅ Supabase auth flow (login, signup, OAuth callback)
- ✅ Core types in `types/index.ts`
- ✅ Supabase client (server + browser)
- ✅ Google Places + Maps clients
- ✅ Anthropic summary client
- ✅ EstablishmentCard component
- ✅ FeatureChip + FeatureChipRow components
- ✅ BottomNav, TopBar, TopNav layout components
- ✅ MapContainer, MapFilters, FilterPanel, MapControls
- ✅ BadgeCard component
- ✅ ContributionForm, ContributionComplete
- ✅ Zustand mapStore
- ✅ All custom hooks (useEstablishments, useContribution, useSaved, useUser, useGeolocation)
- ✅ Database migrations (001–008)
- ✅ globals.css with v1 design tokens

---

## Active tasks / known gaps

- `components/ui/` is empty — generic primitives (Button, Input, Toast, etc.) need to be created as they're needed, using the design system tokens
- `--error` and `--error-light` tokens may be missing from globals.css — add them if not present
- Motion tokens (--ease-spring, --ease-out, --dur-fast, --dur-base, --dur-slow) need to be added to globals.css
- Focus ring token (--focus-ring) needs to be added to globals.css
- Auth pages (login/signup) are scaffolded but need design system styling applied
- Contribution flow needs progress bar + skip interaction wired up
- Map markers need verified/partial/active states implemented

---

## Behaviours — never do these

- Do not add new dependencies without asking first
- Do not modify files in `supabase/migrations/` without explicit instruction
- Do not remove or rename existing CSS custom properties in globals.css — add new ones, don't delete
- Do not use `any` type
- Do not hardcode colours, spacing, or radii — always use tokens
- Do not add `console.log` statements to committed code
- Do not use `position: fixed` for the bottom nav on desktop — it should not appear on desktop at all
- Do not create new Supabase tables or alter schema without a migration file

---

## Tone / brand

Warm, direct, practical. Never clinical or corporate. Copy should feel like advice from a trusted parent friend. See `context/Design/strollable_brand_guidelines.html` for the full brand guide.

Key microcopy examples:
- Empty state: "No one has checked this one yet. Be the first to help parents find out."
- Contribution success: "Nice one. That helps parents in the neighbourhood plan better."
- Unknown feature: "No info yet" (not "N/A" or "Unknown")

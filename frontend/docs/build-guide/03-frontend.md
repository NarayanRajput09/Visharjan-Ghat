# Part 3 — Frontend

**Goal:** a clean, bilingual dashboard where the BMC officer sees the ghat ranking, checks any number against its report page, sees what wasn't tested, and makes a brief to forward.

**Done when:** all four screens work against the real backend in Hindi and English, missing data shows grey "Not tested" everywhere, component tests and one Playwright flow pass, and `npm run build` succeeds.

## Stack

| Need | Tool |
|---|---|
| Build | Vite |
| UI | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS |
| Routing | React Router |
| Server data | TanStack Query |
| API types | `openapi-typescript`, generated from FastAPI's `/openapi.json` |
| Charts | Recharts |
| Map | Leaflet + react-leaflet (OSM tiles, no key) |
| i18n | react-i18next, plus `Intl.NumberFormat('hi-IN' / 'en-IN')` |
| Font | `@fontsource/noto-sans-devanagari` (bundled, works offline) |
| Tests | Vitest + Testing Library, Playwright, `@axe-core/playwright` |
| Lint | ESLint (typescript-eslint, react-hooks, jsx-a11y) + Prettier |

```bash
npm create vite@latest frontend -- --template react-ts
cd frontend
npm i react-router-dom @tanstack/react-query recharts leaflet react-leaflet react-i18next i18next @fontsource/noto-sans-devanagari
npm i -D tailwindcss @tailwindcss/vite openapi-typescript vitest @testing-library/react @testing-library/jest-dom jsdom @playwright/test @axe-core/playwright @types/leaflet
```

## Folder structure

```
frontend/src/
├─ main.tsx, App.tsx            # providers, router
├─ api/
│  ├─ schema.d.ts               # generated: npx openapi-typescript http://localhost:8000/openapi.json -o src/api/schema.d.ts
│  ├─ client.ts                 # fetch wrapper, base URL from VITE_API_URL
│  └─ hooks.ts                  # useRanking, useGhat, useReadings, useCreateBrief
├─ features/
│  ├─ ranking/                  # RankingPage, RankingTable, GhatRow, TierBadge, ConfidenceBadge
│  ├─ ghat-detail/              # GhatDetailPage, ReasonList, SourceChip, SourcePanel, CoverageMatrix, ReadingsTable, TrendChart
│  ├─ map/                      # GhatMap (falls back to a table offline)
│  ├─ brief/                    # BriefPage, BriefView, ExportButtons, SourceLabel
│  └─ about/                    # AboutDataPage
├─ components/                  # Button, Card, Banner, LanguageToggle, Countdown, ReadingCell
├─ i18n/{index.ts,en.json,hi.json}
└─ styles/index.css             # Tailwind + print styles
```

## Screens

| Route | Screen | Must show |
|---|---|---|
| `/` | **Ranking** | Countdown to 20 Oct · CPCB class used (Class B, with an info tooltip) · table: rank, ghat, tier badge, confidence badge, first reason with a source chip · map · **Make brief** button · Download CSV |
| `/ghat/:slug` | **Ghat detail** | Up to 3 reasons with source chips · known-gaps banner · coverage matrix (year × festival × phase, grey = not tested) · readings table per parameter · DO/BOD trend chart with the limit line · suggested actions |
| `/brief/:id` | **Brief** | Hindi and English side by side · label "Written by AI, checked" or "Written from template" · Copy · WhatsApp · Print |
| `/about` | **About the data** | Why Class B · scoring in plain words · limits table · what the data doesn't cover · sources with links |

Ranking layout:

```
┌──────────────────────────────────────────────────────────────┐
│ Visarjan Ghat Watch    Durga visarjan in 9 days    [हिं | EN] │
├──────────────────────────────────────────────────────────────┤
│ Compared with CPCB Class B (bathing) ⓘ   [Make brief] [CSV]  │
├────┬──────────────────────┬───────┬──────────┬───────────────┤
│ #  │ Ghat                 │ Risk  │ Data     │ Main reason   │
│ 1  │ Bairagarh kund       │ HIGH  │ Limited  │ DO 0 mg/l … [2023·Durga·during·p.60] │
│ …  │                      │       │          │               │
├────┴──────────────────────┴───────┴──────────┴───────────────┤
│                      [ Map ]                                 │
└──────────────────────────────────────────────────────────────┘
```

## Rules the UI must follow

1. **Missing is never green.** `ReadingCell` handles all 4 statuses. `not_sampled` → grey hatched "Not tested" / "जाँच नहीं हुई". `bdl` → "Below detection limit". No tick icon for missing values.
2. **Colour plus words.** Tier badges always show the word (High/Medium/Low), never only a colour.
3. **Every number is clickable.** A source chip opens a side panel with `value_as_printed`, `parameter_as_printed`, `site_as_printed`, page, and **View in report** → `{API}/reports/{year}.pdf#page={source_page}`.
4. **No hard-coded text.** Every string comes from `t('…')`. `en.json` and `hi.json` must have the same keys (a test checks this).
5. **No calculations in the UI.** Scores, tiers and reasons come from the API. The UI only formats them.
6. **No health language** in any UI string.
7. **Accessible:** keyboard navigation, `aria-label` on icon buttons, contrast AA, and a print stylesheet that fits the brief on one A4 page.

## Data fetching

```ts
// api/hooks.ts
export const useRanking = (cpcbClass = 'B') =>
  useQuery({ queryKey: ['ranking', cpcbClass], queryFn: () => api.get<RankingResponse>(`/api/ranking?cpcb_class=${cpcbClass}`) });

export const useCreateBrief = () =>
  useMutation({ mutationFn: (cpcbClass: string) => api.post<BriefResponse>('/api/briefs', { cpcb_class: cpcbClass }) });
```

- `VITE_API_URL=http://localhost:8000` in `frontend/.env.development`.
- The CPCB class lives in the URL (`?class=B`), and the language in `localStorage`.
- Loading: skeleton rows. Error: a bilingual banner with a retry button.

## Charts (Recharts)

- `TrendChart`: x = `year · festival · phase`, y = value. A reference line at the limit (DO 5, BOD 3). Missing points are **gaps in the line**, not zeros. Pass `null` and set `connectNulls={false}`.
- Label the y-axis with the assumed unit and an "(unit assumed)" note.

## Tests

| Test | Expect |
|---|---|
| `ReadingCell` | `not_sampled` renders "Not tested", grey, and no tick · `bdl` renders "Below detection limit" |
| `TierBadge` | Text present for every tier |
| `i18n keys` | `en.json` and `hi.json` have identical key sets |
| `RankingTable` | Renders 7 rows from a mocked response, in rank order |
| `TrendChart` | A missing value is passed as `null`, not 0 |
| Playwright `officer-flow` | Open `/` → click top ghat → click a source chip → panel shows page and a report link with `#page=` → back → Make brief → brief shows both languages → switch to Hindi → strings change |
| axe | No serious or critical violations on `/`, `/ghat/:slug`, `/brief/:id` |

## Run

```bash
cd frontend
npx openapi-typescript http://localhost:8000/openapi.json -o src/api/schema.d.ts
npm run dev        # http://localhost:5173 (backend must be running on :8000)
npm run test
npx playwright test
```

## Prompt for Claude Code

```
Parts 1 and 2 are done; the FastAPI backend runs on http://localhost:8000 (see /docs). Read
docs/build-guide/03-frontend.md, docs/01-prd.md (FR-1 to FR-6) and docs/07-code-style.md (React
section). Build Part 3 only, in frontend/.

Stack: Vite, React 19, TypeScript strict, Tailwind CSS, React Router, TanStack Query, Recharts,
react-leaflet, react-i18next, bundled Noto Sans Devanagari, Vitest + Testing Library, Playwright +
axe. Generate API types with openapi-typescript from /openapi.json — do not hand-write response
types.

Build the 4 screens in the guide. Follow the 7 UI rules exactly: missing data is grey "Not tested"
and never green; tier badges show words; every number has a source chip that opens the report at
#page=N; all text via i18n with identical en/hi keys; no scoring in the UI; no health language;
accessible and printable.

Work in order: scaffold + Tailwind + i18n → API client/hooks → Ranking page → Ghat detail →
Brief page → About page → map → tests. Run the Vitest suite after each screen. When finished, run
the Playwright officer flow against the real backend and show me the results.
```

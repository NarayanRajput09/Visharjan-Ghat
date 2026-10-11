# Visarjan Ghat Watch — Frontend

A clean, bilingual dashboard built for the Bhopal Municipal Corporation (BMC) officer preparing Durga visarjan on **20 October 2026**.

Ranks Bhopal immersion ghats by water-quality risk based on MPPCB water testing reports (2023–2025), provides complete evidence traceability back to report pages, highlights sampling gaps honestly, and produces a planning brief.

---

## Stack

- **Framework & Build:** React 19 + TypeScript (strict mode) + Vite
- **Styling:** Tailwind CSS (v4) with custom theme tokens & A4 print stylesheets
- **Routing:** React Router v7
- **Data Fetching:** TanStack Query (v5)
- **API Types:** `openapi-typescript` definitions matching FastAPI `/openapi.json`
- **Charts:** Recharts (with reference limit lines and strict null handling for missing data)
- **Map:** Leaflet & `react-leaflet` with OpenStreetMap tiles and offline coordinates fallback
- **i18n:** `react-i18next` + `i18next` with `Intl.NumberFormat` / `Intl.DateTimeFormat`
- **Typography:** Bundled `@fontsource/noto-sans-devanagari` (100% offline support)
- **Tests:** Vitest, `@testing-library/react`, `@testing-library/jest-dom`, jsdom

---

## 4 Main Screens

1. **Ranking (`/`)**
   - Countdown to 20 October 2026 Durga visarjan.
   - CPCB Class comparison selector (Class B default) with information tooltip.
   - 7 Bhopal ghats ranked with Risk Tier badge, Data Confidence badge, and primary reason.
   - Clickable source chip on each reason opening reading-level report evidence.
   - Interactive Leaflet map with tier-coded pins and offline table fallback.
   - **Make brief** and **Download CSV** actions.

2. **Ghat Detail (`/ghat/:slug`)**
   - Up to 3 structured reasons with evidence source chips.
   - Known data gaps banner (e.g. Bairagarh/Malikhedi Durga 2025 table absence).
   - Sampling coverage matrix (year × festival × phase, grey hatched for not tested).
   - Dissolved Oxygen (DO) and BOD trend chart with CPCB Class B limit lines (`connectNulls={false}`).
   - Suggested municipal operations before and during visarjan.
   - Per-parameter readings table with parameter and year filters.

3. **Planning Brief (`/brief/:id`)**
   - Side-by-side Hindi (administrative) and English brief view.
   - Source badge: *"Written by AI, checked"* or *"Written from template"*.
   - Copy to clipboard, WhatsApp forward, and single A4 page print/PDF options.

4. **About the Data (`/about`)**
   - Explanation of why CPCB Class B (bathing) was selected.
   - Step-by-step scoring methodology in plain words.
   - Official Class B limits table.
   - Known data limitations and official MPPCB report source links.

---

## Strict Domain & UI Rules Enforced

1. **Missing is never green:** Untested data (`not_sampled`) renders as a grey hatched cell labelled *"Not tested"* / *"जाँच नहीं हुई"*. No tick icons.
2. **Colour plus words:** Risk tier badges always display words (High / Medium / Low), never color alone.
3. **Every number is clickable:** Evidence source chips open a slide-over panel displaying `value_as_printed`, `parameter_as_printed`, `site_as_printed`, report year, and a direct link to the report page (`/reports/{year}.pdf#page={source_page}`).
4. **No hard-coded text:** Every user-facing string uses `t(...)`. `en.json` and `hi.json` have 100% identical key sets.
5. **No calculations in the UI:** Tiers, ranks, and reasons are computed by backend/domain models.
6. **No health language:** Strictly avoids medical or health claims; reports solely against legal CPCB benchmarks.
7. **Accessible & Printable:** Keyboard friendly, contrast AA, and single A4 printable brief layout.

---

## Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server (http://localhost:5173)
npm run dev

# 3. Type check
npm run typecheck

# 4. Run test suite
npm run test

# 5. Build for production (outputs to dist/)
npm run build
```

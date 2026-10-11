# 8. Technical Approach

> Step-by-step build instructions for a solo developer are in [build-guide/](build-guide/README.md). This document explains the choices.

## 8.1 Approach in one paragraph

A Python backend and a React frontend. A **pure analysis package** (`backend/analysis`, Pandas + Pydantic) turns MPPCB readings into a ranked, explained list of ghats with reading-level sources. A thin **FastAPI** service exposes that list. It also asks **Claude** to rewrite the computed facts as a short Hindi and English brief, then checks the brief against the facts. A **React + TypeScript** single-page app shows the ranking, the evidence behind each number, charts, a map and the brief. Everything except the AI brief works offline.

## 8.2 Stack

### Data + AI (`backend/analysis`)
| Need | Choice | Why |
|---|---|---|
| Language | Python 3.12 | Best ecosystem for tabular data |
| Data | Pandas | Group, filter and pivot readings in a few lines |
| Models | Pydantic v2 | Validated domain models, reused directly by FastAPI |
| AI | `anthropic` SDK, model `claude-opus-5-5` | Strong Hindi, structured outputs via `messages.parse` |
| Tests | pytest + hypothesis | Unit, golden-data and property tests |
| Quality | ruff + mypy `--strict` | Fast lint and format, type safety |
| Packaging | uv | Fast, reproducible installs with a lockfile |

### Backend (`backend/app`)
| Need | Choice | Why |
|---|---|---|
| Framework | FastAPI + Uvicorn | Typed routes, automatic OpenAPI at `/docs` |
| Settings | pydantic-settings | `.env` support, typed config |
| Brief cache | stdlib `sqlite3` | No dependency, one file |
| Rate limit | slowapi | Protects the paid AI endpoint |
| Tests | pytest + TestClient | In-process API tests |

### Frontend (`frontend/`)
| Need | Choice | Why |
|---|---|---|
| Build / UI | Vite + React 19 + TypeScript strict | Fast dev, static build |
| Styling | Tailwind CSS | Quick, consistent, easy print styles |
| Routing | React Router | Four screens |
| Server state | TanStack Query | Caching, loading and error states |
| API types | openapi-typescript | Generated from FastAPI, so no drift |
| Charts | Recharts | Trend lines with limit reference lines, gaps for missing values |
| Map | Leaflet + react-leaflet, OSM tiles | Free, no key, table fallback offline |
| i18n | react-i18next + `Intl` | Hindi/English, locale number formats |
| Font | Noto Sans Devanagari (bundled) | Works offline |
| Tests | Vitest, Testing Library, Playwright, axe | Components, the officer flow, accessibility |

## 8.3 Why not…

| Option | Reason we didn't pick it |
|---|---|
| Streamlit | Very fast for one person, but harder to make polished, bilingual, accessible and printable. Weak on the "Product" judging criterion |
| Next.js | SSR is not needed. FastAPI serving a static build is simpler to hand over |
| Postgres / full DB | The data is 1.5k rows. A DB server adds setup for the department and gives nothing back |
| LLM ranking or RAG over PDFs | Not traceable, not repeatable. The CSV is already structured |
| Google Maps | Needs an API key and billing |

## 8.4 React application design

### Screens

| Route | Screen | Key components |
|---|---|---|
| `/` | **Ranking**: the officer's home | `RankingTable`, `GhatRow`, `TierBadge`, `ConfidenceBadge`, `GhatMap`, `Countdown`, Make brief, CSV |
| `/ghat/:slug` | **Ghat detail** | `ReasonList`, `SourceChip`, `SourcePanel`, `CoverageMatrix`, `ReadingsTable`, `TrendChart`, `KnownGapsBanner` |
| `/brief/:id` | **Brief** (print-friendly) | `BriefView` (hi/en side by side), `ExportButtons`, `SourceLabel` |
| `/about` | **About the data** | Class B choice, method in plain words, limits, what the data doesn't cover, sources |

### Layout of the ranking page

```
┌───────────────────────────────────────────────────────────────┐
│ Visarjan Ghat Watch          Durga visarjan: 20 Oct · 9 days   │  [हिंदी | English]
├───────────────────────────────────────────────────────────────┤
│ Compared with: CPCB Class B (bathing) ⓘ    [Make brief] [CSV] │
├──────┬──────────────────────────┬────────┬───────────┬────────┤
│ Rank │ Ghat                     │ Risk   │ Data      │ Why    │
├──────┼──────────────────────────┼────────┼───────────┼────────┤
│  1   │ Bairagarh (Sant Hirdaram)│ HIGH   │ Limited ⚠ │ DO 0 mg/l during Durga 2023 (p.60) … │
│  2   │ …                        │ …      │ …         │ (illustrative layout, not real ranks) │
├──────┴──────────────────────────┴────────┴───────────┴────────┤
│                     [ Map of ghats ]                          │
└───────────────────────────────────────────────────────────────┘
```

### Visual rules
- Tier colours: High = red, Medium = amber, Low = green. **Always paired with the word.**
- "Not tested" = grey with a hatched background, never green.
- Source chips read as references: `2023 · Durga · during · p.60`.
- Print stylesheet: brief and ranking each print on one A4 page.

### Export
- **Copy**: plain text, both languages.
- **WhatsApp**: `https://wa.me/?text=<encoded>`, text only, under 1,000 characters.
- **Print / PDF**: browser print with the print stylesheet.
- **CSV**: `/api/export/ranking.csv`.

## 8.5 Backend design

```
routes/ (FastAPI)  →  analysis.* (pure)  +  app/db.py (brief cache)  +  analysis.brief.writer (Claude)
```

- At startup, `app.state` loads the readings DataFrame and limits once and caches rankings per `(data_hash, config_version, cpcb_class)`.
- Routes validate input with Pydantic and FastAPI, call analysis functions, and return Pydantic models.
- The brief endpoint builds facts, checks the cache, calls the writer (Claude or template), validates and stores the result.

## 8.6 Claude integration

Details are in [Agents](09-agents.md). Summary:

- Model `claude-opus-5-5`, overridable with `BRIEF_MODEL`.
- `client.messages.parse(..., output_format=BriefOutput)` with a Pydantic schema → `{en, hi}`.
- Effort `low`: the task is rephrasing given facts.
- On refusal, validation failure (after one retry) or API error → template brief.
- Cached by facts hash, so the same ranking never triggers a second API call.

## 8.7 Build order

See [build-guide/README.md](build-guide/README.md): **Data + AI → Backend → Frontend → Integration**. If time runs short, cut in this order: map → trend chart → class switcher → WhatsApp export → Claude brief. Never cut traceability, missing-data display or the template brief.

## 8.8 After the event

- Add the 2026 Durga readings when MPPCB publishes them. CSV only, no code changes.
- Add the new BMC ghats in `analysis/sites.py`, marked as new.
- Optional: a Cerebras brief writer behind the same `BriefWriter` protocol.

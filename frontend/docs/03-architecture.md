# 3. Architecture

## 3.1 Context

```
                ┌────────────────────────────┐
                │   BMC officer (browser)    │
                └─────────────┬──────────────┘
                              │ HTTP(S)
                ┌─────────────▼──────────────┐
                │  Visarjan Ghat Watch       │
                │  FastAPI + built React app │
                └───────┬─────────────┬──────┘
                        │             │ optional, HTTPS
            local files │             ▼
 (CSV, PDFs, briefs.db) │     ┌───────────────┐
                        ▼     │  Claude API   │
                 ┌──────────┐ │ (brief only)  │
                 │  Disk    │ └───────────────┘
                 └──────────┘
```

There are no connections to government systems. The only outbound call is the optional Claude API request for the brief.

## 3.2 Containers

| Container | Tech | Responsibility |
|---|---|---|
| **Frontend** (`frontend/`) | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, Recharts, react-i18next, Leaflet | Ranking, ghat detail, map, brief view, export |
| **Backend API** (`backend/app/`) | Python 3.12, FastAPI, Uvicorn, Pydantic v2 | Serves ranking, readings and briefs. Holds the API key. Serves PDFs and, in production, the built frontend |
| **Analysis** (`backend/analysis/`) | Python, Pandas, Pydantic, `anthropic` SDK | Loading, status normalisation, CPCB limits, scoring, reasons, brief facts, validator, template, Claude writer |
| **Data** | CSV files in `data/raw/`, loaded into memory at startup | Readings and limits |
| **Brief cache** | SQLite file `backend/briefs.db` | Stored briefs, keyed by facts hash |

`analysis` has no web code and no global state, so it can be tested on its own and run from the CLI. The API is a thin layer over it.

## 3.3 Repository layout

```
visarjan-ghat-watch/
├─ backend/
│  ├─ analysis/              # Part 1 — see build-guide/01-data-ai.md
│  │  ├─ config.py  models.py  status.py  loader.py  limits.py
│  │  ├─ severity.py  scoring.py  reasons.py  coverage.py  sites.py
│  │  ├─ i18n/en.json  i18n/hi.json
│  │  ├─ brief/facts.py  template.py  validator.py  banned.py  writer.py
│  │  └─ cli.py
│  ├─ app/                   # Part 2 — see build-guide/02-backend.md
│  │  ├─ main.py  settings.py  state.py  deps.py  errors.py  db.py
│  │  └─ routes/health.py  ranking.py  ghats.py  readings.py  briefs.py  export.py
│  ├─ tests/analysis/  tests/api/
│  ├─ snapshots/ranking_classB.json
│  └─ pyproject.toml
├─ frontend/                 # Part 3 — see build-guide/03-frontend.md
│  └─ src/api/  features/  components/  i18n/
├─ data/raw/                 # CSVs from the problem pack (unchanged)
├─ data/ghats.geo.json       # ghat coordinates (team-added, sourced)
├─ reports/                  # 2023.pdf, 2024.pdf, 2025.pdf
├─ docs/
├─ .env.example
├─ LICENSE
└─ README.md
```

## 3.4 API

Full endpoint table: [build-guide/02-backend.md](build-guide/02-backend.md#endpoints). Summary:

| Method | Path | Returns |
|---|---|---|
| GET | `/api/health` | `{ok, data_hash, scoring_config_version, llm_available}` |
| GET | `/api/ranking?cpcb_class=B` | Ranked ghats with score, tier, confidence, reasons, reading ids |
| GET | `/api/ghats/{slug}` | Detail: reasons, coverage grid, known gaps, actions |
| GET | `/api/ghats/{slug}/readings` | Filterable readings with source fields |
| GET | `/api/readings/{id}` | One reading as printed, with page |
| GET | `/api/limits`, `/api/parameters` | Reference data |
| POST | `/api/briefs` | `{brief_id, source, en, hi, validation}` |
| GET | `/api/export/ranking.csv` | CSV download |
| GET | `/reports/{year}.pdf` | Static PDF |

JSON is snake_case. The frontend generates its TypeScript types from `/openapi.json`, so the two sides can't drift apart.

```python
class RankedGhat(BaseModel):
    rank: int
    slug: str
    name_en: str
    name_hi: str
    water_body: str
    score: float                                   # 0–100, 1 decimal
    tier: Literal["high", "medium", "low"]
    confidence: Literal["good", "limited", "poor"]
    site_match_confidence: Literal["high", "medium"]
    reasons: list[Reason]                          # each has kind, params, reading_ids
    suggested_actions: list[str]                   # i18n keys
    known_gaps: list[str]                          # i18n keys
```

## 3.5 Deployment

**Primary target, the department laptop (single process):**

```
cd frontend && npm install && npm run build      # → frontend/dist
cd ../backend && uv sync
uv run uvicorn app.main:app --port 8000          # serves API + frontend/dist + /reports
```

**Development:** Uvicorn on `:8000` with `--reload`, and Vite on `:5173` with CORS allowed from `:5173`.

**Optional hosted demo:** one Docker image (Python 3.12-slim, with the frontend built in a Node stage). Runs on any small VM, Render or Fly.io. `briefs.db` on a writable volume.

## 3.6 Architecture decisions

| # | Decision | Alternatives | Why |
|---|---|---|---|
| ADR-1 | Deterministic scoring in code. LLM writes words only | LLM ranks the ghats | Traceability and repeatability are judged. An LLM ranking can't be audited |
| ADR-2 | Python + Pandas for analysis | TypeScript | Solo developer. Pandas makes grouping and pivoting trivial and easy to check in a notebook |
| ADR-3 | FastAPI | Flask, Django, Node | Pydantic models shared with analysis, automatic OpenAPI for frontend types, async |
| ADR-4 | Data in memory, SQLite only for briefs | Postgres, full SQLite schema | 1.5k rows load in milliseconds. Nothing to install. The CSVs stay the single source of truth |
| ADR-5 | React + Vite SPA | Next.js, Streamlit | Polished bilingual UI, static build served by FastAPI |
| ADR-6 | Template brief always available | LLM only | Day-one readiness without keys or network |
| ADR-7 | Reasons as typed objects rendered from i18n | LLM-written reasons | Hindi and English stay identical in meaning and are checked |
| ADR-8 | Bundle MPPCB PDFs locally | Link to mppcb.mp.gov.in | Page links work offline. No reliance on live government systems |
| ADR-9 | Generated TS types from OpenAPI | Hand-written types | One source of truth for the API contract |

## 3.7 Cross-cutting concerns

- **Config:** `.env` read by `pydantic-settings`: `ANTHROPIC_API_KEY` (optional), `BRIEF_MODEL` (default `claude-opus-5-5`), `DATA_DIR`, `REPORTS_DIR`, `DB_PATH`, `CORS_ORIGINS`.
- **Logging:** stdlib `logging` with JSON formatting. Never log the API key or full brief text at info level.
- **Errors:** `AppError(code, status)` → `{error: {code, message}}`. The UI shows bilingual messages.
- **i18n:** reason, action and gap sentences live in `backend/analysis/i18n/` (used by the template brief). UI strings live in `frontend/src/i18n/`. The API returns i18n keys and params, and the frontend renders them.
- **Observability:** `/api/health` exposes the data hash and config version, so anyone can confirm which data a ranking used.

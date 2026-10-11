# Part 2 — Backend

**Goal:** a FastAPI service that exposes Part 1's results to the frontend. **No analysis logic in the API.** Routes call `analysis.*` functions and return Pydantic models.

**Done when:** `uvicorn app.main:app` runs, `/docs` lists every endpoint, the API tests pass, and `GET /api/ranking` returns the same ranking as `python -m analysis.cli rank`.

## Stack

| Need | Tool |
|---|---|
| Framework | FastAPI |
| Server | Uvicorn |
| Models | Pydantic v2 (reused from `analysis.models`) |
| Settings | `pydantic-settings` (reads `.env`) |
| Brief cache | SQLite via the stdlib `sqlite3` module |
| Rate limiting | `slowapi` (only on `POST /api/briefs`) |
| Tests | `pytest` + FastAPI `TestClient` (`httpx`) |
| Static files | FastAPI `StaticFiles` for PDFs and the built frontend |

```bash
cd backend
uv add fastapi "uvicorn[standard]" pydantic-settings slowapi
uv add --dev httpx
```

## Folder structure

```
backend/app/
├─ main.py            # create_app(): CORS, routers, static mounts, startup data load
├─ settings.py        # Settings: anthropic_api_key, brief_model, db_path, cors_origins
├─ state.py           # AppState: readings DataFrame, limits, data_hash, cached rankings
├─ deps.py            # get_state(), get_brief_writer()
├─ errors.py          # AppError → JSON {error: {code, message}}
├─ db.py              # SQLite brief cache: init, get_by_facts_hash, save
└─ routes/
   ├─ health.py
   ├─ ranking.py
   ├─ ghats.py
   ├─ readings.py
   ├─ briefs.py
   └─ export.py
```

## Startup

On startup (`lifespan`):

1. `analysis.loader.load_all(data_dir)` → readings DataFrame, limits, `data_hash`. If validation fails, the app **does not start**, and the error names the file and column.
2. Precompute the Class B ranking and cache it in memory, keyed by `(data_hash, SCORING_CONFIG_VERSION, cpcb_class)`.
3. Open or create the SQLite brief cache.

## Endpoints

| Method | Path | Query / body | Returns |
|---|---|---|---|
| GET | `/api/health` | — | `{ok, data_hash, scoring_config_version, llm_available}` |
| GET | `/api/ranking` | `cpcb_class=B` (A–E) | `{scoring_run_id, generated_at, cpcb_class, ghats: RankedGhat[]}` |
| GET | `/api/ghats/{slug}` | `cpcb_class=B` | Ghat detail: reasons, coverage grid, known gaps, suggested actions |
| GET | `/api/ghats/{slug}/readings` | `parameter`, `year`, `festival`, `phase`, `status` (all optional) | `Reading[]` with `value_as_printed`, `source_page`, `report_url` |
| GET | `/api/readings/{reading_id}` | — | One `Reading` |
| GET | `/api/limits` | `cpcb_class=B` | Limits for that class |
| GET | `/api/parameters` | — | 13 parameters: unit, scored yes/no, label keys |
| POST | `/api/briefs` | `{cpcb_class: "B"}` | `{brief_id, source: "claude"\|"template", en, hi, validation}` |
| GET | `/api/briefs/{brief_id}` | — | Stored brief |
| GET | `/api/export/ranking.csv` | `cpcb_class=B` | CSV download: rank, ghat, score, tier, confidence, reasons (EN), sources |
| GET | `/reports/{year}.pdf` | — | Static PDF. Frontend links to `#page=N` |

Rules:

- `slug` must match `^[a-z0-9-]+$`. An unknown slug returns 404.
- `cpcb_class` is a `Literal["A","B","C","D","E"]`. Anything else returns 422 automatically.
- JSON uses **snake_case** (Python default). The frontend's generated types follow the same names.
- Every `Reading` in a response includes `status`. The API **never** turns `not_sampled` into a number.

## Brief endpoint flow

```
POST /api/briefs
  → ranking = state.ranking(cpcb_class)
  → facts = analysis.brief.facts.build(ranking)
  → if db.get_by_facts_hash(facts.hash): return it          # no repeat API calls
  → brief, source, validation = analysis.brief.generate(facts, writer)
  → db.save(...); return
```

Rate limit: 10 per minute per IP. The Claude call runs in a threadpool (`run_in_threadpool`) so it doesn't block the event loop.

## Settings (`.env`)

```
ANTHROPIC_API_KEY=            # optional; empty → template briefs
BRIEF_MODEL=claude-opus-5-5
DATA_DIR=../data/raw
REPORTS_DIR=../reports
DB_PATH=./briefs.db
CORS_ORIGINS=http://localhost:5173
```

`.env` is git-ignored. Commit `.env.example` with empty values.

## Security checklist

- CORS allows only `CORS_ORIGINS` (the Vite dev server). In production the frontend is served from the same origin.
- Never return or log the API key. `/api/health` returns only `llm_available: bool`.
- No user input reaches the prompt. The brief request takes only `cpcb_class`.
- Static mounts serve fixed directories only.
- Add security headers through a small middleware (`X-Content-Type-Options`, `Referrer-Policy`, CSP for production).

## Tests (must pass before Part 3)

| Test | Expect |
|---|---|
| `GET /api/health` | 200, `llm_available` false when no key |
| `GET /api/ranking` | 200, 7 ghats, ranks 1–7, **equal to `analysis.scoring.rank()` output** |
| `GET /api/ranking?cpcb_class=Z` | 422 |
| `GET /api/ghats/bairagarh-sant-hirdaram-kund` | 200, known gaps include "no Durga 2025" |
| `GET /api/ghats/nope` | 404 with `{error: {code: "NOT_FOUND"}}` |
| `GET /api/ghats/{slug}/readings?status=not_sampled` | Every item has `value: null` |
| `POST /api/briefs` (no key) | 200, `source: "template"`, `validation.ok: true` |
| `POST /api/briefs` twice | Second call returns the same `brief_id` (cache hit) |
| `POST /api/briefs` with a fake writer returning an invented number | `source: "template"` |
| `GET /api/export/ranking.csv` | `text/csv`, 8 lines (header + 7) |

## Run

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
# open http://localhost:8000/docs
```

## Prompt for Claude Code

```
Part 1 (backend/analysis) is done and tested. Read docs/build-guide/02-backend.md and
docs/05-security.md. Build Part 2 only: a FastAPI app in backend/app that exposes the analysis
package. Do not put scoring or data logic in routes — call analysis.* functions and return its
Pydantic models.

Stack: FastAPI, Uvicorn, pydantic-settings, slowapi, stdlib sqlite3 for the brief cache, pytest +
TestClient. Implement every endpoint in the guide's table, the lifespan startup load, the brief
cache by facts hash, CORS from settings, security headers, and static mounts for /reports.

Write the API tests from the guide's table. A test must assert /api/ranking equals
analysis.scoring.rank() for Class B. Never call the real Claude API in tests — inject a fake writer
via dependency override. When finished, run pytest and show me the summary and the list of routes
from /openapi.json.
```

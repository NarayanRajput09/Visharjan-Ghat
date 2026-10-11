# Build Guide — Solo Developer

This guide splits Visarjan Ghat Watch into three parts you build **one at a time**, in this order:

| Order | Part | Stack | Guide |
|---|---|---|---|
| 1 | **Data + AI** | Python 3.12, Pandas, Pydantic, Claude API (`anthropic` SDK) | [01-data-ai.md](01-data-ai.md) |
| 2 | **Backend** | FastAPI, Uvicorn, Pydantic, SQLite (brief cache only) | [02-backend.md](02-backend.md) |
| 3 | **Frontend** | React 19, TypeScript, Vite, Tailwind CSS, Recharts, TanStack Query, react-i18next, Leaflet | [03-frontend.md](03-frontend.md) |
| 4 | **Integration** | Run all three and check the numbers match | [04-integration.md](04-integration.md) |

## Why this order

1. **Data + AI first.** The ranking is the product. If the numbers are wrong, nothing else matters. This part has no web code, just Python functions and tests.
2. **Backend second.** It only exposes what part 1 computes. No analysis logic lives in the API.
3. **Frontend third.** It shows real API data, so you never build screens against fake numbers that later disagree.

## Why this stack (for one person, one day)

| Choice | Reason |
|---|---|
| Python + Pandas for analysis | Filtering, grouping and pivoting 1,524 readings is a few lines in Pandas. Easy to check in a notebook |
| FastAPI | Typed endpoints from Pydantic models, free OpenAPI docs at `/docs`, and the frontend can generate types from them |
| Data in memory, not a database | The data is small. Load the CSVs at startup, about 50 ms. SQLite is used only to cache AI briefs |
| React + TypeScript + Tailwind | Polished, bilingual, accessible UI quickly. Recharts for trend lines |
| Claude (`claude-opus-5-5`) for the brief only | Good Hindi and structured JSON output. The ranking stays in code, so it's traceable |
| Template brief fallback | The tool works with no API key and no internet |

Cerebras is allowed by the event rules. The brief writer sits behind an interface (see [01-data-ai.md §7](01-data-ai.md#step-7--brief-writer-claude)), so you could add a Cerebras writer later. Version 1 uses Claude plus the template.

## Final repo layout

```
visarjan-ghat-watch/
├─ backend/
│  ├─ analysis/          # Part 1: pure Python, no web code
│  ├─ app/               # Part 2: FastAPI
│  ├─ tests/
│  └─ pyproject.toml
├─ frontend/             # Part 3: React app
├─ data/raw/             # CSVs copied unchanged from the problem pack
├─ reports/              # MPPCB PDFs (2023.pdf, 2024.pdf, 2025.pdf)
├─ docs/
├─ .env.example
├─ LICENSE
└─ README.md
```

## How to work with Claude Code

- Paste **one** part's "Prompt for Claude Code" block at a time.
- When that part is done, run its checks yourself (`pytest`, open `/docs`, open the page). Fix problems before moving on.
- Commit after each part: `feat(analysis): …`, `feat(api): …`, `feat(web): …`.
- The reference docs (`docs/01-prd.md` to `docs/09-agents.md`) are the source of truth for rules. The build guides tell you the order of work.

## Time budget (event day)

| Time | Work |
|---|---|
| 10:15–12:30 | Part 1: Data + AI (loader, scoring, reasons, tests). Brief can wait |
| 12:30–13:30 | Part 2: Backend endpoints |
| 13:30–15:30 | Part 3: Frontend |
| 15:30–16:00 | Part 1 extra: Claude brief + validator. Integration checks |
| 16:00 | Record demo. README, LICENSE, secret scan, repo public |
| 17:00 | Submit |

If you are running late, cut the map, then the trend chart, then the Claude brief, in that order. The template brief still works.

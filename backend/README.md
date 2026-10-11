# Visarjan Ghat Watch — Backend

FastAPI backend and pure analytical engine (`analysis`) built for the Bhopal Municipal Corporation (BMC) officer preparing Durga visarjan on **20 October 2026**.

The service evaluates official MPPCB water test records (2023–2025) across Bhopal immersion ghats against CPCB Class B bathing limits, produces deterministic risk scores and rank explanations, links every number to the source PDF report page, and generates validated planning briefs.

---

## Architecture & Layers

- **`backend/analysis/` (Pure Analysis Layer):**
  - Pure Python functions, no web frameworks, no global mutable state.
  - `status.py`: Strict status normalization (`measured`, `bdl`, `nd`, `not_sampled`).
  - `loader.py`: Raw CSV ingestion and integrity validation (1,524 rows, 7 sites, 116 DO, 112 BOD).
  - `limits.py`: CPCB criteria parser for classes A to E.
  - `severity.py`: Reading severity calculation $s \in [0, 1]$ based on legal deviations.
  - `scoring.py`: Weighted risk scoring, tier and confidence classification, tie-breaking.
  - `reasons.py`: Typed reasons with reading IDs for complete report traceability.
  - `coverage.py`: Year × Festival × Phase sampling grid.
  - `brief/`: Facts generator, template writer, safety validator, and Claude writer.
  - `cli.py`: Standalone CLI (`python -m analysis.cli rank` / `brief`).

- **`backend/app/` (FastAPI Web Service):**
  - Thin REST API layer over `analysis`.
  - SQLite brief cache (`db.py`) keyed by facts hash to prevent redundant LLM invocations.
  - In-memory data loading on startup (`state.py`).
  - Security headers and CORS configuration.
  - Static mounts for PDF reports (`/reports/{year}.pdf`) and compiled frontend.

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status, data hash, scoring version, and LLM availability |
| `GET` | `/api/ranking?cpcb_class=B` | Ranked ghats with risk score, tier, confidence, and primary reason |
| `GET` | `/api/ghats/{slug}?cpcb_class=B` | Full ghat detail: reasons, coverage grid, known gaps, actions |
| `GET` | `/api/ghats/{slug}/readings` | Filterable readings with PDF page traceability |
| `GET` | `/api/readings/{reading_id}` | Individual reading detail |
| `GET` | `/api/limits?cpcb_class=B` | Official CPCB limits for selected class |
| `GET` | `/api/parameters` | All 13 parameters with units and scored status |
| `POST` | `/api/briefs` | Generates / returns cached planning brief (bilingual) |
| `GET` | `/api/briefs/{brief_id}` | Retrieves stored brief by ID |
| `GET` | `/api/export/ranking.csv` | Downloadable CSV ranking |
| `GET` | `/reports/{year}.pdf` | Static MPPCB report PDFs (supports `#page=N`) |

---

## Quickstart

```bash
# 1. From the backend folder:
cd backend

# 2. Run CLI commands directly:
python -m analysis.cli rank
python -m analysis.cli brief

# 3. Start the FastAPI development server:
uvicorn app.main:app --reload --port 8000

# Interactive API documentation:
# Open http://localhost:8000/docs
```

---

## Running Tests

```bash
# Run full pytest suite (analysis + api):
pytest tests -v
```

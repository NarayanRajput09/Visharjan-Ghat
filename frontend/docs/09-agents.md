# 9. Agents

This document covers two kinds of agent:

- **Part A — Product agents:** the AI components inside Visarjan Ghat Watch.
- **Part B — Coding agents:** rules for Claude Code (or any AI coding assistant) working in this repo.

---

## Part A — Product agents

### A.1 Design stance

The AI does **one** job in the product: turn computed facts into a short, readable brief in Hindi and English. It does not rank, score, read PDFs at runtime, or decide actions.

That keeps the jury's requirements safe:

| Requirement | How the agent design protects it |
|---|---|
| Ranking traceable to readings and limits | Ranking is computed in code before the agent runs |
| Missing data never shown as clean | Gaps are explicit fields in the facts. The validator requires them in the brief |
| No unsupported health claims | Forbidden in the prompt, checked by the validator |
| Brief readable by a BMC officer | Structured output with length limits. Hindi reviewed by a human in eval |

Each agent is a single, bounded Claude call. None of them is an open-ended autonomous loop.

### A.2 Agent overview

| Agent | When it runs | Model | Required? |
|---|---|---|---|
| **Brief Writer** | Officer clicks "Make brief" | `claude-opus-5-5` | No, template fallback |
| **Brief Validator** | After every draft | Deterministic code (no LLM) | Yes |
| **Translation Checker** (optional) | During `analysis.eval_brief` only | `claude-haiku-5-5` | No |
| **PDF Verifier** (dev tool) | Run by hand by the domain teammate | `claude-opus-5-5` | No |

```
Scoring run ──► BriefFacts ──► Brief Writer ──► Brief Validator ──┬─ pass ─► store + show ("Written by AI, checked")
                    │              (Claude)                         │
                    │                                               └─ fail ─► 1 retry with errors ─► fail ─► Template
                    └──────────────────────────────────────────────────────────────────────────────► Template (no key)
```

### A.3 Brief Writer

**Input: `BriefFacts`** (built by `analysis/brief/facts.py`, never by the LLM):

```python
class Bilingual(BaseModel):
    en: str
    hi: str

class BriefGhat(BaseModel):
    rank: int
    name_en: str
    name_hi: str
    tier: Literal["high", "medium", "low"]
    confidence: Literal["good", "limited", "poor"]
    reasons: list[Bilingual]               # pre-rendered from i18n templates
    suggested_actions: list[Bilingual]

class BriefFacts(BaseModel):
    visarjan_date: str = "2026-10-20"
    cpcb_class: Literal["A", "B", "C", "D", "E"] = "B"
    top_ghats: list[BriefGhat]
    data_gaps: list[Bilingual]
    allowed_numbers: list[float]           # every number the brief may contain
    source_line: Bilingual                 # "Source: MPPCB visarjan reports 2023–2025, pages …"
```

**Output schema** (Pydantic, enforced with structured outputs):

```python
class BriefSection(BaseModel):
    headline: str                          # ≤ 15 words (checked by validator)
    top_risks: list[str]                   # one line per ghat, max 3
    actions: list[str]                     # max 4
    data_gaps: list[str]                   # max 3
    source_line: str

class BriefOutput(BaseModel):
    en: BriefSection
    hi: BriefSection
```

List lengths and word counts are enforced by the validator (§A.4), not by the schema.

**System prompt** (`backend/analysis/brief/prompts/brief_writer_v1.md`, versioned):

```
You write a short planning brief for a Bhopal Municipal Corporation officer who is preparing
Durga visarjan on 20 October 2026. You get facts computed from MPPCB water-test reports.

Rules:
- Use only the facts given. Every number you write must appear in allowed_numbers.
- Report readings against the CPCB Class B (bathing) limits. Do not say what will happen to
  people's health, and do not call water "safe", "unsafe", "toxic" or "poisonous".
- If a ghat has missing tests, say so plainly. Never describe missing data as clean.
- Say "suggested" for actions. The officer decides.
- Write simple, direct sentences. Hindi should be everyday administrative Hindi in Devanagari,
  not a word-by-word translation of the English. Keep ghat names exactly as given.
- Each language: headline of 15 words or fewer, and the whole brief under 150 words.
```

The user message is the `BriefFacts` JSON. Nothing else goes in: no PDF text and no free text from the user.

**Call** (Python, `anthropic` SDK):

```python
import anthropic

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

response = client.messages.parse(
    model=settings.brief_model,            # default "claude-opus-5-5"
    max_tokens=16000,
    system=BRIEF_WRITER_PROMPT_V1,
    messages=[{"role": "user", "content": facts.model_dump_json()}],
    output_format=BriefOutput,
    output_config={"effort": "low"},
)

if response.stop_reason == "refusal" or response.parsed_output is None:
    return template_writer.write(facts)    # never block the officer
```

Notes:
- Opus 5.5 always thinks, and `effort` controls how much. `low` suits rephrasing. Raise it to `medium` only if eval shows quality gaps.
- When implementing, consider the API's server-side refusal `fallbacks` option. Our template fallback covers the same case either way.
- Catch SDK errors by type (rate limit, connection, API status) and fall back to the template. Don't retry more than once during a live demo.
- The prompt is short, so prompt caching gives little benefit. Instead, briefs are cached in SQLite by `facts_hash`.

### A.4 Brief Validator (deterministic)

`analysis/brief/validator.py`, pure and unit-tested. A draft passes only if **all** checks pass:

| Check | Rule |
|---|---|
| Schema | Parses with `BriefOutput` |
| Numbers | Every number in the text (ASCII digits and Devanagari digits ०–९, decimals included) is in `allowed_numbers`. Years and page numbers are added to `allowed_numbers` by the facts builder |
| Ghat names | Each `top_ghats[].name_en` / `name_hi` appears in its language. No other ghat names from the site list appear |
| Data gaps | If any top ghat has confidence ≠ good, `data_gaps` is not empty |
| Lists | `top_risks` ≤ 3, `actions` ≤ 4, `data_gaps` ≤ 3 |
| Banned phrases | None of the list in `analysis/brief/banned.py` (EN + HI: "unsafe", "safe to bathe", "toxic", "poison", "disease", "health risk", "असुरक्षित", "ज़हरीला", "बीमारी", "स्वास्थ्य को खतरा", …) |
| Length | ≤ 150 words per language, headline ≤ 15 words |

The result `{ ok, errors[] }` is stored with the brief. On failure, the writer gets one retry with the errors appended as a second user message. A second failure falls back to the template.

### A.5 Template brief (the always-on fallback)

`analysis/brief/template.py` builds both languages from the same `BriefFacts` using hand-written i18n templates that the Hindi teammate has reviewed. It always passes the validator, and a test enforces that. The UI labels it "Written from template".

### A.6 Translation Checker (eval only)

During `python -m analysis.eval_brief`, a `claude-haiku-5-5` call compares the `en` and `hi` sections and returns `{same_facts: bool, differences: list[str]}` as structured output. It's a cheap screen before human review. It never runs in production and never replaces the native-speaker check.

### A.7 PDF Verifier (developer tool)

`backend/scripts/verify_readings.py`: helps the domain teammate spot-check CSV rows against the original PDFs.

1. Pick N readings that are used in reasons (default 10).
2. For each, send the PDF page as a document block with citations on, and ask: "What value is printed for `<parameter_as_printed>` at `<site_as_printed>` in the `<phase>` column?"
3. Compare the answer with `value_as_printed` and write `docs/verification-log.md` with the citation text.
4. **A human opens each page and confirms.** The agent speeds up the check. It doesn't replace it.

This runs on a teammate's machine. It never runs in the app, and it never contacts government sites (PDFs come from the pack).

### A.8 Evaluation and monitoring

- `python -m analysis.eval_brief` (see [Testing §6.8](06-testing.md#68-llm-brief-evaluation)) is run before the demo and after every prompt change. Results are saved with the prompt version.
- In production, logs record `brief_generated` / `brief_rejected` with the validator errors (no brief text at info level).
- Prompt files are versioned (`brief_writer_v1.md`, `v2` …). The version is stored on each brief.

---

## Part B — Coding agents in this repo

These rules apply to Claude Code and any other AI coding assistant. Copy them into `CLAUDE.md` / `AGENTS.md` at the repo root.

### B.1 Must

- Read `docs/` before changing behaviour. Scoring changes must follow [System Design §2.4](02-system-design.md#24-risk-scoring-method) or update it in the same change.
- Keep `backend/analysis` pure: no FastAPI imports, no global state, no `datetime.now()`. Network only in `brief/writer.py`.
- Keep API routes thin. No Pandas or scoring logic in `backend/app/routes`.
- Treat `not_sampled` as missing everywhere. Never `fillna(0)`, `or 0`, `?? 0` or `|| 0` on readings.
- Add or update tests with every behaviour change. Run the checks in [Code Style §7.1](07-code-style.md#71-tooling-enforced) before saying a task is done, and report failures honestly.
- Add every UI string to **both** `frontend/src/i18n/en.json` and `hi.json`. Note new Hindi strings in `docs/hi-review.md` until a native speaker checks them.
- Use the model ID from config (`BRIEF_MODEL`). Never hard-code keys.
- Build in the order of [build-guide/](build-guide/README.md): Data + AI → Backend → Frontend.

### B.2 Must not

- Commit secrets, `.env`, or `briefs.db`.
- Change files in `data/raw/`. They are the pack data. Fix data issues in the loader, with a test and a comment citing the PDF page.
- Fetch from, scrape or call any government website or API.
- Add health-impact language to UI strings, prompts or templates.
- Let the LLM compute or change rankings, scores or numbers.
- Do calculations in the frontend. It formats what the API returns.
- Update `snapshots/ranking_classB.json` without saying why the ranking moved.
- Add dependencies without a one-line reason.

### B.3 Useful commands

| Command (from) | What it does |
|---|---|
| `uv run pytest` (backend) | All Python tests |
| `uv run python -m analysis.cli rank` (backend) | Print the ranking |
| `uv run uvicorn app.main:app --reload` (backend) | API on :8000, docs at `/docs` |
| `uv run python -m analysis.eval_brief` (backend) | LLM brief evaluation (uses the API and costs money) |
| `uv run python scripts/verify_readings.py` (backend) | PDF spot-check helper (uses the API) |
| `npm run dev` (frontend) | Web on :5173 |
| `npm run test` / `npx playwright test` (frontend) | Component / end-to-end tests |
| `npx openapi-typescript http://localhost:8000/openapi.json -o src/api/schema.d.ts` (frontend) | Regenerate API types |

### B.4 Work split

The project is built by one developer in three sequential Claude Code sessions, each with its own "Prompt for Claude Code" in the build guide:

| Session | Files it owns | Hand-off contract |
|---|---|---|
| 1. Data + AI | `backend/analysis`, `backend/tests/analysis` | Golden + property tests green, `analysis.cli rank` works |
| 2. Backend | `backend/app`, `backend/tests/api` | `/api/ranking` equals `analysis.scoring.rank()`, `/openapi.json` stable |
| 3. Frontend | `frontend/` | Uses generated types only. Playwright officer flow green against the real API |

Don't start a session until the previous one's hand-off contract is met.

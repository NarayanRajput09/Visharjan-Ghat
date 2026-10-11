# Part 1 — Data + AI

**Goal:** pure Python functions that load the pack CSVs, compare readings with CPCB limits, rank the 7 ghats with reasons that point back to report pages, and produce a Hindi and English brief. No web code in this part.

**Done when:** `pytest` passes, including the golden checks (1,524 rows · 42/116 DO < 5 · 100/112 BOD > 3), and `python -m analysis.cli rank` prints a ranked table.

## Stack

| Need | Tool |
|---|---|
| Language | Python 3.12 |
| Package manager | `uv` (or `pip` + `venv`) |
| Data | `pandas` |
| Models / validation | `pydantic` v2 |
| AI | `anthropic` (official Claude SDK) |
| Tests | `pytest`, `hypothesis` (property tests) |
| Lint / types | `ruff`, `mypy --strict` |
| Explore (optional) | Jupyter notebook in `notebooks/` |

## Folder structure

```
backend/
├─ analysis/
│  ├─ __init__.py
│  ├─ config.py        # paths, scoring weights, SCORING_CONFIG_VERSION
│  ├─ models.py        # Pydantic models: Reading, RankedGhat, Reason, BriefFacts, BriefOutput
│  ├─ status.py        # value/flag → 'measured' | 'bdl' | 'nd' | 'not_sampled'
│  ├─ loader.py        # read + validate CSVs → readings DataFrame
│  ├─ limits.py        # CPCB classes from cpcb_water_quality_criteria.csv
│  ├─ severity.py      # per-reading severity 0..1
│  ├─ scoring.py       # ghat score, tier, confidence, ranking
│  ├─ reasons.py       # typed reasons with reading ids
│  ├─ coverage.py      # what was / wasn't tested per ghat
│  ├─ sites.py         # 7 ghats: slug, Hindi name, notes, coordinates
│  ├─ i18n/en.json     # reason, action and gap sentences
│  ├─ i18n/hi.json
│  ├─ brief/
│  │  ├─ facts.py      # BriefFacts from a ranking
│  │  ├─ template.py   # always-works brief
│  │  ├─ validator.py  # numbers, names, banned phrases, length
│  │  ├─ banned.py     # banned health phrases EN + HI
│  │  └─ writer.py     # BriefWriter protocol, ClaudeBriefWriter, TemplateBriefWriter
│  └─ cli.py           # python -m analysis.cli rank | brief
└─ tests/analysis/
```

## Steps

### Step 1 — Set up

```bash
mkdir -p visarjan-ghat-watch/backend visarjan-ghat-watch/data/raw visarjan-ghat-watch/reports
cp <pack>/data/*.csv visarjan-ghat-watch/data/raw/
cp <pack>/resources/*visarjan* <pack>/resources/Idol_immer* visarjan-ghat-watch/reports/   # rename to 2023.pdf, 2024.pdf, 2025.pdf
cd visarjan-ghat-watch/backend
uv init --python 3.12 && uv add pandas pydantic anthropic && uv add --dev pytest hypothesis ruff mypy pandas-stubs
```

### Step 2 — Status normalisation (`status.py`)

This is the single most important function. Get it right and test it first.

| `value` | `flag` / `value_as_printed` | status |
|---|---|---|
| a number | — | `measured` |
| empty | `BDL` | `bdl` |
| empty | `ND` | `nd` |
| empty | `not sampled`, `*`, `**`, blank, `_`, `-` | `not_sampled` |
| empty | anything else | **raise `UnknownStatusError`** |

The current Bhopal file has flags: blank (1,289), `BDL` (174), `not sampled` (57), `*` (2), `**` (2).

**Never fill missing values with 0.** No `fillna(0)` on `value`, anywhere.

### Step 3 — Loader (`loader.py`)

- Read `bhopal_ghats_2023_2025.csv` with `dtype=str`, then convert `value` with `pd.to_numeric(errors="coerce")` only where status is `measured`.
- Add columns: `reading_id` (row number, stable), `status`, `site_slug`.
- Check the headers match the data dictionary. Raise a clear error naming the missing column.
- Return a DataFrame. Also compute `data_hash` (sha256 of the raw files).
- Load the CPCB criteria and parse ranges like `6.5-8.5`.

### Step 4 — Severity and scoring (`severity.py`, `scoring.py`)

Implement exactly as in [System Design §2.4](../02-system-design.md#24-risk-scoring-method):

- Severity: DO `clamp((5−v)/5)`, BOD `clamp((v−3)/9)`, pH `clamp(distance outside 6.5–8.5 / 1.5)`. DO with BDL → 1. BOD with BDL → 0.
- Weights: parameter DO 0.45 / BOD 0.35 / pH 0.20 · year 2025 1.0 / 2024 0.7 / 2023 0.5 · Durga 1.0 / Ganesh 0.8 · phase during 1.0 / after 1.0 / pre 0.6.
- `score = 100 × Σ(w·s) / Σw` over **sampled** readings only.
- Tier: High ≥ 40, or any Durga DO ≤ 2 in the last two years. Medium 15–40. Low < 15.
- Confidence: Good ≥ 12 sampled + Durga data in 2024/2025 · Limited 6–11 or no recent Durga · Poor < 6.
- Ties: lower minimum DO → higher maximum BOD → name.
- All weights go in `config.py` with `SCORING_CONFIG_VERSION = "1.0"`.

Pandas sketch:

```python
scored = df[df.parameter.isin(SCORED_PARAMS) & (df.status != "not_sampled")].copy()
scored["s"] = scored.apply(severity_for_row, axis=1, args=(limits,))
scored["w"] = (scored.parameter.map(cfg.param_w) * scored.year.map(cfg.year_w)
               * scored.festival.map(cfg.festival_w) * scored.phase.map(cfg.phase_w))
g = scored.groupby("site_slug")
score = 100 * (g.apply(lambda x: (x.w * x.s).sum()) / g.w.sum())
```

### Step 5 — Reasons and coverage (`reasons.py`, `coverage.py`)

- Up to 3 reasons per ghat, in this priority: worst failing DO → BOD exceedance count ("X of Y tests") → trend → pH out of range → data gap.
- Each reason is `Reason(kind, params: dict, reading_ids: list[int])`. No free text inside the model. Text comes from `i18n/en.json` and `hi.json`.
- Coverage: a year × festival × phase grid with `sampled` / `missing` counts per ghat.
- Known gaps: Bairagarh and Malikhedi have **no Durga 2025 table**. Rani Kamlapati / Kamla Park has `site_match_confidence = medium` and may be two places.

### Step 6 — Template brief and validator (`brief/`)

- `facts.py`: build `BriefFacts` (top 3 ghats, reasons, suggested actions, data gaps, source line, `allowed_numbers`).
- `template.py`: render both languages from i18n sentences. Must always pass the validator.
- `validator.py` checks:
  - every number in the text (`0-9` and Devanagari `०-९`) is in `allowed_numbers`
  - the top ghat names are present
  - `data_gaps` is not empty when confidence isn't good
  - no banned phrases (`banned.py`: "unsafe", "toxic", "disease", "health risk", "असुरक्षित", "ज़हरीला", "बीमारी", …)
  - each language is 150 words or fewer, and the headline is 15 words or fewer

### Step 7 — Brief writer (Claude)

```python
from typing import Protocol
import anthropic
from analysis.models import BriefFacts, BriefOutput

class BriefWriter(Protocol):
    def write(self, facts: BriefFacts) -> tuple[BriefOutput, str]: ...   # (brief, source)

class ClaudeBriefWriter:
    def __init__(self, model: str = "claude-opus-5-5") -> None:
        self.client = anthropic.Anthropic()          # reads ANTHROPIC_API_KEY
        self.model = model

    def write(self, facts: BriefFacts) -> tuple[BriefOutput, str]:
        response = self.client.messages.parse(
            model=self.model,
            max_tokens=16000,
            system=BRIEF_PROMPT_V1,                  # from docs/09-agents.md §A.3
            messages=[{"role": "user", "content": facts.model_dump_json()}],
            output_format=BriefOutput,
            output_config={"effort": "low"},
        )
        if response.stop_reason == "refusal" or response.parsed_output is None:
            raise BriefRejected("model refused or returned no output")
        return response.parsed_output, "claude"
```

Flow in `generate_brief(facts)`:

1. No API key → template.
2. Claude draft → validate. If it fails, retry once with the errors added. If it fails again → template.
3. Catch `anthropic.RateLimitError`, `anthropic.APIConnectionError` and `anthropic.APIStatusError` → template.
4. Return the brief, its source (`claude` or `template`) and the validation result.

### Step 8 — CLI

```bash
uv run python -m analysis.cli rank            # table: rank, ghat, score, tier, confidence, top reason
uv run python -m analysis.cli rank --class C  # compare against another class
uv run python -m analysis.cli brief           # prints hi + en brief, and says claude or template
```

## Tests (must pass before Part 2)

| File | What it checks |
|---|---|
| `test_status.py` | Every row of the Step 2 table, plus unknown → error |
| `test_golden.py` | 1,524 rows · 7 sites · 116 DO measured, 42 < 5 · 112 BOD measured, 100 > 3 · 4 zero-DO readings at Bairagarh · no Durga 2025 for Bairagarh or Malikhedi |
| `test_severity.py` | DO 0 → 1, DO 2.5 → 0.5, DO 5 → 0 · BOD 12 → 1 · pH 9.25 → 0.5 · DO BDL → 1 |
| `test_scoring.py` | Tier boundaries (40, 15), DO override, confidence boundaries, tie-break |
| `test_properties.py` (hypothesis) | Adding `not_sampled` rows doesn't change scores · lower DO never lowers a score · score in [0, 100] · shuffling rows doesn't change the ranking |
| `test_ranking_snapshot.py` | Full Class B ranking equals `snapshots/ranking_classB.json` |
| `test_reasons.py` | Reasons carry correct reading ids. Every reason kind has an `en` and a `hi` string |
| `test_validator.py` | Rejects an invented number, a banned phrase, a missing gap note, and over-length text. The template brief always passes |
| `test_writer.py` | Fake Claude client: a bad draft falls back to the template. No key → template |

Tests never call the real API.

## Prompt for Claude Code

```
Read docs/01-prd.md, docs/02-system-design.md (§2.3–2.5), docs/09-agents.md (Part A), and
docs/build-guide/01-data-ai.md. Build Part 1 (Data + AI) only, in backend/analysis, exactly as the
build guide describes. Python 3.12, pandas, pydantic v2, anthropic SDK, pytest, hypothesis, ruff,
mypy --strict. Data is in data/raw/.

Rules: never treat 'not sampled' as 0 or as clean; BDL is measured-but-low; no health claims;
ranking is computed in code, Claude only writes the brief; every reason carries reading_ids;
weights live in analysis/config.py.

Work in this order and run pytest after each: status.py → loader.py + golden tests → severity/scoring
+ property tests → reasons/coverage → brief template + validator → Claude writer with a fake-client
test → cli.py. Do not build any web/API code. When finished, show me the output of
`python -m analysis.cli rank` and the pytest summary.
```

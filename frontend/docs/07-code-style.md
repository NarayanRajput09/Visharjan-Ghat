# 7. Code Style

The code is handed to a government department. Write it so someone new can read it in a year.

## 7.1 Tooling (enforced)

| Area | Tool | Config |
|---|---|---|
| Python | Python 3.12, `uv` | `.python-version`, `uv.lock` committed |
| Python lint + format | `ruff` | `line-length = 100`, rules `E,F,I,B,UP,SIM,N,RUF` |
| Python types | `mypy --strict` | Pydantic plugin on, `pandas-stubs` installed |
| TypeScript | TS 5, `strict`, `noUncheckedIndexedAccess` | `frontend/tsconfig.json` |
| TS lint + format | ESLint (typescript-eslint, react-hooks, jsx-a11y) + Prettier | `printWidth: 100`, `singleQuote: true` |
| Git hooks | `pre-commit` | ruff, mypy, prettier, eslint, gitleaks |

Before pushing:

```bash
cd backend  && uv run ruff check . && uv run ruff format --check . && uv run mypy . && uv run pytest
cd frontend && npm run lint && npm run typecheck && npm run test
```

## 7.2 Domain rules (both languages)

- **Missing is not zero.** Never `fillna(0)`, `or 0`, `?? 0` or `|| 0` on reading values. A `not_sampled` reading has `value = None/null` and `status = "not_sampled"`.
- **Status drives logic, not the value.** Check `status` before using `value`.
- **Use domain words from the data dictionary:** ghat, reading, parameter, phase (`pre`/`during`/`after`), festival, BDL, not sampled. Don't invent synonyms like "sample", "location" or "test point".
- **No health language** in strings, prompts or templates.
- **Scoring choices link to the doc:** `# See docs/02-system-design.md §2.4 Step 2`.

## 7.3 Python (`backend/`)

### Structure
- `analysis/` is **pure**: no FastAPI imports, no global state, no `datetime.now()` (pass time in), no network except in `brief/writer.py`.
- `app/` is a thin web layer. Routes validate, call `analysis`, and return models. No Pandas in routes.

### Typing and models
- Type hints on every function. `mypy --strict` must pass.
- Domain objects are Pydantic v2 models with `model_config = ConfigDict(frozen=True)`.
- Use `Literal[...]` for closed sets (`tier`, `status`, `phase`) instead of bare strings.
- Model missing data explicitly:

  ```python
  Status = Literal["measured", "bdl", "nd", "not_sampled"]

  class Reading(BaseModel):
      model_config = ConfigDict(frozen=True)
      reading_id: int
      site_slug: str
      parameter: str
      year: int
      festival: Literal["Ganesh", "Durga"]
      phase: Literal["pre", "during", "after"]
      status: Status
      value: float | None            # None unless status == "measured"
      value_as_printed: str | None
      source_page: int
  ```

### Pandas
- Read CSVs with `dtype=str`, then convert explicitly. Never let Pandas guess types.
- Prefer vectorised operations and `groupby`. Use `.apply` only where it reads more clearly.
- Don't mutate inputs: `df = df.copy()` before adding columns in a function that receives a DataFrame.
- Name DataFrames by content: `readings`, `scored`, `coverage`, never `df2`.
- Functions that return DataFrames document their columns in the docstring.

### Naming
| Thing | Convention | Example |
|---|---|---|
| Modules | snake_case | `scoring.py` |
| Functions / variables | snake_case | `score_ghat`, `do_min_mg_per_l` |
| Classes / models | PascalCase | `RankedGhat`, `BriefFacts` |
| Constants | UPPER_SNAKE | `SCORING_CONFIG_VERSION`, `CLASS_B_LIMITS` |
| Units in names | Suffix when a raw number crosses a boundary | `conductivity_us_per_cm` |

### Errors
- Use custom exceptions (`UnknownStatusError`, `DataValidationError`, `BriefRejected`). Never use a bare `except:`.
- Catch Anthropic SDK errors by type (`anthropic.RateLimitError`, `APIConnectionError`, `APIStatusError`). Don't match on error message strings.
- In `app/errors.py`, map exceptions to `{error: {code, message}}` in one place.

### Example

```python
def do_severity(status: Status, value: float | None, min_mg_per_l: float) -> float | None:
    """Severity of a dissolved-oxygen reading, from 0 (passes) to 1 (worst). None if not sampled."""
    if status == "not_sampled":
        return None  # missing: excluded from scoring, never treated as clean
    if status in ("bdl", "nd"):
        return 1.0  # oxygen too low to detect
    assert value is not None
    return clamp((min_mg_per_l - value) / min_mg_per_l, 0.0, 1.0)
```

## 7.4 TypeScript and React (`frontend/`)

### TypeScript
- **No `any`.** Use `unknown` and narrow it. `@ts-ignore` is banned.
- **API types are generated** (`src/api/schema.d.ts` from `/openapi.json`). Don't hand-write response types.
- Named exports only. Prefer `type` over `interface`. Use union types instead of `enum`.
- No floating promises.

### React
- Function components with hooks only.
- **Feature folders** (`features/ranking/…`). Components shared by two or more features move to `components/`.
- **Server state through TanStack Query** with array keys (`['ranking', cpcbClass]`). Don't copy server data into `useState`.
- **No calculations in the UI.** Scores, tiers and reasons come from the API. The UI formats them.
- Props typed as `type Props = {...}` and destructured in the signature. Prefer a `variant` union over many boolean props.
- **Styling:** Tailwind with tokens defined once (`tier-high`, `tier-medium`, `tier-low`, `status-missing`).
- **Accessibility:** keyboard reachable, `aria-label` on icon buttons, colour never the only signal.
- **Text:** never hard-code user-facing strings. Always use `t('key')`. Enforce with `i18next/no-literal-string` in `src/features`.
- **Numbers and dates:** `Intl.NumberFormat` / `Intl.DateTimeFormat` with `hi-IN` / `en-IN`.
- `dangerouslySetInnerHTML` is banned.

### Naming
| Thing | Convention | Example |
|---|---|---|
| Components | PascalCase file and name | `TierBadge.tsx` |
| Hooks | `useX` | `useRanking` |
| Other modules | camelCase | `formatValue.ts` |
| i18n keys | dot.case by feature | `ranking.tier.high`, `reading.status.not_sampled` |

### Example

```tsx
type Props = { reading: components['schemas']['Reading'] };

export function ReadingCell({ reading }: Props) {
  const { t } = useTranslation();
  switch (reading.status) {
    case 'measured':
      return <td>{formatValue(reading.value, reading.unit_assumed)}</td>;
    case 'bdl':
    case 'nd':
      return <td>{t(`reading.status.${reading.status}`)}</td>;
    case 'not_sampled':
      return <td className="bg-status-missing text-gray-600">{t('reading.status.not_sampled')}</td>;
  }
}
```

## 7.5 API conventions

- One router file per resource in `app/routes/`.
- JSON keys are snake_case, matching the Pydantic models. The frontend uses the generated names as-is.
- Error body: `{ "error": { "code": "NOT_FOUND", "message": "..." } }`.

## 7.6 Comments and docs

- Comment **why**, not what.
- Every public function in `analysis` has a one-line docstring.
- No commented-out code in `main`.

## 7.7 Git

- Branches: `feat/ranking-page`, `fix/bdl-do-severity`, `docs/prd`.
- **Conventional Commits:** `feat(analysis): add DO severity`, `feat(api): ranking endpoint`, `fix(web): grey not-sampled cells`.
- Commit after each build part passes its tests.
- On the event day, pushing to `main` is fine if tests pass.

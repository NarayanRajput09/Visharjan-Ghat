# 6. Testing

## 6.1 Strategy

The things the jury checks are the things we test hardest:

1. The ranking is traceable to readings and CPCB limits.
2. Missing data never shows as clean.
3. The brief contains only true numbers and no health claims.

| Layer | Tool | Scope | Runs |
|---|---|---|---|
| Unit | pytest | `backend/analysis`: status, severity, scoring, tiers, reasons, validator, template | Every save / commit |
| Property | hypothesis | Scoring invariants | Every commit |
| Data / golden | pytest | Load the real pack CSVs and assert the known facts | Every commit |
| API | pytest + FastAPI `TestClient` | Routes, validation, error codes | Every commit |
| Component | Vitest + Testing Library | Badges, readings table, missing-data cells, language switch | Every commit |
| End-to-end | Playwright | The officer's full flow, in both languages | Pre-push / CI |
| Accessibility | @axe-core/playwright | Ranking, detail and brief pages | CI |
| LLM evaluation | Vitest script + human review | Brief fidelity and readability | Before demo, and when prompts change |

Coverage target: **90%+ lines on `backend/analysis`** (`pytest --cov=analysis`). Other packages are covered by their behaviour tests, not a number.

## 6.2 Unit tests — analysis

### Status normalisation
| Input (`value`, `flag`, `value_as_printed`) | Expected status |
|---|---|
| `2.5`, ``, `2.5` | `measured` |
| ``, `BDL`, `BDL` | `bdl` |
| ``, ``, `ND` | `nd` |
| ``, `not sampled`, `` | `not_sampled` |
| ``, `*`, `*` / ``, `**`, `**` | `not_sampled` |
| ``, ``, `abc` | raises `UnknownStatusError` |

### Severity
- DO 0 → 1.0. DO 5 → 0. DO 7 → 0. DO 2.5 → 0.5.
- BOD 3 → 0. BOD 12 → 1. BOD 30 → 1 (clamped).
- pH 7 → 0. pH 9.25 → 0.5. pH 5.0 → 1.
- DO with status `bdl` → 1.0. BOD with status `bdl` → 0.

### Tier and confidence
- Score 40.0 → high. 39.9 → medium. 15.0 → medium. 14.9 → low.
- Any Durga DO ≤ 2 in the last two years → high, whatever the score.
- Confidence boundaries at 6 and 12 sampled readings. "No Durga 2024/2025" → at most limited.

### Reasons
- The worst DO reason carries the correct reading IDs.
- Reasons render the same facts in `hi` and `en`. A snapshot test per kind.

## 6.3 Property tests (hypothesis)

| Property | Statement |
|---|---|
| Missing is neutral | Adding any number of `not_sampled` readings to a ghat leaves its score unchanged |
| Monotonic DO | Lowering any one DO value never lowers the ghat's score |
| Monotonic BOD | Raising any one BOD value never lowers the ghat's score |
| Bounded | The score is always within [0, 100] |
| Deterministic | Same readings + same config → same ranking, byte for byte |
| Order-independent | Shuffling input rows doesn't change the ranking |

## 6.4 Golden data tests (real pack)

These run the loader on `data/raw/` and check facts from the problem statement and data dictionary. All were confirmed against the CSV on 11 Oct 2026:

```python
def test_golden(readings):
    assert len(readings) == 1524
    assert readings.site_slug.nunique() == 7
    do = readings[(readings.parameter == "Dissolved oxygen") & (readings.status == "measured")]
    assert len(do) == 116 and (do.value < 5).sum() == 42
    bod = readings[(readings.parameter == "BOD") & (readings.status == "measured")]
    assert len(bod) == 112 and (bod.value > 3).sum() == 100
    assert ((do.site_slug == "bairagarh-sant-hirdaram-kund") & (do.value == 0)).sum() == 4  # 2023 and 2025
    assert not has_durga_2025(readings, "bairagarh-sant-hirdaram-kund")
    assert not has_durga_2025(readings, "malikhedi-kund")
```

**Ranking snapshot:** the full ranking for Class B is stored as `backend/snapshots/ranking_classB.json`. Any change to it needs a reviewed snapshot update and a note in the PR explaining why the ranking moved.

**PDF spot-check (manual, the domain teammate):** pick 10 random readings that appear in reasons, open the PDF at `source_page` and tick them off in `docs/verification-log.md`. The target is 10/10.

## 6.5 API tests

- `GET /api/ranking` → 200, schema-valid, 7 ghats, ranks 1–7 with no gaps.
- `GET /api/ranking?cpcb_class=Z` → 422 validation error.
- `GET /api/ghats/unknown` → 404.
- `POST /api/briefs` with no API key → 200, `source: 'template'`.
- `POST /api/briefs` with a mocked Claude client returning a bad number → 200, `source: 'template'`, `validation.errors` lists the number.
- `POST /api/briefs` 11 times in a minute → the 11th returns 429.

The Claude client is injected behind a `BriefWriter` interface. Tests use a fake, and CI never calls the real API.

## 6.6 Component tests

- `ReadingCell` with `not_sampled` renders "Not tested" / "जाँच नहीं हुई", grey, with **no** green tick.
- `ReadingCell` with `bdl` renders "Below detection limit".
- `TierBadge` always has a text label (not colour only).
- `SourceChip` shows year, festival, phase and page, and opens the panel.
- The language toggle switches every visible string. Test with a "no missing keys" check that diffs `en.json` against `hi.json` keys.

## 6.7 End-to-end (Playwright)

**Officer flow, run in `en` and `hi`:**

1. Open `/` → see 7 ghats, the top one tiered High.
2. Click the top ghat → see reasons with source chips.
3. Click a chip → the panel shows `value_as_printed` and page. "View in report" has a `#page=N` href.
4. See the coverage matrix with at least one grey "Not tested" cell for a ghat with gaps.
5. Back → **Make brief** → brief appears with the template label (no key in CI), under 150 words per language.
6. Copy button puts text on the clipboard.

**Offline:** block all network except localhost → steps 1–6 still pass.

## 6.8 LLM brief evaluation

Run `uv run python -m analysis.eval_brief` before the demo and after any prompt change. It uses the real API, costs money, and is run by hand.

| Check | Method | Pass bar |
|---|---|---|
| Number fidelity | Validator on 20 generated briefs (varied rankings via config tweaks) | 20/20 pass, or fail and fall back correctly |
| No health claims | Banned phrase scan, plus reading by a human | 0 hits |
| Mentions top-3 ghats | String check | 20/20 |
| Mentions data gaps when confidence ≠ good | String check | 20/20 |
| Length | ≤ 150 words each | 20/20 |
| Hindi readability | Native speaker reads 5 briefs, scores 1–5 | Average ≥ 4 |
| Hindi/English match | Human compares meaning on 5 briefs | No mismatched facts |

Results are saved to `eval/results/<date>.json` with the prompt version.

## 6.9 CI pipeline (GitHub Actions)

```
install (frozen lockfile)
 → lint + typecheck
 → unit + property + golden + API + component tests
 → build
 → Playwright e2e + axe
 → gitleaks + pip-audit + npm audit
```

All steps must pass to merge to `main`. On the event day, run lint, typecheck and tests locally before each push if CI is not set up yet.

## 6.10 Definition of done (per feature)

- Tests written for the new behaviour, and they pass.
- Both languages have their strings.
- Missing data is checked visually in the UI.
- No new lint or type errors.
- If the ranking snapshot changed, the PR says why.

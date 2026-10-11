# 2. System Design

## 2.1 Overview

The system turns MPPCB readings into a ranked, explained, sourced list of ghats and a bilingual brief.

```
 CSV files ──► Ingest ──► SQLite ──► Scoring engine ──► Facts JSON ──┬─► React UI (ranking, detail, map)
 (pack data)   (once)     (read-only)   (deterministic)               │
                                                                      └─► Brief service ──► Validator ──► Brief (hi + en)
                                                                           (Claude or template)   │
                                                                                                  └─ on failure → template brief
```

Two principles drive the design:

1. **Facts first, words second.** Code computes every number, rank and reason. The LLM gets only the facts JSON and may only rephrase it.
2. **Works without the network.** Ingest, scoring, UI and template brief are local. Claude improves the brief but is never required.

## 2.2 Main flows

### Flow A — Officer opens the ranking

1. Browser loads the React app.
2. App calls `GET /api/ranking?class=B`.
3. API reads the latest `scoring_run` from SQLite. If none exists for the current data hash and config version, it runs the scoring engine and stores the result.
4. API returns the ranked ghats with score, tier, confidence, reasons and reading IDs.
5. UI renders the ranked list and map. Each reason shows its source chips (`2023 · Durga · during · p.60`).

### Flow B — Officer checks a number

1. Officer clicks a source chip.
2. UI opens a side panel with the reading exactly as printed and a "View in report" button.
3. The button opens `/reports/<year>.pdf#page=<source_page>` (bundled PDFs, served statically).

### Flow C — Officer generates the brief

1. Officer clicks **Make brief**.
2. UI calls `POST /api/briefs` with `{ scoringRunId, languages: ["hi","en"] }`.
3. Brief service builds the **brief facts**: the top-ranked ghats, their reasons, actions, data gaps and source line.
4. If `ANTHROPIC_API_KEY` is set, the Brief Writer agent drafts both languages as structured output. Otherwise it goes straight to the template.
5. The validator checks the draft (numbers, ghat names, length, banned phrases). If it fails, the template brief is used and the UI says so.
6. The brief is stored in `briefs` with its facts hash and returned. The UI offers copy, print and WhatsApp text.

## 2.3 Data handling rules

| Input | Stored as | Counts in scoring? | Shown as |
|---|---|---|---|
| A number, for example `2.5` | `value = 2.5, status = 'measured'` | Yes | `2.5 mg/l` |
| `BDL` | `value = NULL, status = 'bdl'` | Yes, as below the detection limit (see below) | "Below detection limit" |
| `ND` | `value = NULL, status = 'nd'` | Same as BDL | "Not detected" |
| Blank, `_`, `-`, `not sampled` | `value = NULL, status = 'not_sampled'` | **No.** Excluded from numerator and denominator | Grey "Not tested" |
| `*`, `**` | `value = NULL, status = 'not_sampled'` | No | Grey "Not tested at this stage" |

How BDL counts per parameter:

- **BOD BDL** → passes the limit (BOD ≤ 3).
- **DO BDL** → DO too low to detect, which means it **fails** at the worst severity. None exist in the current Bhopal file, but the rule is coded and tested.
- **Metals BDL** → shown only. Metals are not scored.

The original text is always kept in `value_as_printed`. The `status` field is what the code acts on.

## 2.4 Risk scoring method

Scoring v1 uses only parameters that have a CPCB Class B limit. These are the only ones where "fails the standard" has a legal meaning.

### Why Class B
Immersion ghats are places where people enter the water for a ritual, and Class B is "Outdoor bathing (organised)". It is the closest official use. The app states this choice and lets the officer switch to Class C or D for comparison (`?class=C`).

### Step 1 — Severity of each reading (0 to 1)

| Parameter | Limit (Class B) | Severity `s` |
|---|---|---|
| Dissolved oxygen | ≥ 5 mg/l | `clamp((5 − v) / 5, 0, 1)` → DO of 0 gives 1.0, DO of 5 or more gives 0 |
| BOD | ≤ 3 mg/l | `clamp((v − 3) / 9, 0, 1)` → BOD of 12 or more gives 1.0 |
| pH | 6.5–8.5 | `clamp(distance outside range / 1.5, 0, 1)` |

### Step 2 — Weights

| Factor | Values | Why |
|---|---|---|
| Parameter | DO 0.45 · BOD 0.35 · pH 0.20 | Low DO is the most direct sign of a dead water body |
| Year (recency) | 2025: 1.0 · 2024: 0.7 · 2023: 0.5 | Recent conditions matter more |
| Festival | Durga 1.0 · Ganesh 0.8 | The next event is Durga visarjan |
| Phase | during 1.0 · after 1.0 · pre 0.6 | During/after show the impact of immersion. Pre is the baseline |

All weights live in `backend/analysis/config.py` with a `SCORING_CONFIG_VERSION`. Changing a weight changes the version and triggers a new scoring run.

### Step 3 — Ghat score

For ghat *g*, over all **sampled** readings *r* (status `measured`, `bdl` or `nd`) of DO, BOD and pH:

```
w_r      = w_param × w_year × w_festival × w_phase
score_g  = 100 × Σ (w_r × s_r) / Σ w_r
```

Readings with status `not_sampled` appear in neither sum. Missing data can't push a score down, and it can't push it up.

### Step 4 — Tier and confidence

| Tier | Rule |
|---|---|
| High | score ≥ 40, **or** any DO reading ≤ 2 mg/l in the last two Durga festivals |
| Medium | 15 ≤ score < 40 |
| Low | score < 15 |

The DO override exists because one near-zero oxygen reading during Durga is reason enough to act, whatever the average says.

| Confidence | Rule |
|---|---|
| Good | ≥ 12 sampled limit readings **and** Durga data in 2024 or 2025 |
| Limited | 6–11 sampled readings, **or** no Durga data in 2024–2025 |
| Poor | < 6 sampled readings |

Confidence is shown next to the tier. It never changes the score.

### Step 5 — Ordering and ties

Sort by score, descending. Ties go to the ghat with the lower minimum DO, then the higher maximum BOD, then alphabetically.

### Step 6 — Reasons

The reason generator picks up to three facts per ghat, in this order:

1. Worst DO reading (if it fails), with year, festival, phase.
2. BOD exceedance count, in the form "BOD above 3 in X of Y tests".
3. Trend: did the average severity rise from the earliest to the latest year with data?
4. pH out of range, if any.
5. Data gap note, if confidence is not Good.

Each reason is a typed object, not free text:

```ts
type Reason = {
  kind: 'worst_do' | 'bod_exceedance' | 'trend' | 'ph_out_of_range' | 'data_gap';
  params: Record<string, string | number>;   // e.g. { value: 0, limit: 5, year: 2023, festival: 'Durga', phase: 'during' }
  readingIds: number[];                        // traceability
};
```

The UI and the template brief render reasons from i18n strings (`reason.worst_do` in `hi.json` and `en.json`). Hindi and English always say the same thing.

### Step 7 — Suggested actions

| Tier | Suggested action (shown, never automatic) |
|---|---|
| High | Aeration before and during visarjan, extra cleaning crew, ask MPPCB for an extra test 1–2 days after |
| Medium | Cleaning crew on the day, standard MPPCB testing |
| Low | Standard arrangements |
| Any tier with Poor/Limited confidence | Ask MPPCB for a baseline test before 20 Oct |

Actions are suggestions written with the domain teammate. They are labelled "suggested" in the UI and brief.

## 2.5 Context parameters (not scored)

| Parameter | How it's shown |
|---|---|
| COD, total/dissolved/suspended solids, turbidity | Values and trend chart. "No bathing limit set" |
| Conductivity | Compared with the Class E cap of 2,250 µS/cm for context only, labelled as Class E |
| Chromium, lead, zinc, copper | Value or "Below detection limit". Note: "Only 4 metals were tested. No Class B limit." |

## 2.6 Statewide data

`mp_immersion_sites_2023_2025.csv` (21,600 rows) is **not** used for ranking. Version 1 uses it for one thing: a context line such as "Bhopal ghats' median DO during Durga 2025 compared with the median of all MP sites". Rows with `needs_check = yes` are excluded, and duplicate tables across pages are deduplicated by (year, festival, site_as_printed, phase, parameter, value).

## 2.7 Failure modes

| Failure | Behaviour |
|---|---|
| No API key / network down | Template brief, with the banner "Brief written from template (AI unavailable)" |
| Claude returns an invalid schema or refuses | Template brief, error logged |
| Validator rejects a draft | One retry with the validator errors appended. Then the template |
| PDF missing for a year | "View in report" disabled. Page number still shown |
| CSV schema changes | Ingest fails loudly with the column that's wrong. Old DB is kept |

## 2.8 Scalability

Small data: about 1.5k Bhopal rows, 22k statewide. One SQLite file and one Node process are enough. Adding new ghats or a 2026 report means adding CSV rows and re-running ingest. No code changes.

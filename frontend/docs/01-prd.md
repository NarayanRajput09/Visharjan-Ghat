# 1. Product Requirements Document (PRD)

| | |
|---|---|
| Product | Visarjan Ghat Watch |
| Track | Track 2, Bhopal Impact Lab 2026 |
| Status | Draft v1, 11 Oct 2026 |
| Deadline | Repo public by 5:00 PM, 11 Oct 2026. Officer uses it before 20 Oct 2026 |
| License | MIT, offered to Government of MP through MPSeDC |

## 1.1 Problem

Each Ganesh and Durga festival, MPPCB tests the water at Bhopal's immersion ghats three times: before immersion, during, and one week after. The results sit in PDF reports of 90 to 120 pages. Nobody compares them with the legal limits or across years.

The buried numbers are serious:

- Bairagarh (Sant Hirdaram) kund recorded dissolved oxygen (DO) of **0 mg/l** four times across 2023 and 2025.
- **42 of 116** DO readings at Bhopal ghats (2023–2025) are below the bathing minimum of 5 mg/l.
- **100 of 112** BOD readings are above the bathing maximum of 3 mg/l.

The NGT has banned immersion in the Upper and Lower Lakes, and BMC is building new ghats. Right now the officer decides where to send cleaning, aeration and testing from memory.

## 1.2 User

**One user:** the BMC officer who plans Durga visarjan at the ghats.

| Attribute | Detail |
|---|---|
| Decision | Where to send extra cleaning, aeration and water testing before and after visarjan |
| Time available | Minutes, not hours. Reads on a laptop or phone |
| Language | Hindi first, English for upward reporting |
| Technical level | Not a data analyst. Reads tables and maps, not code |
| Output they forward | A short brief to the Commissioner, zone officers or MPPCB |

**Not our users:** citizens, MPPCB lab staff, state-wide planners. The statewide CSV is background only. We are not building a portal.

## 1.3 Goals and non-goals

**Goals**

1. A ranked list of the 7 Bhopal ghats by water-quality risk, with the reason for each rank in plain words.
2. Every number behind every rank traceable to its report, year, festival, phase and PDF page.
3. A one-page brief in Hindi and English that the officer can forward (copy, print, PDF, WhatsApp-friendly text).
4. Honest display of missing data, BDL values and uncertain site names.

**Non-goals**

- Predicting future water quality with a model. We rank on the history we have.
- Health-impact claims of any kind.
- Connecting to any live government system or scraping portals.
- User accounts, roles, or a multi-department portal.
- Real-time sensors.

## 1.4 User stories

| ID | As the officer, I want to… | So that… | Priority |
|---|---|---|---|
| US-1 | see all 7 ghats ranked by risk on one screen | I know where to act first | Must |
| US-2 | read why a ghat is ranked where it is, in one or two plain sentences | I can justify the decision | Must |
| US-3 | click any number and see the report, year, phase and page | I can verify it or show MPPCB | Must |
| US-4 | see clearly which tests are missing for a ghat | I don't mistake "no data" for "clean" | Must |
| US-5 | get a short brief in Hindi and English | I can forward it today | Must |
| US-6 | see the ghats on a map | I can plan routes for teams | Should |
| US-7 | compare one ghat across 2023, 2024 and 2025 | I can see if it is getting worse | Should |
| US-8 | see what action each tier suggests (more testing, aeration, cleaning) | I can turn the ranking into orders | Should |
| US-9 | use it with poor connectivity | it works at the ghat | Could |
| US-10 | see the same view for new BMC ghats once data exists | the tool stays useful next year | Could |

## 1.5 Functional requirements

### FR-1 Ranking
- FR-1.1 Rank the 7 Bhopal ghats by a risk score from 0 to 100 (method in [System Design §2.4](02-system-design.md#24-risk-scoring-method)).
- FR-1.2 Assign each ghat a tier: **High**, **Medium**, **Low**.
- FR-1.3 Show a separate **data confidence** badge (Good / Limited / Poor) based on how much was sampled. Low confidence never makes a ghat look safer.
- FR-1.4 The ranking is identical on every run for the same input data.

### FR-2 Explanations
- FR-2.1 Each ghat has 1–3 reason lines, built from computed facts, for example: *"Dissolved oxygen was 0 mg/l during Durga 2023 immersion. The bathing minimum is 5."*
- FR-2.2 Each reason line links to the readings that support it.

### FR-3 Traceability
- FR-3.1 Every reading shows `value_as_printed`, `parameter_as_printed`, `site_as_printed`, report year and `source_page`.
- FR-3.2 A "View in report" link opens the bundled PDF at that page.

### FR-4 Missing data and special codes
- FR-4.1 `not sampled` shows as a grey "Not tested" cell, never as a pass.
- FR-4.2 `BDL` / `ND` shows as "Below detection limit" and counts as measured.
- FR-4.3 Known gaps are always visible, for example: "No Durga 2025 table in the report" for Bairagarh and Malikhedi.
- FR-4.4 The Rani Kamlapati / Kamla Park site shows a "may be two places" warning.

### FR-5 Brief
- FR-5.1 Generate a brief of 150 words or fewer in each language: top risks, recommended actions, data gaps, and a source line.
- FR-5.2 Every number in the brief must match a computed fact. Otherwise the brief is rejected and the template brief is used (see [Agents](09-agents.md)).
- FR-5.3 The brief works without an LLM. A deterministic template produces both languages if the API key is missing or the call fails.
- FR-5.4 Export the brief as copy-to-clipboard, printable page / PDF, and plain text for WhatsApp.

### FR-6 Limits reference
- FR-6.1 Compare readings against **CPCB Class B (outdoor bathing)**: DO ≥ 5 mg/l, BOD ≤ 3 mg/l, pH 6.5–8.5. The reason for choosing Class B is shown in the app.
- FR-6.2 Parameters without a Class B limit (COD, solids, turbidity, conductivity, metals) are shown for context and marked "No bathing limit set". They are not scored.

## 1.6 Non-functional requirements

| Area | Requirement |
|---|---|
| Ready on day one | Runs locally in 5 steps or fewer. A department IT person can run it after the event |
| Performance | Ranking page loads in under 2 s on a mid-range laptop. Ranking computes in under 100 ms |
| Offline | Ranking, details and template brief work with no internet. Only the LLM brief needs the network |
| Accessibility | WCAG 2.1 AA: contrast, keyboard navigation, screen-reader labels. Risk is shown by colour **and** text |
| Language | Full UI in Hindi and English, switchable. Devanagari font bundled |
| Privacy | No personal data collected or stored. No analytics trackers |
| Honesty | The README and the app's "About the data" page list what the data doesn't cover |
| Maintainability | TypeScript strict, tests on scoring and ingestion, readable for handover |

## 1.7 Success metrics

| Metric | Target |
|---|---|
| Officer can name the top-3 ghats and one reason each after 2 minutes | Yes, in jury demo |
| Numbers in the app that match the PDF on spot-check | 100% |
| Missing readings shown as passing | 0 |
| Briefs with a number that isn't in the facts | 0 (enforced by validator) |
| Time from clone to running app | Under 10 minutes |
| Hindi brief rated readable by a native speaker on the team | Yes |

## 1.8 Scope for the event day

| Time | Milestone |
|---|---|
| 10:15–11:00 | Agree user, workflow, demo script. Ingest CSV into SQLite. Lock the scoring rules |
| 11:00–13:00 | Scoring engine + tests. Ranking page. Ghat detail with traceability |
| 13:00–14:30 | Brief: template first, then Claude + validator. Hindi review |
| 14:30–15:30 | Map, PDF page links, "About the data" page, polish |
| 15:30–16:00 | README, LICENSE, secret check, repo public |
| 16:00 | Record the 2-minute demo |
| 17:00 | Submit |

**Team split (4–5 people)**

| Role | Work |
|---|---|
| Tech lead | Repo, ingestion, scoring engine, API |
| Frontend | React UI, i18n, map, export |
| AI / brief | Claude brief agent, validator, template fallback |
| Domain / research | NGT order, CPCB class choice, checking numbers against PDFs, ghat coordinates |
| Language and pitch | Hindi brief review, UI strings, demo script, recording |

## 1.9 Risks and open questions

| Risk / question | Mitigation |
|---|---|
| Units are assumed, not printed | Show "unit assumed" notes. Say so in the brief footer |
| Rani Kamlapati / Kamla Park may be two places | Keep one record with a warning. Show Ganesh and Durga readings separately |
| No Durga 2025 data for two ghats | Confidence badge shows "Limited". Their score uses older data, labelled with the year |
| New BMC ghats have no data yet | Show them as "No test data yet — recommend baseline test before 20 Oct" |
| LLM writes a wrong number or a health claim | Deterministic validator plus template fallback |
| Scoring weights are judgement calls | Weights live in one config file, are shown in the app, and are explained in plain words |

## 1.10 What it does not tell you

These are shown in the app and the README:

- Only 4 metals were tested. Absence of other contaminants is unknown, not zero.
- No coliform data, so we can't comment on bacterial safety.
- Three tests per festival is a small sample. Readings vary by time of day and weather.
- This tool doesn't predict 2026 readings. It shows which ghats have failed most in the past.

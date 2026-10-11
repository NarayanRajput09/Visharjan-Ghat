# Visarjan Ghat Watch — Documentation

A tool for the Bhopal Municipal Corporation (BMC) officer who plans Durga visarjan. It ranks Bhopal immersion ghats by water-quality risk, explains each rank in plain words, links every number to the MPPCB report and page, and produces a short brief in Hindi and English.

Built for Track 2 of Claude Impact Lab × Cerebras Café Compute, Bhopal, on 11 October 2026. Durga visarjan is on **20 October 2026**.

| # | Document | What it answers |
|---|---|---|
| 1 | [Product Requirements (PRD)](01-prd.md) | Who it's for, what it must do, and how we know it works |
| 2 | [System Design](02-system-design.md) | How data flows from CSV to ranked list to brief, and how risk is scored |
| 3 | [Architecture](03-architecture.md) | Components, repo layout, deployment, and design decisions |
| 4 | [Database](04-database.md) | Schema, ingestion rules, and how traceability is stored |
| 5 | [Security](05-security.md) | Threats, secrets, LLM safety, and the event rules |
| 6 | [Testing](06-testing.md) | Test strategy, golden data checks, and LLM evaluation |
| 7 | [Code Style](07-code-style.md) | TypeScript and React conventions, naming, commits |
| 8 | [Technical Approach](08-technical-approach.md) | Stack choices (React, FastAPI, Pandas, Claude) and why |
| 9 | [Agents](09-agents.md) | The AI agents in the product, plus rules for coding agents in this repo |

## Build guide (solo developer, step by step)

| Order | Part | Stack |
|---|---|---|
| 1 | [Data + AI](build-guide/01-data-ai.md) | Python 3.12, Pandas, Pydantic, Claude API |
| 2 | [Backend](build-guide/02-backend.md) | FastAPI, Uvicorn, SQLite (brief cache) |
| 3 | [Frontend](build-guide/03-frontend.md) | React 19, TypeScript, Vite, Tailwind, Recharts |
| 4 | [Integration + submission](build-guide/04-integration.md) | Number-match checks, README, demo script |

Start with the [build guide overview](build-guide/README.md). Each part ends with a prompt you paste into Claude Code.

## Rules that apply everywhere

1. **Missing is not clean.** A reading marked `not sampled` is missing. It never counts as passing and never lowers a risk score.
2. **BDL is not zero and not missing.** It means below the detection limit: very low, but measured.
3. **Every number is traceable.** Any figure shown to the officer links to year, festival, phase, report and PDF page.
4. **No health claims.** We report readings against CPCB limits. We do not say the water will make anyone ill.
5. **The ranking is deterministic.** Code computes the ranking. The LLM only writes the brief, and a validator checks that brief against the computed facts.

## Source data

All input data lives in `bhopal-impact-lab-2026-problem-statements/track-2-visarjan-ghat-watch/`. See its `data/DATA_DICTIONARY.md`.

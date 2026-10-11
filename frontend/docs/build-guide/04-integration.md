# Part 4 — Integration and Submission

Run all three parts together and prove the numbers agree end to end.

## Run everything

```bash
# terminal 1
cd backend && uv run uvicorn app.main:app --port 8000
# terminal 2
cd frontend && npm run dev
# open http://localhost:5173
```

Optional single-process mode for handover: `npm run build` in `frontend/`, then FastAPI serves `frontend/dist` at `/`. One command: `uv run uvicorn app.main:app`.

## Number-match checks

| # | Check | How |
|---|---|---|
| 1 | CLI = API | `python -m analysis.cli rank --json` equals `GET /api/ranking` (automated test in Part 2) |
| 2 | API = UI | Playwright reads the 7 rows on `/` and compares rank, ghat and tier with `/api/ranking` |
| 3 | UI = PDF | Open 10 source chips, click **View in report**, and confirm the number on that page. Log results in `docs/verification-log.md` |
| 4 | Missing = grey | Bairagarh detail: the Durga 2025 column is grey "Not tested" |
| 5 | Golden facts | `pytest -k golden` passes: 42/116 DO, 100/112 BOD |
| 6 | Brief honesty | Make a brief with and without `ANTHROPIC_API_KEY`. Both pass the validator. The label shows the source |
| 7 | Offline | Turn off Wi-Fi. Ranking, detail, PDF links and the template brief still work |
| 8 | Hindi | A native speaker reads the UI and the brief, and fixes any awkward strings |

## Before 5:00 PM

- [ ] `README.md`: team name, members, track, the one user, **how to run in 5 steps or fewer**, what works / what doesn't, extra data with links (ghat coordinates source)
- [ ] `LICENSE` (MIT)
- [ ] `.env.example` committed, `.env` not committed
- [ ] `gitleaks detect --source .` is clean, and `git log -p | grep -i sk-ant` finds nothing
- [ ] `pytest`, `npm run test` and `npx playwright test` are green
- [ ] Repo is **public** on GitHub
- [ ] 2-minute screen recording made at 4:00 PM
- [ ] Submitted through the form

## README "How to run" (copy this)

```
1. git clone <repo> && cd visarjan-ghat-watch
2. cd backend && uv sync && cd ../frontend && npm install && npm run build && cd ..
3. cp .env.example .env        # optional: add ANTHROPIC_API_KEY for AI-written briefs
4. cd backend && uv run uvicorn app.main:app --port 8000
5. Open http://localhost:8000
```

## 2-minute demo script

1. **(15 s) Problem:** "MPPCB tests these ghats three times each festival. The results sit in 100-page PDFs. Durga visarjan is in 9 days."
2. **(30 s) Ranking:** the top ghat and its reason. Click the chip and show the PDF page.
3. **(20 s) Missing data:** the grey cells. "We never call untested water clean."
4. **(30 s) Brief:** Make brief, Hindi on the left, English on the right, Copy to WhatsApp.
5. **(15 s) Honesty:** the About page lists what the data doesn't cover. Works offline and without AI.
6. **(10 s) Close:** "Ready for the BMC officer this week. Open source, MIT."

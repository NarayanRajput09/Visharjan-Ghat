# 5. Security

## 5.1 What we protect

| Asset | Why it matters |
|---|---|
| Integrity of readings and ranking | A wrong number could send crews to the wrong ghat or hide a dangerous one |
| Trust in the brief | The officer forwards it with their name on it |
| Claude API key | Cost and abuse if leaked |
| Department machine | The tool will run on government hardware |

There is **no personal data** in the system: no users, no logins, no citizen data. Keep it that way (event rule 5).

## 5.2 Threat model (STRIDE, short)

| Threat | Example | Control |
|---|---|---|
| Spoofing | Someone hosts a fake copy with altered numbers | `/api/health` shows the data hash. README publishes the expected hash. Briefs carry the hash in the footer |
| Tampering | Edited CSV changes a ranking | Ingest hashes raw CSVs and runs integrity checks (see [Database §4.5](04-database.md#45-integrity-checks-run-after-every-ingest)). Runtime DB opened read-only for reading tables |
| Repudiation | "The tool said X" disputes | `briefs` stores the facts JSON, model, validation result and scoring run |
| Information disclosure | API key leaks via git, logs or the browser | Key only on the server, from env. Never sent to the client. gitleaks in pre-commit and CI. Logs redact headers |
| Denial of service | Brief endpoint spammed to run up API cost | Rate limit `POST /api/briefs` (10/min per IP), cache briefs by facts hash, cap `max_tokens` |
| Elevation of privilege | Injection via query params into SQL | Parameterised SQL only. Pydantic validation on every input |

## 5.3 Secrets

- `ANTHROPIC_API_KEY` is read from the environment. `.env` is git-ignored and `.env.example` has empty values.
- No key is ever needed to run the core tool, because the template brief covers that.
- Before the repo goes public at 5:00 PM: run `gitleaks detect --source .` and `git log -p | grep -i "sk-ant"`. Both must be clean.
- If a key leaks: revoke it in the Anthropic Console straight away, rotate it, and purge it from history with `git filter-repo`.

## 5.4 LLM safety

The LLM is the least trusted part of the system. Controls:

| Risk | Control |
|---|---|
| Invented numbers | The validator pulls every number out of the draft (Devanagari digits included) and checks each one against the facts JSON. Any mismatch rejects the draft |
| Health claims | Banned phrase list in both languages ("unsafe to bathe", "causes disease", "बीमारी", "ज़हरीला", …). The system prompt forbids them too. A hit rejects the draft |
| Wrong ghat names | Ghat names must come from the facts. An unknown proper noun is flagged |
| Prompt injection | The model only sees our facts JSON, built from validated CSV values. No PDF text or user free-text goes into the prompt |
| Over-long or off-topic output | Structured output schema with length limits. The validator checks word count |
| Refusal or API failure | Falls back to the template brief. Handle `stop_reason: "refusal"` explicitly |

The officer always sees a label saying whether the brief came from **Claude** or the **template**.

## 5.5 Web application

- **Headers:** strict CSP (`default-src 'self'`; map tiles host allow-listed), `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, `frame-ancestors 'none'`.
- **CORS:** same-origin only in production.
- **Input:** all route params and bodies are validated by FastAPI/Pydantic (`Literal` types for classes, `Path(pattern=...)` for slugs). Slugs must match `^[a-z0-9-]+$`.
- **Output:** React escapes by default. `dangerouslySetInnerHTML` is banned by lint rule. Brief text is rendered as text.
- **SQL:** `sqlite3` with `?` placeholders only. No f-strings or string concatenation into SQL.
- **Static files:** PDFs are served from a fixed directory, with no path built from user input.
- **Map tiles:** OpenStreetMap tiles are the only third-party request besides Claude. In offline mode the map shows a static fallback image and a coordinate table.
- **No trackers:** no analytics, no third-party fonts loaded at runtime. Noto Sans Devanagari is bundled.

## 5.6 Supply chain

- Lockfiles committed: `backend/uv.lock` and `frontend/package-lock.json`. CI uses `uv sync --frozen` and `npm ci`.
- `pip-audit` (backend) and `npm audit --omit=dev` (frontend) in CI. High or critical findings fail the build.
- Keep dependencies few. Each new dependency needs a one-line reason in the PR.
- Pin versions: Python 3.12 (`.python-version`), Node 22 (`.nvmrc`, frontend build only).

## 5.7 Event rules that are also security rules

| Rule | How we comply |
|---|---|
| Public data only | Only the pack data, plus team-added ghat coordinates with sources in the README |
| No live government systems | No scraping, no login, no writes. PDFs are bundled from the pack |
| No personal data | No accounts, no forms collecting names, no logs of IP addresses beyond the in-memory rate limiter |
| No secrets in code | Env vars, gitleaks, check before push |

## 5.8 Handover notes for the department

- Run behind the department's reverse proxy with HTTPS if hosted on a network.
- The app needs no inbound ports apart from the web port, and no database server.
- Outbound: `api.anthropic.com` (optional) and the OSM tile servers (optional). Both can be blocked and the tool keeps working.

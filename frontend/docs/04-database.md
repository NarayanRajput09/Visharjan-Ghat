# 4. Database

## 4.1 Choice

**Version 1 (event day, solo build):**

- **Readings and limits live in memory** as a Pandas DataFrame. They are loaded from `data/raw/*.csv` at API startup (about 50 ms). The CSVs are the source of truth.
- **Briefs are stored in SQLite** (stdlib `sqlite3`, file `backend/briefs.db`), using only the `briefs` table below (plus `audit_log` if wanted).
- The in-memory readings DataFrame uses the same columns as the `readings` table below. This schema is the logical data model even when no DB holds it.

**Version 2 (after handover, optional):** persist the full schema below in SQLite when the department wants scoring history, more sites or yearly data loads. The ingest rules (§4.4) and checks (§4.5) apply either way. In v1 they run inside `analysis/loader.py` at startup.

Why SQLite and not a server DB: there is nothing to install on a department machine, and the data is small (about 1.5k Bhopal rows, 22k statewide).

## 4.2 Entity relationships

```
source_reports 1───* readings *───1 sites 1───* site_aliases
                        │
                        *───1 parameters 1───* cpcb_limits
                        │
scoring_runs 1───* ghat_scores 1───* score_reasons *───* readings (via reason_readings)
      │
      1───* briefs
```

## 4.3 Schema

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;

-- The original MPPCB PDFs
CREATE TABLE source_reports (
  id            INTEGER PRIMARY KEY,
  year          INTEGER NOT NULL UNIQUE,          -- 2023, 2024, 2025
  title         TEXT    NOT NULL,
  url           TEXT    NOT NULL,                 -- public MPPCB link
  local_path    TEXT    NOT NULL,                 -- /reports/2025.pdf
  page_count    INTEGER,
  downloaded_on TEXT    NOT NULL                  -- ISO date
);

-- The 7 standard Bhopal ghats (plus future BMC ghats)
CREATE TABLE sites (
  id                    INTEGER PRIMARY KEY,
  slug                  TEXT NOT NULL UNIQUE,     -- 'bairagarh-sant-hirdaram-kund'
  name_en               TEXT NOT NULL,
  name_hi               TEXT NOT NULL,
  water_body            TEXT NOT NULL,
  site_match_confidence TEXT NOT NULL CHECK (site_match_confidence IN ('high','medium')),
  lat                   REAL,
  lng                   REAL,
  coord_source          TEXT,                     -- where the coordinates came from
  note_key              TEXT,                     -- i18n key, e.g. 'site.note.kamla_park_two_places'
  is_new_bmc_ghat       INTEGER NOT NULL DEFAULT 0
);

-- Every printed name that maps to a standard site
CREATE TABLE site_aliases (
  id              INTEGER PRIMARY KEY,
  site_id         INTEGER NOT NULL REFERENCES sites(id),
  site_as_printed TEXT    NOT NULL,
  UNIQUE (site_id, site_as_printed)
);

CREATE TABLE parameters (
  id            INTEGER PRIMARY KEY,
  name          TEXT NOT NULL UNIQUE,             -- 'Dissolved oxygen'
  unit_assumed  TEXT,                             -- 'mg/l', 'NTU', 'µS/cm', NULL for pH
  label_key     TEXT NOT NULL,                    -- i18n key
  is_scored     INTEGER NOT NULL DEFAULT 0        -- 1 for DO, BOD, pH
);

-- CPCB criteria, from cpcb_water_quality_criteria.csv
CREATE TABLE cpcb_limits (
  id           INTEGER PRIMARY KEY,
  class        TEXT NOT NULL CHECK (class IN ('A','B','C','D','E')),
  best_use     TEXT NOT NULL,
  parameter_id INTEGER REFERENCES parameters(id), -- NULL if we don't measure it (e.g. coliform)
  parameter_as_listed TEXT NOT NULL,
  limit_type   TEXT NOT NULL CHECK (limit_type IN ('min','max','range')),
  limit_min    REAL,
  limit_max    REAL,
  unit         TEXT
);

-- One row per value in the reports
CREATE TABLE readings (
  id                   INTEGER PRIMARY KEY,
  site_id              INTEGER NOT NULL REFERENCES sites(id),
  parameter_id         INTEGER NOT NULL REFERENCES parameters(id),
  source_report_id     INTEGER NOT NULL REFERENCES source_reports(id),
  year                 INTEGER NOT NULL,
  festival             TEXT    NOT NULL CHECK (festival IN ('Ganesh','Durga')),
  phase                TEXT    NOT NULL CHECK (phase IN ('pre','during','after')),
  value                REAL,                       -- NULL unless status = 'measured'
  status               TEXT    NOT NULL CHECK (status IN ('measured','bdl','nd','not_sampled')),
  unit_assumed         TEXT,
  flag_raw             TEXT,                       -- original flag column: 'BDL', 'not sampled', '*', '**'
  value_as_printed     TEXT,
  parameter_as_printed TEXT,
  site_as_printed      TEXT    NOT NULL,
  source_page          INTEGER NOT NULL,
  CHECK ((status = 'measured') = (value IS NOT NULL))
);
CREATE INDEX idx_readings_site_param ON readings (site_id, parameter_id, year, festival, phase);

-- Statewide background data (kept separate: less checked)
CREATE TABLE statewide_readings (
  id                   INTEGER PRIMARY KEY,
  year                 INTEGER NOT NULL,
  festival             TEXT    NOT NULL,
  regional_office      TEXT,
  site_as_printed      TEXT,
  phase                TEXT    NOT NULL,
  parameter            TEXT    NOT NULL,
  value                REAL,
  status               TEXT    NOT NULL,
  value_as_printed     TEXT,
  needs_check          INTEGER NOT NULL DEFAULT 0,
  source_page          INTEGER,
  dedup_key            TEXT    NOT NULL UNIQUE
);

-- One scoring run = one data hash + one config version + one CPCB class
CREATE TABLE scoring_runs (
  id                     INTEGER PRIMARY KEY,
  created_at             TEXT NOT NULL,
  data_hash              TEXT NOT NULL,            -- sha256 of the raw CSVs
  scoring_config_version TEXT NOT NULL,
  cpcb_class             TEXT NOT NULL,
  config_json            TEXT NOT NULL,            -- full weights snapshot
  UNIQUE (data_hash, scoring_config_version, cpcb_class)
);

CREATE TABLE ghat_scores (
  id              INTEGER PRIMARY KEY,
  scoring_run_id  INTEGER NOT NULL REFERENCES scoring_runs(id) ON DELETE CASCADE,
  site_id         INTEGER NOT NULL REFERENCES sites(id),
  rank            INTEGER NOT NULL,
  score           REAL    NOT NULL,
  tier            TEXT    NOT NULL CHECK (tier IN ('high','medium','low')),
  confidence      TEXT    NOT NULL CHECK (confidence IN ('good','limited','poor')),
  sampled_count   INTEGER NOT NULL,
  missing_count   INTEGER NOT NULL,
  UNIQUE (scoring_run_id, site_id)
);

CREATE TABLE score_reasons (
  id            INTEGER PRIMARY KEY,
  ghat_score_id INTEGER NOT NULL REFERENCES ghat_scores(id) ON DELETE CASCADE,
  position      INTEGER NOT NULL,
  kind          TEXT    NOT NULL,
  params_json   TEXT    NOT NULL
);

CREATE TABLE reason_readings (
  score_reason_id INTEGER NOT NULL REFERENCES score_reasons(id) ON DELETE CASCADE,
  reading_id      INTEGER NOT NULL REFERENCES readings(id),
  PRIMARY KEY (score_reason_id, reading_id)
);

CREATE TABLE briefs (
  id              INTEGER PRIMARY KEY,
  scoring_run_id  INTEGER NOT NULL REFERENCES scoring_runs(id),
  created_at      TEXT    NOT NULL,
  source          TEXT    NOT NULL CHECK (source IN ('claude','template')),
  model           TEXT,                            -- e.g. 'claude-opus-5-5'
  facts_hash      TEXT    NOT NULL,
  facts_json      TEXT    NOT NULL,
  text_en         TEXT    NOT NULL,
  text_hi         TEXT    NOT NULL,
  validation_json TEXT    NOT NULL                 -- validator result
);

-- Operational log: no personal data, ever
CREATE TABLE audit_log (
  id         INTEGER PRIMARY KEY,
  at         TEXT NOT NULL,
  event      TEXT NOT NULL,                        -- 'ingest', 'score', 'brief_generated', 'brief_rejected'
  detail     TEXT
);
```

## 4.4 Ingestion rules

`analysis/loader.py` runs these at startup in v1, and as `python -m analysis.cli ingest` in v2:

1. **Hash** every CSV in `data/raw/`. If the hash matches the last ingest, stop.
2. **Validate** headers and each row with Pydantic. Any bad row stops ingest with file, line and column.
3. **Normalise status** with `analysis/status.py`:

   | `flag` / `value_as_printed` | `status` |
   |---|---|
   | number in `value` | `measured` |
   | `BDL` | `bdl` |
   | `ND` | `nd` |
   | `not sampled`, `*`, `**`, blank, `_`, `-` | `not_sampled` |
   | anything else | **ingest error**. Never guess |

4. **Map sites** through `site_aliases`. An unknown `site_as_printed` in the Bhopal file is an error.
5. **Link reports** by year to `source_reports`.
6. **Load limits** from `cpcb_water_quality_criteria.csv`. Parse `range` values like `6.5-8.5` into min/max.
7. **Statewide:** load into `statewide_readings`, set `needs_check`, and drop duplicates using `dedup_key`.
8. Run the integrity checks (§4.5). If any fails, the API refuses to start. In v2, write to a temp DB in one transaction, check, then atomically rename it over the old DB.

## 4.5 Integrity checks (run after every ingest)

| Check | Expected (current pack) |
|---|---|
| Bhopal reading rows | 1,524 |
| Distinct standard sites | 7 |
| DO readings with a value | 116, of which 42 are < 5 |
| BOD readings with a value | 112, of which 100 are > 3 |
| `status = 'measured'` ⇔ `value IS NOT NULL` | always |
| Every reading has `source_page` and a linked report | always |

The first four come from the problem statement. If they don't match, ingest fails.

## 4.6 Useful queries

Coverage matrix for one ghat (what was and wasn't tested):

```sql
SELECT year, festival, phase,
       SUM(status <> 'not_sampled') AS sampled,
       SUM(status =  'not_sampled') AS missing
FROM readings
WHERE site_id = ? AND parameter_id IN (SELECT id FROM parameters WHERE is_scored = 1)
GROUP BY year, festival, phase
ORDER BY year, festival, phase;
```

Class B failures with sources:

```sql
SELECT s.name_en, p.name, r.year, r.festival, r.phase, r.value, r.source_page
FROM readings r
JOIN sites s      ON s.id = r.site_id
JOIN parameters p ON p.id = r.parameter_id
WHERE r.status = 'measured'
  AND ((p.name = 'Dissolved oxygen' AND r.value < 5)
    OR (p.name = 'BOD'              AND r.value > 3)
    OR (p.name = 'pH'               AND (r.value < 6.5 OR r.value > 8.5)))
ORDER BY s.name_en, r.year, r.festival, r.phase;
```

## 4.7 Migrations and backup

- Schema lives in `backend/app/migrations/NNN_name.sql`, applied in order at startup, with versions tracked in `PRAGMA user_version`.
- Readings can always be rebuilt from CSV. Only `briefs` and `audit_log` need a backup: copy the `.db` file.
- The DB file is git-ignored. CSVs in `data/raw/` are committed.

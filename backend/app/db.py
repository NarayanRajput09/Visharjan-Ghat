"""SQLite brief cache storage using stdlib sqlite3."""

import json
import sqlite3
from datetime import datetime, timezone
from pathlib import Path
from analysis.models import BriefResponse, BriefOutput, BriefValidation, BriefSection


def get_db_connection(db_path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn


def init_db(db_path: str) -> None:
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    with get_db_connection(db_path) as conn:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS briefs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                scoring_run_id INTEGER DEFAULT 1,
                created_at TEXT NOT NULL,
                source TEXT NOT NULL,
                model TEXT,
                facts_hash TEXT NOT NULL UNIQUE,
                facts_json TEXT NOT NULL,
                text_en TEXT NOT NULL,
                text_hi TEXT NOT NULL,
                validation_json TEXT NOT NULL
            );
            """
        )
        conn.commit()


def get_by_facts_hash(db_path: str, facts_hash: str) -> BriefResponse | None:
    with get_db_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM briefs WHERE facts_hash = ?", (facts_hash,))
        row = cursor.fetchone()
        if not row:
            return None
        return _row_to_response(row)


def get_by_id(db_path: str, brief_id: int) -> BriefResponse | None:
    with get_db_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM briefs WHERE id = ?", (brief_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return _row_to_response(row)


def save_brief(
    db_path: str,
    facts_hash: str,
    facts_json: str,
    brief_output: BriefOutput,
    source: str,
    model: str | None,
    validation: BriefValidation,
) -> BriefResponse:
    now_iso = datetime.now(timezone.utc).isoformat()
    en_json = brief_output.en.model_dump_json()
    hi_json = brief_output.hi.model_dump_json()
    val_json = validation.model_dump_json()

    with get_db_connection(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO briefs (created_at, source, model, facts_hash, facts_json, text_en, text_hi, validation_json)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(facts_hash) DO UPDATE SET
                created_at = excluded.created_at,
                source = excluded.source,
                text_en = excluded.text_en,
                text_hi = excluded.text_hi
            RETURNING id;
            """,
            (now_iso, source, model, facts_hash, facts_json, en_json, hi_json, val_json),
        )
        brief_id = cursor.fetchone()[0]
        conn.commit()

    return BriefResponse(
        brief_id=brief_id,
        scoring_run_id=1,
        created_at=now_iso,
        source="claude" if source == "claude" else "template",
        model=model,
        en=brief_output.en,
        hi=brief_output.hi,
        validation=validation,
    )


def _row_to_response(row: sqlite3.Row) -> BriefResponse:
    en_dict = json.loads(row["text_en"])
    hi_dict = json.loads(row["text_hi"])
    val_dict = json.loads(row["validation_json"])

    return BriefResponse(
        brief_id=row["id"],
        scoring_run_id=row["scoring_run_id"],
        created_at=row["created_at"],
        source="claude" if row["source"] == "claude" else "template",
        model=row["model"],
        en=BriefSection(**en_dict),
        hi=BriefSection(**hi_dict),
        validation=BriefValidation(**val_dict),
    )

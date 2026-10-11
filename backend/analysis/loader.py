"""Data loader and validator for MPPCB CSV records."""

import hashlib
from pathlib import Path
from typing import Any
import pandas as pd

from analysis.status import normalise_status
from analysis.sites import site_name_to_slug
from analysis.limits import load_limits_csv, DEFAULT_LIMITS
from analysis.models import Reading, Status, Festival, Phase, LimitItem, CPCBClass

REQUIRED_COLUMNS = [
    "year",
    "festival",
    "site",
    "water_body",
    "phase",
    "parameter",
    "value",
    "unit_assumed",
    "flag",
    "value_as_printed",
    "parameter_as_printed",
    "site_as_printed",
    "source_page",
]


class DataValidationError(Exception):
    """Raised when raw CSV files fail format or integrity validation."""
    pass


def compute_file_hash(path: Path) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()


def load_all(
    data_dir: str | Path,
) -> tuple[pd.DataFrame, list[Reading], dict[CPCBClass, list[LimitItem]], str]:
    """
    Loads and validates all CSV data.
    Returns: (readings_df, readings_models, limits_by_class, data_hash)
    """
    dir_path = Path(data_dir)
    bhopal_csv = dir_path / "bhopal_ghats_2023_2025.csv"

    if not bhopal_csv.is_file():
        # Fallback to parent path if called from backend directory
        bhopal_csv = Path("../data/raw/bhopal_ghats_2023_2025.csv")
        if not bhopal_csv.is_file():
            bhopal_csv = Path("data/raw/bhopal_ghats_2023_2025.csv")

    if not bhopal_csv.is_file():
        raise DataValidationError(f"Required data file missing: {bhopal_csv}")

    data_hash = compute_file_hash(bhopal_csv)

    # Read with string dtype so nothing is guessed or coerced silently
    df = pd.read_csv(bhopal_csv, dtype=str)

    # Validate header
    for col in REQUIRED_COLUMNS:
        if col not in df.columns:
            raise DataValidationError(f"Missing required column '{col}' in {bhopal_csv.name}")

    # Normalise status and value
    statuses: list[Status] = []
    numeric_values: list[float | None] = []

    for idx, row in df.iterrows():
        try:
            stat, num_val = normalise_status(
                value=row.get("value"),
                flag=row.get("flag"),
                value_as_printed=row.get("value_as_printed"),
            )
            statuses.append(stat)
            numeric_values.append(num_val)
        except Exception as e:
            raise DataValidationError(
                f"Row {idx + 2} validation error in {bhopal_csv.name}: {e}"
            ) from e

    df["status"] = statuses
    df["value_numeric"] = numeric_values
    df["site_slug"] = df["site"].apply(site_name_to_slug)
    df["year_int"] = df["year"].astype(int)
    df["source_page_int"] = df["source_page"].astype(int)
    df["reading_id"] = range(1, len(df) + 1)

    # Run integrity checks
    if len(df) != 1524:
        raise DataValidationError(f"Expected 1524 rows in Bhopal data, got {len(df)}")
    if df["site_slug"].nunique() != 7:
        raise DataValidationError(f"Expected 7 distinct sites, got {df['site_slug'].nunique()}")

    # Build Pydantic models for type safety
    readings_models: list[Reading] = []
    for _, row in df.iterrows():
        readings_models.append(
            Reading(
                id=int(row["reading_id"]),
                reading_id=int(row["reading_id"]),
                site_slug=str(row["site_slug"]),
                parameter=str(row["parameter"]),
                year=int(row["year_int"]),
                festival=str(row["festival"]),  # type: ignore[arg-type]
                phase=str(row["phase"]),  # type: ignore[arg-type]
                status=str(row["status"]),  # type: ignore[arg-type]
                value=row["value_numeric"],
                unit_assumed=str(row["unit_assumed"]) if pd.notna(row["unit_assumed"]) else None,
                flag_raw=str(row["flag"]) if pd.notna(row["flag"]) else None,
                value_as_printed=str(row["value_as_printed"]) if pd.notna(row["value_as_printed"]) else None,
                parameter_as_printed=str(row["parameter_as_printed"]) if pd.notna(row["parameter_as_printed"]) else None,
                site_as_printed=str(row["site_as_printed"]),
                source_page=int(row["source_page_int"]),
            )
        )

    # Load limits
    criteria_csv = dir_path / "cpcb_water_quality_criteria.csv"
    if not criteria_csv.is_file():
        criteria_csv = Path("../data/raw/cpcb_water_quality_criteria.csv")
    limits = load_limits_csv(criteria_csv)

    return df, readings_models, limits, data_hash

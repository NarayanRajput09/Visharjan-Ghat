"""Computes sampling coverage grid (year x festival x phase) per ghat."""

import pandas as pd
from analysis.models import CoverageCell, Festival, Phase, Status


def compute_ghat_coverage(df: pd.DataFrame, site_slug: str) -> list[CoverageCell]:
    """Computes coverage across 3 years x 2 festivals x 3 phases for a site."""
    site_df = df[df["site_slug"] == site_slug]

    years = [2023, 2024, 2025]
    festivals: list[Festival] = ["Ganesh", "Durga"]
    phases: list[Phase] = ["pre", "during", "after"]

    cells: list[CoverageCell] = []

    for y in years:
        for fest in festivals:
            for ph in phases:
                sub = site_df[
                    (site_df["year_int"] == y)
                    & (site_df["festival"] == fest)
                    & (site_df["phase"] == ph)
                ]

                if len(sub) == 0:
                    cells.append(
                        CoverageCell(
                            year=y,
                            festival=fest,
                            phase=ph,
                            sampled=0,
                            missing=13,
                            status="not_sampled",
                        )
                    )
                else:
                    sampled_cnt = int((sub["status"] != "not_sampled").sum())
                    missing_cnt = int((sub["status"] == "not_sampled").sum())
                    cell_status: Status = "measured" if sampled_cnt > 0 else "not_sampled"
                    cells.append(
                        CoverageCell(
                            year=y,
                            festival=fest,
                            phase=ph,
                            sampled=sampled_cnt,
                            missing=missing_cnt,
                            status=cell_status,
                        )
                    )

    return cells

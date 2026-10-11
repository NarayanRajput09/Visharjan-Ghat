"""Reason generation for ranked ghats."""

import pandas as pd
from analysis.models import Reason, Confidence


def generate_reasons(
    site_df: pd.DataFrame,
    confidence: Confidence,
    min_do: float = 5.0,
    max_bod: float = 3.0,
    min_ph: float = 6.5,
    max_ph: float = 8.5,
) -> list[Reason]:
    """Generates up to 3 typed reasons for a ghat in priority order."""
    reasons: list[Reason] = []

    # 1. Worst DO reading (if < min_do)
    do_readings = site_df[
        (site_df["parameter"] == "Dissolved oxygen")
        & (site_df["status"].isin(["measured", "bdl", "nd"]))
    ].copy()

    if len(do_readings) > 0:
        # replace bdl with 0.0 for comparison
        do_readings["comp_val"] = do_readings.apply(
            lambda r: 0.0 if r["status"] in ("bdl", "nd") else (r["value_numeric"] or 0.0),
            axis=1,
        )
        worst_do = do_readings.sort_values(by=["comp_val", "year_int"], ascending=[True, False]).iloc[0]

        if worst_do["comp_val"] < min_do:
            reasons.append(
                Reason(
                    kind="worst_do",
                    params={
                        "value": float(worst_do["comp_val"]),
                        "limit": float(min_do),
                        "festival": str(worst_do["festival"]),
                        "year": int(worst_do["year_int"]),
                        "phase": str(worst_do["phase"]),
                    },
                    reading_ids=[int(worst_do["reading_id"])],
                )
            )

    # 2. BOD exceedance count ("BOD above 3 in X of Y tests")
    bod_readings = site_df[
        (site_df["parameter"] == "BOD")
        & (site_df["status"] == "measured")
    ]
    if len(bod_readings) > 0:
        total_bod = len(bod_readings)
        exceeded_bod = bod_readings[bod_readings["value_numeric"] > max_bod]
        exceeded_count = len(exceeded_bod)

        if exceeded_count > 0:
            max_val = float(bod_readings["value_numeric"].max())
            worst_bod_ids = exceeded_bod.sort_values(by="value_numeric", ascending=False)["reading_id"].head(2).tolist()
            reasons.append(
                Reason(
                    kind="bod_exceedance",
                    params={
                        "exceeded": exceeded_count,
                        "total": total_bod,
                        "limit": float(max_bod),
                        "max": max_val,
                    },
                    reading_ids=[int(i) for i in worst_bod_ids],
                )
            )

    # 3. Trend: did average severity rise between earliest and latest year?
    years_with_data = sorted(site_df[site_df["status"] != "not_sampled"]["year_int"].unique())
    if len(years_with_data) >= 2:
        earliest_y = years_with_data[0]
        latest_y = years_with_data[-1]

        # check if BOD or DO deteriorated
        latest_do = site_df[(site_df["year_int"] == latest_y) & (site_df["parameter"] == "Dissolved oxygen") & (site_df["status"] == "measured")]
        earliest_do = site_df[(site_df["year_int"] == earliest_y) & (site_df["parameter"] == "Dissolved oxygen") & (site_df["status"] == "measured")]

        if len(latest_do) > 0 and len(earliest_do) > 0:
            if latest_do["value_numeric"].mean() < earliest_do["value_numeric"].mean():
                reasons.append(
                    Reason(
                        kind="trend",
                        params={
                            "earliest_year": int(earliest_y),
                            "latest_year": int(latest_y),
                        },
                        reading_ids=[],
                    )
                )

    # 4. pH out of range
    ph_readings = site_df[
        (site_df["parameter"] == "pH")
        & (site_df["status"] == "measured")
    ]
    if len(ph_readings) > 0:
        out_ph = ph_readings[(ph_readings["value_numeric"] < min_ph) | (ph_readings["value_numeric"] > max_ph)]
        if len(out_ph) > 0:
            worst_ph = out_ph.iloc[0]
            reasons.append(
                Reason(
                    kind="ph_out_of_range",
                    params={
                        "value": float(worst_ph["value_numeric"]),
                        "year": int(worst_ph["year_int"]),
                        "festival": str(worst_ph["festival"]),
                    },
                    reading_ids=[int(worst_ph["reading_id"])],
                )
            )

    # 5. Data gap note if confidence is not good
    if confidence != "good":
        sampled_count = int((site_df[site_df["parameter"].isin(["Dissolved oxygen", "BOD", "pH"])]["status"] != "not_sampled").sum())
        reasons.append(
            Reason(
                kind="data_gap",
                params={
                    "sampled_count": sampled_count,
                },
                reading_ids=[],
            )
        )

    # Return up to 3 reasons
    return reasons[:3]

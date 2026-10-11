"""Risk scoring and ghat ranking engine."""

from datetime import datetime, timezone
import pandas as pd

from analysis.config import PARAM_WEIGHTS, YEAR_WEIGHTS, FESTIVAL_WEIGHTS, PHASE_WEIGHTS, SCORED_PARAMETERS
from analysis.severity import reading_severity
from analysis.sites import STANDARD_SITES
from analysis.reasons import generate_reasons
from analysis.models import RankedGhat, RankingResponse, Tier, Confidence, CPCBClass, LimitItem


def score_and_rank_ghats(
    df: pd.DataFrame,
    cpcb_class: CPCBClass = "B",
    limits_list: list[LimitItem] | None = None,
) -> RankingResponse:
    """Computes deterministic risk score, tier, confidence, and ranking for the 7 Bhopal ghats."""
    # Find limits for class
    min_do = 5.0
    max_bod = 3.0
    min_ph = 6.5
    max_ph = 8.5

    if limits_list:
        for lim in limits_list:
            if "oxygen" in lim.parameter.lower() and lim.limit_min is not None:
                min_do = lim.limit_min
            elif "bod" in lim.parameter.lower() and lim.limit_max is not None:
                max_bod = lim.limit_max
            elif "ph" in lim.parameter.lower():
                if lim.limit_min is not None:
                    min_ph = lim.limit_min
                if lim.limit_max is not None:
                    max_ph = lim.limit_max

    # Filter scored parameters with status != 'not_sampled'
    scored_df = df[
        df["parameter"].isin(SCORED_PARAMETERS)
        & (df["status"] != "not_sampled")
    ].copy()

    # Calculate severity s for each row
    severities: list[float] = []
    weights: list[float] = []

    for _, row in scored_df.iterrows():
        s = reading_severity(
            parameter=str(row["parameter"]),
            status=str(row["status"]),
            value=row["value_numeric"],
            min_do=min_do,
            max_bod=max_bod,
            min_ph=min_ph,
            max_ph=max_ph,
        )
        s_val = s if s is not None else 0.0

        w_p = PARAM_WEIGHTS.get(str(row["parameter"]), 0.3)
        w_y = YEAR_WEIGHTS.get(int(row["year_int"]), 0.5)
        w_f = FESTIVAL_WEIGHTS.get(str(row["festival"]), 0.8)
        w_ph = PHASE_WEIGHTS.get(str(row["phase"]), 0.8)
        w_total = w_p * w_y * w_f * w_ph

        severities.append(s_val)
        weights.append(w_total)

    scored_df["s"] = severities
    scored_df["w"] = weights
    scored_df["w_s"] = scored_df["w"] * scored_df["s"]

    # Process each standard site
    ghats_data: list[dict] = []

    for slug, site_meta in STANDARD_SITES.items():
        site_all = df[df["site_slug"] == slug]
        site_scored = scored_df[scored_df["site_slug"] == slug]

        # Calculate score: 100 * sum(w * s) / sum(w)
        if len(site_scored) > 0 and site_scored["w"].sum() > 0:
            score = 100.0 * (site_scored["w_s"].sum() / site_scored["w"].sum())
        else:
            score = 0.0

        # Confidence:
        # Good: >= 12 sampled limit readings AND Durga data in 2024 or 2025
        # Limited: 6–11 sampled readings, or no Durga data in 2024–2025
        # Poor: < 6 sampled readings
        sampled_count = len(site_scored)
        has_recent_durga = len(
            site_all[
                (site_all["year_int"].isin([2024, 2025]))
                & (site_all["festival"] == "Durga")
                & (site_all["status"] != "not_sampled")
            ]
        ) > 0

        if sampled_count >= 12 and has_recent_durga:
            conf: Confidence = "good"
        elif sampled_count >= 6:
            conf = "limited"
        else:
            conf = "poor"

        # Tier: High >= 40, or any DO <= 2 in last two Durga festivals
        # Medium 15 <= score < 40
        # Low < 15
        recent_durga_do = site_all[
            (site_all["year_int"].isin([2024, 2025]))
            & (site_all["festival"] == "Durga")
            & (site_all["parameter"] == "Dissolved oxygen")
        ]
        has_low_do_override = False
        for _, r in recent_durga_do.iterrows():
            if r["status"] in ("bdl", "nd"):
                has_low_do_override = True
                break
            if r["status"] == "measured" and r["value_numeric"] is not None and r["value_numeric"] <= 2.0:
                has_low_do_override = True
                break

        if score >= 40.0 or has_low_do_override:
            tier: Tier = "high"
        elif score >= 15.0:
            tier = "medium"
        else:
            tier = "low"

        # Reasons
        reasons = generate_reasons(
            site_all,
            confidence=conf,
            min_do=min_do,
            max_bod=max_bod,
            min_ph=min_ph,
            max_ph=max_ph,
        )

        # Min DO and Max BOD for tie breaking
        do_measured = site_all[
            (site_all["parameter"] == "Dissolved oxygen")
            & (site_all["status"] == "measured")
        ]
        min_do_val = float(do_measured["value_numeric"].min()) if len(do_measured) > 0 else 999.0

        bod_measured = site_all[
            (site_all["parameter"] == "BOD")
            & (site_all["status"] == "measured")
        ]
        max_bod_val = float(bod_measured["value_numeric"].max()) if len(bod_measured) > 0 else -1.0

        ghats_data.append(
            {
                "slug": slug,
                "name_en": site_meta.name_en,
                "name_hi": site_meta.name_hi,
                "water_body": site_meta.water_body,
                "score": round(score, 1),
                "tier": tier,
                "confidence": conf,
                "site_match_confidence": site_meta.site_match_confidence,
                "reasons": reasons,
                "suggested_actions": list(site_meta.suggested_actions),
                "known_gaps": list(site_meta.known_gaps),
                "lat": site_meta.lat,
                "lng": site_meta.lng,
                "min_do": min_do_val,
                "max_bod": max_bod_val,
            }
        )

    # Sort: score desc, min_do asc (lower is worse), max_bod desc (higher is worse), name asc
    ghats_data.sort(
        key=lambda g: (-g["score"], g["min_do"], -g["max_bod"], g["slug"])
    )

    ranked_ghats: list[RankedGhat] = []
    for rank_idx, item in enumerate(ghats_data, start=1):
        ranked_ghats.append(
            RankedGhat(
                rank=rank_idx,
                slug=item["slug"],
                name_en=item["name_en"],
                name_hi=item["name_hi"],
                water_body=item["water_body"],
                score=item["score"],
                tier=item["tier"],
                confidence=item["confidence"],
                site_match_confidence=item["site_match_confidence"],
                reasons=item["reasons"],
                suggested_actions=item["suggested_actions"],
                known_gaps=item["known_gaps"],
                lat=item["lat"],
                lng=item["lng"],
            )
        )

    return RankingResponse(
        scoring_run_id=1,
        generated_at=datetime.now(timezone.utc).isoformat(),
        cpcb_class=cpcb_class,
        ghats=ranked_ghats,
    )

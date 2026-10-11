"""CPCB water quality limits parser and reference limits."""

import csv
from pathlib import Path
from analysis.models import CPCBClass, LimitItem, LimitsResponse


# Standard fallback criteria if CSV is not supplied or parsed
DEFAULT_LIMITS: dict[CPCBClass, list[LimitItem]] = {
    "A": [
        LimitItem(parameter="Dissolved oxygen", limit_type="min", limit_min=6.0, unit="mg/l", best_use="Drinking water source without conventional treatment"),
        LimitItem(parameter="BOD", limit_type="max", limit_max=2.0, unit="mg/l", best_use="Drinking water source without conventional treatment"),
        LimitItem(parameter="pH", limit_type="range", limit_min=6.5, limit_max=8.5, best_use="Drinking water source without conventional treatment"),
    ],
    "B": [
        LimitItem(parameter="Dissolved oxygen", limit_type="min", limit_min=5.0, unit="mg/l", best_use="Outdoor bathing (organised)"),
        LimitItem(parameter="BOD", limit_type="max", limit_max=3.0, unit="mg/l", best_use="Outdoor bathing (organised)"),
        LimitItem(parameter="pH", limit_type="range", limit_min=6.5, limit_max=8.5, best_use="Outdoor bathing (organised)"),
    ],
    "C": [
        LimitItem(parameter="Dissolved oxygen", limit_type="min", limit_min=4.0, unit="mg/l", best_use="Drinking water source after conventional treatment"),
        LimitItem(parameter="BOD", limit_type="max", limit_max=3.0, unit="mg/l", best_use="Drinking water source after conventional treatment"),
        LimitItem(parameter="pH", limit_type="range", limit_min=6.0, limit_max=9.0, best_use="Drinking water source after conventional treatment"),
    ],
    "D": [
        LimitItem(parameter="Dissolved oxygen", limit_type="min", limit_min=4.0, unit="mg/l", best_use="Propagation of wild life and fisheries"),
        LimitItem(parameter="pH", limit_type="range", limit_min=6.5, limit_max=8.5, best_use="Propagation of wild life and fisheries"),
    ],
    "E": [
        LimitItem(parameter="pH", limit_type="range", limit_min=6.0, limit_max=8.5, best_use="Irrigation, industrial cooling, controlled waste disposal"),
    ],
}


def load_limits_csv(criteria_csv_path: str | Path) -> dict[CPCBClass, list[LimitItem]]:
    """Loads CPCB water quality criteria from CSV."""
    path = Path(criteria_csv_path)
    if not path.is_file():
        return DEFAULT_LIMITS

    limits_by_class: dict[CPCBClass, list[LimitItem]] = {
        "A": [], "B": [], "C": [], "D": [], "E": []
    }

    with open(path, mode="r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            cls = row.get("class", "").strip().upper()
            if cls not in limits_by_class:
                continue

            param_name = row.get("parameter", "").strip()
            # Normalize parameter name
            if "oxygen" in param_name.lower():
                std_param = "Dissolved oxygen"
            elif "bod" in param_name.lower():
                std_param = "BOD"
            elif "ph" in param_name.lower():
                std_param = "pH"
            else:
                std_param = param_name

            best_use = row.get("best_use", "")
            unit = row.get("unit", "")
            limit_val = row.get("criteria", row.get("limit", "")).strip()

            if "-" in limit_val:
                parts = limit_val.split("-")
                try:
                    p_min, p_max = float(parts[0].strip()), float(parts[1].strip())
                    limits_by_class[cls].append(
                        LimitItem(
                            parameter=std_param,
                            limit_type="range",
                            limit_min=p_min,
                            limit_max=p_max,
                            unit=unit or None,
                            best_use=best_use,
                        )
                    )
                except ValueError:
                    pass
            elif limit_val.startswith(">=") or "or more" in limit_val.lower():
                cleaned = limit_val.replace(">=", "").replace("or more", "").strip()
                try:
                    p_min = float(cleaned)
                    limits_by_class[cls].append(
                        LimitItem(
                            parameter=std_param,
                            limit_type="min",
                            limit_min=p_min,
                            unit=unit or None,
                            best_use=best_use,
                        )
                    )
                except ValueError:
                    pass
            elif limit_val.startswith("<=") or "or less" in limit_val.lower():
                cleaned = limit_val.replace("<=", "").replace("or less", "").strip()
                try:
                    p_max = float(cleaned)
                    limits_by_class[cls].append(
                        LimitItem(
                            parameter=std_param,
                            limit_type="max",
                            limit_max=p_max,
                            unit=unit or None,
                            best_use=best_use,
                        )
                    )
                except ValueError:
                    pass

    # Ensure defaults if empty
    for k in ("A", "B", "C", "D", "E"):
        if not limits_by_class[k]:
            limits_by_class[k] = DEFAULT_LIMITS[k]

    return limits_by_class


def get_limits_for_class(cpcb_class: CPCBClass, limits_map: dict[CPCBClass, list[LimitItem]] | None = None) -> LimitsResponse:
    mapping = limits_map or DEFAULT_LIMITS
    return LimitsResponse(cpcb_class=cpcb_class, limits=mapping.get(cpcb_class, DEFAULT_LIMITS["B"]))

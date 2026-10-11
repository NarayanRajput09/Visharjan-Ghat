"""Per-reading severity calculations against CPCB limits."""

from analysis.models import Status


def clamp(val: float, low: float = 0.0, high: float = 1.0) -> float:
    return max(low, min(high, val))


def reading_severity(
    parameter: str,
    status: Status,
    value: float | None,
    min_do: float = 5.0,
    max_bod: float = 3.0,
    min_ph: float = 6.5,
    max_ph: float = 8.5,
) -> float | None:
    """
    Computes severity in [0.0, 1.0] for a reading of DO, BOD, or pH.
    Returns None if status is 'not_sampled'.
    """
    if status == "not_sampled":
        return None

    param_lower = parameter.lower()

    # Dissolved oxygen (min limit)
    if "oxygen" in param_lower:
        if status in ("bdl", "nd"):
            return 1.0  # Oxygen too low to detect: worst failure
        if value is None:
            return None
        return clamp((min_do - value) / min_do, 0.0, 1.0)

    # BOD (max limit)
    if "bod" in param_lower:
        if status in ("bdl", "nd"):
            return 0.0  # Very low organic loading: passes
        if value is None:
            return None
        return clamp((value - max_bod) / 9.0, 0.0, 1.0)

    # pH (range limit)
    if "ph" in param_lower:
        if status in ("bdl", "nd"):
            return 0.0
        if value is None:
            return None
        if value < min_ph:
            dist = min_ph - value
        elif value > max_ph:
            dist = value - max_ph
        else:
            dist = 0.0
        return clamp(dist / 1.5, 0.0, 1.0)

    return None

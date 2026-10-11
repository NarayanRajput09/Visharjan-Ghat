"""Scoring configuration and weights for Visarjan Ghat Watch."""

SCORING_CONFIG_VERSION = "1.0"

PARAM_WEIGHTS: dict[str, float] = {
    "Dissolved oxygen": 0.45,
    "BOD": 0.35,
    "pH": 0.20,
}

YEAR_WEIGHTS: dict[int, float] = {
    2025: 1.0,
    2024: 0.7,
    2023: 0.5,
}

FESTIVAL_WEIGHTS: dict[str, float] = {
    "Durga": 1.0,
    "Ganesh": 0.8,
}

PHASE_WEIGHTS: dict[str, float] = {
    "during": 1.0,
    "after": 1.0,
    "pre": 0.6,
}

SCORED_PARAMETERS: list[str] = ["Dissolved oxygen", "BOD", "pH"]

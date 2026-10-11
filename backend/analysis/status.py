"""Status normalisation for water quality readings."""

from typing import Any, Literal

Status = Literal["measured", "bdl", "nd", "not_sampled"]


class UnknownStatusError(ValueError):
    """Raised when a reading value/flag cannot be mapped to a known status."""
    pass


def normalise_status(
    value: Any,
    flag: str | None = None,
    value_as_printed: str | None = None,
) -> tuple[Status, float | None]:
    """
    Normalises reading value and flag into a standard status and numeric float or None.
    Never fills missing values with 0.
    """
    # 1. Check if value is a valid numeric float/int
    if value is not None:
        val_str = str(value).strip()
        if val_str and val_str.lower() not in ("nan", "none", "", "-", "_"):
            try:
                num = float(val_str)
                return "measured", num
            except ValueError:
                pass

    # 2. Check flag and value_as_printed
    flag_clean = (str(flag).strip() if flag is not None else "").lower()
    vap_clean = (str(value_as_printed).strip() if value_as_printed is not None else "").lower()

    # BDL check
    if flag_clean == "bdl" or vap_clean == "bdl":
        return "bdl", None

    # ND check
    if flag_clean == "nd" or vap_clean == "nd":
        return "nd", None

    # not sampled check
    not_sampled_tokens = {
        "not sampled",
        "*",
        "**",
        "-",
        "_",
        "",
        "nan",
        "none",
    }
    if flag_clean in not_sampled_tokens and (vap_clean in not_sampled_tokens or not vap_clean):
        return "not_sampled", None

    # If flag is empty but value_as_printed is not sampled
    if vap_clean in not_sampled_tokens:
        return "not_sampled", None

    raise UnknownStatusError(
        f"Unknown reading status: value={value!r}, flag={flag!r}, value_as_printed={value_as_printed!r}"
    )

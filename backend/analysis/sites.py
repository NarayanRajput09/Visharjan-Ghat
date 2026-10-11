"""The 7 standard Bhopal immersion ghats metadata and mappings."""

from dataclasses import dataclass
from typing import Literal


@dataclass(frozen=True)
class SiteInfo:
    slug: str
    name_en: str
    name_hi: str
    water_body: str
    site_match_confidence: Literal["high", "medium"]
    lat: float
    lng: float
    known_gaps: tuple[str, ...]
    suggested_actions: tuple[str, ...]


STANDARD_SITES: dict[str, SiteInfo] = {
    "bairagarh-sant-hirdaram-kund": SiteInfo(
        slug="bairagarh-sant-hirdaram-kund",
        name_en="Bairagarh (Sant Hirdaram) kund",
        name_hi="बैरागढ़ (संत हिरदाराम) कुंड",
        water_body="Upper Lake",
        site_match_confidence="high",
        lat=23.2682,
        lng=77.3401,
        known_gaps=("gap_no_durga_2025",),
        suggested_actions=("action_aeration", "action_cleaning", "action_post_test"),
    ),
    "khatlapura-ghat": SiteInfo(
        slug="khatlapura-ghat",
        name_en="Khatlapura ghat",
        name_hi="खटलापुरा घाट",
        water_body="Lower Lake",
        site_match_confidence="high",
        lat=23.2451,
        lng=77.4102,
        known_gaps=(),
        suggested_actions=("action_aeration", "action_cleaning", "action_post_test"),
    ),
    "prempura-ghat": SiteInfo(
        slug="prempura-ghat",
        name_en="Prempura ghat",
        name_hi="प्रेमपुरा घाट",
        water_body="Upper Lake",
        site_match_confidence="high",
        lat=23.2255,
        lng=77.3754,
        known_gaps=(),
        suggested_actions=("action_standard_cleaning", "action_post_test"),
    ),
    "rani-kamlapati-ghat-kamla-park-kund": SiteInfo(
        slug="rani-kamlapati-ghat-kamla-park-kund",
        name_en="Rani Kamlapati ghat / Kamla Park kund",
        name_hi="रानी कमलापति घाट / कमला पार्क कुंड",
        water_body="Lower Lake",
        site_match_confidence="medium",
        lat=23.2484,
        lng=77.3995,
        known_gaps=("gap_site_name_variation",),
        suggested_actions=("action_standard_cleaning", "action_baseline_test"),
    ),
    "hathaikheda-dam-kund": SiteInfo(
        slug="hathaikheda-dam-kund",
        name_en="Hathaikheda dam / kund",
        name_hi="हथाईखेड़ा बांध / कुंड",
        water_body="Hathaikheda dam",
        site_match_confidence="high",
        lat=23.2492,
        lng=77.4781,
        known_gaps=(),
        suggested_actions=("action_standard_cleaning",),
    ),
    "malikhedi-kund": SiteInfo(
        slug="malikhedi-kund",
        name_en="Malikhedi kund",
        name_hi="मालीखेड़ी कुंड",
        water_body="Kund",
        site_match_confidence="high",
        lat=23.2621,
        lng=77.4583,
        known_gaps=("gap_no_durga_2025",),
        suggested_actions=("action_standard_cleaning", "action_baseline_test"),
    ),
    "shahpura-lake-ghat": SiteInfo(
        slug="shahpura-lake-ghat",
        name_en="Shahpura lake ghat",
        name_hi="शाहपुरा झील घाट",
        water_body="Shahpura Lake",
        site_match_confidence="high",
        lat=23.2081,
        lng=77.4253,
        known_gaps=(),
        suggested_actions=("action_standard_cleaning",),
    ),
}


def site_name_to_slug(site_name: str) -> str:
    """Maps printed or standard site name from CSV to canonical slug."""
    s = site_name.strip().lower()
    if "bairagarh" in s or "hirdaram" in s:
        return "bairagarh-sant-hirdaram-kund"
    if "khatlapura" in s:
        return "khatlapura-ghat"
    if "prempura" in s:
        return "prempura-ghat"
    if "kamlapati" in s or "kamla park" in s or "lower lake" in s:
        return "rani-kamlapati-ghat-kamla-park-kund"
    if "hathaikheda" in s:
        return "hathaikheda-dam-kund"
    if "malikhedi" in s:
        return "malikhedi-kund"
    if "shahpura" in s:
        return "shahpura-lake-ghat"
    raise KeyError(f"Unknown site name: {site_name}")

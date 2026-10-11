"""Domain models for Visarjan Ghat Watch."""

from typing import Any, Literal
from pydantic import BaseModel, ConfigDict

Status = Literal["measured", "bdl", "nd", "not_sampled"]
Phase = Literal["pre", "during", "after"]
Festival = Literal["Ganesh", "Durga"]
Tier = Literal["high", "medium", "low"]
Confidence = Literal["good", "limited", "poor"]
SiteMatchConfidence = Literal["high", "medium"]
CPCBClass = Literal["A", "B", "C", "D", "E"]
ReasonKind = Literal["worst_do", "bod_exceedance", "trend", "ph_out_of_range", "data_gap"]


class Reading(BaseModel):
    model_config = ConfigDict(frozen=True)

    id: int
    reading_id: int
    site_slug: str
    site_id: int | None = None
    parameter: str
    parameter_id: int | None = None
    year: int
    festival: Festival
    phase: Phase
    status: Status
    value: float | None = None
    unit_assumed: str | None = None
    flag_raw: str | None = None
    value_as_printed: str | None = None
    parameter_as_printed: str | None = None
    site_as_printed: str
    source_page: int
    report_url: str | None = None


class Reason(BaseModel):
    model_config = ConfigDict(frozen=True)

    kind: ReasonKind
    params: dict[str, Any]
    reading_ids: list[int]


class RankedGhat(BaseModel):
    model_config = ConfigDict(frozen=True)

    rank: int
    slug: str
    name_en: str
    name_hi: str
    water_body: str
    score: float
    tier: Tier
    confidence: Confidence
    site_match_confidence: SiteMatchConfidence
    reasons: list[Reason]
    suggested_actions: list[str]
    known_gaps: list[str]
    lat: float | None = None
    lng: float | None = None


class RankingResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    scoring_run_id: int
    generated_at: str
    cpcb_class: CPCBClass
    ghats: list[RankedGhat]


class CoverageCell(BaseModel):
    model_config = ConfigDict(frozen=True)

    year: int
    festival: Festival
    phase: Phase
    sampled: int
    missing: int
    status: Status | None = None


class GhatDetailResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    ghat: RankedGhat
    coverage: list[CoverageCell]
    reasons: list[Reason]
    known_gaps: list[str]
    suggested_actions: list[str]


class LimitItem(BaseModel):
    model_config = ConfigDict(frozen=True)

    parameter: str
    limit_type: Literal["min", "max", "range"]
    limit_min: float | None = None
    limit_max: float | None = None
    unit: str | None = None
    best_use: str


class LimitsResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    cpcb_class: CPCBClass
    limits: list[LimitItem]


class ParameterInfo(BaseModel):
    model_config = ConfigDict(frozen=True)

    name: str
    unit: str | None = None
    is_scored: bool
    label_key: str


class ParametersResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    parameters: list[ParameterInfo]


class Bilingual(BaseModel):
    model_config = ConfigDict(frozen=True)

    en: str
    hi: str


class BriefGhat(BaseModel):
    model_config = ConfigDict(frozen=True)

    rank: int
    name_en: str
    name_hi: str
    tier: Tier
    confidence: Confidence
    reasons: list[Bilingual]
    suggested_actions: list[Bilingual]


class BriefFacts(BaseModel):
    model_config = ConfigDict(frozen=True)

    visarjan_date: str = "2026-10-20"
    cpcb_class: CPCBClass = "B"
    top_ghats: list[BriefGhat]
    data_gaps: list[Bilingual]
    allowed_numbers: list[float]
    source_line: Bilingual


class BriefSection(BaseModel):
    model_config = ConfigDict(frozen=True)

    headline: str
    top_risks: list[str]
    actions: list[str]
    data_gaps: list[str]
    source_line: str


class BriefOutput(BaseModel):
    model_config = ConfigDict(frozen=True)

    en: BriefSection
    hi: BriefSection


class BriefValidation(BaseModel):
    model_config = ConfigDict(frozen=True)

    ok: bool
    errors: list[str] = []
    word_count_en: int | None = None
    word_count_hi: int | None = None


class BriefResponse(BaseModel):
    model_config = ConfigDict(frozen=True)

    brief_id: int
    scoring_run_id: int | None = None
    created_at: str | None = None
    source: Literal["claude", "template"]
    model: str | None = None
    en: BriefSection
    hi: BriefSection
    validation: BriefValidation


class CreateBriefRequest(BaseModel):
    cpcb_class: str = "B"

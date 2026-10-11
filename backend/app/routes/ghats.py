"""Ghats detail and readings endpoints."""

from fastapi import APIRouter, Depends, Query
from app.deps import get_state
from app.state import AppState
from app.errors import NotFoundError
from analysis.sites import STANDARD_SITES
from analysis.coverage import compute_ghat_coverage
from analysis.models import (
    GhatDetailResponse,
    Reading,
    CPCBClass,
    Status,
    Festival,
    Phase,
)

router = APIRouter(prefix="/api/ghats", tags=["ghats"])


@router.get("/{slug}", response_model=GhatDetailResponse)
def get_ghat_detail(
    slug: str,
    cpcb_class: CPCBClass = Query(default="B"),
    state: AppState = Depends(get_state),
) -> GhatDetailResponse:
    if slug not in STANDARD_SITES:
        raise NotFoundError(f"Ghat with slug '{slug}' not found")

    ranking = state.get_ranking(cpcb_class)
    ghat_match = next((g for g in ranking.ghats if g.slug == slug), None)

    if not ghat_match:
        raise NotFoundError(f"Ghat with slug '{slug}' not found in ranking")

    coverage = compute_ghat_coverage(state.readings_df, slug)

    return GhatDetailResponse(
        ghat=ghat_match,
        coverage=coverage,
        reasons=ghat_match.reasons,
        known_gaps=ghat_match.known_gaps,
        suggested_actions=ghat_match.suggested_actions,
    )


@router.get("/{slug}/readings", response_model=list[Reading])
def get_ghat_readings(
    slug: str,
    parameter: str | None = Query(default=None),
    year: int | None = Query(default=None),
    festival: Festival | None = Query(default=None),
    phase: Phase | None = Query(default=None),
    status: Status | None = Query(default=None),
    state: AppState = Depends(get_state),
) -> list[Reading]:
    if slug not in STANDARD_SITES:
        raise NotFoundError(f"Ghat with slug '{slug}' not found")

    readings = [r for r in state.readings_models if r.site_slug == slug]

    if parameter:
        readings = [r for r in readings if r.parameter.lower() == parameter.lower()]
    if year:
        readings = [r for r in readings if r.year == year]
    if festival:
        readings = [r for r in readings if r.festival == festival]
    if phase:
        readings = [r for r in readings if r.phase == phase]
    if status:
        readings = [r for r in readings if r.status == status]

    return readings

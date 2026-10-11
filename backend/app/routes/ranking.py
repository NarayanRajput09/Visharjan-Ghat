"""Ranking endpoint."""

from fastapi import APIRouter, Depends, Query
from app.deps import get_state
from app.state import AppState
from analysis.models import RankingResponse, CPCBClass

router = APIRouter(prefix="/api", tags=["ranking"])


@router.get("/ranking", response_model=RankingResponse)
def get_ranking(
    cpcb_class: CPCBClass = Query(default="B", description="CPCB water use classification (A-E)"),
    state: AppState = Depends(get_state),
) -> RankingResponse:
    return state.get_ranking(cpcb_class)

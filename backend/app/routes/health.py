"""Health check endpoint."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel

from app.deps import get_state, get_settings
from app.state import AppState
from app.settings import Settings
from analysis.config import SCORING_CONFIG_VERSION

router = APIRouter(prefix="/api", tags=["health"])


class HealthResponse(BaseModel):
    ok: bool
    data_hash: str
    scoring_config_version: str
    llm_available: bool


@router.get("/health", response_model=HealthResponse)
def health_check(
    state: AppState = Depends(get_state),
    settings: Settings = Depends(get_settings),
) -> HealthResponse:
    return HealthResponse(
        ok=True,
        data_hash=state.data_hash,
        scoring_config_version=SCORING_CONFIG_VERSION,
        llm_available=settings.llm_available,
    )

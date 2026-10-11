"""Reading detail and parameter/limit reference endpoints."""

from fastapi import APIRouter, Depends, Query
from app.deps import get_state
from app.state import AppState
from app.errors import NotFoundError
from analysis.models import Reading, LimitsResponse, ParametersResponse, ParameterInfo, CPCBClass
from analysis.limits import get_limits_for_class

router = APIRouter(prefix="/api", tags=["readings"])

STANDARD_PARAMETERS: list[ParameterInfo] = [
    ParameterInfo(name="Dissolved oxygen", unit="mg/l", is_scored=True, label_key="parameter.do"),
    ParameterInfo(name="BOD", unit="mg/l", is_scored=True, label_key="parameter.bod"),
    ParameterInfo(name="pH", unit=None, is_scored=True, label_key="parameter.ph"),
    ParameterInfo(name="COD", unit="mg/l", is_scored=False, label_key="parameter.cod"),
    ParameterInfo(name="Total solids", unit="mg/l", is_scored=False, label_key="parameter.total_solids"),
    ParameterInfo(name="Dissolved solids", unit="mg/l", is_scored=False, label_key="parameter.dissolved_solids"),
    ParameterInfo(name="Suspended solids", unit="mg/l", is_scored=False, label_key="parameter.suspended_solids"),
    ParameterInfo(name="Turbidity", unit="NTU", is_scored=False, label_key="parameter.turbidity"),
    ParameterInfo(name="Conductivity", unit="µS/cm", is_scored=False, label_key="parameter.conductivity"),
    ParameterInfo(name="Lead", unit="mg/l", is_scored=False, label_key="parameter.lead"),
    ParameterInfo(name="Copper", unit="mg/l", is_scored=False, label_key="parameter.copper"),
    ParameterInfo(name="Zinc", unit="mg/l", is_scored=False, label_key="parameter.zinc"),
    ParameterInfo(name="Chromium", unit="mg/l", is_scored=False, label_key="parameter.chromium"),
]


@router.get("/readings/{reading_id}", response_model=Reading)
def get_reading(
    reading_id: int,
    state: AppState = Depends(get_state),
) -> Reading:
    reading = next((r for r in state.readings_models if r.reading_id == reading_id), None)
    if not reading:
        raise NotFoundError(f"Reading with id {reading_id} not found")
    return reading


@router.get("/limits", response_model=LimitsResponse)
def get_limits(
    cpcb_class: CPCBClass = Query(default="B"),
    state: AppState = Depends(get_state),
) -> LimitsResponse:
    return get_limits_for_class(cpcb_class, state.limits)


@router.get("/parameters", response_model=ParametersResponse)
def get_parameters() -> ParametersResponse:
    return ParametersResponse(parameters=STANDARD_PARAMETERS)

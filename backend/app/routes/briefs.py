"""Brief generation and retrieval endpoints."""

from fastapi import APIRouter, Depends, Request
from starlette.concurrency import run_in_threadpool

from app.deps import get_state, get_settings, get_brief_writer
from app.state import AppState
from app.settings import Settings
from app.errors import NotFoundError
from app import db
from analysis.brief.facts import build_brief_facts, compute_facts_hash
from analysis.brief.writer import BriefWriter, generate_brief
from analysis.models import BriefResponse, CreateBriefRequest, CPCBClass

router = APIRouter(prefix="/api/briefs", tags=["briefs"])


@router.post("", response_model=BriefResponse)
async def create_brief(
    request: Request,
    body: CreateBriefRequest,
    state: AppState = Depends(get_state),
    settings: Settings = Depends(get_settings),
    writer: BriefWriter = Depends(get_brief_writer),
) -> BriefResponse:
    cpcb_class: CPCBClass = "B"
    if body.cpcb_class.upper() in ("A", "B", "C", "D", "E"):
        cpcb_class = body.cpcb_class.upper()  # type: ignore[assignment]

    ranking = state.get_ranking(cpcb_class)
    facts = build_brief_facts(ranking)
    facts_hash = compute_facts_hash(facts)

    # 1. Check database cache
    cached = db.get_by_facts_hash(settings.db_path, facts_hash)
    if cached:
        return cached

    # 2. Run writer (offload potential LLM call to threadpool)
    brief, source, validation = await run_in_threadpool(generate_brief, facts, writer)

    # 3. Save to database
    saved = db.save_brief(
        db_path=settings.db_path,
        facts_hash=facts_hash,
        facts_json=facts.model_dump_json(),
        brief_output=brief,
        source=source,
        model=settings.brief_model if source == "claude" else None,
        validation=validation,
    )

    return saved


@router.get("/{brief_id}", response_model=BriefResponse)
def get_brief(
    brief_id: int,
    settings: Settings = Depends(get_settings),
) -> BriefResponse:
    stored = db.get_by_id(settings.db_path, brief_id)
    if not stored:
        raise NotFoundError(f"Brief with id {brief_id} not found")
    return stored

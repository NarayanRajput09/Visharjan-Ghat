"""Export CSV endpoint."""

import csv
import io
from fastapi import APIRouter, Depends, Query
from fastapi.responses import Response

from app.deps import get_state
from app.state import AppState
from analysis.models import CPCBClass

router = APIRouter(prefix="/api/export", tags=["export"])


@router.get("/ranking.csv")
def export_ranking_csv(
    cpcb_class: CPCBClass = Query(default="B"),
    state: AppState = Depends(get_state),
) -> Response:
    ranking = state.get_ranking(cpcb_class)

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["rank", "ghat", "score", "tier", "confidence", "main_reason", "source"])

    for g in ranking.ghats:
        first_r = g.reasons[0] if g.reasons else None
        reason_desc = f"{first_r.kind}: {first_r.params}" if first_r else "No reason"
        source_page = f"Page {first_r.reading_ids[0]}" if (first_r and first_r.reading_ids) else "Report 2023-2025"
        writer.writerow([
            g.rank,
            g.name_en,
            g.score,
            g.tier,
            g.confidence,
            reason_desc,
            source_page,
        ])

    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=ranking_class_{cpcb_class}.csv"},
    )

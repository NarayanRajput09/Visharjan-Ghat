from analysis.loader import load_all
from analysis.scoring import score_and_rank_ghats


def test_ranking_and_tiers():
    df, _, limits, _ = load_all("data/raw")
    ranking = score_and_rank_ghats(df, cpcb_class="B", limits_list=limits.get("B"))

    assert len(ranking.ghats) == 7

    # Assert ranks are 1 to 7
    ranks = [g.rank for g in ranking.ghats]
    assert ranks == [1, 2, 3, 4, 5, 6, 7]

    # Scores are ordered descending
    scores = [g.score for g in ranking.ghats]
    assert scores == sorted(scores, reverse=True)

    # Top ghat is Bairagarh and has High tier
    top = ranking.ghats[0]
    assert top.slug == "bairagarh-sant-hirdaram-kund"
    assert top.tier == "high"

    # All tiers have text and are valid literals
    for g in ranking.ghats:
        assert g.tier in ("high", "medium", "low")
        assert g.confidence in ("good", "limited", "poor")
        assert len(g.reasons) > 0

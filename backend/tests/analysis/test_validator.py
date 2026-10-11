from analysis.loader import load_all
from analysis.scoring import score_and_rank_ghats
from analysis.brief.facts import build_brief_facts
from analysis.brief.template import generate_template_brief
from analysis.brief.validator import validate_brief
from analysis.models import BriefOutput, BriefSection


def test_template_brief_always_valid():
    df, _, limits, _ = load_all("data/raw")
    ranking = score_and_rank_ghats(df, "B", limits.get("B"))
    facts = build_brief_facts(ranking)
    brief = generate_template_brief(facts)

    val = validate_brief(brief, facts)
    assert val.ok is True
    assert len(val.errors) == 0
    assert (val.word_count_en or 0) <= 150
    assert (val.word_count_hi or 0) <= 150


def test_validator_rejects_unapproved_number():
    df, _, limits, _ = load_all("data/raw")
    ranking = score_and_rank_ghats(df, "B", limits.get("B"))
    facts = build_brief_facts(ranking)
    brief = generate_template_brief(facts)

    # Insert fake unapproved number 999.99
    bad_en = brief.en.model_copy(update={"headline": "Test with fake number 999.99 mg/l"})
    bad_brief = brief.model_copy(update={"en": bad_en})

    val = validate_brief(bad_brief, facts)
    assert val.ok is False
    assert any("unapproved number" in e for e in val.errors)


def test_validator_rejects_banned_health_phrase():
    df, _, limits, _ = load_all("data/raw")
    ranking = score_and_rank_ghats(df, "B", limits.get("B"))
    facts = build_brief_facts(ranking)
    brief = generate_template_brief(facts)

    # Insert banned word 'toxic'
    bad_en = brief.en.model_copy(update={"headline": "This water is toxic and contaminated"})
    bad_brief = brief.model_copy(update={"en": bad_en})

    val = validate_brief(bad_brief, facts)
    assert val.ok is False
    assert any("banned phrase" in e for e in val.errors)

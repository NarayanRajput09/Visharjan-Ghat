"""Deterministic template-based brief generator."""

from analysis.models import BriefFacts, BriefOutput, BriefSection


def generate_template_brief(facts: BriefFacts) -> BriefOutput:
    """Generates guaranteed valid deterministic brief in Hindi and English."""
    # Top risks
    en_risks: list[str] = []
    hi_risks: list[str] = []
    for g in facts.top_ghats:
        first_r = g.reasons[0] if g.reasons else None
        if first_r:
            en_risks.append(f"{g.name_en}: {first_r.en}")
            hi_risks.append(f"{g.name_hi}: {first_r.hi}")
        else:
            en_risks.append(f"{g.name_en}: High priority municipal monitoring required.")
            hi_risks.append(f"{g.name_hi}: प्राथमिकता के आधार पर नगर निगम निगरानी आवश्यक।")

    # Actions: gather unique top actions (up to 3)
    en_actions: list[str] = []
    hi_actions: list[str] = []
    for g in facts.top_ghats:
        for a in g.suggested_actions:
            if a.en not in en_actions and len(en_actions) < 3:
                en_actions.append(a.en)
                hi_actions.append(a.hi)

    # Data gaps
    en_gaps = [g.en for g in facts.data_gaps[:2]]
    hi_gaps = [g.hi for g in facts.data_gaps[:2]]

    en_section = BriefSection(
        headline="Priority immersion sites require immediate aeration and waste clearance.",
        top_risks=en_risks[:3],
        actions=en_actions[:3],
        data_gaps=en_gaps,
        source_line=facts.source_line.en,
    )

    hi_section = BriefSection(
        headline="उच्च जोखिम वाले विसर्जन स्थलों पर तत्काल वातन एवं सफाई आवश्यक है।",
        top_risks=hi_risks[:3],
        actions=hi_actions[:3],
        data_gaps=hi_gaps,
        source_line=facts.source_line.hi,
    )

    return BriefOutput(en=en_section, hi=hi_section)

"""Builds BriefFacts input for brief generation from a RankingResponse."""

import hashlib
import json
from analysis.models import BriefFacts, BriefGhat, Bilingual, RankingResponse


def build_brief_facts(ranking: RankingResponse) -> BriefFacts:
    """Builds BriefFacts deterministic representation from ranking."""
    top_3 = ranking.ghats[:3]

    allowed_numbers = [20.0, 10.0, 2026.0, 2023.0, 2024.0, 2025.0, 5.0, 3.0, 6.5, 8.5, 1.0, 2.0, 3.0]

    top_ghats_facts: list[BriefGhat] = []
    for g in top_3:
        allowed_numbers.append(float(g.rank))
        allowed_numbers.append(float(g.score))

        # Build bilingual reasons
        reasons_bi: list[Bilingual] = []
        for r in g.reasons:
            if r.kind == "worst_do":
                val = float(r.params.get("value", 0))
                yr = int(r.params.get("year", 2023))
                fest = str(r.params.get("festival", "Durga"))
                allowed_numbers.extend([val, float(yr)])
                reasons_bi.append(
                    Bilingual(
                        en=f"Dissolved oxygen was {val} mg/l during {fest} {yr} immersion (limit: 5 mg/l).",
                        hi=f"{fest} {yr} विसर्जन के दौरान घुलित ऑक्सीजन {val} मि.ग्रा./ली. दर्ज हुई (सीमा: 5 मि.ग्रा./ली.)।",
                    )
                )
            elif r.kind == "bod_exceedance":
                exc = int(r.params.get("exceeded", 0))
                tot = int(r.params.get("total", 0))
                max_v = float(r.params.get("max", 0))
                allowed_numbers.extend([float(exc), float(tot), max_v])
                reasons_bi.append(
                    Bilingual(
                        en=f"BOD exceeded 3 mg/l limit in {exc} of {tot} tests (peak {max_v} mg/l).",
                        hi=f"कुल {tot} में से {exc} परीक्षणों में बीओडी 3 मि.ग्रा./ली. से अधिक रहा (अधिकतम {max_v} मि.ग्रा./ली.)।",
                    )
                )
            elif r.kind == "data_gap":
                cnt = int(r.params.get("sampled_count", 0))
                allowed_numbers.append(float(cnt))
                reasons_bi.append(
                    Bilingual(
                        en=f"Limited monitoring: only {cnt} parameter tests available.",
                        hi=f"सीमित निगरानी: केवल {cnt} परीक्षण उपलब्ध हैं।",
                    )
                )
            elif r.kind == "trend":
                reasons_bi.append(
                    Bilingual(
                        en="Average pollution severity increased across monitoring years.",
                        hi="निगरानी वर्षों के दौरान औसत प्रदूषण स्तर में वृद्धि दर्ज की गई।",
                    )
                )

        # Suggested actions bilingual
        actions_bi: list[Bilingual] = []
        if "action_aeration" in g.suggested_actions:
            actions_bi.append(
                Bilingual(
                    en="Deploy water aeration units before and during visarjan.",
                    hi="विसर्जन से पूर्व एवं दौरान जल वातन (एरेटर) संयंत्र तैनात करें।",
                )
            )
        if "action_cleaning" in g.suggested_actions:
            actions_bi.append(
                Bilingual(
                    en="Station continuous waste and flower removal teams at immersion sites.",
                    hi="विसर्जन स्थलों पर निरंतर कचरा व फूल-माला हटाने वाली टीमें तैनात करें।",
                )
            )
        if "action_post_test" in g.suggested_actions:
            actions_bi.append(
                Bilingual(
                    en="Request MPPCB for intensive post-visarjan water quality sampling.",
                    hi="विसर्जन पश्चात म.प्र.प्र.नि.बो. से अतिरिक्त सघन जल परीक्षण का अनुरोध करें।",
                )
            )
        if not actions_bi:
            actions_bi.append(
                Bilingual(
                    en="Standard cleaning crew and monitoring during the event.",
                    hi="उत्सव के दौरान नियमित सफाई दल एवं निगरानी की व्यवस्था रखें।",
                )
            )

        top_ghats_facts.append(
            BriefGhat(
                rank=g.rank,
                name_en=g.name_en,
                name_hi=g.name_hi,
                tier=g.tier,
                confidence=g.confidence,
                reasons=reasons_bi,
                suggested_actions=actions_bi,
            )
        )

    # Data gaps
    data_gaps: list[Bilingual] = [
        Bilingual(
            en="No Durga 2025 immersion test data was published for Bairagarh and Malikhedi kunds.",
            hi="बैरागढ़ और मालीखेड़ी कुंड हेतु दुर्गा 2025 विसर्जन का परीक्षण डेटा प्रकाशित नहीं है।",
        ),
        Bilingual(
            en="Rani Kamlapati site reflects potential sampling location variation between festivals.",
            hi="रानी कमलापति स्थल के नाम में उत्सवों के बीच संभावित स्थल भिन्नता दर्ज है।",
        ),
    ]

    source_line = Bilingual(
        en="Source: MPPCB idol immersion monitoring reports 2023–2025, verified against CPCB Class B bathing standards.",
        hi="स्रोत: म.प्र. प्रदूषण नियंत्रण बोर्ड विसर्जन रिपोर्ट 2023–2025, सीपीसीबी वर्ग 'बी' स्नान मानकों से सत्यापित।",
    )

    return BriefFacts(
        visarjan_date="2026-10-20",
        cpcb_class=ranking.cpcb_class,
        top_ghats=top_ghats_facts,
        data_gaps=data_gaps,
        allowed_numbers=sorted(list(set(allowed_numbers))),
        source_line=source_line,
    )


def compute_facts_hash(facts: BriefFacts) -> str:
    """Computes stable SHA256 hash of facts for caching."""
    encoded = facts.model_dump_json()
    return hashlib.sha256(encoded.encode("utf-8")).hexdigest()

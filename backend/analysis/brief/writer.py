"""Brief writer protocol and implementations (Claude + Template fallback)."""

import os
from typing import Protocol
from analysis.models import BriefFacts, BriefOutput, BriefValidation
from analysis.brief.template import generate_template_brief
from analysis.brief.validator import validate_brief


class BriefWriter(Protocol):
    def write(self, facts: BriefFacts) -> tuple[BriefOutput, str]:
        """Returns (brief, source_name)."""
        ...


class TemplateBriefWriter:
    def write(self, facts: BriefFacts) -> tuple[BriefOutput, str]:
        return generate_template_brief(facts), "template"


class ClaudeBriefWriter:
    def __init__(self, model: str = "claude-opus-5-5") -> None:
        self.model = model
        self.api_key = os.environ.get("ANTHROPIC_API_KEY", "").strip()

    def write(self, facts: BriefFacts) -> tuple[BriefOutput, str]:
        if not self.api_key:
            return generate_template_brief(facts), "template"

        try:
            import anthropic

            client = anthropic.Anthropic(api_key=self.api_key)
            prompt = (
                "You write a short planning brief for a Bhopal Municipal Corporation officer preparing "
                "Durga visarjan on 20 October 2026. You get facts computed from MPPCB water-test reports.\n\n"
                "Rules:\n"
                "- Use only facts given. Every number must appear in allowed_numbers.\n"
                "- Report readings against CPCB Class B (bathing) limits. No health claims.\n"
                "- Missing tests must be stated plainly as 'Not tested'.\n"
                "- Write simple, direct sentences (<= 150 words each language).\n"
            )

            response = client.messages.parse(
                model=self.model,
                max_tokens=4000,
                system=prompt,
                messages=[{"role": "user", "content": facts.model_dump_json()}],
                output_format=BriefOutput,
                output_config={"effort": "low"},
            )
            if response.parsed_output is None:
                return generate_template_brief(facts), "template"
            return response.parsed_output, "claude"
        except Exception:
            return generate_template_brief(facts), "template"


def generate_brief(
    facts: BriefFacts,
    writer: BriefWriter | None = None,
) -> tuple[BriefOutput, str, BriefValidation]:
    """
    Generates a brief using the specified writer with automatic validation
    and fallback to the template writer.
    """
    effective_writer = writer or (ClaudeBriefWriter() if os.environ.get("ANTHROPIC_API_KEY") else TemplateBriefWriter())

    try:
        brief, source = effective_writer.write(facts)
        validation = validate_brief(brief, facts)
        if not validation.ok and source != "template":
            # Fall back to template
            brief = generate_template_brief(facts)
            source = "template"
            validation = validate_brief(brief, facts)
        return brief, source, validation
    except Exception:
        brief = generate_template_brief(facts)
        source = "template"
        validation = validate_brief(brief, facts)
        return brief, source, validation

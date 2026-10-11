"""Validator for brief fidelity, length, numbers, and banned phrases."""

import re
from analysis.models import BriefFacts, BriefOutput, BriefValidation
from analysis.brief.banned import BANNED_WORDS_EN, BANNED_WORDS_HI

DEVANAGARI_DIGITS = {"०": "0", "१": "1", "२": "2", "३": "3", "४": "4", "५": "5", "६": "6", "७": "7", "८": "8", "९": "9"}


def extract_numbers(text: str) -> list[float]:
    """Extracts numbers from English and Devanagari text."""
    # Convert Devanagari digits to ASCII
    converted = text
    for d, a in DEVANAGARI_DIGITS.items():
        converted = converted.replace(d, a)

    # Find float or integer numbers
    matches = re.findall(r"\b\d+(?:\.\d+)?\b", converted)
    nums: list[float] = []
    for m in matches:
        try:
            nums.append(float(m))
        except ValueError:
            pass
    return nums


def validate_brief(brief: BriefOutput, facts: BriefFacts) -> BriefValidation:
    """Validates draft brief against strict safety, fact, and length rules."""
    errors: list[str] = []

    # 1. Headline length (<= 15 words)
    en_headline_words = len(brief.en.headline.split())
    if en_headline_words > 15:
        errors.append(f"English headline too long ({en_headline_words} > 15 words)")

    hi_headline_words = len(brief.hi.headline.split())
    if hi_headline_words > 15:
        errors.append(f"Hindi headline too long ({hi_headline_words} > 15 words)")

    # 2. Total words per language (<= 150 words)
    en_text = f"{brief.en.headline} {' '.join(brief.en.top_risks)} {' '.join(brief.en.actions)} {' '.join(brief.en.data_gaps)} {brief.en.source_line}"
    en_word_count = len(en_text.split())
    if en_word_count > 150:
        errors.append(f"English brief exceeds 150 words ({en_word_count} words)")

    hi_text = f"{brief.hi.headline} {' '.join(brief.hi.top_risks)} {' '.join(brief.hi.actions)} {' '.join(brief.hi.data_gaps)} {brief.hi.source_line}"
    hi_word_count = len(hi_text.split())
    if hi_word_count > 150:
        errors.append(f"Hindi brief exceeds 150 words ({hi_word_count} words)")

    # 3. Check numbers against allowed_numbers
    allowed_set = set(facts.allowed_numbers)
    # Also allow standard common numbers like 1, 2, 3, 2026, 20, 10
    allowed_set.update({1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 2026.0, 20.0, 10.0})

    en_numbers = extract_numbers(en_text)
    for n in en_numbers:
        if n not in allowed_set:
            errors.append(f"English text contains unapproved number: {n}")

    hi_numbers = extract_numbers(hi_text)
    for n in hi_numbers:
        if n not in allowed_set:
            errors.append(f"Hindi text contains unapproved number: {n}")

    # 4. Check banned health phrases
    en_lower = en_text.lower()
    for banned in BANNED_WORDS_EN:
        if banned in en_lower:
            errors.append(f"English text contains banned phrase: '{banned}'")

    hi_lower = hi_text.lower()
    for banned in BANNED_WORDS_HI:
        if banned in hi_lower:
            errors.append(f"Hindi text contains banned phrase: '{banned}'")

    # 5. Check that data gaps are present if any top ghat has confidence != good
    has_limited = any(g.confidence != "good" for g in facts.top_ghats)
    if has_limited and (len(brief.en.data_gaps) == 0 or len(brief.hi.data_gaps) == 0):
        errors.append("Brief must include data gaps when confidence is not good")

    # 6. Check that top ghat names are mentioned
    for g in facts.top_ghats[:2]:
        name_part = g.name_en.split()[0].lower()
        if name_part not in en_lower:
            errors.append(f"English brief omits top ghat: '{g.name_en}'")

    is_ok = len(errors) == 0
    return BriefValidation(
        ok=is_ok,
        errors=errors,
        word_count_en=en_word_count,
        word_count_hi=hi_word_count,
    )

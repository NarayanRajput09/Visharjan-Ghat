"""Command-line interface for running analysis scoring and brief generation."""

import argparse
import sys
from pathlib import Path

# Ensure UTF-8 output on Windows console
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
from analysis.loader import load_all
from analysis.scoring import score_and_rank_ghats
from analysis.brief.facts import build_brief_facts
from analysis.brief.writer import generate_brief
from analysis.models import CPCBClass


def main() -> None:
    parser = argparse.ArgumentParser(description="Visarjan Ghat Watch CLI")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # rank command
    rank_parser = subparsers.add_parser("rank", help="Rank the 7 Bhopal ghats")
    rank_parser.add_argument("--class", dest="cpcb_class", default="B", choices=["A", "B", "C", "D", "E"], help="CPCB water use class")
    rank_parser.add_argument("--data-dir", default="data/raw", help="Path to data/raw directory")

    # brief command
    brief_parser = subparsers.add_parser("brief", help="Generate planning brief")
    brief_parser.add_argument("--class", dest="cpcb_class", default="B", choices=["A", "B", "C", "D", "E"], help="CPCB water use class")
    brief_parser.add_argument("--data-dir", default="data/raw", help="Path to data/raw directory")

    args = parser.parse_args()

    # Load data
    data_path = Path(args.data_dir)
    if not data_path.is_dir():
        data_path = Path("../data/raw")
    df, _, limits, _ = load_all(data_path)

    cpcb_class: CPCBClass = getattr(args, "cpcb_class", "B")

    if args.command == "rank":
        ranking = score_and_rank_ghats(df, cpcb_class=cpcb_class, limits_list=limits.get(cpcb_class))
        print(f"\nVisarjan Ghat Risk Ranking (CPCB Class {cpcb_class}):")
        print(f"{'#':<3} {'Ghat':<35} {'Score':<7} {'Tier':<8} {'Confidence':<11} {'Main Reason'}")
        print("-" * 105)
        for g in ranking.ghats:
            first_r = g.reasons[0].kind if g.reasons else "-"
            print(f"{g.rank:<3} {g.name_en:<35} {g.score:<7.1f} {g.tier.upper():<8} {g.confidence.capitalize():<11} {first_r}")
        print("-" * 105)

    elif args.command == "brief":
        ranking = score_and_rank_ghats(df, cpcb_class=cpcb_class, limits_list=limits.get(cpcb_class))
        facts = build_brief_facts(ranking)
        brief, source, validation = generate_brief(facts)
        print(f"\nVisarjan Ghat Planning Brief (Source: {source.upper()}, Valid: {validation.ok})")
        print("=" * 60)
        print("ENGLISH:")
        print(brief.en.headline)
        print("\nTop Risks:")
        for r in brief.en.top_risks:
            print(f"- {r}")
        print("\nSuggested Actions:")
        for a in brief.en.actions:
            print(f"• {a}")
        print("\nData Gaps:")
        for g in brief.en.data_gaps:
            print(f"- {g}")
        print(f"\n{brief.en.source_line}")
        print("=" * 60)
        print("HINDI:")
        print(brief.hi.headline)
        print("\nमुख्य जोखिम:")
        for r in brief.hi.top_risks:
            print(f"- {r}")
        print("\nसुझाई गई कार्रवाइयां:")
        for a in brief.hi.actions:
            print(f"• {a}")
        print("\nडेटा अंतराल:")
        for g in brief.hi.data_gaps:
            print(f"- {g}")
        print(f"\n{brief.hi.source_line}")
        print("=" * 60)


if __name__ == "__main__":
    main()

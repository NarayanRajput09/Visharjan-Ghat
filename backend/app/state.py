"""Global application state holding loaded data and rankings cache."""

from pathlib import Path
from typing import Any
import pandas as pd

from analysis.loader import load_all
from analysis.scoring import score_and_rank_ghats
from analysis.config import SCORING_CONFIG_VERSION
from analysis.models import Reading, LimitItem, CPCBClass, RankingResponse


class AppState:
    def __init__(self, data_dir: str = "../data/raw") -> None:
        self.data_dir = data_dir
        self.readings_df: pd.DataFrame = pd.DataFrame()
        self.readings_models: list[Reading] = []
        self.limits: dict[CPCBClass, list[LimitItem]] = {}
        self.data_hash: str = ""
        self.ranking_cache: dict[tuple[str, str, str], RankingResponse] = {}

    def load_data(self) -> None:
        path = Path(self.data_dir)
        if not path.is_dir():
            path = Path("data/raw")
            if not path.is_dir():
                path = Path("../data/raw")

        self.readings_df, self.readings_models, self.limits, self.data_hash = load_all(path)

        # Precompute Class B ranking
        self.get_ranking("B")

    def get_ranking(self, cpcb_class: CPCBClass = "B") -> RankingResponse:
        key = (self.data_hash, SCORING_CONFIG_VERSION, cpcb_class)
        if key in self.ranking_cache:
            return self.ranking_cache[key]

        ranking = score_and_rank_ghats(
            self.readings_df,
            cpcb_class=cpcb_class,
            limits_list=self.limits.get(cpcb_class),
        )
        self.ranking_cache[key] = ranking
        return ranking

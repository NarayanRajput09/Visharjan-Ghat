"""Application settings loaded from environment or .env."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    anthropic_api_key: str = ""
    brief_model: str = "claude-opus-5-5"
    data_dir: str = "../data/raw"
    reports_dir: str = "../reports"
    frontend_dist_dir: str = "../frontend/dist"
    db_path: str = "./briefs.db"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def llm_available(self) -> bool:
        return bool(self.anthropic_api_key.strip())

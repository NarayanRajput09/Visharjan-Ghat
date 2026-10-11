"""Dependency injection providers for routes."""

from fastapi import Request
from app.state import AppState
from app.settings import Settings
from analysis.brief.writer import BriefWriter, ClaudeBriefWriter, TemplateBriefWriter


def get_state(request: Request) -> AppState:
    return request.app.state.app_state


def get_settings(request: Request) -> Settings:
    return request.app.state.settings


def get_brief_writer(request: Request) -> BriefWriter:
    settings: Settings = request.app.state.settings
    if settings.llm_available:
        return ClaudeBriefWriter(model=settings.brief_model)
    return TemplateBriefWriter()

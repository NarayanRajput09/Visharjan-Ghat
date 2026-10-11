"""Main FastAPI application entry point with lifespan, CORS, and routers."""

from contextlib import asynccontextmanager
from pathlib import Path
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from app.settings import Settings
from app.state import AppState
from app.errors import AppError, app_error_handler
from app.db import init_db
from app.routes import health, ranking, ghats, readings, briefs, export


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    settings: Settings = app.state.settings
    app_state: AppState = app.state.app_state

    # 1. Initialize SQLite brief cache
    init_db(settings.db_path)

    # 2. Load and validate data, precompute rankings
    app_state.load_data()

    yield


def create_app() -> FastAPI:
    settings = Settings()
    app_state = AppState(data_dir=settings.data_dir)

    app = FastAPI(
        title="Visarjan Ghat Watch API",
        description="Water-quality risk ranking and briefing service for Durga Visarjan 2026",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.state.settings = settings
    app.state.app_state = app_state

    # Exception handler
    app.add_exception_handler(AppError, app_error_handler)  # type: ignore[arg-type]

    # Security headers middleware
    app.add_middleware(SecurityHeadersMiddleware)

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(health.router)
    app.include_router(ranking.router)
    app.include_router(ghats.router)
    app.include_router(readings.router)
    app.include_router(briefs.router)
    app.include_router(export.router)

    # Static mount for PDF reports
    reports_path = Path(settings.reports_dir)
    if not reports_path.is_dir():
        reports_path = Path("reports")
    if reports_path.is_dir():
        app.mount("/reports", StaticFiles(directory=str(reports_path)), name="reports")

    # Optional static mount for built frontend
    dist_path = Path(settings.frontend_dist_dir)
    if not dist_path.is_dir():
        dist_path = Path("frontend/dist")
    if dist_path.is_dir():
        app.mount("/", StaticFiles(directory=str(dist_path), html=True), name="frontend")

    return app


app = create_app()

import asyncio
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.models.incident import Base
from app.core.database import engine
from app.routers import incidents, reports, telemetry, aws_stations, verification

@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception:
        pass
    yield

app = FastAPI(
    title="National Weather Big Data Analytics Platform",
    description="Mission-critical API for SIH26069 - MoES Weather Intelligence",
    version="1.0.0",
    docs_url="/api/v1/docs",
    openapi_url="/api/v1/openapi.json",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(incidents.router, prefix="/api/v1/incidents", tags=["Incidents"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["Reports"])
app.include_router(telemetry.router, prefix="/api/v1/telemetry", tags=["Telemetry"])
app.include_router(aws_stations.router, prefix="/api/v1/aws-stations", tags=["AWS Stations"])
app.include_router(verification.router, prefix="/api/v1/verification", tags=["AI Verification"])

@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "operational", "service": "nwa-platform", "version": "1.0.0"}

@app.get("/api/v1/stats", tags=["Stats"])
async def platform_stats():
    return {
        "active_sensors": settings.active_sensors,
        "ingestion_queue": 0,
        "ai_queue_depth": 0,
        "total_incidents": 0,
    }

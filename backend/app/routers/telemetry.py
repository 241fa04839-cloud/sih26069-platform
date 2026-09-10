from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db

router = APIRouter()

@router.get("/")
async def get_telemetry(db: AsyncSession = Depends(get_db)):
    return {
        "ingestion_latency_ms": 12,
        "active_aws_sensors": 2847,
        "posts_per_hour": 14203,
        "ai_accuracy": "98.7%",
        "uptime": "99.97%",
    }

@router.get("/ingestion")
async def get_ingestion_stats(db: AsyncSession = Depends(get_db)):
    return {
        "current_rate_per_min": 237,
        "total_ingested_today": 340280,
        "queue_depth": 12,
        "avg_processing_time_ms": 45,
    }
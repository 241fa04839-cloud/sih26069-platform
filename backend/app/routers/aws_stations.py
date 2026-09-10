from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.database import get_db
from app.models.incident import AWStation

router = APIRouter()

@router.get("/")
async def get_aws_stations(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(AWStation).where(AWStation.is_active == True))
    stations = result.scalars().all()
    return {"stations": [s.to_dict() for s in stations]}

@router.get("/nearest")
async def get_nearest_stations(
    lat: float = Query(...),
    lng: float = Query(...),
    radius_km: float = Query(50),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(AWStation).where(
        AWStation.is_active == True,
        AWStation.latitude.isnot(None),
    ))
    stations = result.scalars().all()
    return {"stations": [s.to_dict() for s in stations]}
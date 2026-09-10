from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.core.database import get_db
from app.models.incident import Incident
from app.ai.verification import verify_report
from typing import Optional
from datetime import datetime

router = APIRouter()

@router.get("/")
async def get_incidents(
    filter: Optional[str] = Query(None, description="Filter by type"),
    event: Optional[str] = Query(None, description="Filter by event type"),
    location: Optional[str] = Query(None, description="Filter by location"),
    status: Optional[str] = Query(None, description="Filter by verification status"),
    db: AsyncSession = Depends(get_db),
):
    query = select(Incident)
    
    if filter and filter != "all":
        query = query.where(Incident.hazard_type == filter)
    if event and event != "all":
        query = query.where(Incident.hazard_type == event)
    if location and location != "all":
        query = query.where(Incident.location.ilike(f"%{location}%"))
    if status and status != "all":
        query = query.where(Incident.verification_status == status)
    
    query = query.order_by(Incident.created_at.desc())
    result = await db.execute(query)
    incidents = result.scalars().all()
    # Shape matches the frontend's `Incident` interface (frontend/app/command/_lib/api.ts)
    # and what the 2D Leaflet and 3D Cesium viewers read directly:
    # camelCase keys, coordinates nested, timestamp as ISO string.
    return [
        {
            "id": i.id,
            "title": i.title,
            "hazardType": i.hazard_type.value if hasattr(i.hazard_type, "value") else i.hazard_type,
            "description": i.description,
            "verificationStatus": i.verification_status.value if hasattr(i.verification_status, "value") else i.verification_status,
            "credibilityScore": i.credibility_score,
            "coordinates": {"latitude": i.latitude, "longitude": i.longitude},
            "location": i.location,
            "source": i.source,
            "timestamp": (i.created_at or i.timestamp).isoformat() if (i.created_at or i.timestamp) else None,
        }
        for i in incidents
    ]

@router.get("/nearest-aws")
async def nearest_aws_stations(
    lat: float = Query(..., description="Latitude"),
    lng: float = Query(..., description="Longitude"),
    radius_km: float = Query(50, ge=0, le=500, description="Radius in km"),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(text(
        "SELECT id, name, latitude, longitude, temperature, humidity, pressure FROM aws_stations "
        "WHERE ST_DWithin(geography, ST_MakePoint(:lng, :lat)::geography, :radius * 1000)"
    ), {"lat": lat, "lng": lng, "radius": radius_km})
    rows = result.fetchall()
    return {"stations": [dict(row) for row in rows]}

@router.post("/verify")
async def verify_incident(
    incident_id: str,
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(Incident).where(Incident.id == incident_id))
    incident = result.scalar_one_or_none()
    if not incident:
        return {"error": "Incident not found"}
    verification_result = await verify_report(incident)
    return verification_result
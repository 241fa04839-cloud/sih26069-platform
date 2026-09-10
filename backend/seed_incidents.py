"""
Seed the incidents table with test data so the Command Center's 2D (Leaflet)
and 3D (Cesium globe) views have something to render out of the box.

Run from backend/ with the venv active:
    python seed_incidents.py

Safe to re-run: it upserts by id instead of duplicating rows.
"""
import asyncio
from datetime import datetime, timezone

from app.core.database import AsyncSessionLocal, engine
from app.models.incident import Base, Incident, HazardType, VerificationStatus

TEST_INCIDENTS = [
    dict(id="INC-001", title="Severe flooding reported in Kottayam district",
         hazard_type=HazardType.FLOODING, description="Citizen reports rising water levels in low-lying areas",
         verification_status=VerificationStatus.VERIFIED, credibility_score=0.92,
         latitude=9.5894, longitude=76.5174, location="Kottayam, Kerala", source="IMD_Social_Media"),
    dict(id="INC-002", title="Extreme heatwave conditions in Mumbai",
         hazard_type=HazardType.HEATWAVE, description="Temperature exceeding 42°C reported across western suburbs",
         verification_status=VerificationStatus.PENDING, credibility_score=0.73,
         latitude=19.0760, longitude=72.8777, location="Mumbai, Maharashtra", source="Citizen_Report"),
    dict(id="INC-003", title="Cyclone warning for Tamil Nadu coast",
         hazard_type=HazardType.CYCLONE, description="Cyclonic storm forming in Bay of Bengal",
         verification_status=VerificationStatus.VERIFIED, credibility_score=0.97,
         latitude=10.8500, longitude=80.2700, location="Chennai, Tamil Nadu", source="IMD_Official"),
    dict(id="INC-004", title="Landslide risk in Western Himalayas",
         hazard_type=HazardType.LANDSLIDE, description="Ground displacement detected near Uttarkashi",
         verification_status=VerificationStatus.PENDING, credibility_score=0.65,
         latitude=30.8000, longitude=78.5000, location="Uttarkashi, Uttarakhand", source="Citizen_Report"),
    dict(id="INC-005", title="Suspected fake report - Delhi",
         hazard_type=HazardType.FLOODING, description="Unverified flooding claim with duplicate image",
         verification_status=VerificationStatus.FAKE, credibility_score=0.12,
         latitude=28.6100, longitude=77.2100, location="Delhi", source="Social_Media"),
    dict(id="INC-006", title="AI-flagged fake report - Ahmedabad flooding claim",
         hazard_type=HazardType.FLOODING, description="Viral post claiming severe flooding, later found to reuse an old stock photo",
         verification_status=VerificationStatus.FAKE, credibility_score=0.06,
         latitude=23.0225, longitude=72.5714, location="Ahmedabad, Gujarat", source="Social_Media"),
    dict(id="INC-007", title="Drought conditions worsening in Jaisalmer",
         hazard_type=HazardType.DROUGHT, description="Groundwater levels critically low, wells running dry across the district",
         verification_status=VerificationStatus.VERIFIED, credibility_score=0.88,
         latitude=26.9157, longitude=70.9083, location="Jaisalmer, Rajasthan", source="IMD_Official"),
    dict(id="INC-008", title="Severe thunderstorm approaching Lucknow",
         hazard_type=HazardType.STORM, description="Dark clouds and gusty winds reported ahead of expected thunderstorm",
         verification_status=VerificationStatus.PENDING, credibility_score=0.58,
         latitude=26.8467, longitude=80.9462, location="Lucknow, Uttar Pradesh", source="Citizen_Report"),
    dict(id="INC-009", title="Cyclone landfall reported near Puri",
         hazard_type=HazardType.CYCLONE, description="Strong winds and storm surge reported along the Odisha coastline",
         verification_status=VerificationStatus.VERIFIED, credibility_score=0.95,
         latitude=19.8135, longitude=85.8312, location="Puri, Odisha", source="IMD_Official"),
    dict(id="INC-010", title="Flash flooding in Guwahati low-lying areas",
         hazard_type=HazardType.FLOODING, description="Brahmaputra water levels rising rapidly after heavy overnight rain",
         verification_status=VerificationStatus.VERIFIED, credibility_score=0.85,
         latitude=26.1445, longitude=91.7362, location="Guwahati, Assam", source="IMD_Social_Media"),
    dict(id="INC-011", title="Unseasonal storm activity near Bengaluru",
         hazard_type=HazardType.STORM, description="Sudden hailstorm reported in northern parts of the city",
         verification_status=VerificationStatus.PENDING, credibility_score=0.60,
         latitude=12.9716, longitude=77.5946, location="Bengaluru, Karnataka", source="Citizen_Report"),
]


async def seed():
    # Make sure tables exist (main.py normally does this on startup).
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        now = datetime.now(timezone.utc)
        for data in TEST_INCIDENTS:
            existing = await session.get(Incident, data["id"])
            if existing:
                for key, value in data.items():
                    setattr(existing, key, value)
                existing.updated_at = now
            else:
                session.add(Incident(**data, timestamp=now, created_at=now, updated_at=now))
        await session.commit()

    print(f"Seeded {len(TEST_INCIDENTS)} test incidents.")


if __name__ == "__main__":
    asyncio.run(seed())

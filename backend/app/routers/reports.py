from fastapi import APIRouter, Depends, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.incident import IncidentCreate, Incident, HazardType, VerificationStatus
from app.ai.verification import verify_report
import hashlib
import json
from datetime import datetime

router = APIRouter()

@router.post("/")
async def create_report(
    name: str = Form(...),
    email: str = Form(...),
    hazard_type: str = Form(...),
    description: str = Form(...),
    location: str = Form(...),
    image: UploadFile = File(None),
    latitude: float = Form(None),
    longitude: float = Form(None),
    honeypot: str = Form(None),
    db: AsyncSession = Depends(get_db),
):
    if honeypot:
        return {"error": "Spam detected", "code": 400}

    image_hash = None
    if image:
        contents = await image.read()
        image_hash = hashlib.sha256(contents).hexdigest()

    incident_data = IncidentCreate(
        name=name,
        email=email,
        hazard_type=hazard_type,
        description=description,
        location=location,
        image_hash=image_hash,
        latitude=latitude,
        longitude=longitude,
    )

    verification_result = await verify_report(incident_data)

    incident_id = f"INC-{hashlib.md5(str(datetime.now()).encode()).hexdigest()[:8].upper()}"

    # Persist the report as an incident so it actually shows up on the
    # command center map (2D and 3D views both read from this table).
    # Previously `db` was injected but never used, so submitted reports
    # were verified and then silently discarded.
    try:
        hazard_enum = HazardType(hazard_type.lower())
    except ValueError:
        hazard_enum = HazardType.OTHER

    incident = Incident(
        id=incident_id,
        title=f"{hazard_type.title()} reported near {location}",
        hazard_type=hazard_enum,
        description=description,
        verification_status=VerificationStatus(verification_result["verification_status"]),
        credibility_score=verification_result["credibility_score"],
        latitude=latitude,
        longitude=longitude,
        location=location,
        source="Citizen_Report",
        image_hash=verification_result.get("image_hash"),
        user_id=email,
        is_duplicate=verification_result.get("is_duplicate", False),
        nearest_aws_id=(verification_result.get("nearest_aws") or {}).get("id")
        if isinstance(verification_result.get("nearest_aws"), dict)
        else None,
        sensor_corroboration=json.dumps(verification_result.get("sensor_corroboration") or {}),
    )
    db.add(incident)
    await db.commit()

    return {
        "success": True,
        "incident_id": incident_id,
        "message": "Report submitted to AI verification pipeline",
        "verification": verification_result,
    }

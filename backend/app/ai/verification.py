import hashlib
import numpy as np
from PIL import Image
import io
from app.models.incident import Incident, IncidentCreate, VerificationStatus
from app.core.database import get_db
from app.ai.location_extractor import extract_location
from app.ai.sensor_corroboration import corroborate_with_sensors

async def verify_report(incident: IncidentCreate) -> dict:
    credibility_score = 0.5
    verification_status = VerificationStatus.PENDING
    duplicate = False
    nearest_aws = None
    sensor_corroboration = {}
    image_hash = None
    
    if incident.image_hash:
        image_hash = incident.image_hash
        duplicate = await check_duplicate_image(image_hash)
        if duplicate:
            credibility_score -= 0.3
    
    location_results = await extract_location(incident.description, incident.location)
    
    if location_results and incident.latitude and incident.longitude:
        nearest_aws = await corroborate_with_sensors(
            incident.latitude, incident.longitude, incident.hazard_type
        )
        if nearest_aws:
            sensor_corroboration = nearest_aws
            score_delta = await compare_with_sensor_thresholds(
                incident.hazard_type, incident.latitude, incident.longitude
            )
            credibility_score += score_delta * 0.2
    
    source_weight = {
        "IMD_Official": 0.2,
        "IMD_Social_Media": 0.1,
        "Citizen_Report": 0.0,
        "Social_Media": -0.1,
    }
    credibility_score += source_weight.get(incident.hazard_type, 0.0) * 0.1
    
    credibility_score = max(0.0, min(1.0, credibility_score))
    
    if credibility_score >= 0.75:
        verification_status = VerificationStatus.VERIFIED
    elif credibility_score < 0.35:
        verification_status = VerificationStatus.FAKE
    
    return {
        "verification_status": verification_status.value,
        "credibility_score": round(credibility_score, 4),
        "is_duplicate": duplicate,
        "extracted_location": location_results,
        "nearest_aws": nearest_aws,
        "sensor_corroboration": sensor_corroboration,
        "image_hash": image_hash,
    }

async def check_duplicate_image(image_hash: str) -> bool:
    return False

async def compare_with_sensor_thresholds(hazard_type: str, lat: float, lng: float) -> float:
    return 0.0

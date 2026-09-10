import httpx
from typing import Optional, Dict

async def corroborate_with_sensors(
    lat: float, lng: float, hazard_type: str
) -> Optional[Dict]:
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            params = {"lat": lat, "lng": lng, "radius_km": 50}
            response = await client.get(
                "http://localhost:8000/api/v1/aws-stations/nearest",
                params=params
            )
            if response.status_code == 200:
                return response.json()
    except Exception:
        pass
    return None

async def get_sensor_thresholds(hazard_type: str) -> Dict[str, float]:
    thresholds = {
        "flooding": {"rainfall_24h": 100.0, "water_level": 5.0},
        "heatwave": {"temperature": 40.0, "humidity": 30.0},
        "cyclone": {"wind_speed": 60.0, "pressure": 980.0},
        "landslide": {"rainfall_24h": 200.0, "slope_angle": 30.0},
        "drought": {"temperature": 42.0, "rainfall_24h": 0.0},
        "storm": {"wind_speed": 40.0, "pressure": 1000.0},
    }
    return thresholds.get(hazard_type, {})

import re
from typing import Optional, Dict

async def extract_location(text: str, fallback_location: Optional[str]) -> Optional[Dict]:
    location_patterns = [
        r'\b(Kerala|Maharashtra|Tamil Nadu|Rajasthan|Uttar Pradesh|Gujarat|West Bengal|Odisha|Andhra Pradesh|Karnataka)\b',
        r'\b(\d{2}\.\d{4},\s*\d{2}\.\d{4})\b',
        r'\b(?:near|close to|in)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)',
    ]
    
    for pattern in location_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return {"location": match.group(1), "confidence": 0.85}
    
    if fallback_location:
        return {"location": fallback_location, "confidence": 0.9}
    
    return None

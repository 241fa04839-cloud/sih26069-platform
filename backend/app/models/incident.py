from sqlalchemy import Column, String, Float, DateTime, Text, Boolean, Enum, BigInteger
from sqlalchemy.orm import DeclarativeBase
import enum
from datetime import datetime
from typing import Optional

class Base(DeclarativeBase):
    pass

class VerificationStatus(str, enum.Enum):
    VERIFIED = "verified"
    PENDING = "pending"
    FAKE = "fake"

class HazardType(str, enum.Enum):
    FLOODING = "flooding"
    HEATWAVE = "heatwave"
    CYCLONE = "cyclone"
    LANDSLIDE = "landslide"
    DROUGHT = "drought"
    STORM = "storm"
    OTHER = "other"

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    hazard_type = Column(Enum(HazardType), nullable=False, index=True)
    description = Column(Text, nullable=True)
    verification_status = Column(Enum(VerificationStatus), default=VerificationStatus.PENDING, nullable=False, index=True)
    credibility_score = Column(Float, default=0.0)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    location = Column(String(200), nullable=True)
    source = Column(String(100), nullable=True)
    image_hash = Column(String(64), nullable=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow)
    created_at = Column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at = Column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(String(100), nullable=True)
    is_duplicate = Column(Boolean, default=False)
    nearest_aws_id = Column(String(50), nullable=True)
    sensor_corroboration = Column(Text, nullable=True)

class AWStation(Base):
    __tablename__ = "aws_stations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    geography = Column(String, nullable=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    rainfall_24h = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    last_updated = Column(DateTime(timezone=True), default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "temperature": self.temperature,
            "humidity": self.humidity,
            "pressure": self.pressure,
            "wind_speed": self.wind_speed,
            "rainfall_24h": self.rainfall_24h,
            "is_active": self.is_active,
        }

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    aws_id = Column(String, nullable=False, index=True)
    temperature = Column(Float, nullable=True)
    humidity = Column(Float, nullable=True)
    pressure = Column(Float, nullable=True)
    wind_speed = Column(Float, nullable=True)
    rainfall_24h = Column(Float, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=datetime.utcnow)

class IncidentCreate:
    def __init__(self, name, email, hazard_type, description, location, image_hash, latitude, longitude):
        self.name = name
        self.email = email
        self.hazard_type = hazard_type
        self.description = description
        self.location = location
        self.image_hash = image_hash
        self.latitude = latitude
        self.longitude = longitude
        self.id = f"INC-{hash(name+description) & 0xffffffff:08X}"
        self.created_at = datetime.utcnow()

class IncidentFilter:
    pass
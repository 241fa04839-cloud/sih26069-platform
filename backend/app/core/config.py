from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    APP_NAME: str = "National Weather Big Data Analytics Platform"
    APP_VERSION: str = "1.0.0"
    DATABASE_URL: str = "sqlite+aiosqlite:///./nwa_platform.db"
    POSTGIS_URL: str = "postgresql+asyncpg://weather:weather_pass@localhost:5432/nwa_platform"
    REDIS_URL: str = "redis://localhost:6379"
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]
    SECRET_KEY: str = "change-me-in-production"
    ACTIVE_SENSORS: int = 2847
    AI_MODEL_PATH: str = "/models/nwa-verification-v1"

    class Config:
        env_file = ".env"

settings = Settings()

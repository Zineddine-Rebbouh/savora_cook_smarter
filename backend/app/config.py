from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    secret_key: str = "change-me-for-production"
    debug: bool = True
    database_url: str = "postgresql+psycopg://savora:savora@localhost:5432/savora"
    access_token_ttl: int = 1440
    refresh_token_ttl: int = 10080
    cors_origins: str = "http://localhost:8081"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()

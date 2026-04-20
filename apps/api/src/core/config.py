"""
Application configuration using pydantic-settings
"""

from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings"""

    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://luminous:luminous@localhost:5432/luminous"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # AI Services
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # Web Search
    WEB_SEARCH_API: str = "duckduckgo"  # Options: duckduckgo, google, searxg

    # Security
    JWT_SECRET: str = "change-me-in-production"

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:3000", "http://localhost:3001"]

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )

    @property
    def ANTHROPIC_AVAILABLE(self) -> bool:
        """Check if Anthropic API key is configured"""
        return bool(self.ANTHROPIC_API_KEY and self.ANTHROPIC_API_KEY != "your_anthropic_api_key_here")

    @property
    def OPENAI_AVAILABLE(self) -> bool:
        """Check if OpenAI API key is configured"""
        return bool(self.OPENAI_API_KEY and self.OPENAI_API_KEY != "your_openai_api_key_here")


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Export settings
settings = get_settings()

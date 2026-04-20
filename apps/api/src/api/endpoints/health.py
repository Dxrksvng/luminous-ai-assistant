"""
Health check endpoints
"""

from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check"""
    return {
        "status": "healthy",
        "service": "luminous-api",
        "version": "1.0.0",
    }


@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check with service status"""
    from core.config import settings
    from services.ai_service import ai_service

    return {
        "status": "healthy",
        "service": "luminous-api",
        "version": "1.0.0",
        "environment": "development" if settings.DEBUG else "production",
        "services": {
            "anthropic": "available" if settings.ANTHROPIC_AVAILABLE else "not configured",
            "openai": "available" if settings.OPENAI_AVAILABLE else "not configured",
        },
        "ai_initialized": ai_service.initialized,
    }

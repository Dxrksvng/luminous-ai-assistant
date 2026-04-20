"""
Model management endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
from typing import Literal, Optional

from services.model_switcher import model_switcher, ModelType
from services.ollama_service import ollama_service, RECOMMENDED_MODELS, setup_ollama_recommendations
from core.logger import logger


router = APIRouter()


class SetModelRequest(BaseModel):
    """Set model request"""

    model: Literal["cloud_anthropic", "cloud_openai", "local_ollama", "mock"] = Field(
        ..., description="Model type to use"
    )

    class Config:
        json_schema_extra = {
            "example": {"model": "local_ollama"}
        }


class OllamaPullRequest(BaseModel):
    """Pull Ollama model request"""

    model: str = Field(..., description="Model name to pull (e.g., 'llama3.2', 'mistral')")


class OllamaChatRequest(BaseModel):
    """Ollama chat request"""

    message: str = Field(..., min_length=1, max_length=5000)
    model: Optional[str] = Field(None, description="Ollama model name")
    system: Optional[str] = Field(None, description="System prompt")
    temperature: float = Field(0.7, ge=0.0, le=2.0, description="Sampling temperature")


@router.get("/status")
async def get_model_status():
    """
    Get status of all AI models

    Returns information about:
    - Currently selected model
    - Available models
    - Fallback chain
    - Ollama models (if available)
    """
    if not model_switcher:
        raise HTTPException(status_code=503, detail="Model switcher not initialized")

    return await model_switcher.get_status()


@router.post("/set")
async def set_model(request: SetModelRequest):
    """
    Set the current AI model

    - **model**: Model type ('cloud_anthropic', 'cloud_openai', 'local_ollama', 'mock')
    """
    if not model_switcher:
        raise HTTPException(status_code=503, detail="Model switcher not initialized")

    try:
        model_type = ModelType(request.model)
        success = await model_switcher.set_model(model_type)

        if success:
            return {
                "status": "success",
                "current_model": model_type.value,
                "message": f"Model switched to {model_type.value}",
            }
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Model {request.model} is not available",
            )

    except ValueError:
        raise HTTPException(status_code=400, detail=f"Invalid model type: {request.model}")


@router.get("/ollama/models")
async def get_ollama_models():
    """
    Get list of available Ollama models

    Returns all models installed in Ollama
    """
    try:
        models = await ollama_service.get_available_models()
        return {"models": models, "count": len(models)}
    except Exception as e:
        logger.error(f"Failed to get Ollama models: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ollama/pull")
async def pull_ollama_model(request: OllamaPullRequest):
    """
    Pull/download an Ollama model

    - **model**: Model name to pull (e.g., 'llama3.2', 'mistral', 'gemma2')

    This may take a while for large models.
    """
    try:
        result = await ollama_service.pull_model(request.model)

        if result["status"] == "success":
            return result
        else:
            raise HTTPException(status_code=400, detail=result.get("error"))

    except Exception as e:
        logger.error(f"Failed to pull Ollama model: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/ollama/chat")
async def ollama_chat(request: OllamaChatRequest):
    """
    Chat directly with an Ollama model

    - **message**: User's message
    - **model**: Ollama model name (optional, uses default if not specified)
    - **system**: System prompt (optional)
    - **temperature**: Sampling temperature (0-2, default: 0.7)
    """
    try:
        if not await ollama_service.is_available():
            raise HTTPException(
                status_code=503,
                detail="Ollama is not available. Is it running?",
            )

        result = await ollama_service.chat(
            message=request.message,
            model=request.model,
            system=request.system,
            temperature=request.temperature,
        )

        return result

    except Exception as e:
        logger.error(f"Ollama chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/ollama/recommendations")
async def get_ollama_recommendations():
    """
    Get Ollama model recommendations

    Returns recommended models for different use cases:
    - Fast: Quick responses, good for everyday use
    - Balanced: Good quality and speed
    - Quality: Best quality, more reasoning
    - Multilingual: Excellent Thai support
    - Minimal: Very small, low resource usage
    """
    return {"recommendations": await setup_ollama_recommendations()}


@router.post("/ollama/set-default")
async def set_default_ollama_model(model: str):
    """
    Set the default Ollama model

    - **model**: Model name to set as default
    """
    try:
        success = await ollama_service.set_default_model(model)

        if success:
            return {"status": "success", "default_model": model}
        else:
            raise HTTPException(
                status_code=400,
                detail=f"Model '{model}' not found in available models",
            )

    except Exception as e:
        logger.error(f"Failed to set default Ollama model: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/capabilities")
async def get_model_capabilities():
    """
    Get capabilities of all model providers

    Returns what each provider can do and their requirements
    """
    from core.config import settings

    return {
        "cloud_anthropic": {
            "available": settings.ANTHROPIC_AVAILABLE,
            "requires_internet": True,
            "requires_api_key": True,
            "languages": ["th", "en"],
            "quality": "excellent",
            "cost": "per-token",
            "description": "Anthropic Claude - Best reasoning, safety-focused",
        },
        "cloud_openai": {
            "available": settings.OPENAI_AVAILABLE,
            "requires_internet": True,
            "requires_api_key": True,
            "languages": ["th", "en"],
            "quality": "excellent",
            "cost": "per-token",
            "description": "OpenAI GPT - Versatile, widely used",
        },
        "local_ollama": {
            "available": await ollama_service.is_available(),
            "requires_internet": False,
            "requires_api_key": False,
            "languages": ["th", "en", "many"],
            "quality": "varies by model",
            "cost": "free (after model download)",
            "description": "Ollama - Run LLMs locally, requires RAM",
        },
        "mock": {
            "available": True,
            "requires_internet": False,
            "requires_api_key": False,
            "languages": ["th", "en"],
            "quality": "none",
            "cost": "free",
            "description": "Mock responses for testing",
        },
    }

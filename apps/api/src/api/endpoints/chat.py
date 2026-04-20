"""
Chat endpoints
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from services.ai_service import ai_service
from core.logger import logger


router = APIRouter()


class ChatRequest(BaseModel):
    """Chat request model"""

    message: str = Field(..., min_length=1, max_length=5000, description="User's message")
    conversation_id: str | None = Field(None, description="Optional conversation ID for context")
    language: str = Field("th", pattern="^(th|en)$", description="Language: 'th' or 'en'")

    class Config:
        json_schema_extra = {
            "example": {
                "message": "สวัสดี วันนี้เจอยากทำอะไร?",
                "conversation_id": None,
                "language": "th",
            }
        }


class ChatResponse(BaseModel):
    """Chat response model"""

    message: str
    conversation_id: str
    model: str
    provider: str


@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Process a chat message with AI

    - **message**: User's message (required)
    - **conversation_id**: Optional conversation ID for maintaining context
    - **language**: Language preference ('th' or 'en', default: 'th')
    """
    logger.info(f"Chat request: {request.message[:50]}...")

    if not ai_service.initialized:
        raise HTTPException(status_code=503, detail="AI service not initialized")

    try:
        response = await ai_service.chat(
            message=request.message,
            conversation_id=request.conversation_id,
            language=request.language,
        )

        return ChatResponse(
            message=response["message"],
            conversation_id=request.conversation_id or "new",
            model=response["model"],
            provider=response["provider"],
        )
    except Exception as e:
        logger.error(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/capabilities")
async def get_capabilities():
    """Get available AI capabilities"""
    from core.config import settings

    return {
        "anthropic": settings.ANTHROPIC_AVAILABLE,
        "openai": settings.OPENAI_AVAILABLE,
        "languages": ["th", "en"],
        "max_message_length": 5000,
    }

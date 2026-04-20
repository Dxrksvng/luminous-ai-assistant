"""
Voice endpoints - TTS and STT
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
import base64

from services.tts_service import tts_service
from services.stt_service import stt_service
from core.logger import logger


router = APIRouter()


class TTSRequest(BaseModel):
    """TTS request model"""

    text: str = Field(..., min_length=1, max_length=2000, description="Text to synthesize")
    language: str = Field("th", pattern="^(th|en)$", description="Language: 'th' or 'en'")
    gender: str = Field("female", pattern="^(male|female)$", description="Voice gender")
    engine: str | None = Field(None, description="Specific TTS engine to use")

    class Config:
        json_schema_extra = {
            "example": {
                "text": "สวัสดีครับ ผมคือลูมินัส",
                "language": "th",
                "gender": "female",
            }
        }


class STTRequest(BaseModel):
    """STT request model"""

    audio: str = Field(..., description="Base64 encoded audio data")
    language: str = Field("th", pattern="^(th|en|auto)$", description="Language: 'th', 'en', or 'auto'")
    engine: str | None = Field(None, description="Specific STT engine to use")

    class Config:
        json_schema_extra = {
            "example": {
                "audio": "base64_encoded_audio_data_here",
                "language": "th",
            }
        }


class VoiceChatRequest(BaseModel):
    """Voice chat request - STT + AI + TTS"""

    audio: str = Field(..., description="Base64 encoded audio data")
    language: str = Field("th", pattern="^(th|en)$", description="Language")
    conversation_id: str | None = Field(None, description="Conversation ID")
    voice_gender: str = Field("female", pattern="^(male|female)$", description="AI voice gender")


@router.post("/tts", response_model=dict)
async def text_to_speech(request: TTSRequest):
    """
    Convert text to speech (TTS)

    - **text**: Text to synthesize (required)
    - **language**: Language ('th' or 'en', default: 'th')
    - **gender**: Voice gender ('male' or 'female', default: 'female')
    - **engine**: Specific TTS engine (optional)
    """
    try:
        result = await tts_service.synthesize(
            text=request.text,
            language=request.language,
            gender=request.gender,
            engine=request.engine,
        )
        return result
    except Exception as e:
        logger.error(f"TTS error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stt", response_model=dict)
async def speech_to_text(request: STTRequest):
    """
    Convert speech to text (STT)

    - **audio**: Base64 encoded audio data (required)
    - **language**: Language ('th', 'en', or 'auto', default: 'th')
    - **engine**: Specific STT engine (optional)
    """
    try:
        result = await stt_service.transcribe(
            audio_data=request.audio,
            language=request.language,
            engine=request.engine,
        )
        return result
    except Exception as e:
        logger.error(f"STT error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/chat")
async def voice_chat(request: VoiceChatRequest):
    """
    Complete voice chat flow: STT → AI → TTS

    1. Transcribe audio to text
    2. Get AI response
    3. Convert response to speech

    - **audio**: Base64 encoded audio (user speech)
    - **language**: Language ('th' or 'en')
    - **conversation_id**: Optional conversation ID
    - **voice_gender**: AI voice gender
    """
    try:
        # Step 1: Transcribe user's speech
        stt_result = await stt_service.transcribe(
            audio_data=request.audio,
            language=request.language,
        )
        user_text = stt_result["text"]

        logger.info(f"User said: {user_text}")

        # Step 2: Get AI response
        from services.model_switcher import model_switcher

        if not model_switcher:
            raise HTTPException(status_code=503, detail="Model switcher not initialized")

        ai_response = await model_switcher.chat(
            message=user_text,
            conversation_id=request.conversation_id,
            language=request.language,
        )

        ai_text = ai_response["message"]

        # Step 3: Convert AI response to speech
        tts_result = await tts_service.synthesize(
            text=ai_text,
            language=request.language,
            gender=request.voice_gender,
        )

        return {
            "transcription": {
                "text": user_text,
                "engine": stt_result["engine"],
            },
            "response": {
                "text": ai_text,
                "model": ai_response.get("model", "unknown"),
                "provider": ai_response.get("provider", "unknown"),
            },
            "audio": {
                "data": tts_result["audio"],
                "format": tts_result["format"],
                "engine": tts_result["engine"],
            },
        }

    except Exception as e:
        logger.error(f"Voice chat error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/stt/upload")
async def speech_to_text_upload(
    file: UploadFile = File(...),
    language: str = "th",
):
    """
    Upload audio file for transcription

    - **file**: Audio file (WAV, MP3, etc.)
    - **language**: Language ('th', 'en', or 'auto')
    """
    try:
        # Read file
        audio_data = await file.read()

        # Transcribe
        result = await stt_service.transcribe(
            audio_data=audio_data,
            language=language,
        )

        return result

    except Exception as e:
        logger.error(f"STT upload error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/engines")
async def get_voice_engines():
    """Get available TTS and STT engines"""
    return {
        "tts": await tts_service.get_available_engines(),
        "stt": await stt_service.get_available_engines(),
    }

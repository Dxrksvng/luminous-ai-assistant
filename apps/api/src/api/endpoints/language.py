"""
Language Learning Endpoints
Features:
- Real-time voice translation
- Content summarization
- Grammar checking
- Practice modes
"""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel, Field
from typing import Literal, Optional

from services.language_service import language_service
from services.stt_service import stt_service
from services.tts_service import tts_service
from core.logger import logger


router = APIRouter()


class TranslateAudioRequest(BaseModel):
    """Request for audio translation"""

    audio: str = Field(..., description="Base64 encoded audio")
    source_lang: str = Field("en", description="Source language (default: en)")
    target_lang: str = Field("th", description="Target language (default: th)")


class SummarizeRequest(BaseModel):
    """Request for content summarization"""

    content: str = Field(..., min_length=10, description="Content to summarize")
    content_type: Literal["audio_transcript", "text", "mixed"] = Field(
        "text", description="Type of content"
    )
    detail_level: Literal["brief", "detailed", "comprehensive"] = Field(
        "detailed", description="Level of detail"
    )
    language: str = Field("th", description="Output language")


class GrammarCheckRequest(BaseModel):
    """Request for grammar checking"""

    text: str = Field(..., min_length=1, description="Text to check")
    text_type: Literal["english"] = Field("english", description="Type of text")
    language: str = Field("th", description="Output language for feedback")


class PracticeRequest(BaseModel):
    """Request for practice mode"""

    mode: Literal["listening", "speaking", "reading", "writing"] = Field(
        ..., description="Practice mode"
    )
    content: Optional[str] = Field(None, description="Content for the practice")
    user_response: Optional[str] = Field(None, description="User's response")
    difficulty: Literal["beginner", "intermediate", "advanced"] = Field(
        "intermediate", description="Difficulty level"
    )
    language: str = Field("th", description="Output language")


class GenerateExerciseRequest(BaseModel):
    """Request to generate an exercise"""

    exercise_type: Literal[
        "fill_blank",
        "multiple_choice",
        "sentence_rearrangement",
        "translation",
        "listening_comprehension",
    ] = Field(..., description="Type of exercise")
    topic: str = Field(..., description="Topic for the exercise")
    difficulty: Literal["beginner", "intermediate", "advanced"] = Field(
        "intermediate", description="Difficulty level"
    )
    language: str = Field("th", description="Output language")


@router.post("/translate/audio")
async def translate_audio(request: TranslateAudioRequest):
    """
    Translate audio to text and then to target language

    - **audio**: Base64 encoded audio (user speaking)
    - **source_lang**: Source language (default: 'en')
    - **target_lang**: Target language (default: 'th')

    Returns original text, translation, and pronunciation guide
    """
    if not language_service:
        raise HTTPException(status_code=503, detail="Language service not initialized")

    try:
        import base64

        audio_data = base64.b64decode(request.audio)

        result = await language_service.translate_audio(
            audio_data=audio_data,
            source_lang=request.source_lang,
            target_lang=request.target_lang,
        )

        return result

    except Exception as e:
        logger.error(f"Audio translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/translate/text")
async def translate_text(
    text: str,
    source_lang: str = "en",
    target_lang: str = "th",
):
    """
    Translate text directly

    - **text**: Text to translate
    - **source_lang**: Source language (default: 'en')
    - **target_lang**: Target language (default: 'th')
    """
    if not language_service:
        raise HTTPException(status_code=503, detail="Language service not initialized")

    try:
        translation = await language_service._translate_text(
            text=text,
            source_lang=source_lang,
            target_lang=target_lang,
        )

        return {
            "original_text": text,
            "translated_text": translation,
            "source_lang": source_lang,
            "target_lang": target_lang,
        }

    except Exception as e:
        logger.error(f"Text translation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/summarize")
async def summarize_content(request: SummarizeRequest):
    """
    Summarize content (grounded ONLY on provided content)

    - **content**: Content to summarize
    - **content_type**: Type of content ('audio_transcript', 'text', 'mixed')
    - **detail_level**: Level of detail ('brief', 'detailed', 'comprehensive')
    - **language**: Output language

    Returns summary, key points, vocabulary, and more
    """
    if not language_service:
        raise HTTPException(status_code=503, detail="Language service not initialized")

    try:
        result = await language_service.summarize_content(
            content=request.content,
            content_type=request.content_type,
            detail_level=request.detail_level,
            language=request.language,
        )

        return result

    except Exception as e:
        logger.error(f"Summarization error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/grammar/check")
async def check_grammar(request: GrammarCheckRequest):
    """
    Check grammar in English text

    - **text**: Text to check
    - **text_type**: Type of text (currently only 'english' supported)
    - **language**: Output language for feedback

    Returns corrections, suggestions, and explanations
    """
    if not language_service:
        raise HTTPException(status_code=503, detail="Language service not initialized")

    try:
        result = await language_service.check_grammar(
            text=request.text,
            text_type=request.text_type,
            language=request.language,
        )

        return result

    except Exception as e:
        logger.error(f"Grammar check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/practice")
async def practice_mode(request: PracticeRequest):
    """
    Practice mode for language learning

    - **mode**: Practice mode ('listening', 'speaking', 'reading', 'writing')
    - **content**: Content for the practice (optional for some modes)
    - **user_response**: User's response (for speaking/writing)
    - **difficulty**: Difficulty level ('beginner', 'intermediate', 'advanced')
    - **language**: Output language

    Returns practice feedback and next exercise
    """
    if not language_service:
        raise HTTPException(status_code=503, detail="Language service not initialized")

    try:
        result = await language_service.practice_mode(
            mode=request.mode,
            content=request.content,
            user_response=request.user_response,
            difficulty=request.difficulty,
            language=request.language,
        )

        return result

    except Exception as e:
        logger.error(f"Practice mode error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/exercise/generate")
async def generate_exercise(request: GenerateExerciseRequest):
    """
    Generate a language learning exercise

    - **exercise_type**: Type of exercise ('fill_blank', 'multiple_choice', 'sentence_rearrangement', 'translation', 'listening_comprehension')
    - **topic**: Topic for the exercise
    - **difficulty**: Difficulty level ('beginner', 'intermediate', 'advanced')
    - **language**: Output language

    Returns exercise with questions and answers
    """
    if not language_service:
        raise HTTPException(status_code=503, detail="Language service not initialized")

    try:
        result = await language_service.generate_exercise(
            exercise_type=request.exercise_type,
            topic=request.topic,
            difficulty=request.difficulty,
            language=request.language,
        )

        return result

    except Exception as e:
        logger.error(f"Exercise generation error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/voice/learn")
async def voice_learning_session(
    audio: str,
    mode: Literal["translate", "summarize", "practice"] = "translate",
    language: str = "th",
):
    """
    Complete voice learning session

    1. Transcribe audio
    2. Process based on mode:
       - translate: Translate to Thai
       - summarize: Summarize the content
       - practice: Provide practice feedback

    - **audio**: Base64 encoded audio
    - **mode**: Processing mode ('translate', 'summarize', 'practice')
    - **language**: Output language
    """
    try:
        import base64

        audio_data = base64.b64decode(audio)

        # Transcribe audio
        stt_result = await stt_service.transcribe(
            audio_data=audio_data,
            language="auto",
        )
        transcript = stt_result["text"]

        logger.info(f"Voice learning transcript: {transcript[:50]}...")

        # Process based on mode
        if mode == "translate":
            translation = await language_service._translate_text(
                text=transcript,
                source_lang="en",
                target_lang=language,
            )

            return {
                "transcript": transcript,
                "translation": translation,
                "mode": "translate",
            }

        elif mode == "summarize":
            summary = await language_service.summarize_content(
                content=transcript,
                content_type="audio_transcript",
                detail_level="detailed",
                language=language,
            )

            return {
                "transcript": transcript,
                "summary": summary,
                "mode": "summarize",
            }

        elif mode == "practice":
            practice = await language_service.practice_mode(
                mode="speaking",
                content=transcript,
                user_response=transcript,  # For now, use same as content
                difficulty="intermediate",
                language=language,
            )

            return {
                "transcript": transcript,
                "practice": practice,
                "mode": "practice",
            }

    except Exception as e:
        logger.error(f"Voice learning session error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/features")
async def get_language_features():
    """Get available language learning features"""
    return {
        "features": {
            "voice_translation": {
                "available": True,
                "description": "Translate voice to text and target language in real-time",
                "supported_languages": ["en", "th"],
            },
            "content_summarization": {
                "available": True,
                "description": "Summarize content (grounded on input only)",
                "detail_levels": ["brief", "detailed", "comprehensive"],
            },
            "grammar_checking": {
                "available": True,
                "description": "Check English grammar",
                "supported_languages": ["english"],
            },
            "practice_modes": {
                "available": True,
                "modes": ["listening", "speaking", "reading", "writing"],
                "difficulties": ["beginner", "intermediate", "advanced"],
            },
            "exercise_generation": {
                "available": True,
                "types": [
                    "fill_blank",
                    "multiple_choice",
                    "sentence_rearrangement",
                    "translation",
                    "listening_comprehension",
                ],
            },
        },
    }

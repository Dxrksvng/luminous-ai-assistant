"""
STT (Speech-to-Text) Service
Uses Whisper for high-quality transcription with Thai support
"""

import io
import base64
import wave
import numpy as np
from typing import Optional
from abc import ABC, abstractmethod
from core.logger import logger


class STTEngine(ABC):
    """Abstract base class for STT engines"""

    @abstractmethod
    async def transcribe(self, audio_data: bytes, language: str = "th") -> str:
        """Transcribe audio to text"""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if this engine is available"""
        pass


class WhisperEngine(STTEngine):
    """
    Whisper - OpenAI's speech recognition model
    Excellent Thai support, runs locally
    Requires: pip install openai-whisper
    """

    def __init__(self):
        self._model = None
        self._model_size = "base"  # tiny, base, small, medium, large
        self._available: bool | None = None

    async def is_available(self) -> bool:
        """Check if Whisper is installed"""
        if self._available is not None:
            return self._available

        try:
            import whisper
            self._available = True
            return True
        except ImportError:
            self._available = False
            logger.info("Whisper not installed. Run: pip install openai-whisper")
            return False

    def _get_model(self):
        """Lazy load Whisper model"""
        if self._model is None:
            import whisper

            logger.info(f"Loading Whisper model: {self._model_size}")
            self._model = whisper.load_model(self._model_size)
            logger.info("Whisper model loaded")

        return self._model

    async def transcribe(self, audio_data: bytes, language: str = "th") -> str:
        """Transcribe audio using Whisper"""
        try:
            import whisper

            # Save audio to temp file
            temp_file = "temp_audio.wav"
            with open(temp_file, "wb") as f:
                f.write(audio_data)

            # Transcribe
            model = self._get_model()

            # Use language parameter if specified, otherwise auto-detect
            lang_param = None if language == "auto" else language

            result = model.transcribe(
                temp_file,
                language=lang_param,
                fp16=False,  # Use FP32 for better compatibility
            )

            text = result["text"].strip()

            # Clean up
            import os
            if os.path.exists(temp_file):
                os.remove(temp_file)

            return text

        except Exception as e:
            logger.error(f"Whisper transcription error: {e}")
            raise

    def set_model_size(self, size: str):
        """Set Whisper model size (tiny, base, small, medium, large)"""
        if size in ["tiny", "base", "small", "medium", "large", "large-v2", "large-v3"]:
            self._model_size = size
            self._model = None  # Force reload
            logger.info(f"Whisper model size set to: {size}")
        else:
            logger.warning(f"Invalid model size: {size}")


class FasterWhisperEngine(STTEngine):
    """
    Faster-Whisper - Optimized Whisper implementation
    Faster and uses less memory
    Requires: pip install faster-whisper
    """

    def __init__(self):
        self._model = None
        self._model_size = "base"
        self._available: bool | None = None

    async def is_available(self) -> bool:
        """Check if Faster-Whisper is installed"""
        if self._available is not None:
            return self._available

        try:
            from faster_whisper import WhisperModel
            self._available = True
            return True
        except ImportError:
            self._available = False
            logger.info("Faster-Whisper not installed. Run: pip install faster-whisper")
            return False

    def _get_model(self):
        """Lazy load Faster-Whisper model"""
        if self._model is None:
            from faster_whisper import WhisperModel

            logger.info(f"Loading Faster-Whisper model: {self._model_size}")
            self._model = WhisperModel(
                self._model_size,
                device="cpu",  # Use CPU, change to "cuda" for GPU
                compute_type="int8",  # Use int8 for lower memory
            )
            logger.info("Faster-Whisper model loaded")

        return self._model

    async def transcribe(self, audio_data: bytes, language: str = "th") -> str:
        """Transcribe audio using Faster-Whisper"""
        try:
            model = self._get_model()

            # Use language parameter if specified
            lang_param = None if language == "auto" else language

            segments, info = model.transcribe(
                audio_data,
                language=lang_param,
                beam_size=5,
                vad_filter=True,  # Enable voice activity detection
            )

            # Combine all segments
            text = " ".join([segment.text for segment in segments])

            return text.strip()

        except Exception as e:
            logger.error(f"Faster-Whisper transcription error: {e}")
            raise


class SpeechRecognitionEngine(STTEngine):
    """
    SpeechRecognition - Google Web Speech API
    Requires internet, but no installation
    Good for quick testing
    """

    def __init__(self):
        self._available: bool | None = None

    async def is_available(self) -> bool:
        """Check if speech_recognition is installed"""
        if self._available is not None:
            return self._available

        try:
            import speech_recognition as sr
            self._available = True
            return True
        except ImportError:
            self._available = False
            logger.info("speech_recognition not installed. Run: pip install SpeechRecognition")
            return False

    async def transcribe(self, audio_data: bytes, language: str = "th") -> str:
        """Transcribe audio using Google Web Speech API"""
        try:
            import speech_recognition as sr

            r = sr.Recognizer()

            # Convert bytes to AudioData
            with io.BytesIO(audio_data) as audio_file:
                audio = sr.AudioData(audio_file.read(), sample_rate=16000, sample_width=2)

            # Transcribe
            lang_code = "th-TH" if language == "th" else "en-US"
            text = r.recognize_google(audio, language=lang_code)

            return text

        except Exception as e:
            logger.error(f"Speech recognition error: {e}")
            raise


class STTService:
    """
    Main STT Service - Manages multiple STT engines
    """

    def __init__(self):
        self.engines: list[STTEngine] = [
            FasterWhisperEngine(),  # Try Faster-Whisper first (faster, less memory)
            WhisperEngine(),  # Then Whisper (reliable)
            SpeechRecognitionEngine(),  # Fallback to Google (requires internet)
        ]
        self._initialized = False

    async def initialize(self):
        """Initialize STT service and check available engines"""
        logger.info("🎤 Initializing STT service...")

        available_count = 0
        for engine in self.engines:
            is_available = await engine.is_available()
            if is_available:
                available_count += 1
                logger.info(f"  ✅ {engine.__class__.__name__}: Available")
            else:
                logger.info(f"  ❌ {engine.__class__.__name__}: Not available")

        if available_count == 0:
            logger.warning("⚠️ No STT engines available!")
        else:
            logger.info(f"🎙️ STT service ready with {available_count} engine(s)")

        self._initialized = True

    async def transcribe(
        self,
        audio_data: bytes | str,
        language: str = "th",
        engine: str | None = None,
    ) -> dict:
        """
        Transcribe audio to text

        Args:
            audio_data: Audio data (bytes) or base64 string
            language: Language code ('th', 'en', or 'auto')
            engine: Specific engine to use (None = auto-select)

        Returns:
            Dict with transcription and metadata
        """
        if not self._initialized:
            await self.initialize()

        # Convert base64 to bytes if needed
        if isinstance(audio_data, str):
            try:
                audio_data = base64.b64decode(audio_data)
            except Exception as e:
                logger.error(f"Failed to decode base64 audio: {e}")
                raise ValueError("Invalid base64 audio data")

        logger.info(f"🎧 Transcribing audio ({len(audio_data)} bytes)...")

        # Find available engine
        selected_engine = None
        if engine:
            for e in self.engines:
                if e.__class__.__name__.lower().replace("engine", "") == engine.lower():
                    if await e.is_available():
                        selected_engine = e
                    break
        else:
            for e in self.engines:
                if await e.is_available():
                    selected_engine = e
                    break

        if not selected_engine:
            raise Exception("No STT engine available")

        try:
            text = await selected_engine.transcribe(audio_data, language)

            return {
                "text": text,
                "engine": selected_engine.__class__.__name__,
                "language": language,
                "confidence": None,  # Some engines return this
            }

        except Exception as e:
            logger.error(f"STT transcription failed: {e}")
            raise

    async def get_available_engines(self) -> list[dict]:
        """Get list of available STT engines"""
        engines_info = []

        for engine in self.engines:
            is_available = await engine.is_available()
            engines_info.append({
                "name": engine.__class__.__name__,
                "available": is_available,
                "type": engine.__class__.__bases__[0].__name__,
            })

        return engines_info


# Global instance
stt_service = STTService()

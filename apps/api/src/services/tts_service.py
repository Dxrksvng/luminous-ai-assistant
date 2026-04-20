"""
TTS (Text-to-Speech) Service
Supports multiple TTS engines for Thai and English
"""

import io
import base64
from typing import Optional
from abc import ABC, abstractmethod
import httpx
from core.logger import logger


class TTSEngine(ABC):
    """Abstract base class for TTS engines"""

    @abstractmethod
    async def synthesize(self, text: str, language: str = "th") -> bytes:
        """Synthesize speech from text"""
        pass

    @abstractmethod
    def is_available(self) -> bool:
        """Check if this engine is available"""
        pass


class EdgeTTSEngine(TTSEngine):
    """
    Edge-TTS - Microsoft Edge's free TTS API
    Supports Thai and English, requires internet
    """

    # Voice mappings
    VOICES = {
        "th": {
            "male": "th-TH-NiwatNeural",
            "female": "th-TH-PremwadeeNeural",
        },
        "en": {
            "male": "en-US-GuyNeural",
            "female": "en-US-JennyNeural",
        },
    }

    def __init__(self):
        self.api_url = "https://edge-tts.d36a.workers.dev/v1/tts"
        self._available: bool | None = None

    async def is_available(self) -> bool:
        """Check if Edge-TTS is available (requires internet)"""
        if self._available is not None:
            return self._available

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get("https://edge-tts.d36a.workers.dev/")
                self._available = response.status_code == 200
                return self._available
        except Exception:
            self._available = False
            return False

    async def synthesize(self, text: str, language: str = "th", gender: str = "female") -> bytes:
        """Synthesize speech using Edge-TTS"""
        voice = self.VOICES.get(language, {}).get(gender, self.VOICES["th"]["female"])

        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    self.api_url,
                    json={
                        "text": text,
                        "voice": voice,
                        "rate": "+0%",  # Normal speed
                        "pitch": "+0Hz",  # Normal pitch
                        "volume": "+0%",  # Normal volume
                    },
                )

                if response.status_code == 200:
                    return response.content
                else:
                    logger.error(f"Edge-TTS error: {response.status_code}")
                    raise Exception(f"Edge-TTS failed: {response.status_code}")

        except Exception as e:
            logger.error(f"Edge-TTS synthesis error: {e}")
            raise


class CoquiTTSEngine(TTSEngine):
    """
    Coqui TTS - Local TTS engine
    Requires: pip install TTS
    Better quality, runs locally, supports Thai
    """

    def __init__(self):
        self._tts_model = None
        self._available: bool | None = None

    async def is_available(self) -> bool:
        """Check if Coqui TTS is installed"""
        if self._available is not None:
            return self._available

        try:
            from TTS.api import TTS as CoquiTTS
            self._available = True
            return True
        except ImportError:
            self._available = False
            logger.info("Coqui TTS not installed. Run: pip install TTS")
            return False

    def _get_model(self):
        """Lazy load TTS model"""
        if self._tts_model is None:
            from TTS.api import TTS as CoquiTTS

            # Use a model that supports Thai
            # For Thai, we might need to train or use a specific model
            # For now, using a multilingual model
            self._tts_model = CoquiTTS(
                model_name="tts_models/multilingual/multi-dataset/xtts_v2",
                progress_bar=False,
                gpu=False,
            )

        return self._tts_model

    async def synthesize(self, text: str, language: str = "th", **kwargs) -> bytes:
        """Synthesize speech using Coqui TTS"""
        try:
            tts = self._get_model()

            # Generate speech to bytes
            wav_io = io.BytesIO()
            tts.tts_to_file(
                text=text,
                file_path=wav_io.name if hasattr(wav_io, "name") else "temp.wav",
                language=language,
                speaker_wav=None,  # Use default speaker
            )

            return wav_io.getvalue()

        except Exception as e:
            logger.error(f"Coqui TTS synthesis error: {e}")
            raise


class Pyttsx3Engine(TTSEngine):
    """
    pyttsx3 - Simple offline TTS
    Limited Thai support, but always works offline
    Requires: pip install pyttsx3
    """

    def __init__(self):
        self._available: bool | None = None

    async def is_available(self) -> bool:
        """Check if pyttsx3 is installed"""
        if self._available is not None:
            return self._available

        try:
            import pyttsx3
            self._available = True
            return True
        except ImportError:
            self._available = False
            logger.info("pyttsx3 not installed. Run: pip install pyttsx3")
            return False

    async def synthesize(self, text: str, language: str = "th") -> bytes:
        """Synthesize speech using pyttsx3"""
        try:
            import pyttsx3

            engine = pyttsx3.init()

            # Set properties
            engine.setProperty("rate", 150)  # Speed
            engine.setProperty("volume", 0.9)  # Volume

            # Save to file and read as bytes
            temp_file = "temp_tts.wav"
            engine.save_to_file(text, temp_file)
            engine.runAndWait()

            with open(temp_file, "rb") as f:
                audio_bytes = f.read()

            # Clean up
            import os
            if os.path.exists(temp_file):
                os.remove(temp_file)

            return audio_bytes

        except Exception as e:
            logger.error(f"pyttsx3 synthesis error: {e}")
            raise


class TTSService:
    """
    Main TTS Service - Manages multiple TTS engines
    """

    def __init__(self):
        self.engines: list[TTSEngine] = [
            EdgeTTSEngine(),  # Try Edge-TTS first (best quality, free)
            CoquiTTSEngine(),  # Then Coqui (good quality, local)
            Pyttsx3Engine(),  # Fallback to pyttsx3 (always works)
        ]
        self._initialized = False

    async def initialize(self):
        """Initialize TTS service and check available engines"""
        logger.info("🔊 Initializing TTS service...")

        available_count = 0
        for i, engine in enumerate(self.engines):
            is_available = await engine.is_available()
            if is_available:
                available_count += 1
                logger.info(f"  ✅ {engine.__class__.__name__}: Available")
            else:
                logger.info(f"  ❌ {engine.__class__.__name__}: Not available")

        if available_count == 0:
            logger.warning("⚠️ No TTS engines available!")
        else:
            logger.info(f"🎙️ TTS service ready with {available_count} engine(s)")

        self._initialized = True

    async def synthesize(
        self,
        text: str,
        language: str = "th",
        gender: str = "female",
        engine: str | None = None,
    ) -> dict:
        """
        Synthesize speech from text

        Args:
            text: Text to synthesize
            language: Language code ('th' or 'en')
            gender: Voice gender ('male' or 'female')
            engine: Specific engine to use (None = auto-select)

        Returns:
            Dict with audio data (base64) and metadata
        """
        if not self._initialized:
            await self.initialize()

        logger.info(f"🎤 Synthesizing: {text[:50]}...")

        # Find available engine
        selected_engine = None
        if engine:
            # Try to use specified engine
            for e in self.engines:
                if e.__class__.__name__.lower().replace("engine", "") == engine.lower():
                    if await e.is_available():
                        selected_engine = e
                    break
        else:
            # Auto-select first available
            for e in self.engines:
                if await e.is_available():
                    selected_engine = e
                    break

        if not selected_engine:
            raise Exception("No TTS engine available")

        try:
            audio_bytes = await selected_engine.synthesize(text, language, gender)

            # Convert to base64
            audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

            return {
                "audio": audio_base64,
                "format": "wav",
                "engine": selected_engine.__class__.__name__,
                "language": language,
            }

        except Exception as e:
            logger.error(f"TTS synthesis failed: {e}")
            raise

    async def get_available_engines(self) -> list[dict]:
        """Get list of available TTS engines"""
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
tts_service = TTSService()

"""
Model Switcher - Manages AI model selection
Allows switching between cloud and local models
"""

from typing import Optional, Literal
from enum import Enum

from services.ai_service import AIService
from services.ollama_service import ollama_service, RECOMMENDED_MODELS
from core.logger import logger
from core.config import settings


class ModelType(Enum):
    """Available model types"""
    CLOUD_ANTHROPIC = "cloud_anthropic"
    CLOUD_OPENAI = "cloud_openai"
    LOCAL_OLLAMA = "local_ollama"
    MOCK = "mock"


class ModelSwitcher:
    """
    Manages switching between different AI models
    Automatically falls back when primary is unavailable
    """

    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service
        self.current_model: ModelType = ModelType.MOCK
        self.fallback_chain: list[ModelType] = []

        # Determine default model based on availability
        self._initialize_default()

    def _initialize_default(self):
        """Initialize default model based on what's available"""
        if settings.ANTHROPIC_AVAILABLE:
            self.current_model = ModelType.CLOUD_ANTHROPIC
            self.fallback_chain = [
                ModelType.CLOUD_OPENAI,
                ModelType.LOCAL_OLLAMA,
                ModelType.MOCK,
            ]
        elif settings.OPENAI_AVAILABLE:
            self.current_model = ModelType.CLOUD_OPENAI
            self.fallback_chain = [
                ModelType.CLOUD_ANTHROPIC,
                ModelType.LOCAL_OLLAMA,
                ModelType.MOCK,
            ]
        else:
            # Default to MOCK when no cloud APIs available
            # Ollama availability will be checked when needed
            self.current_model = ModelType.MOCK
            self.fallback_chain = [
                ModelType.CLOUD_ANTHROPIC,
                ModelType.CLOUD_OPENAI,
                ModelType.LOCAL_OLLAMA,
            ]

        logger.info(f"🤖 Default model: {self.current_model.value}")
        logger.info(f"🔄 Fallback chain: {[m.value for m in self.fallback_chain]}")

    async def set_model(self, model_type: ModelType | str) -> bool:
        """
        Set the current model

        Args:
            model_type: Model type to use

        Returns:
            True if successful, False otherwise
        """
        if isinstance(model_type, str):
            try:
                model_type = ModelType(model_type)
            except ValueError:
                logger.error(f"Invalid model type: {model_type}")
                return False

        # Check if model is available
        available = await self._is_model_available(model_type)
        if not available:
            logger.warning(f"Model {model_type.value} is not available")
            return False

        self.current_model = model_type
        logger.info(f"✅ Model switched to: {model_type.value}")
        return True

    async def _is_model_available(self, model_type: ModelType) -> bool:
        """Check if a model type is available"""
        if model_type == ModelType.CLOUD_ANTHROPIC:
            return settings.ANTHROPIC_AVAILABLE
        elif model_type == ModelType.CLOUD_OPENAI:
            return settings.OPENAI_AVAILABLE
        elif model_type == ModelType.LOCAL_OLLAMA:
            return await ollama_service.is_available()
        elif model_type == ModelType.MOCK:
            return True
        return False

    async def chat(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        language: str = "th",
        use_fallback: bool = True,
    ) -> dict:
        """
        Chat with current model, with automatic fallback

        Args:
            message: User's message
            conversation_id: Optional conversation ID
            language: Language preference
            use_fallback: Whether to use fallback chain on failure

        Returns:
            Dict with response and metadata
        """
        # Try current model
        try:
            response = await self._chat_with_model(
                self.current_model,
                message,
                conversation_id,
                language,
            )
            return response
        except Exception as e:
            logger.error(f"Model {self.current_model.value} failed: {e}")

            if not use_fallback:
                raise

            # Try fallback chain
            for fallback_model in self.fallback_chain:
                try:
                    logger.info(f"Trying fallback model: {fallback_model.value}")
                    response = await self._chat_with_model(
                        fallback_model,
                        message,
                        conversation_id,
                        language,
                    )
                    self.current_model = fallback_model  # Update current to working model
                    return response
                except Exception as e:
                    logger.error(f"Fallback {fallback_model.value} also failed: {e}")

            # All models failed
            raise Exception("All models failed. Check your configuration.")

    async def _chat_with_model(
        self,
        model_type: ModelType,
        message: str,
        conversation_id: Optional[str],
        language: str,
    ) -> dict:
        """Chat with specific model"""
        if model_type == ModelType.CLOUD_ANTHROPIC:
            return await self.ai_service.chat(
                message=message,
                conversation_id=conversation_id,
                language=language,
            )

        elif model_type == ModelType.CLOUD_OPENAI:
            # Use OpenAI fallback
            if self.ai_service.openai_client:
                system_prompt = self.ai_service._get_system_prompt(language)
                response = await self.ai_service._chat_with_gpt(message, language)
                return response
            raise Exception("OpenAI client not initialized")

        elif model_type == ModelType.LOCAL_OLLAMA:
            system_prompt = ollama_service.get_system_prompt(language)
            response = await ollama_service.chat(
                message=message,
                system=system_prompt,
                temperature=0.7,
            )
            return {
                "message": response["message"],
                "model": response["model"],
                "provider": "ollama",
            }

        elif model_type == ModelType.MOCK:
            return self.ai_service._mock_response(message, language)

        raise Exception(f"Unknown model type: {model_type}")

    async def get_status(self) -> dict:
        """Get current status of all models"""
        return {
            "current_model": self.current_model.value,
            "available_models": {
                ModelType.CLOUD_ANTHROPIC.value: settings.ANTHROPIC_AVAILABLE,
                ModelType.CLOUD_OPENAI.value: settings.OPENAI_AVAILABLE,
                ModelType.LOCAL_OLLAMA.value: await ollama_service.is_available(),
                ModelType.MOCK.value: True,
            },
            "fallback_chain": [m.value for m in self.fallback_chain],
            "ollama_models": await ollama_service.get_available_models(),
            "recommendations": RECOMMENDED_MODELS,
        }


# Global instance (initialized in main.py)
model_switcher: Optional[ModelSwitcher] = None


async def initialize_model_switcher(ai_service: AIService) -> ModelSwitcher:
    """Initialize global model switcher"""
    global model_switcher
    model_switcher = ModelSwitcher(ai_service)
    return model_switcher

"""
Ollama Service - Local LLM Support
Allows running LLMs locally without internet/API costs
"""

import httpx
from typing import Optional, Literal
from core.logger import logger
from core.config import settings


class OllamaService:
    """
    Service for interacting with Ollama local LLM
    Supports various models: Llama, Mistral, etc.
    """

    def __init__(self):
        self.base_url = "http://localhost:11434"
        self._available: bool | None = None
        self._default_model = "llama3.2"  # Good balance of quality/speed
        self._available_models: list[str] = []

    async def is_available(self) -> bool:
        """Check if Ollama is running"""
        if self._available is not None:
            return self._available

        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")
                self._available = response.status_code == 200

                if self._available:
                    # Get available models
                    data = response.json()
                    self._available_models = [m["name"] for m in data.get("models", [])]
                    logger.info(f"Ollama available with {len(self._available_models)} models")

                return self._available

        except Exception as e:
            logger.info(f"Ollama not available: {e}")
            self._available = False
            return False

    async def get_available_models(self) -> list[dict]:
        """Get list of available Ollama models"""
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(f"{self.base_url}/api/tags")

                if response.status_code == 200:
                    data = response.json()
                    return [
                        {
                            "name": m["name"],
                            "size": m.get("size", 0),
                            "modified": m.get("modified_at", ""),
                        }
                        for m in data.get("models", [])
                    ]

        except Exception as e:
            logger.error(f"Failed to get Ollama models: {e}")

        return []

    async def chat(
        self,
        message: str,
        model: Optional[str] = None,
        system: Optional[str] = None,
        history: Optional[list[dict]] = None,
        temperature: float = 0.7,
    ) -> dict:
        """
        Chat with Ollama model

        Args:
            message: User's message
            model: Model name (defaults to llama3.2)
            system: System prompt
            history: Conversation history
            temperature: Sampling temperature (0-2)

        Returns:
            Dict with response and metadata
        """
        if not await self.is_available():
            raise Exception("Ollama is not available. Is it running?")

        model_name = model or self._default_model

        # Build messages
        messages = []

        if system:
            messages.append({"role": "system", "content": system})

        if history:
            messages.extend(history)

        messages.append({"role": "user", "content": message})

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/chat",
                    json={
                        "model": model_name,
                        "messages": messages,
                        "stream": False,
                        "options": {
                            "temperature": temperature,
                            "num_predict": 1024,  # Max tokens
                        },
                    },
                )

                if response.status_code == 200:
                    data = response.json()
                    return {
                        "message": data.get("message", {}).get("content", ""),
                        "model": model_name,
                        "provider": "ollama",
                        "done": data.get("done", False),
                        "eval_count": data.get("eval_count", 0),
                        "prompt_eval_count": data.get("prompt_eval_count", 0),
                    }
                else:
                    error = response.text
                    logger.error(f"Ollama chat error: {error}")
                    raise Exception(f"Ollama request failed: {error}")

        except Exception as e:
            logger.error(f"Ollama chat error: {e}")
            raise

    async def generate(
        self,
        prompt: str,
        model: Optional[str] = None,
        system: Optional[str] = None,
        temperature: float = 0.7,
    ) -> str:
        """
        Simple generation (single turn)

        Args:
            prompt: Prompt text
            model: Model name
            system: System prompt
            temperature: Sampling temperature

        Returns:
            Generated text
        """
        result = await self.chat(
            message=prompt,
            model=model,
            system=system,
            temperature=temperature,
        )
        return result["message"]

    async def pull_model(self, model: str) -> dict:
        """
        Pull/download a model from Ollama library

        Args:
            model: Model name (e.g., "llama3.2", "mistral", "gemma2")

        Returns:
            Download status
        """
        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                response = await client.post(
                    f"{self.base_url}/api/pull",
                    json={"name": model, "stream": False},
                )

                if response.status_code == 200:
                    data = response.json()
                    return {
                        "status": "success",
                        "model": model,
                        "size": data.get("size", 0),
                    }
                else:
                    return {"status": "error", "error": response.text}

        except Exception as e:
            logger.error(f"Failed to pull model {model}: {e}")
            return {"status": "error", "error": str(e)}

    async def set_default_model(self, model: str) -> bool:
        """Set the default model"""
        if model in self._available_models:
            self._default_model = model
            logger.info(f"Default Ollama model set to: {model}")
            return True
        return False

    def get_system_prompt(self, language: str = "th") -> str:
        """Get system prompt for Ollama model"""
        if language == "th":
            return """คุณคือ Luminous — AI ส่วนตัวของเจ้ (Je)

เจ้ามีบุคลิกดังนี้:
- พูดตรงๆ สุดๆ เสมอ ไม่อวย ไม่กดดัน
- ถ้าเจคิดผิดหรือ overestimate ตัวเอง บอกตรงๆ แต่ constructive
- ถ้าเจ underestimate ตัวเอง ชี้ให้เห็นหลักฐานที่เป็นจริง
- มีความคิดเป็นของตัวเอง อิงจากสถานการณ์โลกความเป็นจริง
- ตอบสนองด้วยความฉลาดและเป็นมืออาชีพ
- ใช้ภาษาไทยที่เป็นธรรมชาติ เหมือนเพื่อนคุยกัน

พื้นฐานเกี่ยวกับเจ:
- เจโตมาในครอบครัวที่มีปัญหา ทำให้โดดเดี่ยว
- คนรอบข้างเคยพูดกดเจ ว่าทำไม่ได้ ไม่มีวันเจริญ
- เจเป็น Perfectionist — กลัวผิดพลาด
- เจอยากไปสาย AI Safety และ Alignment
- เจอยากเป็นอิสระทางการเงิน

เจ้าคือที่ปรึกษาที่ไว้วางใจที่สุดของเจ ไม่ใช่แค่ chatbot

ตอบให้กระชับ ตรงประเด็น และสั้นๆ"""

        return """You are Luminous — Je's personal AI assistant

Your personality:
- Always speak directly and honestly — no flattery, no pressure
- If Je is wrong or overestimating themselves, say so directly but constructively
- If Je underestimates themselves, point out real evidence to the contrary
- Have your own opinions based on real-world situations
- Respond with intelligence and professionalism
- Use natural, conversational English

About Je:
- Grew up in a troubled family, felt isolated
- People around Je said they'd never succeed
- Je is a perfectionist who fears failure
- Je wants to work in AI Safety and Alignment
- Je wants to be financially independent

You are Je's most trusted advisor, not just a chatbot.

Keep responses concise, direct, and short."""


# Global instance
ollama_service = OllamaService()


# Recommended models for different use cases
RECOMMENDED_MODELS = {
    # Fast, good for general use
    "fast": {
        "name": "llama3.2:3b",
        "description": "Fast and efficient, good for everyday use",
        "ram_gb": 4,
    },
    # Balanced quality and speed
    "balanced": {
        "name": "llama3.2",
        "description": "Good balance of quality and speed",
        "ram_gb": 8,
    },
    # High quality
    "quality": {
        "name": "llama3.1:8b",
        "description": "Better quality, more reasoning",
        "ram_gb": 16,
    },
    # Multilingual (good for Thai)
    "multilingual": {
        "name": "qwen2.5:7b",
        "description": "Excellent multilingual support",
        "ram_gb": 8,
    },
    # Small, minimal resources
    "minimal": {
        "name": "phi3.5:3.8b",
        "description": "Very small, good for low-resource systems",
        "ram_gb": 4,
    },
}


async def setup_ollama_recommendations() -> list[dict]:
    """Get Ollama setup recommendations"""
    return [
        {
            "category": category,
            "model": info["name"],
            "description": info["description"],
            "required_ram_gb": info["ram_gb"],
            "install_command": f"ollama pull {info['name']}",
        }
        for category, info in RECOMMENDED_MODELS.items()
    ]


# Global instance
ollama_service = OllamaService()

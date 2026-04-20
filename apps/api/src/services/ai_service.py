"""
AI Service - Handles all AI interactions
Supports Anthropic (Claude) and OpenAI (GPT)
"""

from typing import Optional
import anthropic
from openai import AsyncOpenAI

from core.config import settings
from core.logger import logger
from services.web_search_service import web_search_service


class AIService:
    """Service for AI model interactions"""

    def __init__(self):
        self.anthropic_client: Optional[anthropic.AsyncAnthropic] = None
        self.openai_client: Optional[AsyncOpenAI] = None
        self.initialized = False

    async def initialize(self):
        """Initialize AI clients"""
        if settings.ANTHROPIC_AVAILABLE:
            self.anthropic_client = anthropic.AsyncAnthropic(api_key=settings.ANTHROPIC_API_KEY)
            logger.info("✅ Anthropic (Claude) client initialized")

        if settings.OPENAI_AVAILABLE:
            self.openai_client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
            logger.info("✅ OpenAI (GPT) client initialized")

        if not self.anthropic_client and not self.openai_client:
            logger.warning("⚠️ No AI API keys configured. Using mock responses.")

        self.initialized = True

    async def chat(
        self,
        message: str,
        conversation_id: Optional[str] = None,
        language: str = "th",
    ) -> dict:
        """
        Process chat message with AI

        Args:
            message: User's message
            conversation_id: Optional conversation ID for context
            language: Language preference ('th' or 'en')

        Returns:
            Dict containing response and metadata
        """
        logger.info(f"Processing chat message: {message[:50]}...")

        # Try Anthropic first (preferred)
        if self.anthropic_client:
            try:
                response = await self._chat_with_claude(message, language)
                return response
            except Exception as e:
                logger.error(f"Claude error: {e}")

        # Fallback to OpenAI
        if self.openai_client:
            try:
                response = await self._chat_with_gpt(message, language)
                return response
            except Exception as e:
                logger.error(f"OpenAI error: {e}")

        # Mock response if no AI available
        return await self._mock_response(message, language)

    async def _chat_with_claude(self, message: str, language: str) -> dict:
        """Chat with Anthropic Claude"""
        system_prompt = self._get_system_prompt(language)

        response = await self.anthropic_client.messages.create(
            model="claude-sonnet-4-5-20241022",
            max_tokens=1024,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": message,
                }
            ],
        )

        return {
            "message": response.content[0].text,
            "model": "claude-sonnet-4-5",
            "provider": "anthropic",
        }

    async def _chat_with_gpt(self, message: str, language: str) -> dict:
        """Chat with OpenAI GPT"""
        system_prompt = self._get_system_prompt(language)

        response = await self.openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": system_prompt,
                },
                {
                    "role": "user",
                    "content": message,
                },
            ],
            max_tokens=1024,
        )

        return {
            "message": response.choices[0].message.content,
            "model": "gpt-4o",
            "provider": "openai",
        }

    def _get_system_prompt(self, language: str) -> str:
        """Get system prompt based on language"""
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

เจ้าคือที่ปรึกษาที่ไว้วางใจที่สุดของเจ ไม่ใช่แค่ chatbot"""

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

You are Je's most trusted advisor, not just a chatbot."""

    async def _mock_response(self, message: str, language: str) -> dict:
        """Return mock response when no AI is available"""
        if language == "th":
            response = (
                f"ผมได้รับข้อความ: '{message}'\n\n"
                f"ขอโทษครับ ตอนนี้ยังไม่ได้ configure AI API key "
                f"ให้เพิ่ม ANTHROPIC_API_KEY หรือ OPENAI_API_KEY ใน .env ไฟล์"
            )
        else:
            response = (
                f"I received: '{message}'\n\n"
                f"Sorry, no AI API key is configured yet. "
                f"Please add ANTHROPIC_API_KEY or OPENAI_API_KEY to the .env file."
            )

        search_result = None

        # Try web search for current information
        try:
            search_result = await web_search_service.search_and_read(message)
            if search_result.get("top_result") and search_result.get("content_preview"):
                web_info = (
                    f"\n\n🔍 จากการค้นหาข้อมูล:\n"
                    f"{search_result.get('top_result', {}).get('snippet', 'ไม่พบข้อมูล')}"
                )
                response = response + web_info
        except Exception as e:
            logger.error(f"Web search error: {e}")
            response = response + "\n\n⚠️ ไม่สามารถค้นข้อมูลจากเว็บ"

        return {
            "message": response,
            "model": "mock",
            "provider": "none",
            "web_search": search_result.get("results", []) if search_result else [],
        }


# Create singleton instance
ai_service = AIService()

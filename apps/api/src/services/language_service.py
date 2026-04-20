"""
Language Learning Service
Features:
- Real-time voice translation
- Content summarization (grounded on input only)
- Grammar checking
- Practice modes (listening, speaking, reading, writing)
"""

import re
from typing import Optional, Literal
from core.logger import logger
from services.ai_service import AIService
from services.stt_service import stt_service


class LanguageLearningService:
    """
    Service for language learning features
    Focuses on English learning for Thai speakers
    """

    def __init__(self, ai_service: AIService):
        self.ai_service = ai_service

    async def translate_audio(
        self,
        audio_data: bytes,
        source_lang: str = "en",
        target_lang: str = "th",
    ) -> dict:
        """
        Translate audio to text and then translate to target language

        Args:
            audio_data: Audio bytes
            source_lang: Source language code
            target_lang: Target language code

        Returns:
            Dict with original text, translated text, and pronunciation
        """
        try:
            # Step 1: Transcribe audio
            stt_result = await stt_service.transcribe(
                audio_data=audio_data,
                language=source_lang,
            )
            original_text = stt_result["text"]

            logger.info(f"Transcribed: {original_text[:50]}...")

            # Step 2: Translate to target language
            translation = await self._translate_text(
                text=original_text,
                source_lang=source_lang,
                target_lang=target_lang,
            )

            # Step 3: Get pronunciation guide (if English)
            pronunciation = None
            if source_lang == "en":
                pronunciation = self._get_pronunciation_guide(original_text)

            return {
                "original_text": original_text,
                "translated_text": translation,
                "pronunciation": pronunciation,
                "source_lang": source_lang,
                "target_lang": target_lang,
                "detected_words": self._extract_words(original_text) if source_lang == "en" else None,
            }

        except Exception as e:
            logger.error(f"Translation error: {e}")
            raise

    async def _translate_text(
        self,
        text: str,
        source_lang: str,
        target_lang: str,
    ) -> str:
        """Translate text between languages"""
        system_prompt = f"""You are a professional translator. Translate the following text from {source_lang} to {target_lang}.

Rules:
- Translate naturally and accurately
- Preserve the tone and meaning
- For Thai to English: Use natural, conversational English
- For English to Thai: Use natural, conversational Thai
- Return ONLY the translation, no explanations
- Do NOT add any information not present in the original text"""

        try:
            response = await self.ai_service.chat(
                message=f"Translate to {target_lang}:\n\n{text}",
                language="en" if target_lang == "en" else "th",
            )

            # Extract just the translation from the response
            return self._extract_translation(response["message"])

        except Exception as e:
            logger.error(f"Text translation error: {e}")
            return text  # Return original if translation fails

    def _extract_translation(self, response: str) -> str:
        """Extract just the translation from AI response"""
        # Remove common prefixes
        prefixes = [
            "Here's the translation:",
            "Translation:",
            "แปลได้ว่า:",
            "คำแปล:",
            "ในภาษา",
        ]

        for prefix in prefixes:
            if prefix in response:
                response = response.split(prefix, 1)[1].strip()

        # Remove any extra explanations
        lines = response.split("\n")
        translation_lines = []
        for line in lines:
            line = line.strip()
            if line and not any(
                word in line.lower()
                for word in ["note:", "explanation:", "หมายเหตุ:", "อธิบาย:"]
            ):
                translation_lines.append(line)
            else:
                break

        return "\n".join(translation_lines).strip()

    def _get_pronunciation_guide(self, text: str) -> dict:
        """Get pronunciation guide for English text"""
        # Extract words
        words = re.findall(r"\b[a-zA-Z]+\b", text)

        pronunciation_guide = {}

        for word in words:
            word_lower = word.lower()
            # Simple phonetic approximation (can be enhanced with proper phonetic library)
            pronunciation_guide[word] = {
                "word": word,
                "phonetic": self._simple_phonetic(word_lower),
                "syllables": self._count_syllables(word_lower),
            }

        return pronunciation_guide

    def _simple_phonetic(self, word: str) -> str:
        """Simple phonetic approximation (Thai)"""
        # This is a simplified version - for production, use a proper phonetic API
        phonetic_map = {
            "a": "แอ",
            "b": "บี",
            "c": "ซี",
            "d": "ดี",
            "e": "อี",
            "f": "เอฟ",
            "g": "จี",
            "h": "เอช",
            "i": "ไอ",
            "j": "เจ",
            "k": "เค",
            "l": "แอล",
            "m": "เอ็ม",
            "n": "เอ็น",
            "o": "โอ",
            "p": "พี",
            "q": "คิว",
            "r": "อาร์",
            "s": "เอส",
            "t": "ที",
            "u": "ยู",
            "v": "วี",
            "w": "ดับเบิลยู",
            "x": "เอ็กซ์",
            "y": "วาย",
            "z": "แซด",
        }

        # For whole words, return simplified pronunciation
        # In production, use CMU pronouncing dictionary or similar
        return word  # Placeholder - should be replaced with proper API

    def _count_syllables(self, word: str) -> int:
        """Count syllables in a word"""
        word = word.lower()
        if word.endswith("e"):
            word = word[:-1]
        vowels = "aeiouy"
        syllable_count = 0
        prev_is_vowel = False

        for char in word:
            is_vowel = char in vowels
            if is_vowel and not prev_is_vowel:
                syllable_count += 1
            prev_is_vowel = is_vowel

        return max(1, syllable_count)

    def _extract_words(self, text: str) -> list[str]:
        """Extract individual words from text"""
        words = re.findall(r"\b[a-zA-Z]+\b", text)
        return list(set(word.lower() for word in words))

    async def summarize_content(
        self,
        content: str,
        content_type: Literal["audio_transcript", "text", "mixed"] = "text",
        detail_level: Literal["brief", "detailed", "comprehensive"] = "detailed",
        language: str = "th",
    ) -> dict:
        """
        Summarize content (grounded ONLY on the provided content)

        Args:
            content: Content to summarize
            content_type: Type of content
            detail_level: Level of detail
            language: Output language

        Returns:
            Dict with summary, key points, vocabulary, and more
        """
        system_prompt = f"""You are a language learning assistant. Summarize the content provided by the user.

CRITICAL RULES:
- Use ONLY the information provided in the content
- Do NOT add any external information, facts, or context
- Do NOT make assumptions about what is not stated
- If something is not mentioned in the content, say it's not mentioned
- Be honest if the content is unclear or incomplete

Output in {language} with these sections:
1. สรุป (Summary): What the content is about
2. จุดสำคัญ (Key Points): Main points mentioned, numbered
3. คำศัพท์สำคัญ (Key Vocabulary): Important words with meanings
4. โครงสร้าง (Structure): How the content is organized
5. สิ่งที่ไม่ได้กล่าวถึง (Not Mentioned): What is NOT in the content"""

        user_prompt = f"""Summarize this content in {detail_level} detail:

Content:
{content}

Focus on:
- What is being discussed?
- What are the main points?
- What vocabulary should be learned?
- How is the content structured?"""

        try:
            response = await self.ai_service.chat(
                message=user_prompt,
                language=language,
            )

            # Parse the structured response
            return self._parse_summary(response["message"], content)

        except Exception as e:
            logger.error(f"Summarization error: {e}")
            raise

    def _parse_summary(self, summary_text: str, original_content: str) -> dict:
        """Parse the AI summary into structured data"""
        # Initialize result
        result = {
            "summary": "",
            "key_points": [],
            "vocabulary": [],
            "structure": "",
            "not_mentioned": [],
            "word_count": len(original_content.split()),
            "original_content": original_content,
        }

        # Simple parsing based on sections
        sections = {
            "สรุป": "summary",
            "Summary": "summary",
            "จุดสำคัญ": "key_points",
            "Key Points": "key_points",
            "คำศัพท์สำคัญ": "vocabulary",
            "Key Vocabulary": "vocabulary",
            "โครงสร้าง": "structure",
            "Structure": "structure",
            "สิ่งที่ไม่ได้กล่าวถึง": "not_mentioned",
            "Not Mentioned": "not_mentioned",
        }

        current_section = None
        current_content = []

        for line in summary_text.split("\n"):
            line = line.strip()

            # Check for section headers
            found_section = False
            for section_header, section_key in sections.items():
                if line.startswith(section_header) or line.startswith(f"{section_header}:"):
                    # Save previous section
                    if current_section and current_content:
                        result[current_section] = "\n".join(current_content)

                    current_section = section_key
                    current_content = []
                    found_section = True
                    break

            if not found_section and current_section:
                current_content.append(line)

        # Save last section
        if current_section and current_content:
            result[current_section] = "\n".join(current_content)

        # Parse numbered lists
        if isinstance(result["key_points"], str):
            result["key_points"] = self._parse_numbered_list(result["key_points"])

        if isinstance(result["vocabulary"], str):
            result["vocabulary"] = self._parse_vocabulary_list(result["vocabulary"])

        if isinstance(result["not_mentioned"], str):
            result["not_mentioned"] = self._parse_list(result["not_mentioned"])

        return result

    def _parse_numbered_list(self, text: str) -> list[str]:
        """Parse numbered list from text"""
        items = []
        for line in text.split("\n"):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-") or line.startswith("•")):
                # Remove number/bullet
                clean_line = re.sub(r"^\d+\.|[-••]\s*", "", line).strip()
                if clean_line:
                    items.append(clean_line)
        return items

    def _parse_vocabulary_list(self, text: str) -> list[dict]:
        """Parse vocabulary list from text"""
        vocab = []
        for line in text.split("\n"):
            line = line.strip()
            if line:
                # Try to parse "word - definition" or "word: definition"
                if " - " in line:
                    word, definition = line.split(" - ", 1)
                    vocab.append({"word": word.strip(), "definition": definition.strip()})
                elif ": " in line:
                    word, definition = line.split(": ", 1)
                    vocab.append({"word": word.strip(), "definition": definition.strip()})
                else:
                    vocab.append({"word": line, "definition": ""})
        return vocab

    def _parse_list(self, text: str) -> list[str]:
        """Parse bullet list from text"""
        items = []
        for line in text.split("\n"):
            line = line.strip()
            if line and (line[0].isdigit() or line.startswith("-") or line.startswith("•")):
                clean_line = re.sub(r"^\d+\.|[-••]\s*", "", line).strip()
                if clean_line:
                    items.append(clean_line)
        return items

    async def check_grammar(
        self,
        text: str,
        text_type: Literal="english",
        language: str = "th",
    ) -> dict:
        """
        Check grammar in text

        Args:
            text: Text to check
            text_type: Type of text (english)
            language: Output language

        Returns:
            Dict with corrections, suggestions, and explanations
        """
        if text_type != "english":
            return {
                "error": "Only English grammar checking is currently supported",
            }

        system_prompt = f"""You are an English grammar checker for Thai learners. Check the grammar in the provided text.

CRITICAL RULES:
- Focus ONLY on the text provided
- Point out grammatical errors
- Suggest corrections
- Explain WHY something is wrong
- Provide the corrected version
- Be encouraging and helpful

Output in {language} with this format:
1. ข้อผิดพลาด (Errors): List each error found
2. คำแนะนำ (Suggestions): How to fix each error
3. คำอธิบาย (Explanations): Why it's wrong and the grammar rule
4. เวอร์ชันแก้ไข (Corrected Version): The corrected text
5. คะแนน (Score): 0-10 score

If no errors are found, say "ถูกต้องทั้งหมด!" (All correct!)"""

        try:
            response = await self.ai_service.chat(
                message=f"Check the grammar of this text:\n\n{text}",
                language=language,
            )

            return self._parse_grammar_check(response["message"], text)

        except Exception as e:
            logger.error(f"Grammar check error: {e}")
            raise

    def _parse_grammar_check(self, response: str, original_text: str) -> dict:
        """Parse grammar check response"""
        result = {
            "original_text": original_text,
            "errors": [],
            "suggestions": [],
            "explanations": "",
            "corrected_version": "",
            "score": None,
            "is_correct": False,
        }

        # Check if text is correct
        if "ถูกต้องทั้งหมด" in response or "All correct" in response or "No errors" in response:
            result["is_correct"] = True
            result["score"] = 10
            return result

        # Parse sections
        if "ข้อผิดพลาด" in response or "Errors" in response:
            # Extract errors
            error_section = self._extract_section(response, ["ข้อผิดพลาด", "Errors"])
            result["errors"] = self._parse_list(error_section)

        if "คำแนะนำ" in response or "Suggestions" in response:
            suggestion_section = self._extract_section(response, ["คำแนะนำ", "Suggestions"])
            result["suggestions"] = self._parse_list(suggestion_section)

        if "คำอธิบาย" in response or "Explanations" in response:
            result["explanations"] = self._extract_section(
                response,
                ["คำอธิบาย", "Explanations"],
            )

        if "เวอร์ชันแก้ไข" in response or "Corrected Version" in response:
            result["corrected_version"] = self._extract_section(
                response,
                ["เวอร์ชันแก้ไข", "Corrected Version"],
            )

        # Extract score
        score_match = re.search(r"คะแนน.*?(\d+)", response) or re.search(
            r"Score.*?(\d+)",
            response,
        )
        if score_match:
            result["score"] = int(score_match.group(1))

        return result

    def _extract_section(self, text: str, section_names: list[str]) -> str:
        """Extract a section from structured text"""
        for section_name in section_names:
            if section_name in text:
                parts = text.split(section_name, 1)
                if len(parts) > 1:
                    # Get content until next section
                    section_content = parts[1].strip()
                    # Find next section header
                    next_section_match = re.search(
                        r"\n\d+\.", section_content
                    ) or re.search(r"\n[A-Z][a-z]+:", section_content)

                    if next_section_match:
                        section_content = section_content[
                            : next_section_match.start()
                        ].strip()

                    return section_content

        return ""

    async def practice_mode(
        self,
        mode: Literal["listening", "speaking", "reading", "writing"],
        content: Optional[str] = None,
        user_response: Optional[str] = None,
        difficulty: Literal["beginner", "intermediate", "advanced"] = "intermediate",
        language: str = "th",
    ) -> dict:
        """
        Practice mode for language learning

        Args:
            mode: Practice mode
            content: Content for the practice
            user_response: User's response (for speaking/writing)
            difficulty: Difficulty level
            language: Output language

        Returns:
            Practice feedback and next exercise
        """
        system_prompt = f"""You are an English language learning tutor for Thai students. Focus on the {mode} practice.

CRITICAL RULES:
- Use ONLY the content provided
- Give helpful, encouraging feedback
- Point out mistakes clearly
- Suggest improvements
- Provide next exercise at the {difficulty} level

Output in {language}."""

        if mode == "listening":
            return await self._listening_practice(content, language, difficulty)

        elif mode == "speaking":
            return await self._speaking_practice(
                content,
                user_response,
                language,
                difficulty,
            )

        elif mode == "reading":
            return await self._reading_practice(content, user_response, language)

        elif mode == "writing":
            return await self._writing_practice(
                user_response,
                language,
                difficulty,
            )

    async def _listening_practice(
        self,
        content: str,
        language: str,
        difficulty: str,
    ) -> dict:
        """Listening practice mode"""
        user_prompt = f"""For listening practice, help the user understand this content:

Content:
{content}

Provide:
1. What was said (transcript if not clear)
2. Key points to listen for
3. Difficult words and their meanings
4. Comprehension questions to test understanding"""

        response = await self.ai_service.chat(message=user_prompt, language=language)

        return {
            "mode": "listening",
            "content": content,
            "feedback": response["message"],
            "difficulty": difficulty,
        }

    async def _speaking_practice(
        self,
        content: str,
        user_response: str,
        language: str,
        difficulty: str,
    ) -> dict:
        """Speaking practice mode"""
        user_prompt = f"""For speaking practice, the user was supposed to say:

Content to say:
{content}

The user said:
{user_response}

Provide feedback on:
1. Pronunciation
2. Intonation
3. Accuracy
4. Suggestions for improvement"""

        response = await self.ai_service.chat(message=user_prompt, language=language)

        return {
            "mode": "speaking",
            "target_content": content,
            "user_response": user_response,
            "feedback": response["message"],
            "difficulty": difficulty,
        }

    async def _reading_practice(
        self,
        content: str,
        user_response: Optional[str],
        language: str,
    ) -> dict:
        """Reading practice mode"""
        user_prompt = f"""For reading practice, help the user with this text:

Text to read:
{content}

Provide:
1. Vocabulary list with meanings
2. Grammar points
3. Comprehension questions
4. Tips for better reading"""

        response = await self.ai_service.chat(message=user_prompt, language=language)

        return {
            "mode": "reading",
            "content": content,
            "feedback": response["message"],
            "user_response": user_response,
        }

    async def _writing_practice(
        self,
        user_response: str,
        language: str,
        difficulty: str,
    ) -> dict:
        """Writing practice mode"""
        user_prompt = f"""For writing practice, review this text:

User's writing:
{user_response}

Provide feedback on:
1. Grammar
2. Vocabulary usage
3. Sentence structure
4. Overall clarity
5. Corrected version
6. Suggestions for improvement"""

        response = await self.ai_service.chat(message=user_prompt, language=language)

        return {
            "mode": "writing",
            "user_response": user_response,
            "feedback": response["message"],
            "difficulty": difficulty,
        }

    async def generate_exercise(
        self,
        exercise_type: Literal[
            "fill_blank",
            "multiple_choice",
            "sentence_rearrangement",
            "translation",
            "listening_comprehension",
        ],
        topic: str,
        difficulty: Literal["beginner", "intermediate", "advanced"] = "intermediate",
        language: str = "th",
    ) -> dict:
        """
        Generate a language learning exercise

        Args:
            exercise_type: Type of exercise
            topic: Topic for the exercise
            difficulty: Difficulty level
            language: Output language

        Returns:
            Exercise with questions and answers
        """
        system_prompt = f"""You are an English language learning exercise creator. Create a {exercise_type} exercise on the topic: {topic}.

Difficulty level: {difficulty}

CRITICAL RULES:
- Create clear, appropriate questions
- Provide correct answers
- Include explanations
- Output in JSON format

Output in {language}."""

        user_prompt = f"""Create a {exercise_type} exercise about: {topic}

Provide:
1. Instructions
2. Questions (at least 5)
3. Options (for multiple choice)
4. Correct answers
5. Explanations

Format as JSON."""

        response = await self.ai_service.chat(message=user_prompt, language=language)

        try:
            # Try to parse JSON from response
            import json

            # Find JSON in response
            json_match = re.search(r"\{[\s\S]*\}", response["message"])
            if json_match:
                exercise_data = json.loads(json_match.group())
                return {
                    "exercise_type": exercise_type,
                    "topic": topic,
                    "difficulty": difficulty,
                    **exercise_data,
                }
            else:
                # Return raw response if no JSON found
                return {
                    "exercise_type": exercise_type,
                    "topic": topic,
                    "difficulty": difficulty,
                    "content": response["message"],
                }

        except Exception as e:
            logger.error(f"Exercise generation error: {e}")
            return {
                "exercise_type": exercise_type,
                "topic": topic,
                "difficulty": difficulty,
                "error": "Failed to parse exercise",
                "raw_response": response["message"],
            }


# Global instance
language_service: Optional[LanguageLearningService] = None


async def initialize_language_service(ai_service: AIService) -> LanguageLearningService:
    """Initialize global language learning service"""
    global language_service
    language_service = LanguageLearningService(ai_service)
    return language_service

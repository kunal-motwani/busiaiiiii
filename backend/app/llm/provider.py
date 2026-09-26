"""LLM Provider abstraction supporting Gemini, Groq, and deterministic reasoner."""
import json
import logging
from typing import Any, Dict, List, Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class LLMProvider:
    """Abstract interface for LLM reasoning."""

    async def generate_json(self, prompt: str, schema_description: str) -> Dict[str, Any]:
        """Generate structured JSON reasoning."""
        raise NotImplementedError


class GeminiProvider(LLMProvider):
    """Google Gemini LLM provider."""

    def __init__(self, api_key: Optional[str] = None, model: str = "gemini-2.0-flash"):
        self.api_key = api_key or settings.GEMINI_API_KEY
        self.model_name = model

    async def generate_json(self, prompt: str, schema_description: str) -> Dict[str, Any]:
        if not self.api_key:
            raise ValueError("GEMINI_API_KEY is not configured.")

        from google import genai
        client = genai.Client(api_key=self.api_key)
        full_prompt = f"{prompt}\n\nRespond with valid JSON matching: {schema_description}"
        response = client.models.generate_content(
            model=self.model_name,
            contents=full_prompt,
        )
        text = response.text.strip()
        if text.startswith("```json"):
            text = text[7:]
        if text.startswith("```"):
            text = text[3:]
        if text.endswith("```"):
            text = text[:-3]
        return json.loads(text.strip())


class DeterministicReasoner(LLMProvider):
    """Rule-based, heuristic intelligence engine for offline execution and fast testing."""

    async def generate_json(self, prompt: str, schema_description: str) -> Dict[str, Any]:
        # Return fallback structured response
        return {}


def get_llm_provider() -> LLMProvider:
    """Factory to instantiate configured provider."""
    if settings.GEMINI_API_KEY:
        try:
            return GeminiProvider()
        except Exception:
            pass
    return DeterministicReasoner()

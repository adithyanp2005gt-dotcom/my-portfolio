from .base import BaseAiService
from .gemini import GeminiAiService
from .ollama import OllamaAiService
from .openai import OpenAiService
from ...config.settings import settings

class AiServiceFactory:
    @staticmethod
    def get_service() -> BaseAiService:
        provider = settings.AI_PROVIDER.lower()
        if provider == "gemini":
            return GeminiAiService()
        elif provider == "ollama":
            return OllamaAiService()
        elif provider == "openai":
            return OpenAiService()
        else:
            # Default fallback to Gemini
            return GeminiAiService()

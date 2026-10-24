import httpx
from .base import BaseAiService
from ...config.settings import settings

class OllamaAiService(BaseAiService):
    def __init__(self):
        self.host = settings.OLLAMA_HOST
        self.model = "llama3"

    async def generate_summary(self, text: str) -> str:
        headers = {"Content-Type": "application/json"}
        payload = {
            "model": self.model,
            "prompt": f"Summarize this engineering project into a single concise technical paragraph: {text}",
            "stream": False
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.host}/api/generate",
                    headers=headers,
                    json=payload,
                    timeout=15.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["response"]
            except Exception as e:
                return f"[MOCK SUMMARY] (Ollama Offline): Summary of: {text[:60]}... (Error: {str(e)})"
                
        return f"[MOCK SUMMARY] Summary of: {text[:60]}..."

    async def rewrite_text(self, text: str) -> str:
        headers = {"Content-Type": "application/json"}
        payload = {
            "model": self.model,
            "prompt": f"Rewrite this technical description to be more professional, calm, and clear: {text}",
            "stream": False
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.host}/api/generate",
                    headers=headers,
                    json=payload,
                    timeout=15.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["response"]
            except Exception as e:
                return f"[MOCK REWRITE] (Ollama Offline): Rewritten: {text[:60]}... (Error: {str(e)})"
                
        return f"[MOCK REWRITE] Rewritten: {text[:60]}..."

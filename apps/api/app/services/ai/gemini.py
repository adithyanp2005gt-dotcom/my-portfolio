import httpx
from .base import BaseAiService
from ...config.settings import settings

class GeminiAiService(BaseAiService):
    def __init__(self):
        self.api_key = settings.AI_API_KEY
        self.api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

    async def generate_summary(self, text: str) -> str:
        if not self.api_key:
            return f"[MOCK SUMMARY] (Gemini Key Missing): Summary of: {text[:60]}..."
            
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": f"Summarize this engineering project into a single concise technical paragraph: {text}"}]
            }]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.api_url}?key={self.api_key}",
                    headers=headers,
                    json=payload,
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                return f"[ERROR] Failed to query Gemini engine: {str(e)}"
        
        return f"[MOCK SUMMARY] Summary of: {text[:60]}..."

    async def rewrite_text(self, text: str) -> str:
        if not self.api_key:
            return f"[MOCK REWRITE] (Gemini Key Missing): Rewritten: {text[:60]}..."
            
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": f"Rewrite this technical description to be more professional, calm, and clear: {text}"}]
            }]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.api_url}?key={self.api_key}",
                    headers=headers,
                    json=payload,
                    timeout=10.0
                )
                if response.status_code == 200:
                    data = response.json()
                    return data["candidates"][0]["content"]["parts"][0]["text"]
            except Exception as e:
                return f"[ERROR] Failed to query Gemini engine: {str(e)}"
                
        return f"[MOCK REWRITE] Rewritten: {text[:60]}..."

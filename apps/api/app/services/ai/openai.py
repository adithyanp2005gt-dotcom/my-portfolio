import httpx
from .base import BaseAiService
from ...config.settings import settings

class OpenAiService(BaseAiService):
    def __init__(self):
        self.api_key = settings.AI_API_KEY
        self.api_url = "https://api.openai.com/v1/chat/completions"

    async def generate_summary(self, text: str) -> str:
        if not self.api_key:
            return f"[MOCK SUMMARY] (OpenAI Key Missing): Summary of: {text[:60]}..."
            
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a professional engineering assistant."},
                {"role": "user", "content": f"Summarize this project details in one concise paragraph: {text}"}
            ]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.api_url, headers=headers, json=payload, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
            except Exception as e:
                return f"[ERROR] Failed to query OpenAI engine: {str(e)}"
                
        return f"[MOCK SUMMARY] Summary of: {text[:60]}..."

    async def rewrite_text(self, text: str) -> str:
        if not self.api_key:
            return f"[MOCK REWRITE] (OpenAI Key Missing): Rewritten: {text[:60]}..."
            
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.api_key}"
        }
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {"role": "system", "content": "You are a professional technical editor. Speak in a calm, minimal tone."},
                {"role": "user", "content": f"Rewrite this technical description to improve clarity and precision: {text}"}
            ]
        }
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(self.api_url, headers=headers, json=payload, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    return data["choices"][0]["message"]["content"]
            except Exception as e:
                return f"[ERROR] Failed to query OpenAI engine: {str(e)}"
                
        return f"[MOCK REWRITE] Rewritten: {text[:60]}..."

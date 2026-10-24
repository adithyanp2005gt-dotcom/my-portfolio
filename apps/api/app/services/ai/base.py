from abc import ABC, abstractmethod

class BaseAiService(ABC):
    @abstractmethod
    async def generate_summary(self, text: str) -> str:
        """
        Generate a concise engineering summary of the provided details.
        """
        pass

    @abstractmethod
    async def rewrite_text(self, text: str) -> str:
        """
        Improve technical writing tone and clarity of description.
        """
        pass

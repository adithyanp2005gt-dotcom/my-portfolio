from datetime import datetime
from typing import Optional
from sqlmodel import Field, SQLModel

class ResearchLog(SQLModel, table=True):
    __tablename__ = "research"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(nullable=False)
    status: str = Field(default="research") # research | design | development | testing | completed | paused
    progress: int = Field(default=0)
    notes: str = Field(nullable=False)
    category: str = Field(nullable=False)
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

from beanie import Document, Indexed, Link
from typing import Optional, List, Dict
from datetime import datetime
from .candidate import Candidate
from pydantic import BaseModel

class TranscriptEntry(BaseModel):
    question: str
    answer: str

class Interview(Document):
    candidate: Optional[Link[Candidate]] = None
    interview_date: datetime
    name: Optional[str] = None
    position: Optional[str] = None
    email: Optional[str] = None
    chat_transcript: List[Dict[str, str]] = []
    summary: Optional[str] = None
    technical_score: Optional[float] = None
    communication_score: Optional[float] = None
    confidence_score: Optional[float] = None
    overall_score: Optional[float] = None
    strengths: List[str] = []
    areas_of_improvement: List[str] = []
    status: str = "pending"  # pending, completed, cancelled
    created_at: datetime = datetime.utcnow()
    updated_at: datetime = datetime.utcnow()
    
    class Settings:
        name = "interviews"
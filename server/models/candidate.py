from beanie import Document
from typing import Optional, List, Any
from datetime import datetime

class Candidate(Document):
    email: Optional[str] = None
    name: Optional[Any] = None
    phone: Optional[Any] = None
    position: Optional[str] = None
    resume_link: Optional[Any] = None
    experience: Optional[Any] = None
    score: Optional[Any] = None
    linkedin_profile_score: Optional[Any] = None
    questions: Optional[List[str]] = []
    remarks: Optional[str] = None
    status: Optional[str] = "pending"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Settings:
        name = "candidates"
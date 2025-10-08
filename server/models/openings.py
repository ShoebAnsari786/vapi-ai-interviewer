from beanie import Document
from typing import Optional, Any, List
from datetime import datetime

class Openings(Document):
    slug: Optional[Any] = None
    questions: Optional[List[Any]] = []
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Settings:
        name = "openings"
from fastapi import HTTPException
from models.candidate import Candidate
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr, HttpUrl, Field

class CandidateCreate(BaseModel):
    email: EmailStr
    name: str
    phone: int = Field(..., ge=1000000000, le=9999999999)
    position: str
    resume_link: HttpUrl
    experience: float = Field(..., ge=0)
    score: float = Field(..., ge=0, le=100)
    linkedin_profile_score: float = Field(..., ge=0, le=100)
    questions: List[str] = []
    remarks: str
    status: str = Field(default="pending", pattern="^(pending|approved|rejected)$")

async def get_candidates() -> List[Candidate]:
    """
    Fetch all candidates from the database
    """
    try:
        candidates = await Candidate.find_all().to_list()
        return candidates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def get_candidate_by_id(candidate_id: str) -> Candidate:
    """
    Fetch a specific candidate by ID
    """
    try:
        candidate = await Candidate.get(candidate_id)
        if not candidate:
            raise HTTPException(status_code=404, detail="Candidate not found")
        return candidate
    except Exception as e:
        if "Candidate not found" in str(e):
            raise HTTPException(status_code=404, detail="Candidate not found")
        raise HTTPException(status_code=500, detail=str(e))

async def create_candidate(candidate_data: CandidateCreate) -> Candidate:
    try:
        # Check if candidate with same email already exists
        existing_candidate = await Candidate.find_one({"email": candidate_data.email})
        # if existing_candidate:
        #     raise HTTPException(status_code=400, detail="Candidate with this email already exists")
        
        # Create new candidate
        candidate = Candidate(
            email=candidate_data.email,
            name=candidate_data.name,
            phone=candidate_data.phone,
            position=candidate_data.position,
            resume_link=candidate_data.resume_link,
            experience=candidate_data.experience,
            score=candidate_data.score,
            linkedin_profile_score=candidate_data.linkedin_profile_score,
            questions=candidate_data.questions,
            remarks=candidate_data.remarks,
            status=candidate_data.status,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save to database
        await candidate.insert()
        return candidate
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

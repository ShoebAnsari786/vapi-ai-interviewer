from fastapi import APIRouter, HTTPException, Path
from typing import List
from controllers.candidate_controller import create_candidate, get_candidates, get_candidate_by_id, CandidateCreate
from models.candidate import Candidate

router = APIRouter()

@router.get("/", response_model=List[Candidate])
async def list_candidates():
    """
    Get all candidates
    """
    return await get_candidates()

@router.post("/", response_model=Candidate)
async def add_candidate(candidate_data: CandidateCreate):
    """
    Create a new candidate
    """
    return await create_candidate(candidate_data)

@router.get("/{candidate_id}", response_model=Candidate)
async def get_candidate(
    candidate_id: str = Path(..., title="The ID of the candidate to get")
):
    """
    Get a specific candidate by ID
    """
    return await get_candidate_by_id(candidate_id)

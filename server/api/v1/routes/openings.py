from fastapi import APIRouter, HTTPException
from controllers.opening_controller import (
    create_opening,
    update_opening_by_slug,
    get_questions_by_slug,
    OpeningCreate
)
from models.openings import Openings
from typing import List

router = APIRouter()

@router.post("/", response_model=Openings)
async def add_opening(opening_data: OpeningCreate):
    """
    Create a new job opening
    """
    return await create_opening(opening_data)

@router.put("/{slug}", response_model=Openings)
async def update_opening(slug: str, opening_data: OpeningCreate):
    """
    Update a job opening by slug
    """
    return await update_opening_by_slug(slug, opening_data)

@router.get("/{slug}/questions")
async def get_opening_questions(slug: str):
    """
    Get questions for a specific job opening by slug
    """
    return await get_questions_by_slug(slug)
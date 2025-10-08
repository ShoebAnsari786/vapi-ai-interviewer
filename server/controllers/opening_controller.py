from fastapi import HTTPException
from models.openings import Openings
from typing import Optional, Any, List
from datetime import datetime
from pydantic import BaseModel

class OpeningCreate(BaseModel):
    slug: Optional[Any] = None
    questions: Optional[List[Any]] = []

async def create_opening(opening_data: OpeningCreate) -> Openings:
    try:
        # Create new opening
        opening = Openings(
            slug=opening_data.slug,
            questions=opening_data.questions,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )
        
        # Save to database
        await opening.insert()
        return opening
        
    except Exception as e:
        print(f"Error creating opening: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))

async def update_opening_by_slug(slug: str, opening_data: OpeningCreate):
    try:
        # Find opening by slug
        opening = await Openings.find_one({"slug": slug})
        if not opening:
            raise HTTPException(status_code=404, detail="Opening not found")
        
        # Update fields
        if opening_data.questions is not None:
            opening.questions = opening_data.questions
        
        opening.updated_at = datetime.utcnow()
        await opening.save()
        return opening
    except Exception as e:
        print(f"Error updating opening: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))

async def get_questions_by_slug(slug: str) -> dict:
    try:
        # Find opening by slug
        opening = await Openings.find_one({"slug": slug})
        if not opening:
            raise HTTPException(status_code=404, detail="Opening not found")
        
        # Return questions
        return {
            "slug": opening.slug,
            "questions": opening.questions
        }
    except Exception as e:
        print(f"Error getting questions: {str(e)}")  # Add logging
        raise HTTPException(status_code=500, detail=str(e))
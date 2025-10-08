from fastapi import APIRouter
from .routes.interviews import router as interview_router
from .routes.candidates import router as candidate_router
from .routes.openings import router as opening_router

router = APIRouter()

# Include routes from different modules
router.include_router(interview_router, prefix="/interviews", tags=["interviews"])
router.include_router(candidate_router, prefix="/candidates", tags=["candidates"])
router.include_router(opening_router, prefix="/openings", tags=["openings"])

@router.get("/")
async def root():
    return {"message": "Welcome to EcoHire API v1"}
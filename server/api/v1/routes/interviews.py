from fastapi import APIRouter
from controllers.interview_controller import InterviewController, InterviewSummaryRequest

router = APIRouter()

@router.post("/summarize-interview")
async def summarize_interview(data: InterviewSummaryRequest):
    """
    Summarize interview and store results
    """
    return await InterviewController.summarize_interview(data)

@router.get("/")
async def get_interviews():
    """
    Get all interviews
    """
    return await InterviewController.get_interviews()

@router.get("/{interview_id}")
async def get_interview(interview_id: str):
    """
    Get interview by ID
    """
    return await InterviewController.get_interview_by_id(interview_id)
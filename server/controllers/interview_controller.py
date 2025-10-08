from typing import List, Dict, Any
from services.ai_service import ai_service
from fastapi import HTTPException
from models.interview import Interview
from datetime import datetime
from pydantic import BaseModel

class InterviewSummaryRequest(BaseModel):
    chat_transcript: List[Dict[str, str]]
    name: str
    position: str

class InterviewController:
    @staticmethod
    async def get_interviews() -> List[Dict[str, Any]]:
        """
        Fetch all interviews from the database
        
        Returns:
            List of interview records with their details
        """
        try:
            # Fetch all interviews and sort by created_at in descending order
            interviews = await Interview.find().sort("-created_at").to_list()
            
            # Convert interviews to dict and format dates
            return [
                {
                    "id": str(interview.id),
                    "name": interview.name,
                    "position": interview.position,
                    "interview_date": interview.interview_date.isoformat(),
                    "technical_score": interview.technical_score,
                    "communication_score": interview.communication_score,
                    "confidence_score": interview.confidence_score,
                    "overall_score": interview.overall_score,
                    "summary": interview.summary,
                    "strengths": interview.strengths,
                    "areas_of_improvement": interview.areas_of_improvement,
                    "status": interview.status,
                    "created_at": interview.created_at.isoformat(),
                    "updated_at": interview.updated_at.isoformat()
                }
                for interview in interviews
            ]
            
        except Exception as e:
            print(f"Error in get_interviews: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch interviews: {str(e)}"
            )

    @staticmethod
    async def get_interview_by_id(interview_id: str) -> Dict[str, Any]:
        """
        Fetch a specific interview by ID
        
        Args:
            interview_id: The ID of the interview to fetch
            
        Returns:
            Interview record with all details
            
        Raises:
            HTTPException: If interview not found or other errors occur
        """
        try:
            # Convert string ID to ObjectId and fetch interview
            interview = await Interview.get(interview_id)
            
            if not interview:
                raise HTTPException(
                    status_code=404,
                    detail=f"Interview with ID {interview_id} not found"
                )
            
            # Convert to dict and format dates
            return {
                "id": str(interview.id),
                "name": interview.name,
                "position": interview.position,
                "interview_date": interview.interview_date.isoformat(),
                "technical_score": interview.technical_score,
                "communication_score": interview.communication_score,
                "confidence_score": interview.confidence_score,
                "overall_score": interview.overall_score,
                "summary": interview.summary,
                "strengths": interview.strengths,
                "areas_of_improvement": interview.areas_of_improvement,
                "status": interview.status,
                "chat_transcript": interview.chat_transcript,
                "created_at": interview.created_at.isoformat(),
                "updated_at": interview.updated_at.isoformat()
            }
            
        except HTTPException as he:
            raise he
        except Exception as e:
            print(f"Error in get_interview_by_id: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to fetch interview: {str(e)}"
            )

    @staticmethod
    async def summarize_interview(data: InterviewSummaryRequest) -> Dict[str, Any]:
        """
        Process interview chat history and generate AI assessment
        
        Args:
            data: InterviewSummaryRequest containing chat history and candidate info
            
        Returns:
            Dict containing assessment with ratings, strengths, and areas of improvement
        """
        try:
            # Get AI assessment
            assessment = await ai_service.summarize_interview(data.chat_transcript)
            
            # Create interview record
            interview = Interview(
                name=data.name,
                position=data.position,
                interview_date=datetime.utcnow(),
                chat_transcript=data.chat_transcript,  # Store complete transcript
                summary=assessment["remark"],
                technical_score=assessment["ratings"]["technical"],
                communication_score=assessment["ratings"]["communication"],
                confidence_score=assessment["ratings"]["confidence"],
                overall_score=assessment["ratings"]["overall"],
                strengths=assessment["strengths"],
                areas_of_improvement=assessment["areas_of_improvement"],
                status="completed",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            
            # Save to database
            await interview.insert()

            # Return the assessment with interview ID
            return {
                **assessment,
                "interview_id": str(interview.id)
            }

        except Exception as e:
            print(f"Error in summarize_interview: {str(e)}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to analyze interview: {str(e)}"
            )
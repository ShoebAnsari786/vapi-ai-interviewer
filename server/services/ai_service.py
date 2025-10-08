from google import genai
from typing import Dict, Any, List
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# Initialize Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable is not set")

# The client gets the API key from the environment variable
client = genai.Client()

class AIService:
    def __init__(self):
        pass
    
    async def summarize_interview(self, chat_history: List[Dict[str, str]]) -> Dict[str, Any]:
        """
        Analyze interview chat history and provide structured assessment
        
        Args:
            chat_history: List of chat messages with role and content
            
        Returns:
            Dict containing ratings, strengths, areas of improvement, and remarks
        """
        try:
            # Create a prompt from the chat history
            prompt = self._create_analysis_prompt(chat_history)
            
            # Generate response using the client
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=[{
                    "role": "user",
                    "parts": [{"text": prompt}]
                }]
            )
            
            # Print raw response for debugging
            print("Raw AI Response:", response.text)
            
            # Parse the response into structured format
            try:
                # Clean the response text to ensure it's valid JSON
                cleaned_text = self._clean_response_text(response.text)
                assessment = json.loads(cleaned_text)
                
                # Validate the response structure
                if self._validate_assessment(assessment):
                    return assessment
                else:
                    return self._create_default_assessment("Invalid assessment structure")
                
            except json.JSONDecodeError as e:
                print(f"JSON Parse Error: {str(e)}")
                return self._create_default_assessment("Failed to parse AI response")
            
        except Exception as e:
            print(f"Error in AI analysis: {str(e)}")
            return self._create_default_assessment(f"Error: {str(e)}")
    
    def _create_analysis_prompt(self, chat_history: List[Dict[str, str]]) -> str:
        """
        Create a structured prompt for the AI model to analyze the interview
        """
        # Convert chat history to readable format
        conversation = "\n".join([
            f"{msg['role'].upper()}: {msg['content']}"
            for msg in chat_history
        ])
        
        return f"""You are an expert interviewer. Analyze the following interview conversation and provide a structured assessment.
Your response must be in valid JSON format exactly as shown in the template below.
Do not include any additional text or explanations outside the JSON structure.

CONVERSATION:
{conversation}

RESPONSE TEMPLATE (fill in the values, keep the exact structure):
{{
    "ratings": {{
        "technical": 0,
        "communication": 0,
        "confidence": 0,
        "overall": 0
    }},
    "strengths": [],
    "areas_of_improvement": [],
    "remark": ""
}}

RULES:
1. Technical, communication, and confidence scores must be between 0-10
2. Overall score must be between 0-100
3. Strengths and areas_of_improvement must be arrays of strings
4. Remark must be a single string with overall assessment
5. Response must be valid JSON only, no other text"""

    def _clean_response_text(self, text: str) -> str:
        """Clean the response text to ensure it's valid JSON"""
        # Try to find JSON content between curly braces
        try:
            start = text.index("{")
            end = text.rindex("}") + 1
            return text[start:end]
        except ValueError:
            return "{}"
    
    def _validate_assessment(self, assessment: Dict[str, Any]) -> bool:
        """Validate the assessment structure and values"""
        try:
            ratings = assessment.get("ratings", {})
            
            # Check if all required fields exist
            required_fields = {
                "ratings": dict,
                "strengths": list,
                "areas_of_improvement": list,
                "remark": str
            }
            
            for field, field_type in required_fields.items():
                if field not in assessment or not isinstance(assessment[field], field_type):
                    print(f"Missing or invalid field: {field}")
                    return False
            
            # Validate rating values
            for key in ["technical", "communication", "confidence"]:
                if not isinstance(ratings.get(key, 0), (int, float)) or not 0 <= ratings.get(key, 0) <= 10:
                    print(f"Invalid rating value for {key}")
                    return False
            
            if not isinstance(ratings.get("overall", 0), (int, float)) or not 0 <= ratings.get("overall", 0) <= 100:
                print("Invalid overall rating value")
                return False
            
            return True
            
        except Exception as e:
            print(f"Validation error: {str(e)}")
            return False
    
    def _create_default_assessment(self, error_msg: str) -> Dict[str, Any]:
        """
        Create a default assessment structure in case of errors
        """
        return {
            "ratings": {
                "technical": 0,
                "communication": 0,
                "confidence": 0,
                "overall": 0
            },
            "strengths": [],
            "areas_of_improvement": [],
            "remark": f"Assessment failed: {error_msg}"
        }

# Create a singleton instance
ai_service = AIService()
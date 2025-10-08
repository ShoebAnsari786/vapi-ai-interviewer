from motor.motor_asyncio import AsyncIOMotorClient
from beanie import init_beanie
import os
from dotenv import load_dotenv
from typing import Optional
from contextlib import asynccontextmanager

# Load environment variables
load_dotenv()

# MongoDB configuration
MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME")

# MongoDB Client
client: Optional[AsyncIOMotorClient] = None

async def init_db():
    """Initialize database connection"""
    global client
    
    try:
        # Create motor client
        client = AsyncIOMotorClient(MONGODB_URL)
        
        # Import your document models here
        from models.candidate import Candidate
        from models.interview import Interview
        from models.openings import Openings
        
        # Initialize beanie with the document models
        await init_beanie(
            database=client[DATABASE_NAME],
            document_models=[
                Candidate,
                Interview,
                Openings
            ]
        )
        
        print("Connected to MongoDB successfully!")
        
    except Exception as e:
        print(f"Failed to connect to MongoDB: {str(e)}")
        raise e

async def close_db():
    """Close database connection"""
    global client
    if client is not None:
        client.close()
        print("MongoDB connection closed.")

# Database connection context manager
@asynccontextmanager
async def get_db():
    """Get database session"""
    try:
        yield client[DATABASE_NAME]
    except Exception as e:
        print(f"Database error: {str(e)}")
        raise
    finally:
        # Connection will be closed by the client when needed
        pass
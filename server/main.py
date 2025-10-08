from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.database import init_db, close_db

# Create startup and shutdown event handler
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB connection
    await init_db()
    yield
    # Shutdown: Close DB connection
    await close_db()

# Initialize FastAPI app with lifespan
app = FastAPI(
    title="EcoHire API",
    description="AI-powered candidate screening API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Import and include routers
from api.v1.router import router as v1_router
app.include_router(v1_router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}
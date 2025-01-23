from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings
from sqlmodel import Session
from app.core.db import engine, init_db

# Import routers
from app.routes import (
    client,
    csv
) 

# Initialize database
with Session(engine) as session:
    init_db(session)

# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    openapi_url="/v1/openapi.json",  # OpenAPI schema URL
    docs_url=settings.DOCS_URL  # Swagger documentation URL
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # Allow all origins (adjust for production)
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"]   # Allow all headers
)

# API Router
api_router = APIRouter()

# Include routers (uncomment when adding routes)
api_router.include_router(client.router, prefix="/client", tags=["Client"])
api_router.include_router(csv.router, prefix="/csv", tags=["CSV"])

# Register API Router with prefix
app.include_router(api_router, prefix="/v1")

# Root route
@app.get("/")
async def root():
    return {"Phoenix": "API"}

# Health check route
@app.get("/health")
async def health_check():
    return {"status": 200}
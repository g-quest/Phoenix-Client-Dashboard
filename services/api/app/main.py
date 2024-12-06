from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from starlette.middleware.cors import CORSMiddleware
from app.core.config import settings

# Initialize FastAPI app
app = FastAPI(
    title=settings.app_name,
    openapi_url="/v1/openapi.json",  # OpenAPI schema URL
    docs_url=settings.docs_url  # Swagger documentation URL
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
# api_router.include_router(data_load.router, prefix="/data-load", tags=["Data Loaders"])

# Register API Router with prefix
app.include_router(api_router, prefix="/v1")

# Root route
@app.get("/")
async def root():
    return {"phoenix": "API"}

# Health check route
@app.get("/health")
async def health_check():
    return {"status": 200}
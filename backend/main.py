from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, tasks, departments, submissions, stats
import os

app = FastAPI(
    title="Task Management API",
    description="업무 일감 관리 시스템 API",
    version="2.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json"
)

# CORS configuration
origins = [
    "http://localhost:3000",  # Local development
    "http://localhost:3001",
    os.getenv("FRONTEND_URL", ""),  # Production frontend URL
]

# Add all non-empty origins
origins = [origin for origin in origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins + ["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")
app.include_router(departments.router, prefix="/api")
app.include_router(submissions.router, prefix="/api")
app.include_router(stats.router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint"""
    return {"message": "Task Management API", "version": "2.0.0"}


@app.get("/api")
async def api_root():
    """API root endpoint"""
    return {
        "message": "Task Management API is running!",
        "version": "2.0.0",
        "docs": "/api/docs",
        "endpoints": {
            "auth": "/api/auth",
            "tasks": "/api/tasks",
            "departments": "/api/departments",
            "submissions": "/api/submissions",
            "stats": "/api/stats",
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "task-management-api"}


if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 3001))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

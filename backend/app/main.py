from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.db import engine, Base
from app.models import models  # Make sure this imports all your models so tables are registered
from app.api import user
import app.utils.firebase


# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(
    title="Quizzy Backend",
    description="Backend services for the Quizzy application.",
    version="1.0.0"
)

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Or your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the API router from api/user.py
app.include_router(user.router)

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}

# Example root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Quizzy Backend!"}
from fastapi import FastAPI
from app.db.db import engine, Base
from app.models import models  # Make sure this imports all your models so tables are registered

# Create all tables in the database
Base.metadata.create_all(bind=engine)

# Initialize FastAPI app
app = FastAPI(title="Quizzy Backend")

# Health check endpoint
@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}

# Example root endpoint
@app.get("/")
def root():
    return {"message": "Welcome to Quizzy Backend!"}
from pydantic import BaseModel, EmailStr
from datetime import datetime

# --- Schema for incoming Firebase ID token ---
class TokenRequest(BaseModel):
    token: str

# --- Base schema for user data ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

# --- Schema for creating a new user (matches your /signup endpoint) ---
class UserCreate(UserBase):
    password: str

# This matches the response_model in your /signup endpoint
class SignUpResponse(BaseModel):
    success: bool
    message: str
    user_id: int

# --- Schema for returning user data from the DB ---
class UserResponse(UserBase):
    id: int
    firebase_uid: str
    tier: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True # Enables mapping from SQLAlchemy models
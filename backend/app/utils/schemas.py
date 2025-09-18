from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# Schema for the user signup request body.
# We've added the username field.
class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, description="Username must be between 3 and 50 characters")
    email: EmailStr
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters long")

# Schema for the successful signup response.
# The user_id will now be an integer to match your database model.
class SignUpResponse(BaseModel):
    success: bool
    message: str
    user_id: Optional[int] = None
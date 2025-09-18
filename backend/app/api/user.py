from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from firebase_admin import auth

from app.db.db import get_db
from app.services import user_service
from app.utils import schemas

router = APIRouter(prefix="/users", tags=["users"])

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}

@router.post("/signup", response_model=schemas.SignUpResponse, status_code=status.HTTP_201_CREATED)
def signup(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """
    Handles new user registration, now including a username:
    1. Checks if a user with the email OR username already exists.
    2. Creates the user in Firebase, using the username as the display_name.
    3. Stores the new user's details in the PostgreSQL database.
    """
    # Check for existing user by email or username
    existing_user = user_service.get_user_by_email_or_username(
        db, email=user_data.email, username=user_data.username
    )
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A user with this email or username already exists."
        )

    # Create user in Firebase, including the display_name
    try:
        firebase_user = auth.create_user(
            email=user_data.email,
            password=user_data.password,
            display_name=user_data.username
        )
    except auth.EmailAlreadyExistsError:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists in Firebase."
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during Firebase user creation: {e}"
        )

    # Create user in local DB
    new_local_user = user_service.create_db_user(
        db=db,
        username=user_data.username,
        email=firebase_user.email,
        firebase_uid=firebase_user.uid
    )

    return schemas.SignUpResponse(
        success=True,
        message="Registration successful",
        user_id=new_local_user.id
    )
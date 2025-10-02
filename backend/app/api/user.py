import os
from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from firebase_admin import auth

from app.db.db import get_db
from app.services import user_service
from app.utils import schemas
from app.utils.firebase import verify_firebase_token
from app.utils.security import create_access_token
from datetime import timedelta
from app.models.models import User

router = APIRouter(prefix="/users", tags=["users"])
# Load environment variables from .env file
load_dotenv()

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

@router.post("/login")
def login(token_request: schemas.TokenRequest, response: Response, db: Session = Depends(get_db)):
    """
    Handles user login by verifying a Firebase ID token and setting a session cookie.
    """
    try:
        firebase_user = verify_firebase_token(token_request.token)
        firebase_uid = firebase_user["uid"]
        user_email = firebase_user.get("email")
        user_name = firebase_user.get("name", user_email.split('@')[0]) # Use Google name if available

        if not user_email:
             raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No email associated with this Firebase account."
            )

        db_user = user_service.get_user_by_firebase_uid(db, firebase_uid=firebase_uid)
        
        if not db_user:
            # --- THIS IS THE FIX ---
            # Call create_db_user with separate keyword arguments (username, email)
            # instead of a single user_data object.
            db_user = user_service.create_db_user(
                db=db, 
                username=user_name, 
                email=user_email, 
                firebase_uid=firebase_uid
            )

        access_token_expires = timedelta(minutes=60)
        access_token = create_access_token(
            data={"sub": str(db_user.id)}, expires_delta=access_token_expires
        )
        
        is_production = os.getenv("ENVIRONMENT") == "production"

        response.set_cookie(
            key="access_token",
            value=f"Bearer {access_token}",
            httponly=True,
            samesite="lax",
            secure=is_production, # Dynamically set secure flag
            max_age=3600
        )
        return {"status": "success", "user_id": db_user.id}

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An unexpected error occurred: {e}",
        )

@router.post("/logout")
def logout(response: Response):
    """
    Clears the httpOnly session cookie from the user's browser.
    """
    response.delete_cookie(key="access_token")
    return {"status": "success", "message": "Successfully logged out"}
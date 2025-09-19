from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models import models
from app.utils import schemas

def get_user_by_email_or_username(db: Session, email: str, username: str):
    """
    Finds a user by their email OR their username.
    Used by the /signup endpoint to check for duplicates.
    """
    return db.query(models.User).filter(
        or_(models.User.email == email, models.User.username == username)
    ).first()

def get_user_by_firebase_uid(db: Session, firebase_uid: str):
    """
    Finds a user by their unique Firebase UID.
    Used by the /login endpoint.
    """
    return db.query(models.User).filter(models.User.firebase_uid == firebase_uid).first()

def get_user_by_id(db: Session, user_id: int):
    """
    Finds a user by their primary key ID.
    Used by protected routes like /users/me.
    """
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_db_user(db: Session, username: str, email: str, firebase_uid: str):
    """
    Creates a new user record in the local PostgreSQL database.
    This is called by both /signup and /login (if the user doesn't exist locally).
    """
    db_user = models.User(
        email=email,
        username=username,
        firebase_uid=firebase_uid
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


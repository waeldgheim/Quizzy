from sqlalchemy.orm import Session
from app.models import models

def get_user_by_email_or_username(db: Session, email: str, username: str):
    """
    Retrieves a user from the database by their email OR username to prevent duplicates.
    """
    return db.query(models.User).filter(
        (models.User.email == email) | (models.User.username == username)
    ).first()

def create_db_user(db: Session, username: str, email: str, firebase_uid: str):
    """
    Creates a new user record in the database, now including the username.
    """
    db_user = models.User(
        username=username,
        email=email,
        firebase_uid=firebase_uid
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


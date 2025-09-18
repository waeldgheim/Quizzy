# app/utils/firebase.py
import os
import firebase_admin
from firebase_admin import auth, credentials
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize Firebase Admin SDK
SERVICE_ACCOUNT_KEY_PATH = os.getenv("SERVICE_ACCOUNT_KEY_PATH")
cred = credentials.Certificate(SERVICE_ACCOUNT_KEY_PATH)
firebase_admin.initialize_app(cred)

def verify_firebase_token(id_token: str):
    """
    Verifies a Firebase ID token.
    Returns the decoded token payload (which includes uid, email, etc.) if valid.
    Raises a ValueError if the token is invalid or expired.
    """
    if not firebase_admin._apps:
        raise ConnectionError("Firebase Admin SDK not initialized.")

    try:
        decoded_token = auth.verify_id_token(id_token)
        return decoded_token
    except Exception as e:
        # Catch specific Firebase errors for better feedback if needed
        raise ValueError(f"Invalid or expired Firebase token: {e}")

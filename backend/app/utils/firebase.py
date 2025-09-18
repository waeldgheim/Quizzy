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

def verify_token(id_token: str):
    """
    Verifies a Firebase ID token
    Returns user UID if valid, raises error if invalid
    """
    decoded_token = auth.verify_id_token(id_token)
    uid = decoded_token["uid"]
    return uid

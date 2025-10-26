from fastapi import APIRouter, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import bcrypt
import secrets
from datetime import datetime, timedelta, timezone
import os
from dotenv import load_dotenv
import requests

load_dotenv()

from models.user import (
    User, UserSession, SignUpRequest, SignInRequest,
    UpdateProfileRequest, ChangePasswordRequest,
    UpdatePreferencesRequest, UpdateSettingsRequest
)

router = APIRouter()

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
client = MongoClient(MONGO_URL)
db = client.get_database("travea_db")
users_collection = db.users
sessions_collection = db.user_sessions


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def create_session(user_id: str) -> str:
    """Create a new session for a user"""
    session_token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=7)
    
    session = UserSession(
        user_id=user_id,
        session_token=session_token,
        expires_at=expires_at
    )
    
    sessions_collection.insert_one(session.dict())
    return session_token


def get_user_from_session(session_token: str) -> User | None:
    """Get user from session token"""
    session = sessions_collection.find_one({
        "session_token": session_token,
        "expires_at": {"$gt": datetime.now(timezone.utc)}
    })
    
    if not session:
        return None
    
    user_doc = users_collection.find_one({"_id": session["user_id"]})
    if not user_doc:
        return None
    
    user_doc["id"] = user_doc.pop("_id")
    return User(**user_doc)


def get_session_token_from_request(request: Request) -> str | None:
    """Extract session token from cookie or Authorization header"""
    # Check cookie first
    token = request.cookies.get("session_token")
    if token:
        return token
    
    # Check Authorization header
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        return auth_header.split(" ")[1]
    
    return None


@router.post("/signup")
async def signup(data: SignUpRequest, response: Response):
    """Sign up with email and password"""
    # Check if user already exists
    existing_user = users_collection.find_one({"email": data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = f"user_{secrets.token_urlsafe(16)}"
    user = User(
        id=user_id,
        email=data.email,
        name=data.name,
        password_hash=hash_password(data.password),
        auth_provider="email"
    )
    
    # Save to database
    user_dict = user.dict(by_alias=True)
    users_collection.insert_one(user_dict)
    
    # Create session
    session_token = create_session(user_id)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60  # 7 days
    )
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "onboarding_completed": user.onboarding_completed
        },
        "session_token": session_token
    }


@router.post("/signin")
async def signin(data: SignInRequest, response: Response):
    """Sign in with email and password"""
    # Find user
    user_doc = users_collection.find_one({"email": data.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    user_doc["id"] = user_doc.pop("_id")
    user = User(**user_doc)
    
    # Verify password
    if not user.password_hash or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Create session
    session_token = create_session(user.id)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "onboarding_completed": user.onboarding_completed,
            "preferences": user.preferences
        },
        "session_token": session_token
    }


@router.get("/session-data")
async def process_oauth_session(request: Request, response: Response):
    """Process Emergent OAuth session_id"""
    session_id = request.headers.get("X-Session-ID")
    if not session_id:
        raise HTTPException(status_code=400, detail="Missing session_id")
    
    # Call Emergent Auth API
    try:
        auth_response = requests.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
        auth_response.raise_for_status()
        oauth_data = auth_response.json()
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"OAuth verification failed: {str(e)}")
    
    # Check if user exists
    user_doc = users_collection.find_one({"email": oauth_data["email"]})
    
    if user_doc:
        # Existing user
        user_doc["id"] = user_doc.pop("_id")
        user = User(**user_doc)
    else:
        # Create new user
        user_id = f"user_{secrets.token_urlsafe(16)}"
        user = User(
            id=user_id,
            email=oauth_data["email"],
            name=oauth_data["name"],
            picture=oauth_data.get("picture"),
            auth_provider="google"
        )
        user_dict = user.dict(by_alias=True)
        users_collection.insert_one(user_dict)
    
    # Create session
    session_token = create_session(user.id)
    
    # Set cookie
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=7 * 24 * 60 * 60
    )
    
    return {
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "picture": user.picture,
            "onboarding_completed": user.onboarding_completed,
            "preferences": user.preferences
        },
        "session_token": session_token
    }


@router.get("/me")
async def get_current_user(request: Request):
    """Get current authenticated user"""
    session_token = get_session_token_from_request(request)
    if not session_token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    user = get_user_from_session(session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session")
    
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "picture": user.picture,
        "home_city": user.home_city,
        "auth_provider": user.auth_provider,
        "onboarding_completed": user.onboarding_completed,
        "preferences": user.preferences,
        "settings": user.settings
    }


@router.post("/logout")
async def logout(request: Request, response: Response):
    """Log out user"""
    session_token = get_session_token_from_request(request)
    if session_token:
        sessions_collection.delete_many({"session_token": session_token})
    
    response.delete_cookie("session_token")
    return {"message": "Logged out successfully"}


@router.put("/profile")
async def update_profile(request: Request, data: UpdateProfileRequest):
    """Update user profile"""
    session_token = get_session_token_from_request(request)
    user = get_user_from_session(session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    update_data = {}
    if data.name:
        update_data["name"] = data.name
    if data.home_city:
        update_data["home_city"] = data.home_city
    
    if update_data:
        update_data["updated_at"] = datetime.now(timezone.utc)
        users_collection.update_one({"_id": user.id}, {"$set": update_data})
    
    return {"message": "Profile updated successfully"}


@router.post("/change-password")
async def change_password(request: Request, data: ChangePasswordRequest):
    """Change user password"""
    session_token = get_session_token_from_request(request)
    user = get_user_from_session(session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    if user.auth_provider != "email":
        raise HTTPException(status_code=400, detail="Cannot change password for OAuth users")
    
    if not user.password_hash or not verify_password(data.current_password, user.password_hash):
        raise HTTPException(status_code=401, detail="Current password is incorrect")
    
    new_hash = hash_password(data.new_password)
    users_collection.update_one(
        {"_id": user.id},
        {"$set": {"password_hash": new_hash, "updated_at": datetime.now(timezone.utc)}}
    )
    
    return {"message": "Password changed successfully"}


@router.put("/preferences")
async def update_preferences(request: Request, data: UpdatePreferencesRequest):
    """Update onboarding preferences"""
    session_token = get_session_token_from_request(request)
    user = get_user_from_session(session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    users_collection.update_one(
        {"_id": user.id},
        {"$set": {
            "preferences": data.preferences,
            "onboarding_completed": True,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    
    return {"message": "Preferences saved successfully"}


@router.put("/settings")
async def update_settings(request: Request, data: UpdateSettingsRequest):
    """Update user settings"""
    session_token = get_session_token_from_request(request)
    user = get_user_from_session(session_token)
    if not user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    users_collection.update_one(
        {"_id": user.id},
        {"$set": {
            "settings": data.settings,
            "updated_at": datetime.now(timezone.utc)
        }}
    )
    
    return {"message": "Settings updated successfully"}

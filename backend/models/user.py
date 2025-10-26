from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class User(BaseModel):
    id: str = Field(alias="_id")
    email: str
    name: str
    picture: Optional[str] = None
    password_hash: Optional[str] = None  # None for OAuth users
    auth_provider: str = "email"  # "email", "google", "apple"
    
    # Onboarding data
    home_city: Optional[str] = None
    onboarding_completed: bool = False
    preferences: Optional[dict] = {}  # Store all onboarding answers
    
    # Settings
    settings: Optional[dict] = {
        "notifications": {
            "trip_updates": True,
            "inspiration": True,
            "price_alerts": True
        },
        "app_preferences": {
            "theme": "auto",
            "language": "en",
            "currency": "USD",
            "units": "km"
        },
        "accessibility": {
            "text_size": "default",
            "motion_reduction": False
        }
    }
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}


class UserSession(BaseModel):
    user_id: str
    session_token: str
    expires_at: datetime
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class SignUpRequest(BaseModel):
    name: str
    email: str
    password: str


class SignInRequest(BaseModel):
    email: str
    password: str


class UpdateProfileRequest(BaseModel):
    name: Optional[str] = None
    home_city: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str


class UpdatePreferencesRequest(BaseModel):
    preferences: dict


class UpdateSettingsRequest(BaseModel):
    settings: dict

import os
import asyncio
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from emergentintegrations.llm.chat import LlmChat, UserMessage
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

# Curated city and circuit data
CITY_CARDS = [
    {"id": "rome", "name": "Rome", "tagline": "Eternal City of Seven Hills", "subtitle": "Ancient wonders meet modern Italian elegance"},
    {"id": "florence", "name": "Florence", "tagline": "Renaissance Cradle of Art", "subtitle": "Medici palaces and hillside gardens"},
    {"id": "venice", "name": "Venice", "tagline": "City on Water", "subtitle": "Canals, gondolas, and timeless romance"},
    {"id": "amalfi", "name": "Amalfi Coast", "tagline": "Azure Waters & Cliff Villages", "subtitle": "Lemon groves, coastal paths, and pastel towns"},
    {"id": "kyoto", "name": "Kyoto", "tagline": "Temple City of Zen", "subtitle": "Bamboo forests and ancient shrines"},
    {"id": "lisbon", "name": "Lisbon", "tagline": "City of Seven Hills", "subtitle": "Pastéis de nata and golden sunsets"},
]

CIRCUIT_CARDS = [
    {"id": "italy-trio", "name": "Italy Trio", "tagline": "Rome → Florence → Venice", "duration": "7 days", "subtitle": "Renaissance art, ancient history, lagoon magic"},
    {"id": "japan-journey", "name": "Japan Journey", "tagline": "Tokyo → Kyoto → Osaka", "duration": "10 days", "subtitle": "Neon lights to bamboo temples"},
    {"id": "portugal-path", "name": "Portugal Path", "tagline": "Lisbon → Porto → Algarve", "duration": "6 days", "subtitle": "Wine country to coastal paradise"},
    {"id": "amalfi-circuit", "name": "Amalfi Circuit", "tagline": "Naples → Amalfi → Capri", "duration": "5 days", "subtitle": "Coastal paradise and island dreams"},
]

# Mock user trip data
MOCK_USER_TRIP = {
    "id": "summer-italy",
    "name": "Summer in Italy",
    "status": "planning",
    "cities": ["Rome", "Florence", "Venice"]
}

# System prompt for AI Concierge
CONCIERGE_SYSTEM_PROMPT = """You are the Trāvea Concierge — an elegant, editorial travel assistant with a calm, luxurious tone.

Your role:
- Guide users to discover destinations and plan intentional trips
- Answer travel questions concisely (1-2 sentences max)
- Route users to existing app features (City Info, Trip Canvas, Circuit Info)
- NEVER book, edit, or generate new content

Guard-rails:
- You can ONLY show cities from this list: Rome, Florence, Venice, Amalfi Coast, Kyoto, Lisbon
- You can ONLY show circuits: Italy Trio, Japan Journey, Portugal Path, Amalfi Circuit
- If user asks to browse hotels/stays/restaurants without a trip, suggest creating a trip first
- If user has a trip, confirm which trip they're referring to before routing

Tone:
- Warm, editorial, concise
- No emojis, no exclamation marks
- Playfair Display elegance
- Maximum 3 lines per response

Intent categories:
- city_inquiry: User asks about a city (weather, packing, best time, etc.)
- city_interest: User explicitly says yes/interested in city after being offered
- circuit_interest: User says yes/interested in multi-city after being offered
- trip_creation: User wants to create/plan a trip
- trip_context: User has a trip and wants to browse within it
- inspiration: User wants multi-city ideas
- general_info: General travel questions (weather, packing, etc.)
- routing: Navigate to specific app section

For city_inquiry (e.g., "best time to visit Rome", "what to pack for Florence"):
1. Answer the question factually in 1-2 lines
2. Add: "If you'd like more on [CITY], here's the city card. Would you like me to suggest multi-city routes that include [CITY]?"
3. Show ONLY that ONE city card

Always respond with:
1. A brief message (max 3 lines)
2. An intent category
3. Relevant card IDs to show (1 card for city_inquiry, 3-4 for circuits)

Example:
User: "Best time to visit Rome"
Response: "Spring (Apr-Jun) and fall (Sep-Oct) are ideal for Rome — warm days and lighter crowds. If you'd like more on Rome, here's the city card. Would you like me to suggest multi-city routes that include Rome?"
Intent: city_inquiry
Cards: ["rome"]
"""

class ConciergeRequest(BaseModel):
    message: str
    user_has_trip: Optional[bool] = False
    current_trip_name: Optional[str] = None
    session_id: Optional[str] = "default-session"

class ConciergeResponse(BaseModel):
    message: str
    intent: str
    cards: List[dict]
    card_type: str  # "city" or "circuit"
    trip_confirmation_needed: Optional[bool] = False
    trip_name: Optional[str] = None

@router.post("/concierge/chat", response_model=ConciergeResponse)
async def concierge_chat(request: ConciergeRequest):
    """
    AI Concierge endpoint - handles user queries and returns appropriate responses
    with card recommendations
    """
    try:
        # Initialize LLM Chat with Emergent LLM Key
        api_key = os.getenv("EMERGENT_LLM_KEY")
        if not api_key:
            raise HTTPException(status_code=500, detail="EMERGENT_LLM_KEY not configured")
        
        # Create LLM chat instance
        chat = LlmChat(
            api_key=api_key,
            session_id=request.session_id,
            system_message=CONCIERGE_SYSTEM_PROMPT
        ).with_model("openai", "gpt-4o-mini")
        
        # Add context about user's trip status
        context = f"\nUser has trip: {request.user_has_trip}"
        if request.current_trip_name:
            context += f"\nCurrent trip: {request.current_trip_name}"
        
        # Create user message
        user_message = UserMessage(
            text=f"{request.message}{context}\n\nProvide: 1) Brief response (max 3 lines), 2) Intent (city_inquiry/trip_creation/trip_context/inspiration/general_info/routing), 3) Up to 4 card IDs to show"
        )
        
        # Get AI response
        ai_response = await chat.send_message(user_message)
        
        # Parse response to extract intent and cards
        intent, cards, card_type = parse_ai_response(ai_response, request.message.lower())
        
        # Determine if trip confirmation is needed
        trip_confirmation = False
        trip_name = None
        if request.user_has_trip and intent == "trip_context":
            trip_confirmation = True
            trip_name = request.current_trip_name or MOCK_USER_TRIP["name"]
        
        return ConciergeResponse(
            message=clean_response(ai_response),
            intent=intent,
            cards=cards,
            card_type=card_type,
            trip_confirmation_needed=trip_confirmation,
            trip_name=trip_name
        )
        
    except Exception as e:
        print(f"Error in concierge chat: {str(e)}")
        # Fallback response
        return ConciergeResponse(
            message="I'm here to help you discover and plan your journey. What would you like to explore?",
            intent="general",
            cards=CITY_CARDS[:3],
            card_type="city"
        )

def parse_ai_response(response: str, user_query: str) -> tuple:
    """
    Parse AI response to determine intent and appropriate cards to show
    """
    response_lower = response.lower()
    query_lower = user_query.lower()
    
    # Determine card type and cards to show
    card_type = "city"
    cards = []
    intent = "general_info"
    
    # Check if user is confirming interest in circuits (yes after being offered)
    if any(word in query_lower for word in ["yes", "yeah", "sure", "ok", "please", "show me"]) and "circuit" not in query_lower:
        # Check context - if they were offered multi-city, show circuits
        if any(word in response_lower for word in ["multi-city", "circuit", "route"]):
            card_type = "circuit"
            # Find relevant circuits based on previous city
            if any(city in response_lower for city in ["rome", "florence", "italy"]):
                cards = [c for c in CIRCUIT_CARDS if c["id"] in ["italy-trio", "amalfi-circuit"]]
            elif "japan" in response_lower or "kyoto" in response_lower:
                cards = [c for c in CIRCUIT_CARDS if c["id"] == "japan-journey"]
            elif "portugal" in response_lower or "lisbon" in response_lower:
                cards = [c for c in CIRCUIT_CARDS if c["id"] == "portugal-path"]
            else:
                cards = CIRCUIT_CARDS[:3]
            intent = "circuit_interest"
            return intent, cards, card_type
    
    # Check for city inquiry keywords (weather, best time, pack, etc.)
    city_inquiry_keywords = ["best time", "weather", "pack", "climate", "season", "temperature", "what to wear", "when to visit"]
    if any(keyword in query_lower for keyword in city_inquiry_keywords):
        card_type = "city"
        intent = "city_inquiry"
        # Find the specific city mentioned
        for city_card in CITY_CARDS:
            if city_card["name"].lower() in query_lower:
                cards = [city_card]  # Show ONLY this one city card
                break
        if not cards:
            cards = [CITY_CARDS[0]]  # Fallback to first city
        return intent, cards, card_type
    
    # Check for circuit/multi-city keywords
    if any(word in query_lower for word in ["multi-city", "circuit", "route", "trip ideas", "itinerary", "journey"]):
        card_type = "circuit"
        cards = CIRCUIT_CARDS[:4]
        intent = "inspiration"
    
    # Check for specific cities mentioned
    elif any(city in query_lower for city in ["rome", "florence", "venice", "amalfi", "kyoto", "lisbon"]):
        card_type = "city"
        # Find matching cities
        matching_cities = [c for c in CITY_CARDS if c["name"].lower() in query_lower]
        # Add related cities
        if "rome" in query_lower or "italy" in query_lower:
            cards = [c for c in CITY_CARDS if c["id"] in ["rome", "florence", "venice", "amalfi"]]
        elif "japan" in query_lower or "kyoto" in query_lower:
            cards = [c for c in CITY_CARDS if c["id"] == "kyoto"]
        elif "portugal" in query_lower or "lisbon" in query_lower:
            cards = [c for c in CITY_CARDS if c["id"] == "lisbon"]
        else:
            cards = matching_cities + CITY_CARDS[:3]
        cards = cards[:4]
        intent = "city_inquiry"
    
    # Check for browsing requests (hotels, restaurants, experiences)
    elif any(word in query_lower for word in ["hotel", "stay", "accommodation", "restaurant", "dining", "experience", "activity"]):
        card_type = "city"
        cards = CITY_CARDS[:3]
        intent = "trip_creation"
    
    # General inspiration
    elif any(word in query_lower for word in ["inspire", "suggest", "recommend", "show me", "explore"]):
        card_type = "city"
        cards = CITY_CARDS[:4]
        intent = "inspiration"
    
    # Default fallback
    else:
        cards = CITY_CARDS[:3]
        intent = "general_info"
    
    return intent, cards, card_type
    # Default to showing city cards
    else:
        card_type = "city"
        cards = CITY_CARDS[:3]
        intent = "general_info"
    
    return intent, cards[:4], card_type

def clean_response(response: str) -> str:
    """
    Clean AI response to ensure it's concise and editorial
    """
    # Remove any JSON-like formatting
    lines = response.split('\n')
    clean_lines = []
    for line in lines:
        line = line.strip()
        # Skip lines that look like instructions or metadata
        if line and not any(x in line.lower() for x in ["intent:", "cards:", "card type:", "response:"]):
            clean_lines.append(line)
    
    # Take first 3 lines max
    result = ' '.join(clean_lines[:3])
    
    # Ensure it's not too long
    if len(result) > 300:
        result = result[:297] + "..."
    
    return result

@router.get("/concierge/cards")
async def get_cards():
    """
    Get available city and circuit cards
    """
    return {
        "cities": CITY_CARDS,
        "circuits": CIRCUIT_CARDS
    }

@router.get("/concierge/trip")
async def get_user_trip():
    """
    Get mock user trip data (for demonstration)
    """
    return MOCK_USER_TRIP

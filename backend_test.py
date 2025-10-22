#!/usr/bin/env python3
"""
Backend Test Suite for AI Concierge API
Tests all endpoints and functionality as specified in the review request
"""

import requests
import json
import os
from typing import Dict, Any

# Get backend URL from environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'https://frosted-journey-1.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

class ConciergeAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        self.test_results.append({
            "test": test_name,
            "status": status,
            "details": details
        })
        print(f"{status}: {test_name}")
        if details:
            print(f"   Details: {details}")
    
    def test_endpoint_accessibility(self):
        """Test 1: Basic endpoint accessibility"""
        try:
            response = requests.post(
                f"{self.base_url}/concierge/chat",
                json={"message": "Hello", "session_id": "test-session"},
                timeout=30
            )
            
            if response.status_code == 200:
                self.log_test("Endpoint Accessibility", True, f"Status: {response.status_code}")
                return True
            else:
                self.log_test("Endpoint Accessibility", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Endpoint Accessibility", False, f"Connection error: {str(e)}")
            return False
    
    def test_basic_functionality(self):
        """Test 2: Basic functionality with simple query"""
        try:
            payload = {
                "message": "Show me destinations in Italy",
                "user_has_trip": False,
                "session_id": "test-session"
            }
            
            response = requests.post(
                f"{self.base_url}/concierge/chat",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["message", "intent", "cards", "card_type"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Basic Functionality - Response Structure", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Check message is concise (max 3 lines)
                message_lines = data["message"].count('\n') + 1
                if message_lines > 3:
                    self.log_test("Basic Functionality - Message Length", False, f"Message has {message_lines} lines, max 3 expected")
                else:
                    self.log_test("Basic Functionality - Message Length", True, f"Message has {message_lines} lines")
                
                # Check cards are returned
                if len(data["cards"]) > 0:
                    self.log_test("Basic Functionality - Cards Returned", True, f"Returned {len(data['cards'])} cards")
                else:
                    self.log_test("Basic Functionality - Cards Returned", False, "No cards returned")
                
                self.log_test("Basic Functionality", True, f"Response: {data['message'][:100]}...")
                return True
                
            else:
                self.log_test("Basic Functionality", False, f"Status: {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Basic Functionality", False, f"Error: {str(e)}")
            return False
    
    def test_intent_detection(self):
        """Test 3: Intent detection for different query types"""
        test_cases = [
            {
                "query": "Tell me about Rome",
                "expected_intent": "city_inquiry",
                "description": "City inquiry"
            },
            {
                "query": "Show me multi-city trip ideas",
                "expected_intent": "inspiration",
                "description": "Multi-city/circuit inquiry"
            },
            {
                "query": "I want to browse hotels in Florence",
                "expected_intent": "trip_creation",
                "description": "Trip creation"
            },
            {
                "query": "Inspire me with destinations",
                "expected_intent": "inspiration",
                "description": "Inspiration request"
            }
        ]
        
        all_passed = True
        
        for case in test_cases:
            try:
                payload = {
                    "message": case["query"],
                    "user_has_trip": False,
                    "session_id": "test-session"
                }
                
                response = requests.post(
                    f"{self.base_url}/concierge/chat",
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    actual_intent = data.get("intent", "")
                    
                    if actual_intent == case["expected_intent"]:
                        self.log_test(f"Intent Detection - {case['description']}", True, f"Expected: {case['expected_intent']}, Got: {actual_intent}")
                    else:
                        self.log_test(f"Intent Detection - {case['description']}", False, f"Expected: {case['expected_intent']}, Got: {actual_intent}")
                        all_passed = False
                else:
                    self.log_test(f"Intent Detection - {case['description']}", False, f"HTTP {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Intent Detection - {case['description']}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_card_recommendations(self):
        """Test 4: Card recommendations and limits"""
        test_cases = [
            {
                "query": "Show me cities in Italy",
                "expected_card_type": "city",
                "description": "City cards for Italy query"
            },
            {
                "query": "Show me multi-city routes",
                "expected_card_type": "circuit",
                "description": "Circuit cards for multi-city query"
            }
        ]
        
        all_passed = True
        
        for case in test_cases:
            try:
                payload = {
                    "message": case["query"],
                    "user_has_trip": False,
                    "session_id": "test-session"
                }
                
                response = requests.post(
                    f"{self.base_url}/concierge/chat",
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Check card type
                    if data.get("card_type") == case["expected_card_type"]:
                        self.log_test(f"Card Type - {case['description']}", True, f"Got {case['expected_card_type']} cards")
                    else:
                        self.log_test(f"Card Type - {case['description']}", False, f"Expected {case['expected_card_type']}, got {data.get('card_type')}")
                        all_passed = False
                    
                    # Check max 4 cards
                    card_count = len(data.get("cards", []))
                    if card_count <= 4:
                        self.log_test(f"Card Limit - {case['description']}", True, f"Returned {card_count} cards (≤4)")
                    else:
                        self.log_test(f"Card Limit - {case['description']}", False, f"Returned {card_count} cards (>4)")
                        all_passed = False
                    
                    # Check curated destinations only
                    curated_cities = ["Rome", "Florence", "Venice", "Amalfi Coast", "Kyoto", "Lisbon"]
                    cards = data.get("cards", [])
                    
                    if case["expected_card_type"] == "city":
                        invalid_cards = [card for card in cards if card.get("name") not in curated_cities]
                        if not invalid_cards:
                            self.log_test(f"Curated Destinations - {case['description']}", True, "All cards are curated destinations")
                        else:
                            self.log_test(f"Curated Destinations - {case['description']}", False, f"Non-curated cards: {[c.get('name') for c in invalid_cards]}")
                            all_passed = False
                
                else:
                    self.log_test(f"Card Recommendations - {case['description']}", False, f"HTTP {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Card Recommendations - {case['description']}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_error_handling(self):
        """Test 5: Error handling scenarios"""
        test_cases = [
            {
                "payload": {"message": "", "session_id": "test-session"},
                "description": "Empty message"
            },
            {
                "payload": {"message": "x" * 600, "session_id": "test-session"},
                "description": "Very long message (>500 chars)"
            }
        ]
        
        all_passed = True
        
        for case in test_cases:
            try:
                response = requests.post(
                    f"{self.base_url}/concierge/chat",
                    json=case["payload"],
                    timeout=30
                )
                
                # Should still return 200 with fallback response
                if response.status_code == 200:
                    data = response.json()
                    if "message" in data and data["message"]:
                        self.log_test(f"Error Handling - {case['description']}", True, "Graceful fallback response")
                    else:
                        self.log_test(f"Error Handling - {case['description']}", False, "No fallback message")
                        all_passed = False
                else:
                    self.log_test(f"Error Handling - {case['description']}", False, f"HTTP {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Error Handling - {case['description']}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def test_additional_endpoints(self):
        """Test 6: Additional endpoints"""
        endpoints = [
            {
                "url": f"{self.base_url}/concierge/cards",
                "method": "GET",
                "description": "Get all cards endpoint",
                "expected_keys": ["cities", "circuits"]
            },
            {
                "url": f"{self.base_url}/concierge/trip",
                "method": "GET", 
                "description": "Get user trip endpoint",
                "expected_keys": ["id", "name", "status"]
            }
        ]
        
        all_passed = True
        
        for endpoint in endpoints:
            try:
                if endpoint["method"] == "GET":
                    response = requests.get(endpoint["url"], timeout=30)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    # Check expected keys
                    missing_keys = [key for key in endpoint["expected_keys"] if key not in data]
                    if not missing_keys:
                        self.log_test(f"Additional Endpoint - {endpoint['description']}", True, f"All expected keys present")
                    else:
                        self.log_test(f"Additional Endpoint - {endpoint['description']}", False, f"Missing keys: {missing_keys}")
                        all_passed = False
                else:
                    self.log_test(f"Additional Endpoint - {endpoint['description']}", False, f"HTTP {response.status_code}")
                    all_passed = False
                    
            except Exception as e:
                self.log_test(f"Additional Endpoint - {endpoint['description']}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed
    
    def run_all_tests(self):
        """Run all test suites"""
        print("=" * 60)
        print("AI CONCIERGE BACKEND API TEST SUITE")
        print("=" * 60)
        print(f"Testing against: {self.base_url}")
        print()
        
        # Run tests in order
        tests = [
            self.test_endpoint_accessibility,
            self.test_basic_functionality,
            self.test_intent_detection,
            self.test_card_recommendations,
            self.test_error_handling,
            self.test_additional_endpoints
        ]
        
        results = []
        for test in tests:
            print(f"\nRunning {test.__name__}...")
            result = test()
            results.append(result)
            print()
        
        # Summary
        print("=" * 60)
        print("TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(results)
        total = len(results)
        
        for result in self.test_results:
            print(f"{result['status']}: {result['test']}")
            if result['details'] and "FAIL" in result['status']:
                print(f"   {result['details']}")
        
        print(f"\nOverall: {passed}/{total} test suites passed")
        
        if passed == total:
            print("🎉 All tests passed! AI Concierge API is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} test suite(s) failed. See details above.")
            return False

def main():
    """Main test execution"""
    tester = ConciergeAPITester()
    success = tester.run_all_tests()
    
    if success:
        exit(0)
    else:
        exit(1)

if __name__ == "__main__":
    main()
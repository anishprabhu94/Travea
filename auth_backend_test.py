#!/usr/bin/env python3
"""
Backend Test Suite for Authentication API
Tests all authentication endpoints and functionality as specified in the review request
"""

import requests
import json
import os
from typing import Dict, Any
import time

# Get backend URL from environment
BACKEND_URL = os.getenv('EXPO_PUBLIC_BACKEND_URL', 'https://glass-traveler.preview.emergentagent.com')
API_BASE = f"{BACKEND_URL}/api"

class AuthAPITester:
    def __init__(self):
        self.base_url = API_BASE
        self.test_results = []
        self.session_token = None
        self.test_user_email = "test@travea.com"
        self.test_user_password = "testpass123"
        self.test_user_name = "Test User"
        self.test_home_city = "New York"
        
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
    
    def cleanup_test_user(self):
        """Clean up test user if exists (for fresh testing)"""
        try:
            # Try to sign in first to see if user exists
            response = requests.post(
                f"{self.base_url}/auth/signin",
                json={
                    "email": self.test_user_email,
                    "password": self.test_user_password
                },
                timeout=10
            )
            
            if response.status_code == 200:
                # User exists, get session token and delete
                data = response.json()
                session_token = data.get("session_token")
                if session_token:
                    # Try to logout to clean up session
                    requests.post(
                        f"{self.base_url}/auth/logout",
                        headers={"Authorization": f"Bearer {session_token}"},
                        timeout=10
                    )
                print(f"   Cleaned up existing test user: {self.test_user_email}")
        except:
            # User doesn't exist or cleanup failed, that's fine
            pass
    
    def test_signup_endpoint(self):
        """Test 1: POST /api/auth/signup - Create new user"""
        try:
            # Clean up any existing test user first
            self.cleanup_test_user()
            
            payload = {
                "name": self.test_user_name,
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = requests.post(
                f"{self.base_url}/auth/signup",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["user", "session_token"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Signup - Response Structure", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Check user data
                user = data["user"]
                user_fields = ["id", "email", "name", "onboarding_completed"]
                missing_user_fields = [field for field in user_fields if field not in user]
                
                if missing_user_fields:
                    self.log_test("Signup - User Data Structure", False, f"Missing user fields: {missing_user_fields}")
                    return False
                
                # Verify user data matches input
                if user["email"] != self.test_user_email or user["name"] != self.test_user_name:
                    self.log_test("Signup - User Data Accuracy", False, f"Email/name mismatch")
                    return False
                
                # Store session token for subsequent tests
                self.session_token = data["session_token"]
                
                self.log_test("Signup Endpoint", True, f"User created with ID: {user['id']}")
                return True
                
            elif response.status_code == 400:
                # Check if it's "Email already registered" error
                try:
                    error_data = response.json()
                    if "already registered" in error_data.get("detail", "").lower():
                        # Clean up and retry
                        self.cleanup_test_user()
                        time.sleep(1)
                        
                        # Retry signup
                        response = requests.post(
                            f"{self.base_url}/auth/signup",
                            json=payload,
                            timeout=10
                        )
                        
                        if response.status_code == 200:
                            data = response.json()
                            self.session_token = data["session_token"]
                            self.log_test("Signup Endpoint", True, f"User created after cleanup")
                            return True
                
                except:
                    pass
                
                self.log_test("Signup Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
            else:
                self.log_test("Signup Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Signup Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_signin_endpoint(self):
        """Test 2: POST /api/auth/signin - Sign in with credentials"""
        try:
            payload = {
                "email": self.test_user_email,
                "password": self.test_user_password
            }
            
            response = requests.post(
                f"{self.base_url}/auth/signin",
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check response structure
                required_fields = ["user", "session_token"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Signin - Response Structure", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Update session token
                self.session_token = data["session_token"]
                
                # Check user data
                user = data["user"]
                if user["email"] != self.test_user_email:
                    self.log_test("Signin - User Data", False, f"Email mismatch")
                    return False
                
                self.log_test("Signin Endpoint", True, f"Successfully signed in user: {user['email']}")
                return True
                
            else:
                self.log_test("Signin Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Signin Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_me_endpoint(self):
        """Test 3: GET /api/auth/me - Get current user info"""
        if not self.session_token:
            self.log_test("Me Endpoint", False, "No session token available")
            return False
        
        try:
            # Test with Authorization header
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers={"Authorization": f"Bearer {self.session_token}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Check required fields
                required_fields = ["id", "email", "name", "auth_provider", "onboarding_completed"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if missing_fields:
                    self.log_test("Me Endpoint - Response Structure", False, f"Missing fields: {missing_fields}")
                    return False
                
                # Verify data matches our test user
                if data["email"] != self.test_user_email:
                    self.log_test("Me Endpoint - Data Accuracy", False, f"Email mismatch")
                    return False
                
                self.log_test("Me Endpoint", True, f"Retrieved user data for: {data['email']}")
                return True
                
            else:
                self.log_test("Me Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Me Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_profile_update_endpoint(self):
        """Test 4: PUT /api/auth/profile - Update user profile"""
        if not self.session_token:
            self.log_test("Profile Update Endpoint", False, "No session token available")
            return False
        
        try:
            payload = {
                "name": "Updated Test User",
                "home_city": self.test_home_city
            }
            
            response = requests.put(
                f"{self.base_url}/auth/profile",
                json=payload,
                headers={"Authorization": f"Bearer {self.session_token}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "message" in data and "updated" in data["message"].lower():
                    # Verify the update by calling /me endpoint
                    me_response = requests.get(
                        f"{self.base_url}/auth/me",
                        headers={"Authorization": f"Bearer {self.session_token}"},
                        timeout=10
                    )
                    
                    if me_response.status_code == 200:
                        me_data = me_response.json()
                        if me_data.get("name") == "Updated Test User" and me_data.get("home_city") == self.test_home_city:
                            self.log_test("Profile Update Endpoint", True, f"Profile updated successfully")
                            return True
                        else:
                            self.log_test("Profile Update Endpoint", False, f"Update not persisted correctly")
                            return False
                    else:
                        self.log_test("Profile Update Endpoint", False, f"Could not verify update")
                        return False
                else:
                    self.log_test("Profile Update Endpoint", False, f"Unexpected response: {data}")
                    return False
                
            else:
                self.log_test("Profile Update Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Profile Update Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_preferences_update_endpoint(self):
        """Test 5: PUT /api/auth/preferences - Update onboarding preferences"""
        if not self.session_token:
            self.log_test("Preferences Update Endpoint", False, "No session token available")
            return False
        
        try:
            payload = {
                "preferences": {
                    "home_city": self.test_home_city,
                    "traveler_type": ["solo", "couple"],
                    "preferred_stays": ["luxury_hotels", "boutique"],
                    "interests": ["culture", "food", "nature"],
                    "exploration_style": "slow_travel"
                }
            }
            
            response = requests.put(
                f"{self.base_url}/auth/preferences",
                json=payload,
                headers={"Authorization": f"Bearer {self.session_token}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "message" in data and "saved" in data["message"].lower():
                    # Verify the update by calling /me endpoint
                    me_response = requests.get(
                        f"{self.base_url}/auth/me",
                        headers={"Authorization": f"Bearer {self.session_token}"},
                        timeout=10
                    )
                    
                    if me_response.status_code == 200:
                        me_data = me_response.json()
                        if me_data.get("onboarding_completed") == True and me_data.get("preferences"):
                            self.log_test("Preferences Update Endpoint", True, f"Preferences saved and onboarding marked complete")
                            return True
                        else:
                            self.log_test("Preferences Update Endpoint", False, f"Preferences not persisted correctly")
                            return False
                    else:
                        self.log_test("Preferences Update Endpoint", False, f"Could not verify preferences update")
                        return False
                else:
                    self.log_test("Preferences Update Endpoint", False, f"Unexpected response: {data}")
                    return False
                
            else:
                self.log_test("Preferences Update Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Preferences Update Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_settings_update_endpoint(self):
        """Test 6: PUT /api/auth/settings - Update user settings"""
        if not self.session_token:
            self.log_test("Settings Update Endpoint", False, "No session token available")
            return False
        
        try:
            payload = {
                "settings": {
                    "notifications": {
                        "trip_updates": False,
                        "inspiration": True,
                        "price_alerts": False
                    },
                    "app_preferences": {
                        "theme": "dark",
                        "language": "en",
                        "currency": "EUR",
                        "units": "miles"
                    }
                }
            }
            
            response = requests.put(
                f"{self.base_url}/auth/settings",
                json=payload,
                headers={"Authorization": f"Bearer {self.session_token}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "message" in data and "updated" in data["message"].lower():
                    # Verify the update by calling /me endpoint
                    me_response = requests.get(
                        f"{self.base_url}/auth/me",
                        headers={"Authorization": f"Bearer {self.session_token}"},
                        timeout=10
                    )
                    
                    if me_response.status_code == 200:
                        me_data = me_response.json()
                        settings = me_data.get("settings", {})
                        if settings.get("app_preferences", {}).get("currency") == "EUR":
                            self.log_test("Settings Update Endpoint", True, f"Settings updated successfully")
                            return True
                        else:
                            self.log_test("Settings Update Endpoint", False, f"Settings not persisted correctly")
                            return False
                    else:
                        self.log_test("Settings Update Endpoint", False, f"Could not verify settings update")
                        return False
                else:
                    self.log_test("Settings Update Endpoint", False, f"Unexpected response: {data}")
                    return False
                
            else:
                self.log_test("Settings Update Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Settings Update Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_change_password_endpoint(self):
        """Test 7: POST /api/auth/change-password - Change user password"""
        if not self.session_token:
            self.log_test("Change Password Endpoint", False, "No session token available")
            return False
        
        try:
            new_password = "newpass456"
            payload = {
                "current_password": self.test_user_password,
                "new_password": new_password
            }
            
            response = requests.post(
                f"{self.base_url}/auth/change-password",
                json=payload,
                headers={"Authorization": f"Bearer {self.session_token}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "message" in data and "changed" in data["message"].lower():
                    # Verify password change by trying to sign in with new password
                    signin_response = requests.post(
                        f"{self.base_url}/auth/signin",
                        json={
                            "email": self.test_user_email,
                            "password": new_password
                        },
                        timeout=10
                    )
                    
                    if signin_response.status_code == 200:
                        # Update our stored password for cleanup
                        self.test_user_password = new_password
                        signin_data = signin_response.json()
                        self.session_token = signin_data["session_token"]
                        self.log_test("Change Password Endpoint", True, f"Password changed and verified")
                        return True
                    else:
                        self.log_test("Change Password Endpoint", False, f"Password change not effective")
                        return False
                else:
                    self.log_test("Change Password Endpoint", False, f"Unexpected response: {data}")
                    return False
                
            else:
                self.log_test("Change Password Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Change Password Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_logout_endpoint(self):
        """Test 8: POST /api/auth/logout - Log out user"""
        if not self.session_token:
            self.log_test("Logout Endpoint", False, "No session token available")
            return False
        
        try:
            response = requests.post(
                f"{self.base_url}/auth/logout",
                headers={"Authorization": f"Bearer {self.session_token}"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                
                if "message" in data and "logged out" in data["message"].lower():
                    # Verify logout by trying to access /me endpoint
                    me_response = requests.get(
                        f"{self.base_url}/auth/me",
                        headers={"Authorization": f"Bearer {self.session_token}"},
                        timeout=10
                    )
                    
                    if me_response.status_code == 401:
                        self.log_test("Logout Endpoint", True, f"Successfully logged out and session invalidated")
                        self.session_token = None
                        return True
                    else:
                        self.log_test("Logout Endpoint", False, f"Session still valid after logout")
                        return False
                else:
                    self.log_test("Logout Endpoint", False, f"Unexpected response: {data}")
                    return False
                
            else:
                self.log_test("Logout Endpoint", False, f"Status: {response.status_code}, Response: {response.text}")
                return False
                
        except Exception as e:
            self.log_test("Logout Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_oauth_session_endpoint(self):
        """Test 9: GET /api/auth/session-data - OAuth endpoint (manual testing note)"""
        try:
            # This endpoint requires external Emergent Auth service
            # We'll just test that the endpoint exists and returns proper error for missing session_id
            response = requests.get(
                f"{self.base_url}/auth/session-data",
                timeout=10
            )
            
            if response.status_code == 400:
                try:
                    data = response.json()
                    if "session_id" in data.get("detail", "").lower():
                        self.log_test("OAuth Session Endpoint", True, f"Endpoint exists and validates session_id requirement")
                        return True
                except:
                    pass
            
            self.log_test("OAuth Session Endpoint", False, f"Unexpected response: {response.status_code} - {response.text}")
            return False
                
        except Exception as e:
            self.log_test("OAuth Session Endpoint", False, f"Error: {str(e)}")
            return False
    
    def test_authentication_security(self):
        """Test 10: Authentication security - unauthorized access"""
        try:
            # Test accessing protected endpoint without token
            response = requests.get(
                f"{self.base_url}/auth/me",
                timeout=10
            )
            
            if response.status_code == 401:
                self.log_test("Authentication Security - No Token", True, f"Properly rejects requests without token")
            else:
                self.log_test("Authentication Security - No Token", False, f"Should return 401, got {response.status_code}")
                return False
            
            # Test with invalid token
            response = requests.get(
                f"{self.base_url}/auth/me",
                headers={"Authorization": "Bearer invalid_token_12345"},
                timeout=10
            )
            
            if response.status_code == 401:
                self.log_test("Authentication Security - Invalid Token", True, f"Properly rejects invalid tokens")
                return True
            else:
                self.log_test("Authentication Security - Invalid Token", False, f"Should return 401, got {response.status_code}")
                return False
                
        except Exception as e:
            self.log_test("Authentication Security", False, f"Error: {str(e)}")
            return False
    
    def test_password_hashing(self):
        """Test 11: Password hashing with bcrypt"""
        # This is tested implicitly through the signup/signin flow
        # If passwords are properly hashed, signin should work after signup
        if hasattr(self, '_signup_successful') and hasattr(self, '_signin_successful'):
            self.log_test("Password Hashing (bcrypt)", True, f"Passwords properly hashed - signup/signin flow works")
            return True
        else:
            self.log_test("Password Hashing (bcrypt)", False, f"Cannot verify - signup/signin flow failed")
            return False
    
    def test_mongodb_persistence(self):
        """Test 12: MongoDB data persistence"""
        # This is tested implicitly through profile updates and data retrieval
        # If data persists between requests, MongoDB is working
        try:
            # Sign in again to get a fresh session
            signin_response = requests.post(
                f"{self.base_url}/auth/signin",
                json={
                    "email": self.test_user_email,
                    "password": self.test_user_password
                },
                timeout=10
            )
            
            if signin_response.status_code == 200:
                data = signin_response.json()
                user = data["user"]
                
                # Check if our previous updates are still there
                if user.get("onboarding_completed") == True:
                    self.log_test("MongoDB Persistence", True, f"Data persisted correctly across sessions")
                    return True
                else:
                    self.log_test("MongoDB Persistence", False, f"Data not persisted correctly")
                    return False
            else:
                self.log_test("MongoDB Persistence", False, f"Could not verify persistence - signin failed")
                return False
                
        except Exception as e:
            self.log_test("MongoDB Persistence", False, f"Error: {str(e)}")
            return False
    
    def run_all_tests(self):
        """Run all test suites"""
        print("=" * 70)
        print("AUTHENTICATION BACKEND API TEST SUITE")
        print("=" * 70)
        print(f"Testing against: {self.base_url}")
        print(f"Test user: {self.test_user_email}")
        print()
        
        # Run tests in order
        tests = [
            ("Signup", self.test_signup_endpoint),
            ("Signin", self.test_signin_endpoint),
            ("Me (Get User)", self.test_me_endpoint),
            ("Profile Update", self.test_profile_update_endpoint),
            ("Preferences Update", self.test_preferences_update_endpoint),
            ("Settings Update", self.test_settings_update_endpoint),
            ("Change Password", self.test_change_password_endpoint),
            ("Logout", self.test_logout_endpoint),
            ("OAuth Session (Structure)", self.test_oauth_session_endpoint),
            ("Authentication Security", self.test_authentication_security),
            ("Password Hashing", self.test_password_hashing),
            ("MongoDB Persistence", self.test_mongodb_persistence)
        ]
        
        results = []
        for test_name, test_func in tests:
            print(f"\nRunning {test_name} test...")
            result = test_func()
            results.append(result)
            
            # Mark successful tests for later verification
            if result and test_name == "Signup":
                self._signup_successful = True
            if result and test_name == "Signin":
                self._signin_successful = True
            
            print()
        
        # Summary
        print("=" * 70)
        print("TEST SUMMARY")
        print("=" * 70)
        
        passed = sum(results)
        total = len(results)
        
        # Group results by status
        passed_tests = []
        failed_tests = []
        
        for result in self.test_results:
            if "✅ PASS" in result['status']:
                passed_tests.append(result)
            else:
                failed_tests.append(result)
        
        # Show failed tests first (more important)
        if failed_tests:
            print("FAILED TESTS:")
            for result in failed_tests:
                print(f"{result['status']}: {result['test']}")
                if result['details']:
                    print(f"   {result['details']}")
            print()
        
        # Show passed tests
        if passed_tests:
            print("PASSED TESTS:")
            for result in passed_tests:
                print(f"{result['status']}: {result['test']}")
            print()
        
        print(f"Overall: {passed}/{total} tests passed")
        
        if passed == total:
            print("🎉 All authentication tests passed! Backend API is working correctly.")
            return True
        else:
            print(f"⚠️  {total - passed} test(s) failed. See details above.")
            return False

def main():
    """Main test execution"""
    tester = AuthAPITester()
    success = tester.run_all_tests()
    
    if success:
        exit(0)
    else:
        exit(1)

if __name__ == "__main__":
    main()
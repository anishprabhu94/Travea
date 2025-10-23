import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hardcoded backend URL for now - environment variables not working properly
const EXPO_BACKEND_URL = 'https://glass-traveler.preview.emergentagent.com';

console.log('AuthContext - EXPO_BACKEND_URL:', EXPO_BACKEND_URL);

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  home_city?: string;
  auth_provider: string;
  onboarding_completed: boolean;
  preferences?: any;
  settings?: any;
}

interface AuthContextType {
  user: User | null;
  sessionToken: string | null;
  isLoading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithOAuth: (sessionId: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { name?: string; home_city?: string }) => Promise<void>;
  updatePreferences: (preferences: any) => Promise<void>;
  updateSettings: (settings: any) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    loadSession();
  }, []);

  const loadSession = async () => {
    try {
      const token = await AsyncStorage.getItem('session_token');
      if (token) {
        setSessionToken(token);
        await fetchUser(token);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUser = async (token: string) => {
    try {
      const response = await fetch(`${EXPO_BACKEND_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Invalid token, clear it
        await AsyncStorage.removeItem('session_token');
        setSessionToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  const signUp = async (name: string, email: string, password: string) => {
    console.log('signUp function called with:', { name, email, hasPassword: !!password });
    console.log('Backend URL:', EXPO_BACKEND_URL);
    try {
      const url = `${EXPO_BACKEND_URL}/api/auth/signup`;
      console.log('Fetching:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const error = await response.json();
        console.error('Response error:', error);
        throw new Error(error.detail || 'Sign up failed');
      }

      const data = await response.json();
      console.log('Response data received:', { user: data.user, hasToken: !!data.session_token });
      setUser(data.user);
      setSessionToken(data.session_token);
      await AsyncStorage.setItem('session_token', data.session_token);
      console.log('User and session token saved');
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('signIn function called with:', { email, hasPassword: !!password });
    console.log('Backend URL:', EXPO_BACKEND_URL);
    try {
      const url = `${EXPO_BACKEND_URL}/api/auth/signin`;
      console.log('Fetching:', url);
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Response status:', response.status);
      if (!response.ok) {
        const error = await response.json();
        console.error('Response error:', error);
        throw new Error(error.detail || 'Sign in failed');
      }

      const data = await response.json();
      console.log('Response data received:', { user: data.user, hasToken: !!data.session_token });
      setUser(data.user);
      setSessionToken(data.session_token);
      await AsyncStorage.setItem('session_token', data.session_token);
      console.log('User and session token saved');
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signInWithOAuth = async (sessionId: string) => {
    try {
      const response = await fetch(`${EXPO_BACKEND_URL}/api/auth/session-data`, {
        method: 'GET',
        headers: {
          'X-Session-ID': sessionId,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'OAuth sign in failed');
      }

      const data = await response.json();
      setUser(data.user);
      setSessionToken(data.session_token);
      await AsyncStorage.setItem('session_token', data.session_token);
    } catch (error) {
      console.error('OAuth sign in error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (sessionToken) {
        await fetch(`${EXPO_BACKEND_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      await AsyncStorage.removeItem('session_token');
      setUser(null);
      setSessionToken(null);
    }
  };

  const updateProfile = async (data: { name?: string; home_city?: string }) => {
    try {
      const response = await fetch(`${EXPO_BACKEND_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  };

  const updatePreferences = async (preferences: any) => {
    try {
      const response = await fetch(`${EXPO_BACKEND_URL}/api/auth/preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ preferences }),
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error('Update preferences error:', error);
      throw error;
    }
  };

  const updateSettings = async (settings: any) => {
    try {
      const response = await fetch(`${EXPO_BACKEND_URL}/api/auth/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({ settings }),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      // Refresh user data
      await refreshUser();
    } catch (error) {
      console.error('Update settings error:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    if (sessionToken) {
      await fetchUser(sessionToken);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        sessionToken,
        isLoading,
        signUp,
        signIn,
        signInWithOAuth,
        signOut,
        updateProfile,
        updatePreferences,
        updateSettings,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

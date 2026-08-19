import React, { createContext, useContext, useEffect, useState } from 'react';
import { getMe, login as loginApi, register as registerApi } from '../api/auth';
import { setUnauthenticatedHandler } from '../api/client';
import { clearTokens, getAccessToken, setTokens } from '../api/storage';
import { ProfileRead, RegisterIn } from '../api/types';

interface AuthContextValue {
  userProfile: ProfileRead | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  registerUser: (email: string, password: string, diets: string[]) => Promise<void>;
  loginUser: (email: string, password: string) => Promise<void>;
  logoutUser: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<ProfileRead | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const logoutUser = async () => {
    await clearTokens();
    setUserProfile(null);
    setIsAuthenticated(false);
    setError(null);
  };

  useEffect(() => {
    setUnauthenticatedHandler(() => {
      logoutUser();
    });

    const checkTokenOnLaunch = async () => {
      try {
        const token = await getAccessToken();
        if (token) {
          const profile = await getMe();
          setUserProfile(profile);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        // Token was invalid or expired and refresh failed
        await clearTokens();
        setUserProfile(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkTokenOnLaunch();
  }, []);

  const registerUser = async (email: string, password: string, diets: string[]) => {
    setError(null);
    try {
      // Use email prefix as default display_name if not separately requested
      const displayName = email.split('@')[0] || 'Chef';
      const registerData: RegisterIn = {
        email,
        password,
        display_name: displayName,
        diets,
      };

      const tokens = await registerApi(registerData);
      await setTokens(tokens.access_token, tokens.refresh_token);

      const profile = await getMe();
      setUserProfile(profile);
      setIsAuthenticated(true);
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Registration failed. Please check your credentials.';
      setError(message);
      throw err;
    }
  };

  const loginUser = async (email: string, password: string) => {
    setError(null);
    try {
      const tokens = await loginApi({ email, password });
      await setTokens(tokens.access_token, tokens.refresh_token);

      const profile = await getMe();
      setUserProfile(profile);
      setIsAuthenticated(true);
    } catch (err: any) {
      const message = err.response?.data?.detail || err.message || 'Login failed. Invalid email or password.';
      setError(message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        isAuthenticated,
        isLoading,
        error,
        registerUser,
        loginUser,
        logoutUser,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService, LoginInput, RegisterInput } from "@/lib/services/auth";
import { getAuthToken, clearAuthTokens } from "@/lib/api";
import { UserApiResponse, GamificationStats } from "@/types/api";

interface AuthContextType {
  user: UserApiResponse | null;
  gamification: GamificationStats | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserApiResponse | null>(null);
  const [gamification, setGamification] = useState<GamificationStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setUser(null);
        setGamification(null);
        return;
      }

      const data = await authService.getMe();
      setUser(data.user);
      setGamification(data.gamification);
    } catch {
      clearAuthTokens();
      setUser(null);
      setGamification(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };

    initAuth();
  }, [refreshUser]);

  const login = async (input: LoginInput) => {
    const data = await authService.login(input);
    setUser(data.user);
    // Fetch gamification stats after login
    try {
      const meData = await authService.getMe();
      setGamification(meData.gamification);
    } catch {
      // Ignore gamification fetch errors
    }
  };

  const register = async (input: RegisterInput) => {
    const data = await authService.register(input);
    setUser(data.user);
    // Fetch gamification stats after register
    try {
      const meData = await authService.getMe();
      setGamification(meData.gamification);
    } catch {
      // Ignore gamification fetch errors
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setGamification(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        gamification,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

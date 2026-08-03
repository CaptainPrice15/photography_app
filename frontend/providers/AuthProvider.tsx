"use client";

import { createContext, useContext, useEffect, ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, setUser, login: storeLogin, logout: storeLogout, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          if (data) {
            setUser(data);
          } else {
            storeLogout();
          }
        } catch {
          storeLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [setUser, storeLogout, setLoading]);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    storeLogin(data.user, data.access_token, data.refresh_token);
  };

  const register = async (email: string, username: string, password: string, fullName: string) => {
    const { data } = await api.post("/auth/register", {
      email,
      username,
      password,
      full_name: fullName,
    });
    storeLogin(data.user, data.access_token, data.refresh_token);
  };

  const logout = () => {
    storeLogout();
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, logout }}>
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

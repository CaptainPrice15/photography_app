"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/lib/types";

export function useAuth() {
  const { user, isAuthenticated, isLoading, setUser, login: storeLogin, logout: storeLogout, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
      if (token) {
        try {
          const { data } = await api.get("/auth/me");
          setUser(data);
        } catch {
          storeLogout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [setUser, storeLogout, setLoading]);

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    storeLogin(data.user, data.access_token, data.refresh_token);
    return data.user;
  }, [storeLogin]);

  const register = useCallback(async (email: string, username: string, password: string, fullName: string) => {
    const { data } = await api.post("/auth/register", {
      email,
      username,
      password,
      full_name: fullName,
    });
    storeLogin(data.user, data.access_token, data.refresh_token);
    return data.user;
  }, [storeLogin]);

  const logout = useCallback(() => {
    storeLogout();
    window.location.href = "/";
  }, [storeLogout]);

  return { user, isAuthenticated, isLoading, login, register, logout };
}

"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { apiRequest } from "../lib/api";
import { AuthUser, Role } from "../types";

interface AuthResponse {
  token: string;
  user: AuthUser;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { fullName: string; email: string; password: string; role?: Role }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    }
    return null;
  });
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token");
    }
    return null;
  });
  const loading = false;

  const persist = (res: AuthResponse) => {
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem("token", res.token);
    localStorage.setItem("user", JSON.stringify(res.user));
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      loading,
      login: async (email, password) => {
        const res = await apiRequest<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ email, password })
        });
        persist(res);
      },
      signup: async (payload) => {
        const res = await apiRequest<AuthResponse>("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        persist(res);
      },
      logout: () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

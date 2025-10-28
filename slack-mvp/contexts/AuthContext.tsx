"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { AuthUser, LoginResult } from "../types";

// Hardcoded allowed credentials
const VALID_EMAIL = "ronit@golden.vc";
const VALID_PASSWORD = "testing";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null); // null = logged out

  function login(email: string, password: string): LoginResult {
    if (email === VALID_EMAIL && password === VALID_PASSWORD) {
      const authedUser: AuthUser = { email };
      setUser(authedUser);
      return { ok: true };
    } else {
      return { ok: false, error: "Invalid email or password" };
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

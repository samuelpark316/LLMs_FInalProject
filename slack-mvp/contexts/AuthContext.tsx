"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthUser, LoginResult } from "../types";
import { getUserByEmail } from "../lib/auth";
import { supabase } from "../lib/supabaseClient";

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string) => Promise<LoginResult>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null); // null = logged out
  const [loading, setLoading] = useState(true);

  // Check for existing OAuth session on mount
  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({ email: session.user.email || "" });
      }
      setLoading(false);
    });

    // Listen for auth changes (OAuth callbacks, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({ email: session.user.email || "" });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function login(email: string): Promise<LoginResult> {
    try {
      // Check if there's an active Supabase session (created by verifyCode)
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && session.user.email === email) {
        // Session exists and matches the email - user is already logged in
        // The onAuthStateChange listener will have already set the user
        return { ok: true };
      } else {
        // No session found - verification might have failed
        return { ok: false, error: "Please verify your code first" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { ok: false, error: "Login failed" };
    }
  }

  async function logout() {
    // Sign out from Supabase (for OAuth users)
    await supabase.auth.signOut();
    setUser(null);
  }

  // Show loading state while checking for existing session
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#592F63]"></div>
      </div>
    );
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

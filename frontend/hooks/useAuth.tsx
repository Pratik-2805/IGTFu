"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

type User = {
  id: number;
  username: string;
  email: string;
  role?: string | null;
  name?: string | null;
};

interface AuthContextType {
  user: User | null;
  access: string | null;
  login: (access: string, user: User) => void;
  logout: () => Promise<void>;
  ensureFreshAccess: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [access, setAccess] = useState<string | null>(null);

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;

  // REFRESH ACCESS TOKEN ONLY WHEN NECESSARY
  const refreshAccess = useCallback(async (): Promise<string | null> => {
    try {
      const res = await fetch(`${API}/token/refresh-cookie/`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) return null;

      const data = await res.json();
      setAccess(data.access);
      return data.access;
    } catch {
      return null;
    }
  }, [API]);

  // Called ONLY by useAuthFetch if a 401 occurs
  const ensureFreshAccess = useCallback(async () => {
    return access || (await refreshAccess());
  }, [access, refreshAccess]);

  const login = (newAccess: string, newUser: User) => {
    setAccess(newAccess);
    setUser(newUser);
  };

  const logout = async () => {
    await fetch(`${API}/api/logout/`, {
      method: "POST",
      credentials: "include",
    });

    setAccess(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        access,
        login,
        logout,
        ensureFreshAccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

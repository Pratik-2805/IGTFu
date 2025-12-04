"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "react-toastify";

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  name?: string;
}

export function useAccount() {
  const authFetch = useAuthFetch();
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const ME_URL = `${BASE}/me/`;

  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [resetLoading, setResetLoading] = useState(false);

  // Fetch User
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);

      const res = await authFetch(ME_URL);

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data: UserInfo = await res.json();
      setUser(data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [authFetch, ME_URL]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Send Reset Link
const sendResetPasswordLink = async () => {
  try {
    setResetLoading(true);

    const res = await authFetch(`${BASE}/password/reset/`, {
      method: "POST",
    });

    const data = await res.json();

    if (res.ok) {
      toast.success("Reset password link sent to your email.");
    } else {
      toast.error(data.detail || "Failed to send reset link.");
    }
  } catch (err) {
    toast.error("Network error.");
  } finally {
    setResetLoading(false);
  }
};


  return {
    user,
    loading,
    reloadUser: loadUser,
    sendResetPasswordLink,
    resetLoading,
  };
}

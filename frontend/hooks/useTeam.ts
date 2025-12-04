"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "react-toastify";
export interface TeamUser {
  id: number;
  name: string;
  username: string;
  email: string;
  role: "admin" | "manager" | "sales";
  status: "active" | "inactive";
}

export function useTeam(enabled: boolean) {
  const authFetch = useAuthFetch();

  const API = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const LIST_URL = `${API}/team/list/`;
  const CREATE_URL = `${API}/team/create/`;
  const DELETE_URL = `${API}/team/delete/`;

  const [team, setTeam] = useState<TeamUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------------------
  // FETCH TEAM LIST
  // ----------------------------------------------------
  const fetchTeam = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await authFetch(LIST_URL);
      if (!res.ok) {
        throw new Error(
          res.status === 403
            ? "Unauthorized — Only admin can view team"
            : "Server error"
        );
      }

      const data = await res.json();

      // Sort admin first
      const sorted = [...data].sort((a, b) => {
        if (a.role === "admin") return -1;
        if (b.role === "admin") return 1;
        return 0;
      });

      setTeam(sorted);

      toast.success("Team list updated ✔️"); // ⬅️ toast
    } catch (err: any) {
      setError(err.message || "Failed to load team.");
      setTeam([]);

      toast.error(err.message || "Failed to load team ❌"); // ⬅️ toast
    } finally {
      setLoading(false);
    }
  }, [authFetch, LIST_URL]);

  useEffect(() => {
    if (!enabled) return;
    fetchTeam();
  }, [enabled, fetchTeam]);

  // ----------------------------------------------------
  // CREATE TEAM USER
  // ----------------------------------------------------
  const createUser = async (payload: {
    name: string;
    email: string;
    role: "manager" | "sales";
  }) => {
    try {
      setLoading(true);
      setError("");

      const res = await authFetch(CREATE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Failed to create user");
      }

      await fetchTeam();

      toast.success("User created 🎉"); // ⬅️ toast
      return { ok: true };
    } catch (err: any) {
      setError(err.message);

      toast.error(err.message || "Failed to create user ❌"); // ⬅️ toast
      return { ok: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------------------
  // DELETE TEAM USER
  // ----------------------------------------------------
  const deleteUser = async (id: number) => {
    try {
      setLoading(true);
      setError("");

      const res = await authFetch(`${DELETE_URL}${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      await fetchTeam();

      toast.success("User deleted 🗑️"); // ⬅️ toast
      return true;
    } catch (err: any) {
      setError(err.message);

      toast.error(err.message || "Failed to delete user ❌"); // ⬅️ toast
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    team,
    loading,
    error,
    fetchTeam,
    createUser,
    deleteUser,
  };
}

"use client";

import { useCallback } from "react";
import { useAuth } from "./useAuth";
import { toast } from "react-toastify";

export function useAuthFetch() {
  const { ensureFreshAccess, logout } = useAuth();

  return useCallback(
    async (url: string, options: RequestInit = {}) => {
      try {
        const headers = new Headers(options.headers || {});

        // JSON vs FormData
        if (options.body instanceof FormData) {
          headers.delete("Content-Type");
        } else if (options.body) {
          headers.set("Content-Type", "application/json");
        }

        // FIRST REQUEST
        let res = await fetch(url, {
          ...options,
          headers,
          credentials: "include",
        });

        // If unauthorized → try refresh and retry ONCE
        if (res.status === 401) {
          const newAccess = await ensureFreshAccess();

          if (!newAccess) {
            toast.error("Session expired — please login again.");
            await logout();
            throw new Error("Unauthorized");
          }

          headers.set("Authorization", `Bearer ${newAccess}`);

          res = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
          });
        }

        // General error handler
        if (!res.ok) {
          const text = await res.text();

          let msg = `Server Error (${res.status})`;
          try {
            const json = JSON.parse(text);
            msg = json.detail || json.error || json.message || msg;
          } catch {}

          toast.error(msg);
        }

        return res;
      } catch (err: any) {
        toast.error("Network error — please try again.");
        throw err;
      }
    },
    [ensureFreshAccess, logout]
  );
}

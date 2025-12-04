"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "react-toastify";

// Match your Django model
import type { VisitorRegistration } from "@/utils/api";

export function useVisitors(enabled: boolean) {
  const authFetch = useAuthFetch();

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const VISITORS_URL = `${BASE}/visitor-registrations/`;

  const [visitors, setVisitors] = useState<VisitorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // ---------------------------------------------------------
  // FETCH VISITORS
  // ---------------------------------------------------------
  const fetchVisitors = useCallback(async () => {
    try {
      setLoading(true);

      const res = await authFetch(VISITORS_URL);

      if (!res.ok) throw new Error("Failed to fetch visitors");

      const data = await res.json();

      // Support DRF pagination
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];

      setVisitors(list);
    } catch (err) {
      setVisitors([]);
    } finally {
      setLoading(false);
    }
  }, [authFetch, VISITORS_URL]);

  useEffect(() => {
    if (!enabled) return;
    fetchVisitors();
  }, [enabled, fetchVisitors]);

  // ---------------------------------------------------------
  // UPDATE VISITOR STATUS
  // ---------------------------------------------------------
  const updateStatus = async (
    id: number,
    newStatus: VisitorRegistration["status"]
  ) => {
    try {
      setIsUpdating(true);

      const res = await authFetch(`${VISITORS_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Update failed");

      // 🔥 Build full name from visitor object
      const visitor = visitors.find((v) => v.id === id);
      const displayName = visitor
        ? `${visitor.first_name} ${visitor.last_name}`.trim()
        : "Visitor";

      toast.success(`${displayName} has been updated to ${newStatus}`);

      await fetchVisitors();
    } catch (err) {
      toast.error("Failed to update visitor status");
    } finally {
      setTimeout(() => {
        setIsUpdating(false);
      }, 500);
    }
  };

  // ---------------------------------------------------------
  // STATS
  // ---------------------------------------------------------
  const stats = {
    totalVisitors: visitors.length,
    pendingVisitors: visitors.filter((v) => v.status === "pending").length,
    contactedVisitors: visitors.filter((v) => v.status === "contacted").length,
    paidVisitors: visitors.filter((v) => v.status === "paid").length,
    rejectedVisitors: visitors.filter((v) => v.status === "rejected").length,
  };

  return {
    visitors,
    loading,
    isUpdating,

    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,

    updateStatus,
    stats,
    refetch: fetchVisitors,
  };
}

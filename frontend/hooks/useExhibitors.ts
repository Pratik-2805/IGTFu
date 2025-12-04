"use client";

import { useState, useEffect, useCallback } from "react";
import { ExhibitorRegistration } from "@/utils/api";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "react-toastify";

export function useExhibitors(enabled: boolean) {
  const authFetch = useAuthFetch();

  const [exhibitors, setExhibitors] = useState<ExhibitorRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // BASE URL (always from env)
  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const EXHIBITORS_URL = `${BASE}/exhibitor-registrations/`;

  // -------------------------------------------------------------
  // FETCH LIST
  // -------------------------------------------------------------
  const fetchExhibitors = useCallback(async () => {
    try {
      setLoading(true);

      const res = await authFetch(EXHIBITORS_URL);

      if (!res.ok) {
        throw new Error(`Failed: ${res.status}`);
      }

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.results)
        ? data.results
        : [];
      const normalized = list.map((item: any) => ({
        ...item,
        event_location: item.event_location ?? "",
      }));

      setExhibitors(normalized);
    } catch (err) {
      setExhibitors([]);
    } finally {
      setLoading(false);
    }
  }, [authFetch, EXHIBITORS_URL]);

  useEffect(() => {
    if (!enabled) return;
    fetchExhibitors();
  }, [enabled, fetchExhibitors]);

  // -------------------------------------------------------------
  // UPDATE STATUS
  // -------------------------------------------------------------

  const updateStatus = async (
    id: number,
    newStatus: ExhibitorRegistration["status"]
  ) => {
    try {
      setIsUpdating(true);

      // ⏳ small UX delay (same as visitors)
      await new Promise((r) => setTimeout(r, 500));

      const res = await authFetch(`${EXHIBITORS_URL}${id}/`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      // 🟦 Find exhibitor locally
      const exhibitor = exhibitors.find((e) => e.id === id);

      // 🟦 Display readable name
      const displayName = exhibitor
        ? exhibitor.company_name?.trim()
        : "Exhibitor";

      // 🟦 Toast message
      toast.success(`${displayName} has been updated to ${newStatus}`);

      // 🔄 Re-fetch data
      await fetchExhibitors();
    } catch (err) {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  // -------------------------------------------------------------
  // STATS
  // -------------------------------------------------------------
  const stats = {
    totalExhibitors: exhibitors.length,
    paidExhibitors: exhibitors.filter((e) => e.status === "paid").length,
    contactedExhibitors: exhibitors.filter((e) => e.status === "contacted")
      .length,
    pendingExhibitors: exhibitors.filter((e) => e.status === "pending").length,
    rejectedExhibitors: exhibitors.filter((e) => e.status === "rejected")
      .length,
  };

  return {
    exhibitors,
    loading,
    isUpdating,

    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,

    updateStatus,
    stats,
    refetch: fetchExhibitors,
  };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { toast } from "react-toastify";

import type { Event } from "@/utils/api";

export function useEvents(enabled: boolean) {
  const authFetch = useAuthFetch();

  const BASE = process.env.NEXT_PUBLIC_API_BASE_URL!;
  const EVENTS_URL = `${BASE}/events/`;

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<Event | null>(null);

  // ---------------------------------------------------------
  // FETCH EVENTS
  // ---------------------------------------------------------
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);

      const res = await authFetch(EVENTS_URL);
      if (!res.ok) throw new Error("Failed to load events");

      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.results ?? [];

      const normalized = list.map((e: any) => ({
        id: e.id,
        title: e.title,
        location: e.location,
        start_date: e.start_date,
        end_date: e.end_date,
        time: e.time_schedule,

        exhibitors: e.exhibitors_count,
        buyers: e.buyers_count,
        countries: e.countries_count,
        sectors: e.sectors_count,

        description: e.description,

        is_active: e.is_active,
        is_past: !e.is_active,
      }));

      setEvents(normalized);

      toast.success("Events loaded ✔️");
    } catch (error) {
      toast.error("Failed to load events ❌");
    } finally {
      setLoading(false);
    }
  }, [authFetch, EVENTS_URL]);

  useEffect(() => {
    if (!enabled) return;
    fetchEvents();
  }, [enabled, fetchEvents]);

  // ---------------------------------------------------------
  // ADD EVENT
  // ---------------------------------------------------------
  const addEvent = async (data: any) => {
    try {
      const payload = {
        title: data.title,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        time_schedule: data.time,
        exhibitors_count: data.exhibitors,
        buyers_count: data.buyers,
        countries_count: data.countries,
        sectors_count: data.sectors,
        description: data.description,
        is_active: data.is_past ? false : true,
      };

      const res = await authFetch(EVENTS_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create event");

      toast.success("Event created 🎉");
      await fetchEvents();
    } catch (error) {
      toast.error("Failed to create event ❌");
    }
  };

  // ---------------------------------------------------------
  // EDIT EVENT
  // ---------------------------------------------------------
  const editEvent = async (data: any) => {
    if (!editingItem && !data.id) return;

    try {
      const id = data.id ?? editingItem!.id;

      const payload = {
        title: data.title,
        location: data.location,
        start_date: data.start_date,
        end_date: data.end_date,
        time_schedule: data.time,
        exhibitors_count: data.exhibitors,
        buyers_count: data.buyers,
        countries_count: data.countries,
        sectors_count: data.sectors,
        description: data.description,
        is_active: data.is_past ? false : true,
      };

      const res = await authFetch(`${EVENTS_URL}${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to update event");

      toast.success("Event updated ✨");
      setEditingItem(null);
      await fetchEvents();
    } catch (error) {
      toast.error("Failed to update event ❌");
    }
  };

  // ---------------------------------------------------------
  // DELETE EVENT
  // ---------------------------------------------------------
  const deleteEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await authFetch(`${EVENTS_URL}${id}/`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete event");

      toast.success("Event deleted 🗑️");
      await fetchEvents();
    } catch (error) {
      toast.error("Failed to delete event ❌");
    }
  };

  return {
    events,
    loading,
    editingItem,
    setEditingItem,
    addEvent,
    editEvent,
    deleteEvent,
    refetch: fetchEvents,
  };
}

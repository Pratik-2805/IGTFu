"use client";

import { useState } from "react";
import { Plus, Edit, Trash2, Calendar, MapPin, X } from "lucide-react";
import { Event } from "@/utils/api";

interface EventsTabProps {
  events: Event[];
  addEvent: (data: any) => void;
  editEvent: (data: any) => void;
  deleteEvent: (id: number) => void;
  loading: boolean;
}

export default function EventsTab({
  events,
  addEvent,
  editEvent,
  deleteEvent,
  loading,
}: EventsTabProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
  };

  if (loading) {
    return (
      <div className="py-40 flex justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading events...</p>
        </div>
      </div>
    );
  }

  // ---------- Helper to mass-normalize numbers that might be "400+" strings etc.
  const normalizeNumberLike = (val: any) => {
    if (val == null) return val;
    const asStr = String(val).trim();
    // If numeric-ish, return number; else return original string
    const digits = asStr.replace(/[^\d]/g, "");
    if (digits.length > 0 && digits.length <= 7 && /^\d+$/.test(digits)) {
      // if original contained non-digit characters, keep original (e.g. "400+")
      if (/\D/.test(asStr)) return asStr;
      return Number(digits);
    }
    return asStr;
  };

  // Build payload from form element (robust)
  // Replace existing buildPayloadFromForm with this
  const buildPayloadFromForm = (formEl: HTMLFormElement) => {
    const fd = new FormData(formEl);

    // Read the 'is_past' checkbox specifically (your form uses name="is_past")
    const isPastRaw = fd.get("is_past");
    // When checkbox is unchecked, FormData.get returns null. When checked, it returns "on" by default.
    const is_past =
      isPastRaw === null
        ? false
        : String(isPastRaw) === "true" || String(isPastRaw) === "on";

    // ensure numeric-ish fields become numbers when possible (or null)
    const toNumberOrNull = (v: FormDataEntryValue | null) => {
      if (v == null) return null;
      const s = String(v).trim();
      // allow plain numbers only
      if (/^\d+$/.test(s)) return Number(s);
      return s; // keep "400+" style if user typed that intentionally
    };

    const payload: any = {
      // these are the *form-shaped* keys your useEvents hook expects:
      title: String(fd.get("title") || "").trim(),
      location: String(fd.get("location") || "").trim(),
      // include venue (important for PUT/validation) — add a field in the form later if needed
      venue: String(fd.get("venue") || "").trim(),
      start_date: String(fd.get("start_date") || "").trim(),
      end_date: String(fd.get("end_date") || "").trim(),
      // hook expects `time` (it maps to time_schedule later)
      time: String(fd.get("time") || "").trim(),

      exhibitors: toNumberOrNull(fd.get("exhibitors")),
      buyers: toNumberOrNull(fd.get("buyers")),
      countries: toNumberOrNull(fd.get("countries")),
      sectors: toNumberOrNull(fd.get("sectors")),

      description: String(fd.get("description") || "").trim(),

      // high-level boolean the hook expects
      is_past,
    };

    return payload;
  };

  return (
    <div>
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-serif text-3xl">Manage Events ({events.length})</h2>

        <button
          onClick={() => {
            setEditingItem(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Event
        </button>
      </div>

      {/* EVENTS GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-muted/30 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-serif text-2xl mb-2">{event.title}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingItem(event);
                    setShowModal(true);
                  }}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteEvent(event.id)}
                  className="p-2 hover:bg-red-500/10 text-red-500 rounded-md transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-primary" />
                <span>
                  {new Date(event.start_date).toLocaleDateString()} —{" "}
                  {new Date(event.end_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{event.time}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 text-sm border-t pt-4">
              <p>
                <b>Exhibitors:</b> {event.exhibitors}
              </p>
              <p>
                <b>Buyers:</b> {event.buyers}
              </p>
              <p>
                <b>Countries:</b> {event.countries}
              </p>
              <p>
                <b>Sectors:</b> {event.sectors}
              </p>
            </div>

            <p className="text-sm mt-4 text-muted-foreground">
              {event.description}
            </p>

            <span
              className={`inline-block mt-4 px-3 py-1 rounded-full text-xs font-medium ${
                event.is_active
                  ? "bg-green-500 text-white"
                  : "bg-gray-600 text-white"
              }`}
            >
              {event.is_active ? "UPCOMING" : "PAST EVENT"}
            </span>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full shadow-xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-background">
              <h2 className="font-serif text-2xl">
                {editingItem ? "Edit Event" : "Add Event"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-muted rounded-md transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formEl = e.currentTarget as HTMLFormElement;
                const payload = buildPayloadFromForm(formEl);

                // Debug logs — open browser console to see these

                // Call the hook functions with a clean, deterministic payload
                if (editingItem) {
                  // include id for clarity (the hook will use editingItem.id)
                  editEvent({ ...payload, id: editingItem.id });
                } else {
                  addEvent(payload);
                }

                closeModal();
              }}
              className="p-6 space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Event Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingItem?.title || ""}
                  required
                  className="w-full px-4 py-2 rounded-md bg-background border border-border"
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  defaultValue={editingItem?.location || ""}
                  required
                  className="w-full px-4 py-2 rounded-md bg-background border border-border"
                />
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    defaultValue={editingItem?.start_date || ""}
                    required
                    className="w-full px-4 py-2 rounded-md bg-background border border-border"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    name="end_date"
                    defaultValue={editingItem?.end_date || ""}
                    required
                    className="w-full px-4 py-2 rounded-md bg-background border border-border"
                  />
                </div>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium mb-2">Time</label>
                <input
                  type="text"
                  name="time"
                  defaultValue={editingItem?.time || ""}
                  placeholder="10:00 AM - 7:00 PM"
                  required
                  className="w-full px-4 py-2 rounded-md bg-background border border-border"
                />
              </div>

              {/* Numbers */}
              <div className="grid md:grid-cols-2 gap-4">
                <InputField
                  label="Exhibitors"
                  name="exhibitors"
                  defaultValue={editingItem?.exhibitors}
                />
                <InputField
                  label="Buyers"
                  name="buyers"
                  defaultValue={editingItem?.buyers}
                />
                <InputField
                  label="Countries"
                  name="countries"
                  defaultValue={editingItem?.countries}
                />
                <InputField
                  label="Sectors"
                  name="sectors"
                  defaultValue={editingItem?.sectors}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={editingItem?.description || ""}
                  rows={3}
                  required
                  className="w-full px-4 py-2 rounded-md bg-background border border-border resize-none"
                />
              </div>

              {/* Past Event Checkbox — we still include hidden/checkbox but payload builder is authoritative */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="is_past"
                  defaultChecked={editingItem ? !editingItem.is_active : false}
                  className="w-4 h-4"
                />
                <span className="text-sm">Mark as Past Event</span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 rounded-md border border-border hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
                >
                  {editingItem ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* Small helper component inside file */
function InputField({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | readonly string[] | undefined;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue as any}
        required
        className="w-full px-4 py-2 rounded-md bg-background border border-border"
      />
    </div>
  );
}

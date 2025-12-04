"use client";

import { useState, useEffect } from "react";
import { Loader2, ShieldAlert, Calendar } from "lucide-react";
import { toast } from "react-toastify";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const ROOT_URL = process.env.NEXT_PUBLIC_BACKEND_ROOT;

/**
 * Helper: read cookie by name
 */
function getCookie(name: string) {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";")[0];
  return undefined;
}

export default function MaintenanceSettingsTab() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [underMaintenance, setUnderMaintenance] = useState(false);
  const [dateOfOnline, setDateOfOnline] = useState("");

  const [error, setError] = useState("");

  // --------------------------------------------------
  // FETCH CURRENT SETTINGS
  // --------------------------------------------------
  const loadSettings = async () => {
    try {
      const res = await fetch(`${ROOT_URL}/`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        setUnderMaintenance(data.under_maintenance || false);
        setDateOfOnline(data.date_of_online || "");
      } else {
        setError(data.detail || "Failed to load settings");
      }
    } catch {
      setError("Network error");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadSettings();
  }, []);

  // --------------------------------------------------
  // SAVE SETTINGS
  // --------------------------------------------------
  const saveSettings = async () => {
    setSaving(true);

    try {
      const accessToken = getCookie("access");

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

      // Validation: if under maintenance, date must be selected
      if (underMaintenance && !dateOfOnline) {
        toast.error("Please select an expected online date.");
        setSaving(false);
        return;
      }

      const res = await fetch(`${ROOT_URL}/system/update/`, {
        method: "POST",
        credentials: "include",
        headers,
        body: JSON.stringify({
          under_maintenance: underMaintenance,
          date_of_online: underMaintenance ? dateOfOnline : null,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        toast.success("System settings updated.");
      } else {
        toast.error(
          data.detail || data.message || "Failed to update settings."
        );
      }
    } catch {
      toast.error("Network error.");
    }

    // 👇 NEW 500ms delay to smooth UX
    setTimeout(() => {
      setSaving(false);
    }, 500);
  };

  // --------------------------------------------------
  // Handle toggle
  // --------------------------------------------------
  const handleToggle = () => {
    const nextState = !underMaintenance;
    setUnderMaintenance(nextState);

    if (!nextState) {
      setDateOfOnline("");
    }

    toast.info(
      nextState ? "Maintenance mode enabled" : "Maintenance mode disabled"
    );
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        Loading settings…
      </div>
    );
  }

  if (error) {
    return <div className="py-20 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-muted/30 p-6 rounded-lg border shadow-sm">
        <h2 className="font-serif text-3xl mb-4">Maintenance Mode</h2>

        <p className="text-sm text-muted-foreground mb-6">
          Enable maintenance mode to temporarily take the site offline.
        </p>

        {/* Toggle */}
        <div className="flex items-center justify-between py-4 border-b">
          <div>
            <p className="font-medium">Under Maintenance</p>
            <p className="text-sm text-muted-foreground">
              Visitors will see a maintenance page.
            </p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={underMaintenance}
              onChange={handleToggle}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* Date Input — only show when ON */}
        {underMaintenance && (
          <div className="mt-6">
            <label className="block font-medium mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Expected Online Date
            </label>

            <input
              type="datetime-local"
              value={dateOfOnline}
              onChange={(e) => setDateOfOnline(e.target.value)}
              className="w-full border px-4 py-2 rounded-md bg-background"
            />
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={saveSettings}
          disabled={saving}
          className="mt-6 bg-primary text-primary-foreground px-6 py-3 rounded-md hover:bg-primary/90 flex items-center gap-2"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <ShieldAlert className="w-5 h-5" /> Save Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

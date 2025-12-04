"use client";

import { Home, RefreshCw, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import maintenanceAnimation from "@/public/animations/maintenance.json";

export default function MaintenancePage() {
  const [isRetrying, setIsRetrying] = useState(false);
  const [onlineTime, setOnlineTime] = useState<string | null>(null);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => window.location.reload(), 500);
  };

  // Fetch date_of_online from Django REST API
  useEffect(() => {
    async function getData() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_ROOT}/`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data?.date_of_online) {
          const date = new Date(data.date_of_online);
          const formatter = new Intl.DateTimeFormat("en-US", {
            weekday: "short",
            hour: "2-digit",
            minute: "2-digit",
            month: "short",
            day: "numeric",
          });

          setOnlineTime(formatter.format(date));
        }
      } catch (e) {
      }
    }

    getData();
  }, []);

  const floatingAnimation = {
    y: [-8, 8, -8],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 bg-background text-foreground">
      <div className="w-full max-w-4xl">
        <div className="text-center space-y-10">
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary">
            Under Maintenance
          </h1>

          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            We're currently performing scheduled maintenance to improve your
            experience.
          </p>

          {/* Animation */}
          <div className="flex justify-center">
            <div className="w-full max-w-xl aspect-video">
              <Lottie animationData={maintenanceAnimation} loop autoplay />
            </div>
          </div>

          {/* Online Time */}
          <div className="mx-4 p-5 rounded-xl bg-card border border-border shadow-sm flex items-start gap-4">
            <CalendarCheck className="h-6 w-6 text-primary" />
            <div>
              <h3 className="text-lg font-semibold">
                Estimated Time Back Online
              </h3>
              <p className="text-muted-foreground">
                {onlineTime ?? "Fetching time…"}
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto px-4 pt-6">
            {/* Refresh */}
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="
                w-full flex-1 flex items-center justify-center gap-2 
                bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow
                disabled:bg-muted disabled:text-muted-foreground
              "
            >
              <RefreshCw
                className={`h-5 w-5 ${isRetrying ? "animate-spin" : ""}`}
              />
              {isRetrying ? "Refreshing…" : "Refresh Page"}
            </button>

            {/* Home */}
            <Link
              href="/"
              className="
                w-full flex-1 flex items-center justify-center gap-2 
                bg-card border border-border rounded-lg shadow px-6 py-3
                hover:bg-accent transition-colors
              "
            >
              <Home className="h-5 w-5" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

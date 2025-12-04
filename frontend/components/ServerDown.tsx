"use client";

import { motion } from "framer-motion";
import {
  Home,
  RefreshCw,
  ArrowLeft,
  Wifi,
  WifiOff,
  ServerOff,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";

type ErrorType = "OFFLINE" | "SERVER_DOWN";

export default function ServerDown() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== "undefined" ? navigator.onLine : true
  );
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateStatus = () => setIsOnline(navigator.onLine);

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setTimeout(() => window.location.reload(), 600);
  };

  const glitchAnimation = {
    x: [-2, 2, -2, 2, 0],
    transition: { duration: 0.4, repeat: Infinity, repeatDelay: 3 },
  };

  const pulseAnimation = {
    scale: [1, 1.04, 1],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
  };

  const {
    icon: MainIcon,
    title,
    message,
  } = useMemo(() => {
    if (!isOnline)
      return {
        icon: WifiOff,
        title: "No Internet Connection",
        message:
          "Your device appears to be offline. Please check your network connection.",
      };

    return {
      icon: ServerOff,
      title: "Service Unavailable",
      message:
        "Our servers are temporarily unreachable. We're working to restore access soon.",
    };
  }, [isOnline]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      {/* ---- Header ---- */}
      <div className="w-full max-w-3xl text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-primary flex items-center justify-center gap-3">
          <ServerOff className="h-8 w-8 text-primary" />
          Server Down
        </h1>
        <p className="mt-2 text-muted-foreground text-sm sm:text-base">
          The server is currently down. Please try again shortly.
        </p>
      </div>

      {/* ---- Main Block ---- */}
      <div className="w-full max-w-md text-center space-y-10">
        {/* Error Code */}
        <div>
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-extrabold text-primary">
            <motion.span animate={glitchAnimation}>
              {isOnline ? "503" : "---"}
            </motion.span>
          </h1>
        </div>

        {/* Status Text */}
        <div className="space-y-4 px-3">
          <div className="flex justify-center items-center gap-3">
            <MainIcon className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-bold">{title}</h2>
          </div>

          <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
            {message}
          </p>

          {/* Online/Offline Indicator */}
          <div className="flex justify-center mt-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card border border-border shadow-sm">
              {isOnline ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    Connected
                  </span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    Offline
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ---- Buttons Section ---- */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          {/* Retry Button */}
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-3 rounded-lg shadow-md hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed transition"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Retrying..." : "Retry"}
          </button>

          {/* Home Button */}
          <Link href="/" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-card border border-border hover:bg-accent shadow-sm transition">
              <Home className="h-4 w-4" />
              Home
            </button>
          </Link>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-card border border-border hover:bg-accent shadow-sm transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>
      </div>
    </div>
  );
}

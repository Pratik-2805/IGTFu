"use client";

import { Home, Search, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Lottie from "lottie-react";
import notFoundAnimation from "@/public/animations/404.json";

export default function NotFound() {
  const floatingAnimation = {
    y: [-8, 8, -8],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  const pulseAnimation = {
    scale: [1, 1.03, 1],
    transition: {
      duration: 2.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 bg-background text-foreground">
      <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl">
        <div className="text-center space-y-10">
          {/* Title */}
          <div className="space-y-5">
            <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-serif font-bold text-primary">
              Page Not Found
            </h1>

            <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg">
              Oops! The page you're looking for doesn’t exist or has been moved.
            </p>
          </div>

          {/* Lottie Animation */}
          <div className="flex justify-center px-4">
            <div className="relative w-full max-w-md md:max-w-lg aspect-video flex items-center justify-center">
              <Lottie animationData={notFoundAnimation} loop autoplay />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto px-4 pt-6">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="
                w-full sm:flex-1 flex items-center justify-center gap-2
                bg-primary text-primary-foreground px-6 py-3 rounded-lg shadow-lg
                hover:bg-primary/90 transition-colors text-sm sm:text-base
              "
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>

            {/* Home Button */}
            <div className="w-full sm:flex-1">
              <Link
                href="/"
                className="
                  flex items-center justify-center gap-2 w-full
                  bg-card border border-border text-foreground px-6 py-3 
                  rounded-lg shadow-sm hover:bg-accent transition-colors
                  text-sm sm:text-base font-medium
                "
              >
                <Home className="h-5 w-5" />
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

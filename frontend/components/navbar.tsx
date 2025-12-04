"use client";

import type React from "react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef } from "react";
import Image from "next/image";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [pressProgress, setPressProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  const handleLogoMouseDown = () => {
    const startTime = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / 3000) * 100, 100);
      setPressProgress(progress);
    }, 50);

    const timer = setTimeout(() => {
      router.push("/login");
      setPressProgress(0);
      if (progressInterval.current) clearInterval(progressInterval.current);
    }, 3000);

    setPressTimer(timer);
  };

  const handleLogoMouseUp = () => {
    const wasShortPress = pressProgress < 100;
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
    setPressProgress(0);
    if (wasShortPress && pressProgress > 0) router.push("/");
  };

  const handleLogoClick = () => {
    if (pressProgress === 0) router.push("/");
  };

  const handleLogoTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    handleLogoMouseDown();
  };

  const handleLogoTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    handleLogoMouseUp();
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/exhibition", label: "Exhibition" },
    { href: "/categories", label: "Categories" },
    { href: "/visitors", label: "Visitors" },
    { href: "/gallery", label: "Gallery" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-70 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="relative">
              <button
                className="relative focus:outline-none cursor-pointer"
                onMouseDown={handleLogoMouseDown}
                onMouseUp={handleLogoMouseUp}
                onMouseLeave={handleLogoMouseUp}
                onClick={handleLogoClick}
                onTouchStart={handleLogoTouchStart}
                onTouchEnd={handleLogoTouchEnd}
                onTouchCancel={handleLogoMouseUp}
                aria-label="IGTF Logo - Press and hold for 3 seconds to access admin"
              >
                <Image
                  src="/igtf-logo.webp"
                  alt="IGTF Logo"
                  width={150}
                  height={56}
                  className="h-14 select-none pointer-events-none"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />

                {/* Progress bar */}
                {pressProgress > 0 && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-100"
                      style={{ width: `${pressProgress}%` }}
                    />
                  </div>
                )}
              </button>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`transition-colors duration-500 ${
                    pathname === link.href
                      ? "text-primary font-medium"
                      : "text-foreground hover:text-primary"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block relative">
              <button
                className="
    relative 
    px-6 py-2 
    rounded-md 
    font-medium 
    text-background 
    transition-all 
    duration-500 
    overflow-hidden
    bg-gradient-to-r 
    from-[oklch(0.35_0.07_250)] 
    via-[oklch(0.75_0.12_75)] 
    to-[oklch(0.35_0.07_250)]
    bg-[length:200%_200%]
    animate-gradient-move
  "
                onClick={() => setModalOpen(true)}
                onMouseEnter={() => setModalOpen(true)}
              >
                Register Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`transition-colors duration-500 ${
                      pathname === link.href
                        ? "text-primary font-medium"
                        : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                ))}
                <button
                  className="w-full bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90 transition-all duration-500 font-medium"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setModalOpen(true);
                  }}
                >
                  Register Now
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modal (Tailwind Only) */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 rounded-lg shadow-xl p-6 max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
            onMouseLeave={() => setModalOpen(false)} // closes on hover out
          >
            <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
              Register As
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Choose how you’d like to register for the event
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="w-full bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-all duration-300"
                onClick={() => {
                  setModalOpen(false);
                  router.push("/exhibition#registration-form");
                }}
              >
                Exhibitor
              </button>
              <button
                className="w-full border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300"
                onClick={() => {
                  setModalOpen(false);
                  router.push("/visitors#visitor-registration");
                }}
              >
                Visitor
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

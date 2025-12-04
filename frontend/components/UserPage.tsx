"use client";

import { useEffect } from "react";
import { ChatBot } from "@/components/chat-bot";
import { Navbar } from "@/components/navbar";
import { Footer } from "./footer";
import Image from "next/image";

export default function HomePage() {
  // --- FIX: Reinitialize scroll animations on component mount ---
  useEffect(() => {
    const elements = document.querySelectorAll(
      ".scroll-animate, .scroll-animate-zoom, .scroll-animate-right"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="pt-20">
        {/* HERO SECTION */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden animate-fade-in">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="/background-video.mp4" type="video/mp4" />
          </video>

          <div className="absolute inset-0 bg-black/75" />

          <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto animate-slide-up">
            <p className="text-sm md:text-base tracking-[0.3em] uppercase mb-6 animate-fade-in-delay-1">
              Welcome To
            </p>

            <h1 className="font-serif text-6xl md:text-8xl lg:text-10xl mb-8 animate-fade-in-delay-2">
              Indo Global Trade Fair
            </h1>

            <div className="flex items-center justify-center gap-4 mb-6 animate-fade-in-delay-3">
              <div className="h-px w-24 bg-white/50" />
              <p className="text-sm md:text-base tracking-widest uppercase">
                Save The Date
              </p>
              <div className="h-px w-24 bg-white/50" />
            </div>

            <h2 className="text-2xl md:text-4xl mb-8 font-light animate-fade-in-delay-4">
              16 Categories, 1 Platform, Inspiring Global Trade
            </h2>

            <p className="text-lg md:text-xl mb-12 max-w-3xl mx-auto animate-fade-in-delay-5">
              December 2025 - Bombay Exhibitions Center
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-6">
              <a href="/visitors">
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-700 px-8 py-3 rounded-md hover:scale-105 text-lg font-medium tracking-wider uppercase">
                  Visitor Registration
                </button>
              </a>

              <a href="/exhibition">
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-black transition-all duration-700 px-8 py-3 rounded-md hover:scale-105 text-lg font-medium tracking-wider uppercase">
                  Exhibitor Registration
                </button>
              </a>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <section className="py-8 bg-primary text-primary-foreground overflow-hidden">
          <div className="whitespace-nowrap animate-scroll">
            <span className="inline-block px-8 text-lg">
              Hardware & Tools | Toys | Chemical | Electronics & Components |
              Auto Parts | Construction Material | Agriculture & Equipment's |
              Plastic & Packaging | Sports | Food & Beverage | Pharma | Surgical
              Devices | Gifting & Stationary | Furniture | Kitchen Wear | Spices
              | Footwear | Home Décor |
            </span>
          </div>
        </section>

        {/* PM MODI SECTION */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Image */}
              <div className="relative scroll-animate-zoom flex justify-center">
                <div className="relative w-1/2 aspect-4/5 rounded-lg overflow-hidden border-8 border-white shadow-2xl">
                  <Image
                    src="/pm-modi.webp"
                    alt="Hon'ble Prime Minister Shri Narendra Modi"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="space-y-6 scroll-animate-right">
                <h3 className="font-serif text-3xl md:text-4xl">
                  Vision: Local to Global
                </h3>

                <p className="text-lg text-muted-foreground leading-relaxed">
                  Inspired by Hon'ble Prime Minister Shri Narendra Modi's
                  visionary initiative
                </p>

                <blockquote className="border-l-4 border-primary pl-6 italic text-lg text-muted-foreground">
                  "Make in India, Make for the World - Let us transform local
                  craftsmanship into global excellence."
                </blockquote>

                <p className="text-muted-foreground leading-relaxed">
                  The Indo Global Trade Fair embodies this vision by creating a
                  platform where Indian MSMEs can showcase their capabilities
                  globally.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="py-16 lg:py-24 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="scroll-animate">
                <div className="text-6xl md:text-7xl font-serif font-bold text-primary mb-3">
                  400+
                </div>
                <p className="text-muted-foreground">Exhibitors</p>
              </div>

              <div className="scroll-animate animation-delay-100">
                <div className="text-6xl md:text-7xl font-serif font-bold text-primary mb-3">
                  6000+
                </div>
                <p className="text-muted-foreground">Trade Buyers</p>
              </div>

              <div className="scroll-animate animation-delay-200">
                <div className="text-6xl md:text-7xl font-serif font-bold text-primary mb-3">
                  40+
                </div>
                <p className="text-muted-foreground">Countries</p>
              </div>

              <div className="scroll-animate animation-delay-300">
                <div className="text-6xl md:text-7xl font-serif font-bold text-primary mb-3">
                  16
                </div>
                <p className="text-muted-foreground">Sectors</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-16 lg:py-24 px-4 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-5xl mb-6 font-bold">
              Ready to Expand Your Business Globally?
            </h2>

            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
              Join India’s premier B2B trade platform connecting manufacturers
              with international buyers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/exhibition" className="w-full sm:w-auto">
                <button className="w-full bg-white text-primary hover:bg-white/90 px-8 py-3.5 rounded-md text-lg font-semibold shadow-lg hover:scale-105 transition">
                  Become an Exhibitor
                </button>
              </a>

              <a href="/about" className="w-full sm:w-auto">
                <button className="w-full bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-3.5 rounded-md text-lg font-semibold hover:scale-105 transition">
                  Learn More
                </button>
              </a>
            </div>
          </div>
        </section>
      </div>
      <Footer />
      <ChatBot />
    </div>
  );
}

"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatBot } from "@/components/chat-bot";
import { useState, useEffect } from "react";
import Image from "next/image";
import Slider from "@/components/Slider";

export default function AboutPage() {
  const [banner, setBanner] = useState<string | null>(null);
  const [whyExhibitImages, setWhyExhibitImages] = useState<string[]>([]);
  const [whyChooseImages, setWhyChooseImages] = useState<string[]>([]);

  type GalleryItem = { image: string };

  const loadImages = async (
    section: string,
    setter: (v: string[]) => void
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery/?page=about&section=${section}`,
        { cache: "no-store" }
      );

      if (!res.ok) return;

      const data = await res.json();

      const items: GalleryItem[] = Array.isArray(data)
        ? data
        : (data.results ?? []);

      setter(items.map((img) => img.image));
    } catch (err) {
    }
  };

  useEffect(() => {
    // Load Banner
    (async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/gallery/?page=about&section=banner`,
          { cache: "no-store" }
        );
        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results ?? [];
        if (items.length > 0) setBanner(items[0].image);
      } catch (err) {
      }
    })();

    loadImages("why_exhibit", setWhyExhibitImages);
    loadImages("why_choose_igtf", setWhyChooseImages);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />

      <div className="pt-20">
        {/* HERO */}
        <section className="relative py-10 sm:py-14 lg:py-16 px-4 bg-linear-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4">
              About IGTF
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground px-4">
              India's Premier B2B Trade Platform Connecting Local Excellence
              with Global Markets
            </p>
          </div>
        </section>

        {/* BANNER */}
        {banner && (
          <section className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
            <div className="max-w-6xl mx-auto">
              <div className="relative w-full overflow-hidden rounded-xl shadow-xl border border-border">
                <Image
                  src={banner}
                  alt="IGTF Banner"
                  width={2000}
                  height={1200}
                  className="w-full h-auto object-cover"
                  priority
                />
              </div>
            </div>
          </section>
        )}

        {/* STORY */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl mb-6">
              Our Story
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Indo-Global Trade Fair 2025 is more than just an exhibition – it's a transformative platform where Indian enterprise meets the world.
              </p>
              <p>
                IGTF & Sitarahub create a seamless path for Indian makers and suppliers to enter global markets.
              </p>
              <p>
                With strategic locations, curated foot traffic, and unparalleled brand visibility — IGTF ensures exhibitors reach serious, ready buyers.
              </p>
            </div>
          </div>
        </section>

        {/* WHY EXHIBIT */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            {/* SLIDER FIRST ON MOBILE */}
            <div className="order-1 md:order-2">
              <Slider images={whyExhibitImages} />
            </div>

            {/* TEXT SECOND ON MOBILE */}
            <div className="space-y-6 order-2 md:order-1">
              <h3 className="font-serif text-3xl">Why Exhibit?</h3>
              <p className="text-muted-foreground leading-relaxed">
                Showcase your brand to a global audience of international buyers and industry leaders.
              </p>
              <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                <li className="flex gap-3"><span className="text-primary">•</span> Network with buyers from 40+ countries</li>
                <li className="flex gap-3"><span className="text-primary">•</span> Exclusive media coverage</li>
                <li className="flex gap-3"><span className="text-primary">•</span> Connect with 6000+ trade visitors</li>
                <li className="flex gap-3"><span className="text-primary">•</span> Hosted buyer programs</li>
                <li className="flex gap-3"><span className="text-primary">•</span> Flexible stall & sponsorship packages</li>
              </ul>
            </div>

          </div>
        </section>

        {/* WHY CHOOSE IGTF */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-muted/30">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

            {/* SLIDER FIRST ON MOBILE */}
            <div className="order-1 md:order-1">
              <Slider images={whyChooseImages} />
            </div>

            {/* TEXT SECOND ON MOBILE */}
            <div className="space-y-6 order-2 md:order-2">
              <h3 className="font-serif text-3xl">Why Choose IGTF?</h3>
              <p className="text-muted-foreground leading-relaxed">
                IGTF is a premier B2B platform tailored for serious business expansion.
              </p>
              <ul className="space-y-3 text-muted-foreground text-sm sm:text-base">
                <li className="flex gap-3"><span className="text-primary">•</span> Exceptional visibility & footfall</li>
                <li className="flex gap-3"><span className="text-primary">•</span> 16+ high-demand sectors</li>
                <li className="flex gap-3"><span className="text-primary">•</span> Deep B2B networking ecosystem</li>
                <li className="flex gap-3"><span className="text-primary">•</span> Strategic opportunities for growth</li>
              </ul>
            </div>

          </div>
        </section>

        {/* MISSION & VISION */}
        <section className="py-16 px-4 bg-background">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
            <div className="bg-muted/30 p-8 rounded-lg">
              <h3 className="font-serif text-2xl mb-4">Our Mission</h3>
              <p className="text-muted-foreground">
                To empower Indian MSMEs by connecting them with global buyers & accelerating economic growth.
              </p>
            </div>
            <div className="bg-muted/30 p-8 rounded-lg">
              <h3 className="font-serif text-2xl mb-4">Our Vision</h3>
              <p className="text-muted-foreground">
                To become Asia’s leading trade platform, driving India’s “Local to Global” movement.
              </p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
}

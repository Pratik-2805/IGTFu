"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ChatBot } from "@/components/chat-bot";

interface CategoryData {
  id: number;
  name: string;
  description: string;
  icon: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const CATEGORY_API_URL = `${BASE_URL}/categories/`;

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{ name: string; imageUrl: string }[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [overlayVisible, setOverlayVisible] = useState(false);

  /** -------------------------------------------------------
   *  🔥 FETCH CATEGORIES FROM BACKEND (with pagination fix)
   *  ------------------------------------------------------- */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(CATEGORY_API_URL, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          setCategories([]);
          return;
        }

        let data = await response.json();

        // Django REST Framework pagination support
        if (data && data.results) {
          data = data.results;
        }

        if (!Array.isArray(data)) {
          setCategories([]);
          return;
        }

        // Map API data → frontend carousel format
        const formatted = data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          imageUrl: cat.image, // backend absolute URL
        }));


        setCategories(formatted);
      } catch (error) {
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  /** Auto slide animation */
  useEffect(() => {
    if (categories.length === 0) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % categories.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [categories]);

  /** Overlay fade animation */
  useEffect(() => {
    setOverlayVisible(false);
    const timer = setTimeout(() => setOverlayVisible(true), 300);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  /** Slide styling */
  const getSlideStyle = (index: number) => {
    const offset = index - activeIndex;
    const total = categories.length;
    const half = Math.floor(total / 2);
    let position = offset;

    if (offset > half) position = offset - total;
    if (offset < -half) position = offset + total;

    const translateX = position * 160;
    const scale = 1 - Math.abs(position) * 0.1;
    const zIndex = 50 - Math.abs(position);
    const opacity = Math.abs(position) > 4 ? 0 : 1;

    return {
      transform: `translateX(${translateX}px) scale(${scale})`,
      zIndex,
      opacity,
      transition: "all 0.8s ease",
    };
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="pt-15">
        {/* Hero */}
        <section className="relative py-12 px-4 bg-gradient-to-b from-muted/30 to-background text-center">
          <h1 className="font-serif text-5xl md:text-6xl mb-4">Exhibition Categories</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Explore dynamic sectors representing diverse industries
          </p>
        </section>

        {/* Animations */}
        <style jsx global>{`
          @keyframes slideUpFade {
            0% {
              opacity: 0;
              transform: translateY(15px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideUpFade {
            animation: slideUpFade 0.6s ease-out forwards;
          }

          @keyframes fadeInOverlay {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          .animate-fadeInOverlay {
            animation: fadeInOverlay 0.5s ease-in forwards;
          }
        `}</style>

        {/* Carousel */}
        <section className="py-10 sm:py-12 bg-gradient-to-b from-[#FEF9F4] to-[#E59E54]/30 relative overflow-hidden">
          <div className="relative flex items-center justify-center h-[380px] sm:h-[460px] md:h-[520px]">
            <div className="relative w-full flex items-center justify-center h-full">

              {categories.length === 0 ? (
                <p className="text-muted-foreground text-xl">Loading categories...</p>
              ) : (
                categories.map((cat, i) => {
                  const isActive = i === activeIndex;
                  return (
                    <div
                      key={i}
                      className="absolute rounded-2xl overflow-hidden shadow-lg transition-transform duration-700 w-[200px] h-[280px] sm:w-[260px] sm:h-[360px] md:w-[300px] md:h-[430px]"
                      style={getSlideStyle(i)}
                    >
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="300px"
                        className={`object-cover rounded-2xl transition-all duration-700 ${isActive ? "brightness-100" : "brightness-75 blur-[1px]"
                          }`}
                        onError={(e: any) => {
                          e.currentTarget.src = "/categories/default.webp"; // fallback image
                        }}
                      />

                      {isActive && (
                        <>
                          {overlayVisible && (
                            <div className="absolute inset-0 bg-black/40 animate-fadeInOverlay" />
                          )}
                          {overlayVisible && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent py-4 animate-slideUpFade">
                              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-semibold text-center drop-shadow-lg">
                                {cat.name}
                              </h3>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Prev Button */}
            <button
              onClick={() =>
                setActiveIndex((prev) => (prev - 1 + categories.length) % categories.length)
              }
              className="absolute left-8 top-1/2 -translate-y-1/2 bg-[#002B5B] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#003C7B] transition z-50 shadow-md"
            >
              &#8249;
            </button>

            {/* Next Button */}
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % categories.length)}
              className="absolute right-8 top-1/2 -translate-y-1/2 bg-[#002B5B] text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-[#003C7B] transition z-50 shadow-md"
            >
              &#8250;
            </button>
          </div>
        </section>



        {/* All Categories Grid Section */}
        <section className="py-12 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif text-center mb-10">
              Browse All Categories
            </h2>

            {categories.length === 0 ? (
              <p className="text-center text-muted-foreground text-lg">
                Loading categories...
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {categories.map((cat, index) => (
                  <div
                    key={index}
                    className="bg-muted/20 rounded-xl p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer"
                  >
                    <div className="w-full h-28 relative mb-3 rounded-lg overflow-hidden">
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        className="object-cover"
                        onError={(e: any) => {
                          e.currentTarget.src = "/categories/default.webp";
                        }}
                      />
                    </div>
                    <p className="text-center font-medium text-sm">{cat.name}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>


        {/* CTA */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl md:text-4xl mb-6">Find Your Industry Sector</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Register as an exhibitor in your category and connect with thousands of trade buyers.
            </p>
            <a href="/exhibition">
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-md hover:bg-primary/90 transition-all duration-500 font-medium text-lg">
                Register Now
              </button>
            </a>
          </div>
        </section>

        <Footer />
        <ChatBot />
      </div>
    </div>
  );
}

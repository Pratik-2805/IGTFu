"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { ChatBot } from "@/components/chat-bot";
import { Footer } from "@/components/footer";
import GallerySlider from "@/components/GallerySlider";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const GALLERY_API_URL = `${BASE_URL}/gallery/`;

interface GalleryItem {
  id: number;
  title?: string;
  description?: string;
  image: string;
}

export default function GalleryPage() {
  const [bannerImages, setBannerImages] = useState<string[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loadingBanner, setLoadingBanner] = useState(true);
  const [loadingGrid, setLoadingGrid] = useState(true);

  // Infinite scroll state
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // LOAD BANNER
  useEffect(() => {
    const loadBanner = async () => {
      try {
        const res = await fetch(
          `${GALLERY_API_URL}?page=gallery&section=main`,
          { cache: "no-store" }
        );

        const data = await res.json();
        const items = Array.isArray(data) ? data : data.results ?? [];

        setBannerImages(items.map((img: any) => img.image).filter(Boolean));
      } catch (err) {
      } finally {
        setLoadingBanner(false);
      }
    };

    loadBanner();
  }, []);

  // INITIAL LOAD OF PAGE 1 (EXHIBITION MOMENTS)
  useEffect(() => {
    const loadExhibitionMoments = async () => {
      try {
        const res = await fetch(
          `${GALLERY_API_URL}?page=gallery&section=exhibition_moments`,
          { cache: "no-store" }
        );

        const data = await res.json();

        // If paginated DRF response
        if (data.results) {
          setGallery(data.results);
          setNextUrl(data.next);
        } else {
          // Non-paginated fallback
          setGallery(data);
          setNextUrl(null);
        }
      } catch (err) {
      } finally {
        setLoadingGrid(false);
      }
    };

    loadExhibitionMoments();
  }, []);

  // LOAD MORE WHEN SCROLLING TO BOTTOM
  const loadMore = useCallback(async () => {
    if (!nextUrl || loadingMore) return;

    setLoadingMore(true);

    try {
      const res = await fetch(nextUrl, { cache: "no-store" });
      const data = await res.json();

      setGallery(prev => [...prev, ...(data.results || data)]);
      setNextUrl(data.next || null);
    } catch (err) {
    } finally {
      setLoadingMore(false);
    }
  }, [nextUrl, loadingMore]);

  // SCROLL HANDLER
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 300; // 300px from bottom

      if (bottom && nextUrl && !loadingMore) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextUrl, loadingMore, loadMore]);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="pt-20">

        {/* HERO */}
        <section className="relative py-16 px-4 bg-gradient-to-b from-muted/30 to-background">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-5xl md:text-6xl mb-6 animate-fade-in">
              Gallery
            </h1>
            <p className="text-xl text-muted-foreground animate-fade-in-delay-1">
              Explore highlights from our previous exhibitions
            </p>
          </div>
        </section>

        {/* BANNER */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <div className="relative w-full rounded-xl overflow-hidden border border-border">
              {loadingBanner && (
                <div className="w-full h-[400px] md:h-[550px] bg-white animate-pulse rounded-xl" />
              )}

              {!loadingBanner && bannerImages.length > 1 && (
                <GallerySlider images={bannerImages} />
              )}
            </div>
          </div>
        </section>

        {/* GRID */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">
                Exhibition Moments
              </h2>
              <p className="text-muted-foreground">
                Captured memories of business, innovation & global trade
              </p>
            </div>

            {/* GRID ITEMS */}
            {loadingGrid ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-full aspect-[5/4] bg-white rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {gallery.map((item) => (
                  <div
                    key={item.id}
                    className="relative w-full aspect-[5/4] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <Image
                      src={item.image}
                      alt={item.title || "gallery"}
                      fill
                      className="object-cover rounded-lg/10"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* LOADING MORE SPINNER */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-gray-300 border-t-primary rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </section>

        {/* MODAL */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="relative w-[500px] h-[400px]">
              <Image
                src={selectedImage}
                alt="Preview"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      <Footer />
      <ChatBot />
    </div>
  );
}

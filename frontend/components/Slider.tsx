"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Slider({ images }: { images: string[] }) {
    const [index, setIndex] = useState(0);
    const [paused, setPaused] = useState(false);

    // Auto-slide (cannot be conditional)
    useEffect(() => {
        if (paused || images.length === 0) return;

        const t = setInterval(() => {
            setIndex((i) => (i + 1) % images.length);
        }, 4000);

        return () => clearInterval(t);
    }, [paused, images.length]);

    // If no images — show fallback UI
    if (!images || images.length === 0) {
        return (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No images uploaded
            </div>
        );
    }

    const next = () => setIndex((i) => (i + 1) % images.length);
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

    return (
        <div
            className="relative aspect-square rounded-lg overflow-hidden border-4 sm:border-8 border-white shadow-2xl group"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            {images.map((src, i) => (
                <Image
                    key={i}
                    src={src}
                    alt={`Slide ${i}`}
                    fill
                    className={`absolute inset-0 object-cover transition-opacity duration-700
                        ${i === index ? "opacity-100" : "opacity-0"}`}
                />
            ))}

            <button
                onClick={prev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white 
                text-primary rounded-full p-2 sm:p-3 md:opacity-0 md:group-hover:opacity-100 shadow-lg z-10"
            >
                ‹
            </button>

            <button
                onClick={next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white 
                text-primary rounded-full p-2 sm:p-3 md:opacity-0 md:group-hover:opacity-100 shadow-lg z-10"
            >
                ›
            </button>
        </div>
    );
}

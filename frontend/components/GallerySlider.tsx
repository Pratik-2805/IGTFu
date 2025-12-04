"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
    images: string[];
}

export default function GallerySlider({ images }: Props) {
    const [index, setIndex] = useState(0);
    const [loaded, setLoaded] = useState(false);

    const next = () => setIndex((i) => (i + 1) % images.length);
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

    useEffect(() => {
        const timer = setInterval(next, 4000);
        return () => clearInterval(timer);
    }, [images.length]);

    return (
        <div
            className="
                relative w-full mx-auto max-w-[2000px]
                h-[300px] 
                sm:h-[380px] 
                md:h-[500px] 
                lg:h-[600px] 
                xl:h-[640px]
                overflow-hidden 
            "
        >
            {/* Skeleton */}
            {!loaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
            )}

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
                <Image
                    key={index}
                    src={images[index]}
                    alt={`Gallery Slide ${index}`}
                    fill
                    className="object-contain transition-opacity duration-500"
                    onLoadingComplete={() => setLoaded(true)}
                />
            </div>

            {/* Left Arrow */}
            <button
                className="
                    absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 
                    bg-white/40 backdrop-blur-md 
                    p-2 sm:p-3 rounded-full 
                    hover:bg-white/70 transition
                "
                onClick={prev}
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Right Arrow */}
            <button
                className="
                    absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 
                    bg-white/40 backdrop-blur-md 
                    p-2 sm:p-3 rounded-full 
                    hover:bg-white/70 transition
                "
                onClick={next}
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-0 right-0 flex justify-center gap-2">
                {images.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setIndex(i)}
                        className={`
                            cursor-pointer rounded-full transition
                            ${i === index ? "bg-white" : "bg-white/40"}
                            h-2 w-2 sm:h-3 sm:w-3
                        `}
                    />
                ))}
            </div>
        </div>
    );
}

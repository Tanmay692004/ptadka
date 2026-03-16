"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { VideoCard } from "./VideoCard";
import type { YouTubeVideo } from "@/lib/youtube";

interface YouTubeCarouselProps {
  videos: YouTubeVideo[];
}

export function YouTubeCarousel({ videos }: YouTubeCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start", slidesToScroll: 1 },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  if (videos.length === 0) return null;

  return (
    <section id="videos" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-center opacity-90">
          Latest from the Channel
        </h2>

        <div className="relative">
          {/* Prev button */}
          <button
            onClick={scrollPrev}
            className="absolute -left-3 md:-left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Next button */}
          <button
            onClick={scrollNext}
            className="absolute -right-3 md:-right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black/80 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center transition-all duration-200 shadow-lg backdrop-blur-sm"
            aria-label="Next video"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Embla viewport */}
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-2">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="flex-[0_0_100%] min-w-0 md:flex-[0_0_calc(33.333%)] lg:flex-[0_0_calc(33.333%)] pl-2"
                >
                  <VideoCard video={video} isFeatured={index === 0} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "bg-yellow-400 w-5"
                  : "bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import { VideoCard } from "./VideoCard";
import type { YouTubeVideo } from "@/lib/youtube";

export function CarouselSkeleton() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="h-9 w-64 mx-auto rounded bg-white/10 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded p-6 bg-white/5 animate-pulse h-72" />
          ))}
        </div>
      </div>
    </section>
  );
}

interface YouTubeCarouselWrapperProps {
  videos: YouTubeVideo[];
}

// Server-renderable fallback (no carousel, just grid) for no-JS or SSR
export function YouTubeCarouselWrapper({ videos }: YouTubeCarouselWrapperProps) {
  if (videos.length === 0) return null;
  return (
    <section id="videos" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-8 text-center opacity-90">
          Latest from the Channel
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <VideoCard key={video.id} video={video} isFeatured={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

import Image from "next/image";
import { Play } from "lucide-react";
import { Paperclip } from "@/components/ui/Paperclip";
import { formatViewCount, formatDate } from "@/lib/utils";
import type { YouTubeVideo } from "@/lib/youtube";

interface VideoCardProps {
  video: YouTubeVideo;
  isFeatured?: boolean;
}

export function VideoCard({ video, isFeatured }: VideoCardProps) {
  return (
    <a
      href={video.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block relative notebook-page rounded-none p-6 pt-8 shadow-lg hover:shadow-2xl transition-shadow duration-300 mx-2 h-full"
      style={{
        backgroundImage: `
          linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.07) 95%),
          linear-gradient(transparent 95%, rgba(0,0,0,0.07) 95%)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <Paperclip />

      {isFeatured && (
        <span className="absolute top-3 left-6 text-xs font-semibold tracking-widest uppercase opacity-70 text-yellow-500">
          Latest
        </span>
      )}

      {/* Thumbnail */}
      <div className="relative w-full aspect-video rounded overflow-hidden mb-4 bg-black">
        <Image
          src={video.thumbnail}
          alt={video.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-all duration-300">
          <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
            <Play className="w-6 h-6 text-white fill-white ml-1" />
          </div>
        </div>
      </div>

      {/* Meta */}
      <h3 className="font-playfair font-semibold text-base leading-snug mb-2 line-clamp-2">
        {video.title}
      </h3>
      <p className="text-xs opacity-50 italic">
        {formatDate(video.publishedAt)} · {formatViewCount(video.viewCount)}
      </p>
    </a>
  );
}

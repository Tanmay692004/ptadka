"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Video, AlertTriangle, ExternalLink } from "lucide-react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import type { YouTubeVideo } from "@/lib/youtube";

interface SearchResult {
  videos: YouTubeVideo[];
  aiResponse: string | null;
  videoExists: boolean;
  error?: string;
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export function SearchModal({ open, onClose, initialQuery = "" }: SearchModalProps) {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery(initialQuery);
      setResult(null);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, initialQuery]);

  const handleSearch = async (q: string) => {
    if (!q.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const [searchRes] = await Promise.all([
        fetch(`/api/search?q=${encodeURIComponent(q)}`).then((r) => r.json() as Promise<SearchResult>),
        // Fire and forget: record query after search
        fetch("/api/search/record", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        }).catch(() => {}),
      ]);
      setResult(searchRes);
    } catch {
      setResult({ videos: [], aiResponse: "An error occurred. Please try again.", videoExists: false });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="notebook-page p-0 overflow-hidden max-h-[80vh] flex flex-col mx-4 shadow-2xl dark:border-white/10 border-black/10 border rounded-none">
        <DialogHeader className="p-5 pb-3 border-b border-white/10">
          <DialogTitle className="font-playfair text-xl">Search pahadi तड़का</DialogTitle>
        </DialogHeader>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-3 px-5 py-3 border-b border-white/10">
          <Search className="w-4 h-4 opacity-50 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a dish, trail, or topic..."
            className="flex-1 bg-transparent outline-none text-base"
          />
          {query && (
            <button type="button" onClick={() => { setQuery(""); setResult(null); }} className="opacity-50 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="submit"
            disabled={!query.trim() || loading}
            className="px-4 py-1.5 rounded-full text-sm font-medium bg-yellow-500 text-black hover:bg-yellow-400 disabled:opacity-40 transition-colors"
          >
            Search
          </button>
        </form>

        {/* Results area */}
        <div className="flex-1 overflow-y-auto p-5 min-h-[200px]">
          {loading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 animate-pulse">
                  <div className="w-32 h-20 rounded bg-white/10 flex-shrink-0" />
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/10 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {result && !loading && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {result.videoExists && result.videos.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Video className="w-4 h-4 text-red-400" />
                      <span className="text-sm font-medium text-green-400">Videos found on the channel</span>
                    </div>
                    {result.videos.map((video) => (
                      <motion.a
                        key={video.id}
                        href={video.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex gap-3 p-3 rounded hover:bg-white/5 transition-colors group"
                        whileHover={{ x: 4 }}
                      >
                        <div className="relative w-32 h-20 flex-shrink-0 rounded overflow-hidden bg-black">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                            sizes="128px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm line-clamp-2 group-hover:text-yellow-400 transition-colors">
                            {video.title}
                          </p>
                          <p className="text-xs opacity-50 mt-1 italic">{formatDate(video.publishedAt)}</p>
                          <span className="inline-flex items-center gap-1 text-xs text-green-400 mt-1">
                            <ExternalLink className="w-3 h-3" /> Watch on YouTube
                          </span>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Not uploaded badge */}
                    <div className="flex items-start gap-3 p-4 rounded border border-yellow-500/30 bg-yellow-500/5">
                      <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-yellow-400 text-sm">🎬 This video hasn&apos;t been uploaded yet — stay tuned!</p>
                        <p className="text-xs opacity-60 mt-1">But here&apos;s what our AI knows about it:</p>
                      </div>
                    </div>

                    {/* AI response */}
                    {result.aiResponse && (
                      <div className="p-4 rounded bg-white/5 border border-white/10 text-sm leading-relaxed opacity-90 whitespace-pre-line">
                        {result.aiResponse}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !loading && (
            <p className="text-sm opacity-40 text-center pt-6">
              Try searching for a pahadi dish, trail, or festival...
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

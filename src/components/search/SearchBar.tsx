"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { SearchModal } from "@/components/search/SearchModal";

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) setOpen(true);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-3 w-full px-4 py-3 rounded-full border border-white/20 dark:bg-white/5 bg-black/10 backdrop-blur-sm shadow-inner transition-all focus-within:border-yellow-400/60 focus-within:shadow-yellow-400/10 focus-within:shadow-lg"
      >
        <Search className="w-4 h-4 opacity-50 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClick={() => setOpen(true)}
          placeholder="Search dishes, trails, videos... ⌘K"
          className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-40"
          aria-label="Search"
          readOnly
        />
      </form>

      <SearchModal
        open={open}
        onClose={() => setOpen(false)}
        initialQuery={query}
      />
    </>
  );
}

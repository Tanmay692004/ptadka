"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Mountain } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

const SESSION_KEY = "pahaditadka_dish_chat";

export function DishChatFloat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY);
      if (saved) setMessages(JSON.parse(saved) as Message[]);
    } catch {}
  }, []);

  // Save to sessionStorage when messages change
  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {}
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const dish = input.trim();
    if (!dish || loading) return;

    const userMsg: Message = { role: "user", content: dish };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/dish-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dish }),
      });
      const data = await res.json() as { history?: string; error?: string };
      const aiMsg: Message = {
        role: "ai",
        content: data.history ?? "Sorry, I couldn't find information about that dish right now.",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="w-[360px] max-w-[calc(100vw-48px)] rounded-none shadow-2xl overflow-hidden flex flex-col notebook-page border dark:border-white/10 border-black/10"
            style={{ height: 480 }}
            initial={{ opacity: 0, scale: 0.85, y: 20, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b dark:border-white/10 border-black/10">
              <div>
                <h3 className="font-playfair font-bold text-base">🏔️ Pahadi Dish History</h3>
                <p className="text-xs opacity-50">Ask about any pahadi dish</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center opacity-40 py-8 text-sm">
                  <Mountain className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p>Ask about a pahadi dish like</p>
                  <p className="font-semibold mt-1">&ldquo;Chainsoo&rdquo;, &ldquo;Kafuli&rdquo;, &ldquo;Bal Mithai&rdquo;</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div
                    className={`max-w-[80%] rounded px-3 py-2 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "dark:bg-yellow-500/20 bg-yellow-500/30 dark:text-yellow-100 text-yellow-900 font-medium"
                        : "dark:bg-white/8 bg-black/8 dark:text-neutral-200 text-neutral-800 border dark:border-white/10 border-black/8"
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="dark:bg-white/8 bg-black/8 border dark:border-white/10 border-black/8 rounded px-4 py-2 text-sm">
                    <span className="animate-pulse">Searching the mountains</span>
                    <span className="inline-flex gap-0.5 ml-1">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="inline-block w-1 h-1 rounded-full bg-current opacity-60 animate-bounce"
                          style={{ animationDelay: `${d * 0.15}s` }}
                        />
                      ))}
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex gap-2 p-3 border-t dark:border-white/10 border-black/10"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. Kafuli, Chainsoo, Jhangora..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="w-8 h-8 rounded-full bg-yellow-500 text-black flex items-center justify-center hover:bg-yellow-400 disabled:opacity-40 transition-colors flex-shrink-0"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB button */}
      <motion.button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-4 py-3 rounded-full bg-yellow-500 text-black font-semibold text-sm shadow-xl hover:bg-yellow-400 transition-colors relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Ask AI about a pahadi dish"
      >
        {/* Pulse ring */}
        {!open && (
          <span className="absolute inset-0 rounded-full bg-yellow-500 animate-ping opacity-25 pointer-events-none" />
        )}
        <Mountain className="w-4 h-4" />
        <span>{open ? "Close" : "Ask about a dish"}</span>
      </motion.button>
    </div>
  );
}

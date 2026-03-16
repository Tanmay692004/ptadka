"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isLight = theme === "light";

  return (
    <motion.div
      className="fixed top-0 right-10 z-50 cursor-pointer select-none"
      whileHover={{ rotate: 15 }}
      onClick={() => setTheme(isLight ? "dark" : "light")}
      title={isLight ? "Switch to dark mode" : "Switch to light mode"}
    >
      {/* Chain */}
      <div className="w-1 h-14 bg-gradient-to-b from-neutral-500 to-neutral-700 mx-auto relative">
        <div className="absolute -top-0 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-neutral-600" />
      </div>

      {/* Bulb */}
      <motion.div
        className="relative w-12 h-16"
        whileHover={{ animation: "swing" }}
        animate={isLight ? { rotate: [0, 3, -3, 0] } : {}}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {/* Glass */}
        <div
          className="absolute top-0 w-12 h-12 rounded-[50%_50%_50%_50%_/_60%_60%_40%_40%] transition-all duration-500"
          style={
            isLight
              ? {
                  background: "#fff9c4",
                  boxShadow:
                    "0 0 30px rgba(255,249,196,0.8), 0 0 60px rgba(255,249,196,0.5), inset -5px -5px 15px rgba(255,255,255,0.5)",
                }
              : {
                  background: "#4a4a4a",
                  boxShadow: "inset -5px -5px 15px rgba(0,0,0,0.3)",
                }
          }
        />

        {/* Filament */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-6">
          <div
            className="absolute w-0.5 h-4 top-0 left-1.5 rounded-full transition-all duration-300"
            style={
              isLight
                ? { background: "#ff9800", boxShadow: "0 0 10px #ff9800" }
                : { background: "#555" }
            }
          />
          <div
            className="absolute w-0.5 h-4 top-0 right-1.5 rounded-full transition-all duration-300"
            style={
              isLight
                ? { background: "#ff9800", boxShadow: "0 0 10px #ff9800" }
                : { background: "#555" }
            }
          />
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-2 border-2 rounded-full transition-all duration-300"
            style={
              isLight
                ? { borderColor: "#ff9800", boxShadow: "0 0 15px #ff9800" }
                : { borderColor: "#555" }
            }
          />
        </div>

        {/* Base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-5 bg-gradient-to-b from-neutral-500 to-neutral-700 rounded-t-sm">
          <div className="absolute top-1.5 left-1.5 w-5 h-0.5 bg-neutral-600" />
          <div className="absolute top-2.5 left-1.5 w-5 h-0.5 bg-neutral-600" />
        </div>
      </motion.div>
    </motion.div>
  );
}

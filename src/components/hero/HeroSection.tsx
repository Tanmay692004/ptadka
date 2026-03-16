"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/search/SearchBar";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Videos", href: "#videos" },
  { label: "Blog", href: "#blog" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function HeroSection() {
  return (
    <motion.header
      id="home"
      className="pt-20 pb-12 px-4 text-center relative"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="font-playfair font-bold tracking-widest mb-3">
        <motion.span
          className="block text-5xl md:text-7xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          pahadi
        </motion.span>
        <motion.span
          className="block font-devanagari text-4xl md:text-6xl mt-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          तड़का
        </motion.span>
      </h1>

      <motion.p
        className="text-sm tracking-[0.3em] uppercase opacity-60 font-light mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.5 }}
      >
        The Mountains to Cities Zipline buffet
      </motion.p>

      {/* Nav */}
      <nav className="flex justify-center gap-4 flex-wrap mb-8">
        {navLinks.map((link, i) => (
          <motion.a
            key={link.href}
            href={link.href}
            className="px-5 py-2 rounded-full font-medium text-sm transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden
              dark:text-neutral-200 dark:hover:bg-white/10
              light:text-[#1a1a2e] light:hover:bg-black/10
              hover:bg-white/10"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + i * 0.08 }}
          >
            {link.label}
          </motion.a>
        ))}
      </nav>

      {/* Search */}
      <motion.div
        className="max-w-xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <SearchBar />
      </motion.div>
    </motion.header>
  );
}

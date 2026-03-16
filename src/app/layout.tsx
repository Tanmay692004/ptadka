import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { DishChatFloat } from "@/components/ai/DishChatFloat";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "pahadi तड़का — The Mountains to Cities Zipline Buffet",
  description:
    "A personal blog about mountain life, pahadi cuisine, trekking trails, and the culture of the Himalayas.",
  keywords: ["pahadi", "uttarakhand", "himachal", "mountain blog", "pahadi food", "trekking"],
  openGraph: {
    title: "pahadi तड़का",
    description: "The Mountains to Cities Zipline Buffet",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700&family=Playfair+Display:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <style>{`
          .font-playfair { font-family: 'Playfair Display', serif; }
          .font-devanagari { font-family: 'Noto Sans Devanagari', sans-serif; }
        `}</style>
      </head>
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider>
          {children}
          <DishChatFloat />
        </ThemeProvider>
      </body>
    </html>
  );
}

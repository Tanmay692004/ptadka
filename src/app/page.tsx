import { HeroSection } from "@/components/hero/HeroSection";
import { ThemeSwitcher } from "@/components/hero/ThemeSwitcher";
import { YouTubeCarousel } from "@/components/carousel/YouTubeCarousel";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { Sidebar } from "@/components/Sidebar";
import { AboutSection } from "@/components/AboutSection";
import { Footer } from "@/components/Footer";
import { getRecentUploads, type YouTubeVideo } from "@/lib/youtube";

export const revalidate = 3600;

export default async function HomePage() {
  let videos: YouTubeVideo[] = [];
  try {
    videos = await getRecentUploads(10);
  } catch {
    // YouTube API not configured yet — carousel will be hidden.
  }

  return (
    <main className="min-h-screen dark:bg-[#0a0a0a] bg-[#1a3a5c]">
      <ThemeSwitcher />
      <HeroSection />
      <YouTubeCarousel videos={videos} />
      <BlogGrid />
      <Sidebar />
      <AboutSection />
      <Footer />
    </main>
  );
}

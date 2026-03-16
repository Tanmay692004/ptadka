"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BlogCard } from "./BlogCard";

interface Post {
  slug: string;
  title: string;
  titleHindi?: string;
  excerpt: string;
  date: string;
  category: string;
  tags?: string[];
}

export function BlogGrid() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog/posts")
      .then((r) => r.json())
      .then((data: { posts: Post[] }) => setPosts(data.posts ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="blog" className="py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-playfair text-2xl md:text-3xl font-bold mb-10 text-center opacity-90">
          From the Blog
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 rounded bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center opacity-40 py-12">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post, i) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <BlogCard {...post} />
              </motion.div>
            ))}
          </div>
        )}

        {!loading && posts.length > 0 && (
          <div className="text-center mt-10">
            <a
              href="/blog"
              className="inline-block border-2 border-current px-8 py-3 rounded-full font-medium opacity-70 hover:opacity-100 hover:-translate-y-0.5 transition-all duration-300"
            >
              View All Posts →
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

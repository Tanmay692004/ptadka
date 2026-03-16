import { Paperclip } from "@/components/ui/Paperclip";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

interface BlogCardProps {
  slug: string;
  title: string;
  titleHindi?: string;
  excerpt: string;
  date: string;
  category: string;
  tags?: string[];
}

export function BlogCard({ slug, title, titleHindi, excerpt, date, category, tags }: BlogCardProps) {
  return (
    <article
      className="group relative notebook-page p-8 pt-10 shadow-lg hover:shadow-2xl transition-all duration-500 min-h-[360px] flex flex-col"
      style={{
        backgroundImage: `
          linear-gradient(90deg, transparent 95%, rgba(0,0,0,0.07) 95%),
          linear-gradient(transparent 95%, rgba(0,0,0,0.07) 95%)
        `,
        backgroundSize: "20px 20px",
      }}
    >
      <Paperclip />

      <span className="text-xs tracking-widest uppercase opacity-50 font-medium mb-3 block">
        {category}
      </span>

      <h2 className="font-playfair text-2xl font-bold mb-1 leading-tight">
        {title}
      </h2>
      {titleHindi && (
        <p className="font-devanagari text-lg opacity-70 mb-4">{titleHindi}</p>
      )}

      <p className="text-xs opacity-50 italic mb-4">{formatDate(date)}</p>

      <p className="text-sm leading-relaxed opacity-80 flex-1 line-clamp-4">
        {excerpt}
      </p>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full border border-white/20 opacity-60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/blog/${slug}`}
        className="mt-5 inline-block text-sm font-semibold border-2 border-current px-5 py-2 rounded-full opacity-70 hover:opacity-100 hover:translate-x-1 transition-all duration-300 self-start"
      >
        Read More →
      </Link>
    </article>
  );
}

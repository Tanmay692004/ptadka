import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogPost } from "@/models/BlogPost";
import { formatDate } from "@/lib/utils";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params;

  await connectToDatabase();
  const post = await BlogPost.findOne({ slug, published: true }).lean();

  if (!post) return notFound();

  return (
    <main className="min-h-screen dark:bg-[#0a0a0a] bg-[#1a3a5c]">
      <article className="max-w-3xl mx-auto px-4 py-20">
        <p className="text-xs tracking-widest uppercase opacity-60 mb-3">{post.category}</p>
        <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-2">{post.title}</h1>
        {post.titleHindi && <p className="font-devanagari text-2xl opacity-75 mb-3">{post.titleHindi}</p>}
        <p className="text-sm opacity-50 italic mb-10">{formatDate((post.date as Date).toISOString())}</p>

        <div className="notebook-page p-8 shadow-xl leading-relaxed whitespace-pre-line text-base">
          {post.content}
        </div>
      </article>
    </main>
  );
}

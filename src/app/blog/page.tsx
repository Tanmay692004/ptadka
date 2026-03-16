import { connectToDatabase } from "@/lib/mongodb";
import { BlogPost, IBlogPost } from "@/models/BlogPost";
import { BlogCard } from "@/components/blog/BlogCard";

export const revalidate = 300;

export default async function BlogPage() {
  let posts: Partial<IBlogPost>[] = [];
  try {
    await connectToDatabase();
    posts = await BlogPost.find({ published: true })
      .sort({ date: -1 })
      .select("slug title titleHindi excerpt date category tags")
      .lean();
  } catch {
    // DB not configured
  }

  return (
    <main className="min-h-screen dark:bg-[#0a0a0a] bg-[#1a3a5c]">
      <div className="max-w-6xl mx-auto px-4 py-20">
        <h1 className="font-playfair text-4xl md:text-5xl font-bold text-center mb-12 opacity-90">
          All Posts
        </h1>

        {posts.length === 0 ? (
          <p className="text-center opacity-40">No posts yet. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {posts.map((post) => (
              <BlogCard
                key={post.slug}
                slug={post.slug!}
                title={post.title!}
                titleHindi={post.titleHindi}
                excerpt={post.excerpt!}
                date={(post.date as Date).toISOString()}
                category={post.category!}
                tags={post.tags}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

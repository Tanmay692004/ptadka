import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { BlogPost } from "@/models/BlogPost";

export const revalidate = 300; // re-fetch every 5 minutes

export async function GET() {
  try {
    await connectToDatabase();
    const posts = await BlogPost.find({ published: true })
      .sort({ date: -1 })
      .limit(6)
      .select("slug title titleHindi excerpt date category tags thumbnail")
      .lean();

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("[blog/posts] Error:", error);
    return NextResponse.json({ posts: [], error: "Failed to fetch posts" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { searchChannelVideos } from "@/lib/youtube";
import { getSearchAIFallback } from "@/lib/gemini";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim();
  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    const videos = await searchChannelVideos(query);

    if (videos.length > 0) {
      return NextResponse.json({ videos, aiResponse: null, videoExists: true });
    }

    // No videos found — fall back to AI
    const aiResponse = await getSearchAIFallback(query);
    return NextResponse.json({ videos: [], aiResponse, videoExists: false });
  } catch (error) {
    console.error("[search] Error:", error);
    return NextResponse.json(
      { error: "Search failed", videos: [], aiResponse: null, videoExists: false },
      { status: 500 }
    );
  }
}

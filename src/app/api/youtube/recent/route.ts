import { NextResponse } from "next/server";
import { getRecentUploads } from "@/lib/youtube";

export const revalidate = 3600; // ISR: re-fetch every hour

export async function GET() {
  try {
    const videos = await getRecentUploads(10);
    return NextResponse.json({ videos });
  } catch (error) {
    console.error("[youtube/recent] Error:", error);
    return NextResponse.json({ videos: [], error: "Failed to fetch videos" }, { status: 500 });
  }
}

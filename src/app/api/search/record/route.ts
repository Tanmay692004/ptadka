import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { SearchQuery } from "@/models/SearchQuery";
import { normalizeSearchQuery } from "@/lib/groq";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { query?: string };
    const rawQuery = body.query?.trim();
    if (!rawQuery) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    // Normalize via Groq (deduplication)
    const { canonicalName, category, aliases } = await normalizeSearchQuery(rawQuery);

    await connectToDatabase();

    // Try to find existing entry by canonical name OR any known alias
    const existing = await SearchQuery.findOne({
      $or: [
        { canonicalName: { $regex: new RegExp(`^${canonicalName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
        { aliases: { $regex: new RegExp(`^${rawQuery.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") } },
      ],
    });

    if (existing) {
      // Increment count and add alias if new
      const newAliases = [...new Set([...existing.aliases, rawQuery.toLowerCase()])];
      await SearchQuery.updateOne(
        { _id: existing._id },
        {
          $inc: { count: 1 },
          $set: {
            aliases: newAliases,
            lastSearchedAt: new Date(),
          },
        }
      );
      return NextResponse.json({ recorded: true, canonicalName: existing.canonicalName, isNew: false });
    }

    // Create new entry
    await SearchQuery.create({
      canonicalName,
      category,
      aliases: [...new Set([rawQuery.toLowerCase(), ...aliases.map((a) => a.toLowerCase())])],
      count: 1,
      lastSearchedAt: new Date(),
    });

    return NextResponse.json({ recorded: true, canonicalName, isNew: true });
  } catch (error) {
    console.error("[search/record] Error:", error);
    // Don't fail the user experience if recording fails
    return NextResponse.json({ recorded: false }, { status: 200 });
  }
}

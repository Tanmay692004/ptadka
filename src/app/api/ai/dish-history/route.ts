import { NextRequest, NextResponse } from "next/server";
import { getDishHistory } from "@/lib/gemini";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { dish?: string };
    const dish = body.dish?.trim();
    if (!dish) {
      return NextResponse.json({ error: "Dish name is required" }, { status: 400 });
    }

    const history = await getDishHistory(dish);
    return NextResponse.json({ history });
  } catch (error) {
    console.error("[ai/dish-history] Error:", error);
    const message = error instanceof Error ? error.message : "Failed to get dish history";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

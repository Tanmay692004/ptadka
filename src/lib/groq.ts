import Groq from "groq-sdk";

export interface QueryNormalizationResult {
  canonicalName: string;
  category: string;
  aliases: string[];
}

const NORMALIZATION_SYSTEM_PROMPT = `You are an expert on Pahadi (Uttarakhand and Himachal Pradesh) cuisine and culture.

Your task is to normalize search queries about Pahadi dishes or topics.

Given a search query, you must:
1. Identify the canonical (standard) name for the dish or topic
2. Categorize it (e.g., "Pahadi Dish", "Trekking", "Mountain Life", "Culture", "Festival", "Recipe", "Travel", "Other")
3. List common spelling variants or aliases for the dish

IMPORTANT rules:
- "chesu", "chaisu", "chaesu", "chaiso" are all the same dish → canonical: "Chainsoo"  
- "aloo ke gutke" and "aloo gutke" are the same → canonical: "Aloo ke Gutke"
- Normalize spelling variations, transliteration differences, and common misspellings
- If not a Pahadi topic, still provide best canonical name

Respond ONLY with valid JSON in this exact format:
{
  "canonicalName": "Canonical Name Here",
  "category": "Category Here",
  "aliases": ["alias1", "alias2"]
}`;

export async function normalizeSearchQuery(query: string): Promise<QueryNormalizationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      canonicalName: query,
      category: "Other",
      aliases: [query.toLowerCase()],
    };
  }

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: NORMALIZATION_SYSTEM_PROMPT },
      { role: "user", content: `Normalize this search query: "${query}"` },
    ],
    model: "llama3-8b-8192",
    temperature: 0.1,
    max_tokens: 200,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as Partial<QueryNormalizationResult>;

  return {
    canonicalName: parsed.canonicalName ?? query,
    category: parsed.category ?? "Other",
    aliases: parsed.aliases ?? [],
  };
}

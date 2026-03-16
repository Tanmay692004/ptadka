import Groq from "groq-sdk";

export interface QueryNormalizationResult {
  standardized_name: string;
  original_query: string;
}

const NORMALIZATION_SYSTEM_PROMPT = `You are a culinary data normalizer specializing in Indian and specifically Pahadi/Uttarakhand cuisine.
Your task is to take a user's search query for a dish and return a standardized, master name for that dish to be used as a database key.

Rules:
1. Correct any spelling mistakes or phonetic variations (e.g., "chesu", "chaesu", "cheshuu" must all resolve to "Chaisu").
2. Capitalize the first letter of the standardized name.
3. If the query is completely unrelated to food, cuisine, or mountains, return "Invalid".
4. You must ONLY output a raw JSON object with the keys "standardized_name" and "original_query". Do not include markdown formatting, backticks, or any other text.

Example 1:
User: "how to make chaesu"
Output: {"standardized_name": "Chaisu", "original_query": "how to make chaesu"}

Example 2:
User: "bhat ki churkani"
Output: {"standardized_name": "Bhatt Ki Churkani", "original_query": "bhat ki churkani"}`;

function titleCase(value: string): string {
  return value
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function normalizeSearchQuery(query: string): Promise<QueryNormalizationResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return {
      standardized_name: titleCase(query),
      original_query: query,
    };
  }

  const groq = new Groq({ apiKey });

  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: NORMALIZATION_SYSTEM_PROMPT },
      { role: "user", content: query },
    ],
    model: "llama3-8b-8192",
    temperature: 0.1,
    max_tokens: 120,
    response_format: { type: "json_object" },
  });

  const content = completion.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content) as Partial<QueryNormalizationResult>;
  const standardized = (parsed.standardized_name ?? "").trim();
  const normalizedName = standardized.toLowerCase() === "invalid"
    ? "Invalid"
    : titleCase(standardized || query);

  return {
    standardized_name: normalizedName,
    original_query: parsed.original_query?.trim() || query,
  };
}

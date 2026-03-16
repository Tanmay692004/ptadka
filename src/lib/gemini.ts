import { GoogleGenerativeAI } from "@google/generative-ai";

const geminiApiKey = process.env.GEMINI_API_KEY ?? "";
const genAI = new GoogleGenerativeAI(geminiApiKey);

const FALLBACK_MODELS = [
  process.env.GEMINI_MODEL,
  "gemini-2.0-flash",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash-8b",
].filter((m): m is string => Boolean(m));

async function generateWithFallback(prompt: string): Promise<string> {
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  let lastError: unknown;

  for (const modelName of FALLBACK_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError instanceof Error
    ? new Error(`All Gemini model attempts failed. Last error: ${lastError.message}`)
    : new Error("All Gemini model attempts failed");
}

const DISH_HISTORY_SYSTEM_PROMPT = `You are an expert on Pahadi (Uttarakhand and Himachal Pradesh) cuisine and food history.
When asked about a dish, provide:
1. A rich historical and cultural background of the dish
2. Traditional ingredients and preparation methods
3. Regional variants (if any) across the Himalayas
4. Cultural significance and occasions when it's made
5. Nutritional aspects from a traditional perspective

Keep your response engaging, warm, and between 200-350 words. Write as if you are a Pahadi elder sharing family stories.
Do not mention modern restaurants or commercial versions. Focus on authentic home cooking traditions.`;

export async function getDishHistory(dish: string): Promise<string> {
  const prompt = `${DISH_HISTORY_SYSTEM_PROMPT}\n\nTell me about the history and cultural significance of: "${dish}"`;

  return generateWithFallback(prompt);
}

export async function getSearchAIFallback(query: string): Promise<string> {
  const prompt = `You are a knowledgeable assistant about Pahadi (Uttarakhand/Himachal Pradesh) culture, food, and mountain life.
  
Someone searched for: "${query}"

Provide a helpful, informative response (100-200 words) about this topic from a Pahadi perspective. 
If it's a dish, briefly describe it. If it's a place or tradition, explain it.
Be warm and authentic. Do not make up facts.`;

  return generateWithFallback(prompt);
}

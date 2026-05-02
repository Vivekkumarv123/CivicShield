import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { env } from "../../../lib/env";
import { logger } from "../../../lib/logger";

const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GEMINI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { text, targetLang } = await req.json();

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Missing text or targetLang" }, { status: 400 });
    }

    const prompt = `Translate the following election-related text into ${
      targetLang === "hi" ? "Hindi (हिन्दी)" : targetLang === "mr" ? "Marathi (मराठी)" : "English"
    }. 
    Maintain the same tone and ensure civic terminology is accurate. 
    Only return the translated text.
    
    Text: ${text}`;

    const result = await generateText({
      model: google("gemini-2.5-flash-lite"),
      prompt: prompt,
    });

    return NextResponse.json({ translatedText: result.text.trim() });
  } catch (error) {
    logger.error("api_translate_error", { error: String(error) });
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}

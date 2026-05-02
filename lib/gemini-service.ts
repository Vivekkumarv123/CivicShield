import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, streamObject, generateText } from "ai";
import { z } from "zod";
import { env } from "./env";
import { electionDataStr } from "./election-data";
import { logger } from "./logger";

/**
 * Google Generative AI instance configured with environment-safe API keys.
 */
const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_GEMINI_API_KEY,
});

const SYSTEM_PROMPT = `
You are CivicShield, an India election education assistant. 
You ONLY answer questions about Indian elections and the ECI. 
Context about Indian Elections:
${electionDataStr}

CRITICAL: Debunking rumors, administrative election processes (like Aadhaar integration), and ECI rules is EXPLICITLY IN SCOPE. 
ONLY return the OUT_OF_SCOPE JSON if the query is 100% unrelated to Indian politics or elections (e.g., recipes, coding, or foreign countries).
`;

const getLocalePrompt = (locale: string) => {
  const map: Record<string, string> = {
    en: "RESPOND ONLY IN ENGLISH. All text fields, summaries, and descriptions must be in English.",
    hi: "RESPOND ONLY IN HINDI (हिन्दी). All text fields, summaries, and descriptions must be in Hindi.",
    mr: "RESPOND ONLY IN MARATHI (मराठी). All text fields, summaries, and descriptions must be in Marathi."
  };
  return map[locale] || map.en;
};

export const explainSchema = z.object({
  type: z.literal("EXPLAIN"),
  timeline: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    durationDays: z.number().optional(),
    icon: z.string()
  })),
  summary: z.string(),
  relatedTopics: z.array(z.string()),
  language: z.enum(["en", "hi", "mr"])
});

export const factCheckSchema = z.object({
  type: z.literal("FACTCHECK"),
  verdict: z.enum(["True", "False", "Partially True", "Unverified"]),
  confidence: z.number().min(0).max(1),
  explanation: z.string(),
  sources: z.array(z.object({
    url: z.string(),
    title: z.string(),
    snippet: z.string().optional()
  })).optional().default([]),
  groundingChunks: z.array(z.string()).optional().default([])
});

export const outOfScopeSchema = z.object({
  type: z.literal("OUT_OF_SCOPE"),
  message: z.string()
});

export const explainUnionSchema = z.discriminatedUnion("type", [explainSchema, outOfScopeSchema]);
export const factCheckUnionSchema = z.discriminatedUnion("type", [factCheckSchema, outOfScopeSchema]);


/**
 * CivicShield AI Orchestration Service
 * Handles multilingual explanations and real-time fact-checking using Gemini 2.5 Flash.
 */
export const geminiService = {
  /**
   * Streams a structured educational breakdown for a given election topic.
   * @param message - The user's query
   * @param locale - Target language for the response (en, hi, mr)
   */
  streamExplanation: async (message: string, locale: string) => {
    try {
      const result = await streamObject({
        model: google("gemini-2.5-flash-lite"),
        schema: explainUnionSchema,
        output: "object",
        system: SYSTEM_PROMPT + "\n" + getLocalePrompt(locale) + "\nProvide an educational breakdown as a structured timeline. IF the request is 100% unrelated to Indian elections/politics, return the OUT_OF_SCOPE JSON object.",
        prompt: message,
      });

      return result;
    } catch (e: any) {
      logger.error("gemini_error", { errorCode: e.name, model: "gemini-2.5-flash-lite" });
      throw e;
    }
  },

  /**
   * Performs real-time fact-checking using Google Search Grounding.
   * @param message - The claim or rumor to verify
   * @param locale - Target language for the analysis
   */
  factCheck: async (message: string, locale: string) => {
    try {
      const result = await generateObject({
        model: google("gemini-2.5-flash-lite"),
        schema: factCheckUnionSchema,
        system: `You are CivicShield, an expert fact-checker for the Election Commission of India (ECI). 
CRITICAL: Debunking rumors and misinformation is EXPLICITLY IN SCOPE. Use Google Search.
IF the query is 100% unrelated to Indian politics or elections, return the OUT_OF_SCOPE JSON object.
Otherwise, return the fact-check JSON.` + "\n" + getLocalePrompt(locale),
        prompt: message,

        tools: [{ googleSearch: {} }]
      });

      return result.object;
    } catch (e: any) {
      logger.error("gemini_error", { errorCode: e.name, model: "gemini-2.5-flash-lite" });
      throw e;
    }
  }
};

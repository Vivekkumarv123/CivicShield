import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject, streamObject, generateText } from "ai";
import { z } from "zod";
import { env } from "./env";
import { electionDataStr } from "./election-data";
import { logger } from "./logger";

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
    en: "Respond in English.",
    hi: "Respond in Hindi (हिन्दी).",
    mr: "Respond in Marathi (मराठी)."
  };
  return map[locale] || map.en;
};

export const explainSchema = z.object({
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
  verdict: z.enum(["True", "False", "Partially True", "Unverified"]),
  confidence: z.number(),
  explanation: z.string(),
  sources: z.array(z.object({ 
    url: z.string(), 
    title: z.string(), 
    snippet: z.string().optional() 
  })).optional().default([]),
  groundingChunks: z.array(z.string()).optional().default([])
}).catchall(z.any());

export const outOfScopeSchema = z.object({
  type: z.literal("OUT_OF_SCOPE"),
  message: z.string()
});

export const geminiService = {
  checkScope: async (message: string) => {
     const result = await generateText({
       model: google("gemini-2.5-flash-lite"),
       system: SYSTEM_PROMPT + "\nCheck if the following query is in scope. If not, return the OUT_OF_SCOPE JSON. If it IS in scope, return 'VALID_SCOPE'.",
       prompt: message
     });
     
     const text = result.text.trim();
     if (text.includes("OUT_OF_SCOPE")) {
        return { type: "OUT_OF_SCOPE", message: "I can only help with Indian election processes. Please ask me about voting, candidates, ECI rules, or the election timeline." };
     }
     return null;
  },

  streamExplanation: async (message: string, locale: string) => {
    try {
      const scopeCheck = await geminiService.checkScope(message);
      if (scopeCheck) {
          throw new Error("OUT_OF_SCOPE_CAUGHT");
      }

      const result = await streamObject({
        model: google("gemini-2.5-flash-lite"),
        schema: explainSchema as z.ZodType<z.infer<typeof explainSchema>>,
        output: "object",
        system: SYSTEM_PROMPT + "\n" + getLocalePrompt(locale) + "\nProvide an educational breakdown of the request as a structured timeline. Ensure 'language' exactly matches the active locale.",
        prompt: message,
      });

      return result;
    } catch (e: any) {
      if (e.message !== "OUT_OF_SCOPE_CAUGHT") {
          logger.error("gemini_error", { errorCode: e.name, model: "gemini-1.5-pro" });
      }
      throw e;
    }
  },

  factCheck: async (message: string, locale: string) => {
    try {
       const scopeCheck = await geminiService.checkScope(message);
       if (scopeCheck) {
           return outOfScopeSchema.parse(scopeCheck);
       }

      const result = await generateObject({
        model: google("gemini-2.5-flash-lite"),
        schema: factCheckSchema as z.ZodType<z.infer<typeof factCheckSchema>>,
        system: `You are CivicShield, an expert fact-checker for the Election Commission of India (ECI). 
CRITICAL: Debunking rumors, fake voting methods (like online/mobile voting), EVM hacking claims, and WhatsApp misinformation is EXPLICITLY IN SCOPE. You must fact-check these claims using the Google Search tool. 
ONLY return the OUT_OF_SCOPE JSON if the query is 100% unrelated to Indian politics or elections (e.g., asking about recipes, coding, or foreign countries). 
For in-scope claims, use Google Search grounding and return the {verdict, confidence, sources, explanation} JSON.
` + "\n" + getLocalePrompt(locale),
        prompt: message,
        // @ts-ignore: native google search tools not strictly typed in ai sdk generic types yet, but supported by the provider
        tools: [{ googleSearch: {} }] 
      });

      return result.object;
    } catch (e: any) {
      logger.error("gemini_error", { errorCode: e.name, model: "gemini-1.5-pro" });
      throw e;
    }
  }
};

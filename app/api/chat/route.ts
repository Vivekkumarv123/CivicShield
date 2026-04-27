import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { checkRateLimit } from "../../../lib/rate-limit";
import { geminiService } from "../../../lib/gemini-service";
import { logger } from "../../../lib/logger";

const chatRequestSchema = z.object({
  message: z.string().min(1).max(500),
  locale: z.enum(["en", "hi", "mr"]).default("en"),
});

// Configure CORS
const corsHeaders = {
  "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_APP_URL || "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  try {
    // Basic CORS check on origin
    const origin = req.headers.get("origin");
    if (process.env.NODE_ENV === "production" && origin !== process.env.NEXT_PUBLIC_APP_URL) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, headers } = await checkRateLimit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429, headers: { ...corsHeaders, ...headers } }
      );
    }

    // Body Validation
    const bodyText = await req.text();
    if (!bodyText) {
        return NextResponse.json({ error: "Invalid request: empty body" }, { status: 400, headers: corsHeaders });
    }

    let parsedBody;
    try {
        parsedBody = JSON.parse(bodyText);
    } catch (e) {
        return NextResponse.json({ error: "Invalid request: bad JSON" }, { status: 400, headers: corsHeaders });
    }

    const validationResult = chatRequestSchema.safeParse(parsedBody);
    
    if (!validationResult.success) {
      if (parsedBody.message && parsedBody.message.length > 500) {
        return NextResponse.json({ error: "Message too long" }, { status: 400, headers: corsHeaders });
      }
      return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
    }

    const { message, locale } = validationResult.data;

    // Logging
    logger.info("chat_request", { locale, mode: "explain" });

    // AI Logic (Explain Mode)
    try {
       const streamOutput = await geminiService.streamExplanation(message, locale);
       const streamResponse = streamOutput.toTextStreamResponse();
       
       // Append CORS and Rate Limit headers to the stream response
       Object.entries({ ...corsHeaders, ...headers }).forEach(([key, value]) => {
           streamResponse.headers.set(key, value);
       });
       
       return streamResponse;

    } catch (e: any) {
        if (e.message === "OUT_OF_SCOPE_CAUGHT") {
            const outOfScopeResponse = { type: "OUT_OF_SCOPE", message: "I can only help with Indian election processes. Please ask me about voting, candidates, ECI rules, or the election timeline." };
            return NextResponse.json(outOfScopeResponse, { status: 200, headers: { ...corsHeaders, ...headers } });
        }
        throw e; // goes to outer catch
    }

  } catch (error) {
    logger.error("api_chat_error", { error: String(error) });
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 502, headers: corsHeaders }
    );
  }
}

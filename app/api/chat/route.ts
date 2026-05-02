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
    // Strictly validate request origin against allowed production domains to prevent CSRF
    const origin = req.headers.get("origin");
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [];
    const isAllowedOrigin = process.env.NODE_ENV === 'development' || (origin && allowedOrigins.includes(origin));

    if (process.env.NODE_ENV === "production" && !isAllowedOrigin) {
       logger.warn("403 Forbidden: Origin mismatch.", { received: origin });
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, headers } = await checkRateLimit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "CivicShield is experiencing high traffic. Please try again in a minute." },
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
      return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
    }

    const { message, locale } = validationResult.data;

    // Logging
    logger.info("chat_request", { locale, mode: "explain" });

    // AI Logic (Explain Mode)
    const streamOutput = await geminiService.streamExplanation(message, locale);
    const streamResponse = streamOutput.toTextStreamResponse();
    
    // Append CORS and Rate Limit headers
    Object.entries({ ...corsHeaders, ...headers }).forEach(([key, value]) => {
        streamResponse.headers.set(key, value);
    });
    
    return streamResponse;


  } catch (error) {
    logger.error("api_chat_error", { error: String(error) });
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 502, headers: corsHeaders }
    );
  }
}

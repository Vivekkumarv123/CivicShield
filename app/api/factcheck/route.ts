import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "../../../lib/rate-limit";
import { geminiService } from "../../../lib/gemini-service";
import { logger } from "../../../lib/logger";

const factCheckRequestSchema = z.object({
  message: z.string().min(1).max(500),
  locale: z.enum(["en", "hi", "mr"]).default("en"),
});

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
    const origin = req.headers.get("origin");
    if (process.env.NODE_ENV === "production" && origin !== process.env.NEXT_PUBLIC_APP_URL) {
       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, headers } = await checkRateLimit(ip);
    
    if (!success) {
      return NextResponse.json(
        { error: "CivicShield is experiencing high traffic. Please try again in a minute." },
        { status: 429, headers: { ...corsHeaders, ...headers } }
      );
    }

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

    const validationResult = factCheckRequestSchema.safeParse(parsedBody);
    
    if (!validationResult.success) {
      if (parsedBody.message && parsedBody.message.length > 500) {
        return NextResponse.json({ error: "Message too long" }, { status: 400, headers: corsHeaders });
      }
      return NextResponse.json({ error: "Invalid request" }, { status: 400, headers: corsHeaders });
    }

    const { message, locale } = validationResult.data;

    logger.info("chat_request", { locale, mode: "factcheck" });

    const result = await geminiService.factCheck(message, locale);
    
    return NextResponse.json(result, { 
        status: 200, 
        headers: { ...corsHeaders, ...headers } 
    });

  } catch (error) {
    logger.error("api_factcheck_error", { error: String(error) });
    return NextResponse.json(
      { error: "AI service unavailable" },
      { status: 502, headers: corsHeaders }
    );
  }
}

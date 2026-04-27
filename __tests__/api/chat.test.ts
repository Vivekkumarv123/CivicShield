/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

process.env.GOOGLE_GEMINI_API_KEY = "test_key";
process.env.UPSTASH_REDIS_REST_URL = "http://test.com";
process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
process.env.NEXT_PUBLIC_APP_URL = "http://test.com";
process.env.NODE_ENV = "test";

import { POST } from "../../app/api/chat/route";
import { geminiService } from "../../lib/gemini-service";
import { checkRateLimit } from "../../lib/rate-limit";

jest.mock("../../lib/gemini-service", () => ({
  geminiService: {
    streamExplanation: jest.fn(),
  },
}));

jest.mock("../../lib/rate-limit", () => ({
  checkRateLimit: jest.fn(),
}));

jest.mock("../../lib/logger", () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe("Chat API", () => {
  const mockRequest = (body: any) => {
    return new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: body ? JSON.stringify(body) : null,
      headers: {
        "content-type": "application/json",
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (checkRateLimit as jest.Mock).mockResolvedValue({
      success: true,
      headers: { "X-RateLimit-Remaining": "19" },
    });
  });

  it("returns 400 for missing body", async () => {
    const req = mockRequest(null);
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("Invalid request");
  });

  it("returns 400 for message too long", async () => {
    const req = mockRequest({ message: "A".repeat(501) });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Message too long");
  });

  it("returns 429 when rate limited", async () => {
    (checkRateLimit as jest.Mock).mockResolvedValue({
      success: false,
      headers: { "Retry-After": "60" },
    });
    const req = mockRequest({ message: "Hello" });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe("Rate limit exceeded");
    expect(res.headers.get("Retry-After")).toBe("60");
  });

  it("returns 200 with out_of_scope JSON from Gemini OUT_OF_SCOPE_CAUGHT", async () => {
    (geminiService.streamExplanation as jest.Mock).mockRejectedValue(new Error("OUT_OF_SCOPE_CAUGHT"));
    const req = mockRequest({ message: "Who is the US president?" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.type).toBe("OUT_OF_SCOPE");
  });

  it("returns 502 for Gemini error, abstracting raw error", async () => {
    (geminiService.streamExplanation as jest.Mock).mockRejectedValue(new Error("Some internal API fail"));
    const req = mockRequest({ message: "Hello" });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toBe("AI service unavailable");
  });

  it("returns streaming response for valid request", async () => {
    const mockToTextStreamResponse = jest.fn().mockReturnValue(new Response("stream_data", { status: 200 }));
    (geminiService.streamExplanation as jest.Mock).mockResolvedValue({
      toTextStreamResponse: mockToTextStreamResponse,
    });
    
    const req = mockRequest({ message: "Explain voting steps" });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});

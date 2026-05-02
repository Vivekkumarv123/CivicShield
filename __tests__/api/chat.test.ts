/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

// Environment Polyfill for NextRequest
if (!global.Request) {
  const { Request, Response, Headers } = require('undici');
  global.Request = Request;
  global.Response = Response;
  global.Headers = Headers;
}

process.env.GOOGLE_GEMINI_API_KEY = "test_key";
process.env.UPSTASH_REDIS_REST_URL = "http://test.com";
process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
process.env.NEXT_PUBLIC_APP_URL = "http://test.com";
(process.env as any).NODE_ENV = "test";

import { POST, OPTIONS } from "../../app/api/chat/route";
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
    warn: jest.fn(),
  },
}));

describe("Chat API", () => {
  const mockRequest = (body: any, headers = {}) => {
    return new NextRequest("http://localhost/api/chat", {
      method: "POST",
      body: body === undefined ? undefined : (typeof body === 'string' ? body : JSON.stringify(body)),
      headers: {
        "content-type": "application/json",
        ...headers
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    const mockedCheckRateLimit = checkRateLimit as jest.Mock;
    mockedCheckRateLimit.mockResolvedValue({
      success: true,
      headers: { "X-RateLimit-Remaining": "19" },
    });
  });

  it("handles OPTIONS request", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
  });

  it("returns 403 for invalid origin in production", async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";
    process.env.ALLOWED_ORIGINS = "https://safe.com";

    const req = mockRequest({ message: "test" }, { "origin": "https://evil.com" });
    const res = await POST(req);
    expect(res.status).toBe(403);

    process.env.NODE_ENV = originalEnv;
  });

  it("returns 400 for empty body", async () => {
    const req = new NextRequest("http://localhost/api/chat", { method: "POST", body: null });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request: empty body");
  });

  it("returns 400 for malformed JSON", async () => {
    const req = mockRequest("invalid-json");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request: bad JSON");
  });

  it("returns 400 for missing message in body", async () => {
    const req = mockRequest({});
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 for message too long", async () => {
    const req = mockRequest({ message: "A".repeat(501) });
    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Invalid request");
  });

  it("returns 429 when rate limited", async () => {
    const mockedCheckRateLimit = checkRateLimit as jest.Mock;
    mockedCheckRateLimit.mockResolvedValue({
      success: false,
      headers: { "Retry-After": "60" },
    });
    const req = mockRequest({ message: "Hello" });
    const res = await POST(req);
    expect(res.status).toBe(429);
    const data = await res.json();
    expect(data.error).toBe("CivicShield is experiencing high traffic. Please try again in a minute.");
    expect(res.headers.get("Retry-After")).toBe("60");
  });

  it("returns 502 for Gemini error, abstracting raw error", async () => {
    const mockedStream = geminiService.streamExplanation as jest.Mock;
    mockedStream.mockRejectedValue(new Error("Some internal API fail"));
    const req = mockRequest({ message: "Hello" });
    const res = await POST(req);
    expect(res.status).toBe(502);
    const data = await res.json();
    expect(data.error).toBe("AI service unavailable");
  });

  it("returns streaming response for valid request", async () => {
    const mockedStream = geminiService.streamExplanation as jest.Mock;
    const headerStore: Record<string, string> = {};
    mockedStream.mockResolvedValue({
      toTextStreamResponse: () => ({
        status: 200,
        headers: {
          set: (k: string, v: string) => { headerStore[k] = v; },
          get: (k: string) => headerStore[k] || null,
        },
      }),
    });

    const req = mockRequest({ message: "Explain voting steps" });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });

});

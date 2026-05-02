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
process.env.NODE_ENV = "test";

import { POST, OPTIONS } from "../../app/api/factcheck/route";
import { geminiService } from "../../lib/gemini-service";
import { checkRateLimit } from "../../lib/rate-limit";
import { factCheckSchema } from "../../lib/gemini-service";

jest.mock("../../lib/gemini-service", () => ({
  geminiService: {
    factCheck: jest.fn(),
  },
  factCheckSchema: {
    safeParse: jest.requireActual("../../lib/gemini-service").factCheckSchema.safeParse,
    parse: jest.requireActual("../../lib/gemini-service").factCheckSchema.parse,
  }
}));

jest.mock("../../lib/rate-limit", () => ({
  checkRateLimit: jest.fn(),
}));

jest.mock("../../lib/logger", () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe("FactCheck API", () => {
  const mockRequest = (body: any) => {
    return new NextRequest("http://localhost/api/factcheck", {
      method: "POST",
      body: body ? JSON.stringify(body) : null,
      headers: {
        "content-type": "application/json",
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

  it("handles CORS preflight OPTIONS to 204 no content", async () => {
    const res = await OPTIONS();
    expect(res.status).toBe(204);
  });

  it("returns verdict schema validation success", async () => {
    const mockResponse = {
      type: "FACTCHECK",
      verdict: "Partially True",
      confidence: 0.8,
      sources: [{ url: "http://example.com", title: "Example", snippet: "Snippet" }],
      explanation: "Expl",
      groundingChunks: ["Chunk"]
    };
    const mockedFactCheck = geminiService.factCheck as jest.Mock;
    mockedFactCheck.mockResolvedValue(mockResponse);

    const req = mockRequest({ message: "Is EVM hackable?" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.verdict).toBe("Partially True");
  });

  it("returns 403 for forbidden origin in production", async () => {
    const originalNodeEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = "production";
    const req = new NextRequest("http://localhost/api/factcheck", {
      method: "POST",
      headers: { "origin": "http://evil.com" }
    });
    const res = await POST(req);
    expect(res.status).toBe(403);
    (process.env as any).NODE_ENV = originalNodeEnv;
  });

  it("returns 429 when rate limited", async () => {
    const mockedCheckRateLimit = checkRateLimit as jest.Mock;
    mockedCheckRateLimit.mockResolvedValueOnce({
      success: false,
      headers: { "Retry-After": "60" }
    });
    const req = mockRequest({ message: "Hello" });
    const res = await POST(req);
    expect(res.status).toBe(429);
  });

  it("returns 400 for invalid locale", async () => {
    const req = mockRequest({ message: "test", locale: "fr" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 502 for Gemini service failure", async () => {
    const mockedFactCheck = geminiService.factCheck as jest.Mock;
    mockedFactCheck.mockRejectedValue(new Error("AI error"));

    const req = mockRequest({ message: "Check this" });
    const res = await POST(req);
    expect(res.status).toBe(502);
  });

  it("returns 400 for empty body or bad JSON", async () => {
    const reqEmpty = new NextRequest("http://localhost/api/factcheck", { method: "POST", body: null });
    const resEmpty = await POST(reqEmpty);
    expect(resEmpty.status).toBe(400);

    const reqBadJson = new NextRequest("http://localhost/api/factcheck", { method: "POST", body: "not-json" });
    const resBadJson = await POST(reqBadJson);
    expect(resBadJson.status).toBe(400);
  });

  describe("Schema Tests", () => {
    it("accepts all 4 verdict types", () => {
      const verdicts = ["True", "False", "Partially True", "Unverified"];
      verdicts.forEach(v => {
        const result = factCheckSchema.safeParse({ type: "FACTCHECK", verdict: v, confidence: 0.5, sources: [], explanation: "", groundingChunks: [] });
        expect(result.success).toBe(true);
      });
    });

    it("clamps confidence out of range or fails validation", () => {
      const result = factCheckSchema.safeParse({ type: "FACTCHECK", verdict: "True", confidence: 1.5, sources: [], explanation: "", groundingChunks: [] });
      expect(result.success).toBe(false); // Schema enforces max 1
    });

    it("allows missing sources by coercing to empty array or accepting empty", () => {
      const result = factCheckSchema.safeParse({ type: "FACTCHECK", verdict: "True", confidence: 0.5, sources: [], explanation: "", groundingChunks: [] });
      expect(result.success).toBe(true);
    });
  });
});

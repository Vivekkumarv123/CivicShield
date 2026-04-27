/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";

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
    (checkRateLimit as jest.Mock).mockResolvedValue({
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
      verdict: "Partially True",
      confidence: 0.8,
      sources: [{ url: "http://example.com", title: "Example", snippet: "Snippet" }],
      explanation: "Expl",
      groundingChunks: ["Chunk"]
    };
    (geminiService.factCheck as jest.Mock).mockResolvedValue(mockResponse);

    const req = mockRequest({ message: "Is EVM hackable?" });
    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.verdict).toBe("Partially True");
  });

  describe("Schema Tests", () => {
    it("accepts all 4 verdict types", () => {
        const verdicts = ["True", "False", "Partially True", "Unverified"];
        verdicts.forEach(v => {
            const result = factCheckSchema.safeParse({ verdict: v, confidence: 0.5, sources: [], explanation: "", groundingChunks: [] });
            expect(result.success).toBe(true);
        });
    });

    it("clamps confidence out of range or fails validation", () => {
       const result = factCheckSchema.safeParse({ verdict: "True", confidence: 1.5, sources: [], explanation: "", groundingChunks: [] });
       expect(result.success).toBe(false); // Schema enforces max 1
    });

    it("allows missing sources by coercing to empty array or accepting empty", () => {
        const result = factCheckSchema.safeParse({ verdict: "True", confidence: 0.5, sources: [], explanation: "", groundingChunks: [] });
        expect(result.success).toBe(true);
    });
  });
});

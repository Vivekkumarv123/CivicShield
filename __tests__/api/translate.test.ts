
/**
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import * as ai from "ai";

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

// Mock AI SDK at the top level
jest.mock("ai", () => ({
  generateText: jest.fn()
}));

// Import AFTER env vars and mocks
import { POST } from "../../app/api/translate/route";

describe("Translate API Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 and translated text on valid request", async () => {
    const mockedGenerateText = ai.generateText as jest.Mock;
    mockedGenerateText.mockResolvedValue({ text: "नमस्ते" });

    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "Hello", targetLang: "hi" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.translatedText).toBe("नमस्ते");
  });

  it("returns 200 for Marathi targetLang", async () => {
    const mockedGenerateText = ai.generateText as jest.Mock;
    mockedGenerateText.mockResolvedValue({ text: "नमस्कार" });

    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "Hello", targetLang: "mr" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.translatedText).toBe("नमस्कार");
    expect(mockedGenerateText).toHaveBeenCalledWith(expect.objectContaining({
      prompt: expect.stringContaining("Marathi")
    }));
  });

  it("returns 400 for missing fields", async () => {
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "Hello" }), // missing targetLang
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 500 when AI fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const mockedGenerateText = ai.generateText as jest.Mock;
    mockedGenerateText.mockRejectedValue(new Error("AI Fail"));
    const req = new NextRequest("http://localhost/api/translate", {
      method: "POST",
      body: JSON.stringify({ text: "Hello", targetLang: "en" }),
    });
    const res = await POST(req);
    expect(res.status).toBe(500);
    consoleSpy.mockRestore();
  });
});

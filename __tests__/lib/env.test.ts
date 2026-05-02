describe("Env Validation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("exports typed env object when all required vars present", () => {
    process.env.GOOGLE_GEMINI_API_KEY = "test_key";
    process.env.UPSTASH_REDIS_REST_URL = "http://test.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
    process.env.NEXT_PUBLIC_APP_URL = "http://test.com";
    process.env.NODE_ENV = "test";

    const { env } = require("../../lib/env");
    expect(env.GOOGLE_GEMINI_API_KEY).toBe("test_key");
  });

  it("throws with missing GOOGLE_GEMINI_API_KEY in production mode", () => {
    process.env.NODE_ENV = "production";
    process.env.UPSTASH_REDIS_REST_URL = "http://test.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
    process.env.NEXT_PUBLIC_APP_URL = "http://test.com";

    expect(() => {
      require("../../lib/env");
    }).toThrow(/FATAL: Missing env vars: \[GOOGLE_GEMINI_API_KEY\]/);
  });

  it("throws with missing UPSTASH_REDIS_REST_URL in production mode", () => {
    process.env.NODE_ENV = "production";
    process.env.GOOGLE_GEMINI_API_KEY = "test";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
    process.env.NEXT_PUBLIC_APP_URL = "http://test.com";

    expect(() => {
      require("../../lib/env");
    }).toThrow(/FATAL: Missing env vars: \[UPSTASH_REDIS_REST_URL\]/);
  });

});

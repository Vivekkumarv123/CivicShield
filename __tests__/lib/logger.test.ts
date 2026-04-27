describe("Logger", () => {
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;
  
  beforeAll(() => {
    process.env.GOOGLE_GEMINI_API_KEY = "test_key";
    process.env.UPSTASH_REDIS_REST_URL = "http://test.com";
    process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
    process.env.NEXT_PUBLIC_APP_URL = "http://test.com";
    process.env.NODE_ENV = "test";
  });

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, "write").mockImplementation();
    stderrSpy = jest.spyOn(process.stderr, "write").mockImplementation();
    
    const { env } = require("../../lib/env");
    env.NODE_ENV = "production";
  });

  afterEach(() => {
    jest.restoreAllMocks();
    const { env } = require("../../lib/env");
    env.NODE_ENV = "test";
  });

  it("INFO log writes to stdout with structured JSON", () => {
    const { logger } = require("../../lib/logger");
    logger.info("Test message", { key: "value" });
    expect(stdoutSpy).toHaveBeenCalled();
    const output = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(output.severity).toBe("INFO");
    expect(output.message).toBe("Test message");
    expect(output.labels.key).toBe("value");
    expect(output.timestamp).toBeDefined();
  });

  it("ERROR log writes to stderr with severity ERROR", () => {
    const { logger } = require("../../lib/logger");
    logger.error("Error occurred");
    expect(stderrSpy).toHaveBeenCalled();
    const output = JSON.parse(stderrSpy.mock.calls[0][0]);
    expect(output.severity).toBe("ERROR");
  });

  it("PII guard: user_message content is REDACTED", () => {
    const { logger } = require("../../lib/logger");
    logger.info("Sending user_message: vote for xyz", { user_message: "vote for xyz" });
    expect(stdoutSpy).toHaveBeenCalled();
    const output = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(output.message).toBe("REDACTED_PII_LOG_ATTEMPT");
    expect(output.message).not.toContain("vote for xyz");
    expect(output.labels.user_message).toBeUndefined();
  });
});

import { logger } from "../../lib/logger";

describe("Logger Service", () => {
  let stdoutSpy: jest.SpyInstance;
  let stderrSpy: jest.SpyInstance;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    stdoutSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
    stderrSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => true);
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.resetModules();
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it("logs to stdout in test environment for INFO severity", () => {
    logger.info("test message", { key: "value" });
    expect(stdoutSpy).toHaveBeenCalled();
    const logData = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(logData.severity).toBe("INFO");
    expect(logData.message).toBe("test message");
    expect(logData.labels.key).toBe("value");
  });

  it("logs to stderr in test environment for ERROR severity", () => {
    logger.error("fail message");
    expect(stderrSpy).toHaveBeenCalled();
    const logData = JSON.parse(stderrSpy.mock.calls[0][0]);
    expect(logData.severity).toBe("ERROR");
  });

  it("redacts PII such as emails and phone numbers", () => {
    logger.info("Contact me at test@example.com or +91 9876543210", { email: "user@domain.com" });
    const logData = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(logData.message).toContain("[REDACTED_EMAIL]");
    expect(logData.message).toContain("[REDACTED_PHONE]");
    expect(logData.labels.email).toBe("[REDACTED_EMAIL]");
  });

  it("handles warning and critical helper methods", () => {
    logger.warn("warning message");
    expect(stdoutSpy).toHaveBeenCalled();
    
    logger.critical("critical message");
    expect(stderrSpy).toHaveBeenCalled();
  });

  it("pretty prints in development environment", () => {
    // Mock env module specifically for this test
    jest.mock("../../lib/env", () => ({
        env: { NODE_ENV: "development" }
    }));
    
    // Re-import logger to pick up mocked env
    const { logger: devLogger } = require("../../lib/logger");
    
    devLogger.info("dev message");
    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain("INFO: dev message");

    devLogger.error("dev error");
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it("handles missing npm_package_version fallback in labels", () => {
    const originalVersion = process.env.npm_package_version;
    delete process.env.npm_package_version;
    
    logger.info("test version fallback");
    const logData = JSON.parse(stdoutSpy.mock.calls[0][0]);
    expect(logData.labels.version).toBe("unknown");
    
    process.env.npm_package_version = originalVersion;
  });
});

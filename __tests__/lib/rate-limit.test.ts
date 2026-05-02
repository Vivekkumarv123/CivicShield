
process.env.GOOGLE_GEMINI_API_KEY = "test_key";
process.env.UPSTASH_REDIS_REST_URL = "http://test.com";
process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
process.env.NEXT_PUBLIC_APP_URL = "http://test.com";
process.env.NODE_ENV = "test";

// Mock Upstash dependencies before importing
const mockLimit = jest.fn();

jest.mock('@upstash/ratelimit', () => {
  return {
    Ratelimit: Object.assign(
      jest.fn().mockImplementation(() => ({
        limit: mockLimit
      })),
      {
        slidingWindow: jest.fn().mockReturnValue({})
      }
    ),
  };
});

jest.mock('@upstash/redis', () => ({
  Redis: jest.fn().mockImplementation(() => ({}))
}));

jest.mock('../../lib/logger', () => ({
  logger: { warn: jest.fn(), info: jest.fn(), error: jest.fn() }
}));

import { checkRateLimit } from '../../lib/rate-limit';
import { logger } from '../../lib/logger';

describe('Rate Limit - checkRateLimit()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns success=true with correct headers when under limit', async () => {
    const now = Date.now();
    mockLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 9,
      reset: now + 60000,
    });

    const result = await checkRateLimit('192.168.1.1');

    expect(result.success).toBe(true);
    expect(result.headers['X-RateLimit-Limit']).toBe('10');
    expect(result.headers['X-RateLimit-Remaining']).toBe('9');
    expect(result.headers['X-RateLimit-Reset']).toBe(String(now + 60000));
    expect(result.headers['Retry-After']).toBeDefined();
  });

  it('returns success=false and logs warning when rate limited', async () => {
    mockLimit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 60000,
    });

    const result = await checkRateLimit('10.0.0.1');

    expect(result.success).toBe(false);
    expect(result.headers['X-RateLimit-Remaining']).toBe('0');
    expect(logger.warn).toHaveBeenCalledWith(
      'rate_limit_exceeded',
      expect.objectContaining({ ip: expect.any(String) })
    );
  });

  it('masks IP in log to first 8 chars + "***"', async () => {
    mockLimit.mockResolvedValue({
      success: false,
      limit: 10,
      remaining: 0,
      reset: Date.now() + 60000,
    });

    await checkRateLimit('192.168.100.200');

    expect(logger.warn).toHaveBeenCalledWith(
      'rate_limit_exceeded',
      { ip: '192.168.***' }
    );
  });

  it('does NOT log warning when request is allowed', async () => {
    mockLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 5,
      reset: Date.now() + 30000,
    });

    await checkRateLimit('127.0.0.1');

    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('computes Retry-After as ceil of seconds until reset', async () => {
    const resetTime = Date.now() + 45000;
    mockLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 3,
      reset: resetTime,
    });

    const result = await checkRateLimit('10.10.10.10');

    const retryAfter = parseInt(result.headers['Retry-After'], 10);
    expect(retryAfter).toBeGreaterThanOrEqual(44);
    expect(retryAfter).toBeLessThanOrEqual(46);
  });

  it('calls ratelimit.limit with the provided IP', async () => {
    mockLimit.mockResolvedValue({
      success: true,
      limit: 10,
      remaining: 8,
      reset: Date.now() + 60000,
    });

    await checkRateLimit('203.0.113.42');

    expect(mockLimit).toHaveBeenCalledWith('203.0.113.42');
  });
});

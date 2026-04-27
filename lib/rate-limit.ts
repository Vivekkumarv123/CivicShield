import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "./env";
import { logger } from "./logger";

// Create a new ratelimiter, that allows 20 requests per 1 minute
export const ratelimit = new Ratelimit({
  redis: new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  }),
  limiter: Ratelimit.slidingWindow(20, "1 m"),
  analytics: true,
  prefix: "@upstash/ratelimit",
});

export const checkRateLimit = async (ip: string) => {
  const { success, limit, remaining, reset } = await ratelimit.limit(ip);
  
  if (!success) {
    logger.warn("rate_limit_exceeded", { ip: ip.substring(0, 8) + "***" }); // Hash/mask IP
  }
  
  return {
    success,
    headers: {
      "X-RateLimit-Limit": limit.toString(),
      "X-RateLimit-Remaining": remaining.toString(),
      "X-RateLimit-Reset": reset.toString(),
      "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
    }
  };
};

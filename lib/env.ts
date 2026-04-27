import { z } from "zod";

const envSchema = z.object({
  GOOGLE_GEMINI_API_KEY: z.string().min(1),
  UPSTASH_REDIS_REST_URL: z.string().url(),
  UPSTASH_REDIS_REST_TOKEN: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const validateEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map((e) => e.path.join(".")).join(", ");
      throw new Error(`FATAL: Missing env vars: [${missingVars}]`);
    }
    throw error;
  }
};

export const env = validateEnv();

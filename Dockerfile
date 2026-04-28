# Stage 1 — deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# Using npm install instead of ci if lockfile missing
RUN npm install

# Stage 2 — builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Dummy variables to pass build-time validation in lib/env.ts
# These will be overridden by real secrets at runtime on Cloud Run
ENV GOOGLE_GEMINI_API_KEY=build_time_placeholder
ENV UPSTASH_REDIS_REST_URL=https://dummy-redis.com
ENV UPSTASH_REDIS_REST_TOKEN=build_time_placeholder
ENV NEXT_PUBLIC_APP_URL=https://civicshield.app

RUN npm run build

# Stage 3 — runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
ENV PORT=8080 
ENV HOSTNAME=0.0.0.0
EXPOSE 8080

LABEL org.opencontainers.image.title="CivicShield" \
      org.opencontainers.image.description="India Election Education Assistant"

CMD ["node", "server.js"]

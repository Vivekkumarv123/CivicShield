import { env } from "./env";

export type LogSeverity = "DEFAULT" | "DEBUG" | "INFO" | "WARNING" | "ERROR" | "CRITICAL";

export interface LogEntry {
  severity: LogSeverity;
  message: string;
  labels?: Record<string, string | number | boolean>;
  httpRequest?: {
    requestMethod: string;
    requestUrl: string;
    status: number;
    latency: string;
  };
}

export const logger = {
  log: (entry: LogEntry) => {
    // PII Guard: Automated detection and redaction of sensitive data patterns
    const redactPII = (val: any): any => {
      if (typeof val === "string") {
        return val
          .replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, "[REDACTED_EMAIL]") // Emails
          .replace(/(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}/g, "[REDACTED_PHONE]") // Indian Phone Numbers
          .replace(/\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g, "[REDACTED_ID]"); // Generic 12-digit ID (Aadhaar style)
      }
      if (typeof val === "object" && val !== null) {
        const redacted: any = Array.isArray(val) ? [] : {};
        for (const key in val) {
          redacted[key] = redactPII(val[key]);
        }
        return redacted;
      }
      return val;
    };

    entry.message = redactPII(entry.message);
    if (entry.labels) {
      entry.labels = redactPII(entry.labels);
    }

    const payload = {
      ...entry,
      timestamp: new Date().toISOString(),
      labels: {
        ...entry.labels,
        service: "civicshield",
        version: process.env.npm_package_version ?? "unknown",
      },
    };

    if (env.NODE_ENV === "production" || env.NODE_ENV === "test") {
      const logString = JSON.stringify(payload);
      if (entry.severity === "ERROR" || entry.severity === "CRITICAL") {
        process.stderr.write(logString + "\n");
      } else {
        process.stdout.write(logString + "\n");
      }
    } else {
      // Pretty print in development
      const prefix = `[${payload.timestamp}] ${payload.severity}: ${payload.message}`;
      if (entry.severity === "ERROR" || entry.severity === "CRITICAL") {
        console.error(prefix, payload.labels, payload.httpRequest || "");
      } else {
        console.log(prefix, payload.labels, payload.httpRequest || "");
      }
    }
  },
  info: (message: string, labels?: Record<string, string | number>) => logger.log({ severity: "INFO", message, labels }),
  warn: (message: string, labels?: Record<string, string | number>) => logger.log({ severity: "WARNING", message, labels }),
  error: (message: string, labels?: Record<string, string | number>) => logger.log({ severity: "ERROR", message, labels }),
  critical: (message: string, labels?: Record<string, string | number>) => logger.log({ severity: "CRITICAL", message, labels }),
};

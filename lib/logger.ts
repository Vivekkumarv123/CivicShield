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
    // PII Guard: Ensure we never log raw user messages directly in the message or labels
    if (entry.message.toLowerCase().includes("user_message") || 
        (entry.labels && JSON.stringify(entry.labels).toLowerCase().includes("user_message"))) {
      entry.message = "REDACTED_PII_LOG_ATTEMPT";
      entry.labels = {};
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

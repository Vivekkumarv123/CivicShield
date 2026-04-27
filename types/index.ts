export interface Step {
  id: string;
  title: string;
  description: string;
  durationDays?: number;
  icon: string;
}

export interface ExplainResponse {
  timeline: Step[];
  summary: string;
  relatedTopics: string[];
  language: "en" | "hi" | "mr";
}

export interface Source {
  url: string;
  title: string;
  snippet: string;
}

export interface FactCheckResponse {
  verdict: "True" | "False" | "Partially True" | "Unverified";
  confidence: number;
  sources: Source[];
  explanation: string;
  groundingChunks: string[];
}

export interface OutOfScopeResponse {
  type: "OUT_OF_SCOPE";
  message: string;
}

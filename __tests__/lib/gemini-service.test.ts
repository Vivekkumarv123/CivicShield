
process.env.GOOGLE_GEMINI_API_KEY = "test_key";
process.env.UPSTASH_REDIS_REST_URL = "http://test.com";
process.env.UPSTASH_REDIS_REST_TOKEN = "test_token";
process.env.NEXT_PUBLIC_APP_URL = "http://test.com";
(process.env as any).NODE_ENV = "test";

import * as ai from 'ai';

// Mock the 'ai' package
jest.mock('ai', () => ({
  streamObject: jest.fn(),
  generateObject: jest.fn(),
  generateText: jest.fn().mockResolvedValue({ text: '{}' })
}));

// Mock @ai-sdk/google
jest.mock('@ai-sdk/google', () => ({
  createGoogleGenerativeAI: jest.fn().mockReturnValue(
    jest.fn().mockReturnValue('mock-model')
  ),
}));

jest.mock('../../lib/logger', () => ({
  logger: { error: jest.fn(), info: jest.fn(), warn: jest.fn() }
}));

import {
  geminiService,
  explainSchema,
  factCheckSchema,
  outOfScopeSchema,
  explainUnionSchema,
  factCheckUnionSchema
} from '../../lib/gemini-service';
import { logger } from '../../lib/logger';

describe('Gemini Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- streamExplanation ---
  describe('streamExplanation()', () => {
    it('calls streamObject with correct prompt and Hindi locale', async () => {
      const mockResult = { toTextStreamResponse: jest.fn() };
      (ai.streamObject as jest.Mock).mockResolvedValue(mockResult);

      const result = await geminiService.streamExplanation('How to vote?', 'hi');

      expect(ai.streamObject).toHaveBeenCalledWith(expect.objectContaining({
        prompt: 'How to vote?',
        system: expect.stringContaining('HINDI'),
      }));
      expect(result).toBe(mockResult);
    });

    it('calls streamObject with English locale by default', async () => {
      (ai.streamObject as jest.Mock).mockResolvedValue({});

      await geminiService.streamExplanation('Test', 'en');

      expect(ai.streamObject).toHaveBeenCalledWith(expect.objectContaining({
        system: expect.stringContaining('ENGLISH'),
      }));
    });

    it('calls streamObject with Marathi locale', async () => {
      (ai.streamObject as jest.Mock).mockResolvedValue({});

      await geminiService.streamExplanation('Test', 'mr');

      expect(ai.streamObject).toHaveBeenCalledWith(expect.objectContaining({
        system: expect.stringContaining('MARATHI'),
      }));
    });

    it('falls back to English for unknown locale', async () => {
      (ai.streamObject as jest.Mock).mockResolvedValue({});

      await geminiService.streamExplanation('Test', 'fr');

      expect(ai.streamObject).toHaveBeenCalledWith(expect.objectContaining({
        system: expect.stringContaining('ENGLISH'),
      }));
    });

    it('logs error and re-throws on stream failure', async () => {
      const err = new Error('AI_STREAM_FAIL');
      err.name = 'StreamError';
      (ai.streamObject as jest.Mock).mockRejectedValue(err);

      await expect(geminiService.streamExplanation('?', 'en')).rejects.toThrow('AI_STREAM_FAIL');
      expect(logger.error).toHaveBeenCalledWith('gemini_error', expect.objectContaining({
        errorCode: 'StreamError',
      }));
    });

    it('successfully handles OUT_OF_SCOPE response type', async () => {
      const mockResult = { 
        toTextStreamResponse: jest.fn(),
        object: Promise.resolve({ type: 'OUT_OF_SCOPE', message: 'Refusal' })
      };
      (ai.streamObject as jest.Mock).mockResolvedValue(mockResult);

      const result = await geminiService.streamExplanation('Something unrelated', 'en');
      expect(result).toBe(mockResult);
    });
  });

  // --- factCheck ---
  describe('factCheck()', () => {
    it('calls generateText and returns the parsed result object', async () => {
      const mockResponse = {
        type: "FACTCHECK",
        verdict: 'True',
        confidence: 0.9,
        explanation: 'Verified',
        sources: [],
        groundingChunks: []
      };
      (ai.generateText as jest.Mock).mockResolvedValue({ text: JSON.stringify(mockResponse) });

      const result = await geminiService.factCheck('Is EVM hackable?', 'en');

      expect(ai.generateText).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('passes Hindi locale to the system prompt', async () => {
      const mockResponse = { type: "FACTCHECK", verdict: 'True', confidence: 0.5, explanation: 'Test' };
      (ai.generateText as jest.Mock).mockResolvedValue({
        text: JSON.stringify(mockResponse)
      });

      await geminiService.factCheck('Claim', 'hi');

      expect(ai.generateText).toHaveBeenCalledWith(expect.objectContaining({
        system: expect.stringContaining('HINDI'),
      }));
    });

    it('logs error and re-throws on factcheck failure', async () => {
      const err = new Error('FC_FAIL');
      err.name = 'FactCheckError';
      (ai.generateText as jest.Mock).mockRejectedValue(err);

      await expect(geminiService.factCheck('?', 'en')).rejects.toThrow('FC_FAIL');
      expect(logger.error).toHaveBeenCalledWith('gemini_error', expect.objectContaining({
        errorCode: 'FactCheckError',
      }));
    });
  });

  // --- Schema validation ---
  describe('Zod Schemas', () => {
    it('explainSchema validates a correct EXPLAIN object', () => {
      const valid = {
        type: "EXPLAIN",
        timeline: [{ id: "1", title: "T", description: "D", icon: "📋" }],
        summary: "Summary",
        relatedTopics: ["topic1"],
        language: "en"
      };
      expect(explainSchema.safeParse(valid).success).toBe(true);
    });

    it('explainSchema rejects invalid language', () => {
      const invalid = {
        type: "EXPLAIN",
        timeline: [],
        summary: "",
        relatedTopics: [],
        language: "de"
      };
      expect(explainSchema.safeParse(invalid).success).toBe(false);
    });

    it('factCheckSchema validates all verdict types', () => {
      const verdicts = ["True", "False", "Partially True", "Unverified"];
      verdicts.forEach(v => {
        const obj = { type: "FACTCHECK", verdict: v, confidence: 0.5, explanation: "E", sources: [], groundingChunks: [] };
        expect(factCheckSchema.safeParse(obj).success).toBe(true);
      });
    });

    it('factCheckSchema rejects confidence > 1', () => {
      const obj = { type: "FACTCHECK", verdict: "True", confidence: 1.5, explanation: "", sources: [], groundingChunks: [] };
      expect(factCheckSchema.safeParse(obj).success).toBe(false);
    });

    it('factCheckSchema rejects confidence < 0', () => {
      const obj = { type: "FACTCHECK", verdict: "True", confidence: -0.1, explanation: "", sources: [], groundingChunks: [] };
      expect(factCheckSchema.safeParse(obj).success).toBe(false);
    });

    it('outOfScopeSchema validates correct OUT_OF_SCOPE', () => {
      const obj = { type: "OUT_OF_SCOPE", message: "Not election related" };
      expect(outOfScopeSchema.safeParse(obj).success).toBe(true);
    });

    it('explainUnionSchema discriminates EXPLAIN vs OUT_OF_SCOPE', () => {
      const explain = {
        type: "EXPLAIN",
        timeline: [],
        summary: "S",
        relatedTopics: [],
        language: "en"
      };
      const outOfScope = { type: "OUT_OF_SCOPE", message: "Nope" };

      expect(explainUnionSchema.safeParse(explain).success).toBe(true);
      expect(explainUnionSchema.safeParse(outOfScope).success).toBe(true);
    });

    it('factCheckUnionSchema discriminates FACTCHECK vs OUT_OF_SCOPE', () => {
      const factcheck = {
        type: "FACTCHECK", verdict: "True", confidence: 0.5,
        explanation: "E", sources: [], groundingChunks: []
      };
      const outOfScope = { type: "OUT_OF_SCOPE", message: "Nope" };

      expect(factCheckUnionSchema.safeParse(factcheck).success).toBe(true);
      expect(factCheckUnionSchema.safeParse(outOfScope).success).toBe(true);
    });

    it('factCheckSchema defaults sources and groundingChunks to empty arrays', () => {
      const obj = { type: "FACTCHECK", verdict: "True", confidence: 0.5, explanation: "E" };
      const result = factCheckSchema.safeParse(obj);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sources).toEqual([]);
        expect(result.data.groundingChunks).toEqual([]);
      }
    });
  });
});

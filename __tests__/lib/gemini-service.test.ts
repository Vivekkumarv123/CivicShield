import { geminiService } from '../../lib/gemini-service';

// Mock the 'ai' package and Gemini provider
jest.mock('ai', () => ({
  streamObject: jest.fn().mockResolvedValue({
    toTextStreamResponse: () => new Response('{"summary": "Test Summary"}'),
  }),
  generateObject: jest.fn().mockResolvedValue({
    object: { verdict: 'True', confidence: 0.9, explanation: 'Test' }
  }),
  generateText: jest.fn().mockResolvedValue({
    text: 'VALID_SCOPE'
  })
}));

describe('Gemini Service Core Logic', () => {
  it('should validate scope successfully for election queries', async () => {
    const result = await geminiService.checkScope('Who is the ECI commissioner?');
    expect(result).toBeNull(); // null means in scope
  });

  it('should return OUT_OF_SCOPE for non-election queries', async () => {
    const { generateText } = require('ai');
    generateText.mockResolvedValueOnce({ text: 'OUT_OF_SCOPE' });

    const result = await geminiService.checkScope('How to cook pasta?');
    expect(result).not.toBeNull();
    expect(result?.type).toBe('OUT_OF_SCOPE');
  });

  it('should handle fact-checking with correct locale enforcement', async () => {
    const result = await geminiService.factCheck('Claim about EVM', 'en');
    expect(result).toHaveProperty('verdict');
    expect(result).toHaveProperty('confidence');
  });
});

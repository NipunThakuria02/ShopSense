// Gemini SDK tests — testing pure helper functions only (no external import needed)

const SYSTEM_PROMPT = `You are ShopSense AI, a smart Indian shopping assistant.`;

function buildPrompt(preferences = {}) {
  const { interests = [], budget = '₹5000', ageGroup = '25-34' } = preferences;
  return `Based on these user preferences:
- Age Group: ${ageGroup}
- Interests: ${interests.join(', ') || 'general'}
- Monthly Budget: ${budget}
You are an Indian shopping assistant. Suggest 5 products available in India.`;
}

function parseGeminiResponse(text) {
  if (!text || typeof text !== 'string') return [];
  try {
    const match = text.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

function buildChatHistory(history, systemPrompt) {
  // System prompt is always prepended conceptually via systemInstruction
  return [
    { role: 'user', parts: [{ text: systemPrompt }] },
    ...history,
  ];
}

describe('buildPrompt', () => {
  test('includes "Indian shopping assistant" in prompt', () => {
    const prompt = buildPrompt({ interests: ['Electronics'], budget: '₹5000', ageGroup: '25-34' });
    expect(prompt).toMatch(/Indian shopping assistant/i);
  });

  test('includes user budget in prompt', () => {
    const prompt = buildPrompt({ budget: '₹10000' });
    expect(prompt).toContain('₹10000');
  });

  test('includes interests in prompt', () => {
    const prompt = buildPrompt({ interests: ['Electronics', 'Fashion'] });
    expect(prompt).toContain('Electronics');
    expect(prompt).toContain('Fashion');
  });

  test('handles missing preferences gracefully', () => {
    expect(() => buildPrompt({})).not.toThrow();
    expect(() => buildPrompt()).not.toThrow();
  });
});

describe('parseGeminiResponse', () => {
  test('parses valid JSON array', () => {
    const text = '[{"name":"Phone","estimatedPrice":"₹999","category":"Electronics","reason":"Good"}]';
    const result = parseGeminiResponse(text);
    expect(Array.isArray(result)).toBe(true);
    expect(result[0].name).toBe('Phone');
  });

  test('returns [] on empty string', () => {
    expect(parseGeminiResponse('')).toEqual([]);
  });

  test('returns [] on null', () => {
    expect(parseGeminiResponse(null)).toEqual([]);
  });

  test('returns [] on malformed JSON', () => {
    expect(parseGeminiResponse('[not valid json}')).toEqual([]);
  });

  test('extracts JSON from text with surrounding content', () => {
    const text = 'Here are recommendations: [{"name":"Item","estimatedPrice":"₹500","category":"Home","reason":"Affordable"}] Hope this helps!';
    const result = parseGeminiResponse(text);
    expect(result.length).toBe(1);
  });
});

describe('buildChatHistory', () => {
  test('system prompt is always prepended', () => {
    const history = [{ role: 'user', parts: [{ text: 'hello' }] }];
    const result = buildChatHistory(history, SYSTEM_PROMPT);
    expect(result[0].parts[0].text).toBe(SYSTEM_PROMPT);
  });

  test('preserves existing history', () => {
    const history = [
      { role: 'user', parts: [{ text: 'hello' }] },
      { role: 'model', parts: [{ text: 'Hi!' }] },
    ];
    const result = buildChatHistory(history, SYSTEM_PROMPT);
    expect(result.length).toBe(3);
  });
});

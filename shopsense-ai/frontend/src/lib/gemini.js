import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizeInput } from './utils';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are ShopSense AI, a smart Indian shopping assistant. 
Analyze user intent, budget (in rupees), occasion, and recipient. 
Return 3-5 product recommendations with name, estimated price, reason, and category. 
Be concise and helpful. Format prices in Indian rupees (₹). 
Always think about value for money for the Indian market.`;

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: SYSTEM_PROMPT,
});

/**
 * Send a chat message with full history — returns streaming response
 * @param {Array} history - [{role:'user'|'model', parts:[{text:'...'}]}]
 * @param {string} userMessage
 * @returns {AsyncGenerator} streaming text chunks
 */
export async function sendChatMessage(history, userMessage) {
  const sanitized = sanitizeInput(userMessage);
  const chat = model.startChat({ history });
  const result = await chat.sendMessageStream(sanitized);
  return result.stream;
}

/**
 * Get personalized product recommendations based on user preferences
 * @param {{ categories: string[], budget: string, ageGroup: string }} preferences
 * @returns {Promise<Array>} array of product suggestions
 */
export async function getPersonalizedRecs(preferences) {
  const { categories = [], budget = '₹5000', ageGroup = '25-34' } = preferences;
  const prompt = `Based on these user preferences:
- Age Group: ${ageGroup}
- Interests: ${categories.join(', ')}
- Monthly Budget: ${budget}

Suggest 5 specific products available in India. For each product return a JSON array item with:
{"name": string, "category": string, "estimatedPrice": string, "reason": string, "rating": number}

Return ONLY valid JSON array, no markdown.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
  } catch {
    return [];
  }
}

/**
 * Get a single Gemini-powered trending insight
 * @returns {Promise<string>}
 */
export async function getTrendingInsight() {
  const prompt = `Give one short, actionable shopping insight for Indian e-commerce shoppers this week. 
Focus on deals, trends, or smart buying tips. Max 2 sentences. Be specific and helpful.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Compare two products using Gemini
 * @param {object} product1
 * @param {object} product2
 * @returns {Promise<string>}
 */
export async function compareProducts(product1, product2) {
  const prompt = `Compare these two products for an Indian shopper:

Product 1: ${product1.title} — ${product1.price}
Product 2: ${product2.title} — ${product2.price}

Give a concise comparison covering: value for money, quality, who should buy which. Max 150 words.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * Build autocomplete suggestions for search
 * @param {string} query
 * @returns {Promise<string[]>}
 */
export async function getSearchSuggestions(query) {
  if (!query || query.length < 2) return [];
  const prompt = `Suggest 5 e-commerce search queries for an Indian shopping app based on: "${query}"
Return ONLY a JSON array of strings. No markdown. Example: ["query1","query2"]`;
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\[[\s\S]*?\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

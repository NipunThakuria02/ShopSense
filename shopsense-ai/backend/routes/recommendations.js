const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const SYSTEM_PROMPT = `You are ShopSense AI, a smart Indian shopping assistant. 
Analyze user intent, budget (in rupees), occasion, and recipient. 
Return 3-5 product recommendations with name, estimated price (in ₹), reason, and category. 
Be concise and helpful.`;

router.post('/', async (req, res) => {
  const { preferences = {}, budget = '₹5000', occasion = 'general' } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.json({
      recommendations: [
        { name: 'Boat Airdopes Wireless Earbuds', estimatedPrice: '₹1,299', category: 'Electronics', reason: 'Great value for money' },
        { name: 'Redmi Note 13', estimatedPrice: '₹12,999', category: 'Electronics', reason: 'Best mid-range phone' },
        { name: 'Puma Sports Shoes', estimatedPrice: '₹2,499', category: 'Fashion', reason: 'Comfortable and trendy' },
      ],
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    const prompt = `User preferences:
- Categories: ${(preferences.interests || []).join(', ') || 'General'}
- Age Group: ${preferences.ageGroup || '25-34'}
- Budget: ${budget}
- Occasion: ${occasion}

Suggest 5 specific products available in India. Return ONLY a JSON array:
[{"name":string,"estimatedPrice":string,"category":string,"reason":string,"rating":number}]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const match = text.match(/\[[\s\S]*\]/);
    const recommendations = match ? JSON.parse(match[0]) : [];

    res.json({ recommendations });
  } catch (err) {
    console.error('Recommendations error:', err.message);
    res.status(500).json({ error: 'Failed to generate recommendations', recommendations: [] });
  }
});

module.exports = router;

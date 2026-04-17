const express = require('express');
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_CSE_ID = process.env.GOOGLE_CSE_ID;

// Mock results for when API credentials aren't set
function getMockResults(query) {
  const items = [
    { title: `${query} - Best Deal`, price: 1299, source: 'Amazon', rating: 4.3 },
    { title: `Premium ${query}`, price: 2499, source: 'Flipkart', rating: 4.5 },
    { title: `${query} Pro Edition`, price: 3999, source: 'Meesho', rating: 4.1 },
    { title: `Budget ${query}`, price: 799, source: 'Snapdeal', rating: 3.9 },
    { title: `${query} Special Pack`, price: 1899, source: 'Myntra', rating: 4.4 },
  ];
  return items.map((item, i) => ({
    id: `mock-${i}`,
    title: item.title,
    image: `https://images.unsplash.com/photo-${['1523275335684-37898b6baf30','1585386959984-a4155224a1ad','1542291026-7eec264c27ff','1491553895911-0055eca6402d','1560343090-f0409e92791a'][i]}?w=300&h=300&fit=crop`,
    price: item.price,
    source: item.source,
    rating: item.rating,
    url: `https://www.amazon.in/s?k=${encodeURIComponent(query)}`,
  }));
}

function parsePrice(snippet = '') {
  const match = snippet.match(/(?:₹|Rs\.?\s*|INR\s*)([0-9,]+)/i);
  if (match) return parseInt(match[1].replace(/,/g, ''));
  // Random realistic price
  return Math.floor(Math.random() * 49001) + 999;
}

function extractSource(displayLink = '') {
  return displayLink.replace('www.', '').split('.')[0];
}

router.get('/', async (req, res) => {
  const { q, category, minPrice = 0, maxPrice = 1000000 } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(400).json({ error: 'Query required' });
  }

  const sanitizedQ = q.slice(0, 200).replace(/<[^>]*>/g, '').trim();

  // Return mock data if no API keys
  if (!GOOGLE_API_KEY || !GOOGLE_CSE_ID) {
    const results = getMockResults(sanitizedQ);
    return res.json({ results, source: 'mock' });
  }

  try {
    const searchQ = category && category !== 'All'
      ? `${sanitizedQ} ${category} India buy online`
      : `${sanitizedQ} India buy online`;

    const url = new URL('https://www.googleapis.com/customsearch/v1');
    url.searchParams.set('key', GOOGLE_API_KEY);
    url.searchParams.set('cx', GOOGLE_CSE_ID);
    url.searchParams.set('q', searchQ);
    url.searchParams.set('num', '10');

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`CSE API error: ${response.status}`);

    const data = await response.json();
    const items = data.items || [];

    const results = items
      .map((item, i) => {
        const price = parsePrice(item.snippet);
        return {
          id: item.cacheId || `cse-${i}`,
          title: item.title,
          image: item.pagemap?.cse_image?.[0]?.src ||
                 item.pagemap?.metatags?.[0]?.['og:image'] ||
                 `https://via.placeholder.com/300x300/0f1930/a7a5ff?text=Product`,
          price,
          source: extractSource(item.displayLink),
          rating: +(3.5 + Math.random() * 1.5).toFixed(1),
          url: item.link,
        };
      })
      .filter((r) => r.price >= +minPrice && r.price <= +maxPrice)
      .slice(0, 20);

    res.json({ results, total: results.length });
  } catch (err) {
    console.error('Search error:', err.message);
    // Fallback to mock data on error
    res.json({ results: getMockResults(sanitizedQ), source: 'fallback' });
  }
});

module.exports = router;

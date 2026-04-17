// api.test.js — Backend integration tests using supertest

// Must mock before any require
jest.mock('firebase-admin', () => {
  const mockAdmin = {
    apps: [],
    initializeApp: jest.fn(() => mockAdmin),
    credential: { cert: jest.fn(), applicationDefault: jest.fn() },
    auth: jest.fn(() => ({
      verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
    })),
  };
  return mockAdmin;
});

jest.mock('node-fetch', () => jest.fn());

// Stub global fetch for search route
global.fetch = jest.fn().mockResolvedValue({
  ok: true,
  json: async () => ({
    items: [
      {
        title: 'Test Headphones',
        link: 'https://amazon.in/test',
        displayLink: 'amazon.in',
        snippet: 'Buy for ₹999 online',
        cacheId: 'test-1',
        pagemap: { cse_image: [{ src: 'https://via.placeholder.com/300' }] },
      },
    ],
  }),
});

// Disable Gemini so recommendations don't need real key
process.env.GEMINI_API_KEY = '';
process.env.GOOGLE_API_KEY = '';  // triggers mock fallback path

const request = require('supertest');
const app = require('../backend/server');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.version).toBe('1.0.0');
    expect(typeof res.body.timestamp).toBe('number');
  });
});

describe('GET /api/search', () => {
  it('returns 400 when q param is missing', async () => {
    const res = await request(app).get('/api/search');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Query required');
  });

  it('returns 400 for empty q param', async () => {
    const res = await request(app).get('/api/search?q=');
    expect(res.status).toBe(400);
  });

  it('returns 200 with results array for valid query (mock fallback)', async () => {
    const res = await request(app).get('/api/search?q=headphones');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(0);
  });

  it('has rate limit headers', async () => {
    const res = await request(app).get('/api/search?q=shoes');
    const hasRateLimit =
      res.headers['ratelimit-limit'] ||
      res.headers['x-ratelimit-limit'] ||
      res.headers['ratelimit-policy'];
    expect(hasRateLimit).toBeDefined();
  });
});

describe('GET /api/wishlist (protected)', () => {
  it('returns 401 without auth token', async () => {
    const res = await request(app).get('/api/wishlist');
    expect(res.status).toBe(401);
  });

  it('returns 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/wishlist')
      .set('Authorization', 'Bearer fake_token_xyz');
    expect(res.status).toBe(401);
  });
});

describe('Unknown routes', () => {
  it('returns 404 for non-existent route', async () => {
    const res = await request(app).get('/api/does-not-exist');
    expect(res.status).toBe(404);
  });
});

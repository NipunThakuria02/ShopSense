const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const searchRouter = require('./routes/search');
const recommendationsRouter = require('./routes/recommendations');
const { verifyToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 8080;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'https:', 'data:'],
      connectSrc: ["'self'", 'https://firestore.googleapis.com', 'https://generativelanguage.googleapis.com'],
    },
  },
}));

// CORS
const allowedOrigins = [
  'https://shopsense-ai.web.app',
  'http://localhost:3000',
  'http://localhost:5173',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// Body parser
app.use(express.json({ limit: '10kb' }));

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now(), version: '1.0.0' });
});

// Public routes
app.use('/api/search', searchRouter);
app.use('/api/recommendations', recommendationsRouter);

// Protected routes (require JWT)
app.use('/api/wishlist', verifyToken, (req, res) => {
  res.json({ message: 'Wishlist endpoint — manage via Firestore SDK directly.' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✅ ShopSense AI backend running on port ${PORT}`);
});

module.exports = app;

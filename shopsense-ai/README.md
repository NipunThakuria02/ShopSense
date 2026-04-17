# ShopSense AI 🛍️
> AI-powered smart shopping assistant for the modern Indian shopper

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange)
![Cloud Run](https://img.shields.io/badge/Google_Cloud-Run-blue)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-purple)

## Vertical: Retail & E-commerce

## Problem Statement
Indian shoppers spend hours comparing products across Flipkart, Amazon, Meesho and dozens of other sites. They miss deals, get overwhelmed by choices, and have no personalized guidance. There's no single intelligent layer that understands *their* budget, preferences, and occasion.

## Solution
ShopSense AI centralizes product discovery, AI recommendations, price tracking and trend analysis in one intelligent assistant — powered by Gemini 1.5 Flash and built entirely on Google Cloud.

## Architecture

```
User Browser
│
▼
Firebase Hosting (React + Vite Frontend)
│
├──→ Firebase Auth (Google Sign-In)
├──→ Firestore (Wishlist + Preferences)
└──→ Cloud Run Backend (Node.js/Express)
     │
     ├──→ Gemini 1.5 Flash (AI Chat + Recommendations)
     ├──→ Google Custom Search API (Product Search)
     └──→ Secret Manager (API Keys)
```

## Google Services Used

| Service | Purpose |
|---|---|
| Google Cloud Run | Backend API hosting (auto-scaling) |
| Firebase Hosting | Frontend deployment (CDN) |
| Firebase Auth | Google Sign-In |
| Firebase Firestore | Wishlist + user preferences |
| Gemini 1.5 Flash | AI chat, recommendations, insights |
| Google Custom Search | Product search across the web |
| Google Secret Manager | Secure API key storage |
| Google Analytics 4 | Usage tracking |
| Google Cloud Build | CI/CD pipeline |
| Google Stitch | UI component generation |

## Features

- ✅ **Google Sign-In** — one-click authentication
- ✅ **AI Chat Assistant** — Gemini-powered, streaming responses
- ✅ **Smart Search** — Google Custom Search with AI autocomplete
- ✅ **AI Product Comparison** — select 2 products, Gemini compares them
- ✅ **Personalized Recommendations** — based on onboarding quiz + Gemini
- ✅ **Wishlist** — Firestore CRUD with target price tracking
- ✅ **Price Drop Alerts** — badge when current price ≤ target price
- ✅ **Trend Dashboard** — Recharts charts + Gemini AI insight card
- ✅ **Onboarding Quiz** — 3-step age/interests/budget preferences
- ✅ **Export Wishlist PDF** — jsPDF one-click export
- ✅ **Dark Mode** — default dark design system
- ✅ **Toast Notifications** — react-hot-toast throughout
- ✅ **Share Wishlist** — public link sharing
- ✅ **Responsive** — mobile-first, desktop command-center

## How It Works

1. User signs in with Google (Firebase Auth)
2. Completes 3-step onboarding quiz (age, interests, budget)
3. Home page shows personalized AI-curated product recommendations
4. User searches products → results from Google Custom Search API
5. AI chat assistant understands natural language shopping intent
6. Products added to wishlist with target price tracking in Firestore
7. Dashboard shows category trends + Gemini-generated insights

## Local Setup

### Prerequisites
- Node.js 18+
- Firebase project configured
- Gemini API key from [aistudio.google.com](https://aistudio.google.com)

### Steps

```bash
# Clone the repo
git clone https://github.com/yourusername/shopsense-ai.git
cd shopsense-ai

# Frontend setup
cd frontend
cp ../.env.example .env
# Fill in your Firebase and Gemini keys in .env
npm install
npm run dev

# Backend setup (in a new terminal)
cd backend
cp ../.env.example .env
# Fill in GEMINI_API_KEY, GOOGLE_API_KEY, GOOGLE_CSE_ID
npm install
npm start
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:8080`.

## Deployment

### Backend → Google Cloud Run

```bash
# Authenticate
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Store secrets
echo -n "your_gemini_key" | gcloud secrets create GEMINI_API_KEY --data-file=-
echo -n "your_api_key" | gcloud secrets create GOOGLE_API_KEY --data-file=-
echo -n "your_cse_id" | gcloud secrets create GOOGLE_CSE_ID --data-file=-

# Deploy via Cloud Build
gcloud builds submit --config cloudbuild.yaml
```

### Frontend → Firebase Hosting

```bash
cd frontend
npm run build
firebase deploy --only hosting
```

Frontend URL: `https://shopsense-ai.web.app`

## Environment Variables

See [`.env.example`](.env.example) for all required variables.

## Running Tests

```bash
cd backend
npm test
```

## Assumptions

- Price data is estimated/extracted from Google Custom Search result snippets
- Trend data uses curated mock data enhanced by Gemini insights  
- Google Custom Search free tier: 100 queries/day (upgrade for production)
- Wishlist target price alerts are shown as visual badges (no email alerts)

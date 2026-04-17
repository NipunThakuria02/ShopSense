# ShopSense AI 🛍️✨
**An intelligent shopping assistant powered by Google Gemini AI**

> Discover products, get AI-powered recommendations, track prices, and manage your wishlist — all in one place, built for Indian shoppers.

---

## What it does

| Feature | Description |
|---|---|
| 🤖 AI Chat | Talk to Gemini 1.5 Flash — ask anything about products |
| 🔍 Smart Search | Google Custom Search across Amazon, Flipkart, Myntra |
| 💡 Personalized Recs | AI picks products based on your budget & interests |
| 📊 Trend Dashboard | Visual charts + AI shopping trend insights |
| ❤️ Wishlist | Save products, set target prices, export to PDF |
| 🎯 Onboarding Quiz | 3-step preference setup for tailored experience |

---

## Tech Stack

**Frontend:** React + Vite + Tailwind CSS  
**Backend:** Node.js + Express → Google Cloud Run  
**AI:** Google Gemini 1.5 Flash  
**Auth & DB:** Firebase Authentication + Firestore  
**Hosting:** Firebase Hosting (frontend) + Cloud Run (backend)  

---

## Google Cloud Services Used

`Gemini API` · `Cloud Run` · `Cloud Build` · `Firebase Auth` · `Firestore` · `Firebase Hosting` · `Custom Search API` · `Secret Manager` · `Google Analytics 4`

---

## Local Setup

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/shopsense-ai.git
cd shopsense-ai

# Frontend
cd frontend
cp ../.env.example .env   # fill in your keys
npm install
npm run dev               # runs at http://localhost:3000

# Backend (new terminal)
cd backend
npm install
node server.js            # runs at http://localhost:8080
```

### Required Environment Variables (`frontend/.env`)
```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_GEMINI_API_KEY=...
VITE_API_URL=http://localhost:8080
```

---

## Deployment

**Frontend** → Firebase Hosting  
**Backend** → Google Cloud Run (auto-deploy via GitHub + Cloud Build)

See deployment guide below ↓

---

## License
MIT

import { useEffect, useState } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import OnboardingQuiz from '../components/OnboardingQuiz';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { getPersonalizedRecs } from '../lib/gemini';
import { productImage } from '../lib/utils';

const HERO_CHIPS = [
  '🎧 Wireless Earbuds', '💻 Budget Laptops', '👗 Summer Fashion',
  '🏋️ Gym Equipment', '📱 Smartphones under ₹15000',
];

function SkeletonCard() {
  return (
    <div className="glass-card p-4 h-72">
      <div className="skeleton h-40 w-full mb-3" />
      <div className="skeleton h-4 w-3/4 mb-2" />
      <div className="skeleton h-4 w-1/2 mb-3" />
      <div className="skeleton h-8 w-full" />
    </div>
  );
}

function Home() {
  const { currentUser } = useAuth();
  const { getPreferences } = useFirestore();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [recs, setRecs] = useState([]);
  const [recsLoading, setRecsLoading] = useState(true);
  const [prefs, setPrefs] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      const done = localStorage.getItem('shopsense_onboarded');
      if (!done) setShowOnboarding(true);
      // Show default recs
      setRecsLoading(false);
      setRecs(getMockRecs());
      return;
    }
    getPreferences(currentUser.uid).then((p) => {
      if (!p || !p.interests?.length) {
        const done = localStorage.getItem(`shopsense_onboarded_${currentUser.uid}`);
        if (!done) setShowOnboarding(true);
        setRecsLoading(false);
        setRecs(getMockRecs());
        return;
      }
      setPrefs(p);
      getPersonalizedRecs(p)
        .then((items) => setRecs(items.length ? items.map(mapAIRec) : getMockRecs()))
        .catch(() => setRecs(getMockRecs()))
        .finally(() => setRecsLoading(false));
    });
  }, [currentUser]);

  const handleOnboardingComplete = async (p) => {
    setPrefs(p);
    setShowOnboarding(false);
    const key = currentUser ? `shopsense_onboarded_${currentUser.uid}` : 'shopsense_onboarded';
    localStorage.setItem(key, '1');
    setRecsLoading(true);
    getPersonalizedRecs(p)
      .then((items) => setRecs(items.length ? items.map(mapAIRec) : getMockRecs()))
      .catch(() => setRecs(getMockRecs()))
      .finally(() => setRecsLoading(false));
  };

  return (
    <HelmetProvider>
      <Helmet>
        <title>ShopSense AI 🛍️ — Smart Shopping Assistant</title>
        <meta name="description" content="Discover products with AI-powered recommendations, price tracking, and your personal shopping assistant." />
        <meta property="og:title" content="ShopSense AI — Smart Shopping" />
        <meta property="og:description" content="AI-powered product discovery for Indian shoppers." />
        <link rel="canonical" href="https://shopsense-ai.web.app/" />
      </Helmet>

      {showOnboarding && <OnboardingQuiz onComplete={handleOnboardingComplete} />}

      <main id="main-content">
        {/* Hero */}
        <section className="relative py-20 px-4 text-center" aria-labelledby="hero-heading">
          <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
          <div className="relative z-10 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-widest text-[#645efb] font-bold mb-4">
              ✨ AI-Powered Shopping
            </p>
            <h1 id="hero-heading" className="text-5xl md:text-6xl font-extrabold text-[#dee5ff] leading-tight mb-6">
              Shop Smarter with{' '}
              <span className="text-gradient">ShopSense AI</span>
            </h1>
            <p className="text-[#a3aac4] text-lg mb-10 max-w-xl mx-auto">
              Your intelligent Indian shopping assistant. Discover deals, compare products, and get AI-curated picks.
            </p>
            <div className="flex justify-center mb-6">
              <SearchBar />
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {HERO_CHIPS.map((chip) => (
                <button key={chip} className="chip text-xs" aria-label={`Search for ${chip}`}>
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Personalized Recommendations */}
        <section className="max-w-7xl mx-auto px-4 py-12" aria-labelledby="recs-heading">
          <div className="flex items-center justify-between mb-6">
            <h2 id="recs-heading" className="section-heading">
              {prefs ? '✨ Curated For You' : '🔥 Popular Right Now'}
            </h2>
            <a href="/search" className="text-sm text-[#a7a5ff] hover:underline">See all →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recsLoading
              ? [...Array(8)].map((_, i) => <SkeletonCard key={i} />)
              : recs.slice(0, 8).map((p, i) => <ProductCard key={i} product={p} />)
            }
          </div>
        </section>

        {/* Trending */}
        <section className="max-w-7xl mx-auto px-4 py-12 pb-24 md:pb-12" aria-labelledby="trending-heading">
          <h2 id="trending-heading" className="section-heading mb-6">📊 The Sense Heatmap</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {[
              { icon: '💻', label: 'Electronics', searches: '84K' },
              { icon: '👗', label: 'Fashion', searches: '62K' },
              { icon: '🏠', label: 'Home', searches: '48K' },
              { icon: '💄', label: 'Beauty', searches: '39K' },
              { icon: '⚽', label: 'Sports', searches: '31K' },
            ].map((cat) => (
              <a
                key={cat.label}
                href={`/search?q=${cat.label}`}
                className="glass-card p-4 text-center hover:border-[#645efb]/30 transition-all duration-200"
                aria-label={`Browse ${cat.label} — ${cat.searches} searches`}
              >
                <p className="text-3xl mb-2" aria-hidden="true">{cat.icon}</p>
                <p className="text-sm font-semibold text-[#dee5ff]">{cat.label}</p>
                <p className="text-xs text-[#a3aac4] mt-0.5">{cat.searches} searches</p>
              </a>
            ))}
          </div>
        </section>
      </main>
    </HelmetProvider>
  );
}

// Helpers
function getMockRecs() {
  return Array.from({ length: 8 }, (_, i) => ({
    id: `mock-${i}`,
    title: ['Boat Airdopes 141 Wireless Earbuds', 'Redmi Note 13 5G', 'HP Laptop 15s', 'Puma Men\'s Sneakers', 'Lakme CC Cream', 'Prestige Induction Cooktop', 'Yoga Mat 6mm', 'Instant Pot Duo'][i],
    price: [1299, 12999, 39999, 2499, 349, 3200, 899, 8999][i],
    rating: [4.3, 4.5, 4.4, 4.1, 4.2, 4.6, 4.3, 4.7][i],
    source: ['Amazon', 'Flipkart', 'Amazon', 'Myntra', 'Nykaa', 'Amazon', 'Flipkart', 'Amazon'][i],
    image: productImage(i),
    url: '#',
  }));
}

function mapAIRec(rec, i) {
  return {
    id: `ai-${i}`,
    title: rec.name,
    price: parseInt(rec.estimatedPrice?.replace(/[^0-9]/g, '') || '999'),
    rating: rec.rating || 4.0,
    source: 'AI Pick',
    image: productImage(i),
    url: `https://www.amazon.in/s?k=${encodeURIComponent(rec.name)}`,
    category: rec.category,
  };
}

export default Home;

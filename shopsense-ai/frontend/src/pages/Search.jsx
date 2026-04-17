import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];

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

function Search() {
  const [params] = useSearchParams();
  const q = params.get('q') || '';

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('relevance');
  const [category, setCategory] = useState('All');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);
  const [minRating, setMinRating] = useState(0);
  const [compareList, setCompareList] = useState([]);
  const [compareResult, setCompareResult] = useState('');
  const [comparing, setComparing] = useState(false);

  const fetchResults = useCallback(async () => {
    if (!q) return;
    setLoading(true);
    setError('');
    try {
      const url = new URL(`${API_URL}/api/search`);
      url.searchParams.set('q', q);
      if (category !== 'All') url.searchParams.set('category', category);
      url.searchParams.set('minPrice', minPrice);
      url.searchParams.set('maxPrice', maxPrice);

      const res = await fetch(url);
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      setResults(data.results || []);
    } catch (err) {
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [q, category, minPrice, maxPrice]);

  useEffect(() => { fetchResults(); }, [fetchResults]);

  const sortedResults = [...results]
    .filter((r) => r.rating >= minRating)
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return 0;
    });

  const handleCompare = (product) => {
    setCompareList((prev) => {
      if (prev.find((p) => p.id === product.id)) return prev.filter((p) => p.id !== product.id);
      if (prev.length >= 2) return [prev[1], product];
      return [...prev, product];
    });
  };

  const runComparison = async () => {
    if (compareList.length < 2) return;
    setComparing(true);
    try {
      const { compareProducts } = await import('../lib/gemini');
      const result = await compareProducts(compareList[0], compareList[1]);
      setCompareResult(result);
    } finally {
      setComparing(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{q ? `"${q}" — ShopSense AI` : 'Search — ShopSense AI'}</title>
        <meta name="description" content={`Search results for ${q} on ShopSense AI — AI-powered shopping assistant.`} />
        <link rel="canonical" href={`https://shopsense-ai.web.app/search?q=${q}`} />
      </Helmet>

      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">
        <div className="mb-6">
          <SearchBar defaultValue={q} />
        </div>

        {/* Compare bar */}
        {compareList.length > 0 && (
          <div className="glass-card p-4 mb-6 border border-[#645efb]/20 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-[#a7a5ff] uppercase tracking-wider">Comparing:</span>
              {compareList.map((p) => (
                <span key={p.id} className="chip text-xs">{p.title?.slice(0, 30)}…</span>
              ))}
            </div>
            <div className="flex gap-2">
              {compareList.length === 2 && (
                <button onClick={runComparison} disabled={comparing} className="btn-primary text-xs">
                  {comparing ? 'Comparing…' : '⚖️ Compare'}
                </button>
              )}
              <button onClick={() => { setCompareList([]); setCompareResult(''); }} className="btn-ghost text-xs">
                Clear
              </button>
            </div>
          </div>
        )}

        {compareResult && (
          <div className="glass-card p-5 mb-6 border border-[#645efb]/20">
            <p className="text-xs font-bold text-[#645efb] uppercase tracking-widest mb-2">✨ AI Comparison</p>
            <p className="text-sm text-[#dee5ff] leading-relaxed whitespace-pre-wrap">{compareResult}</p>
          </div>
        )}

        <div className="flex gap-6">
          {/* Sidebar filters */}
          <aside className="hidden md:flex flex-col gap-6 w-56 shrink-0" aria-label="Filter products">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#a3aac4] mb-3">Category</h2>
              {CATEGORIES.map((cat) => (
                <label key={cat} className="flex items-center gap-2 py-1.5 cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value={cat}
                    checked={category === cat}
                    onChange={() => setCategory(cat)}
                    className="accent-[#645efb]"
                    aria-label={`Filter by ${cat}`}
                  />
                  <span className={`text-sm transition-colors ${category === cat ? 'text-[#a7a5ff]' : 'text-[#a3aac4] group-hover:text-[#dee5ff]'}`}>
                    {cat}
                  </span>
                </label>
              ))}
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#a3aac4] mb-3">
                Price Range (₹{minPrice.toLocaleString('en-IN')} – ₹{maxPrice.toLocaleString('en-IN')})
              </h2>
              <input type="range" min={0} max={100000} step={500} value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="w-full accent-[#645efb]" aria-label="Maximum price filter" />
            </div>

            <div>
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#a3aac4] mb-3">Min Rating</h2>
              {[4, 3, 2, 0].map((r) => (
                <label key={r} className="flex items-center gap-2 py-1.5 cursor-pointer">
                  <input type="radio" name="rating" value={r} checked={minRating === r}
                    onChange={() => setMinRating(r)} className="accent-[#645efb]"
                    aria-label={`Minimum ${r} stars`} />
                  <span className="text-sm text-[#a3aac4]">
                    {r > 0 ? `★ ${r}+` : 'All ratings'}
                  </span>
                </label>
              ))}
            </div>
          </aside>

          {/* Results */}
          <section className="flex-1 min-w-0" aria-label="Search results">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-[#a3aac4]">
                {loading ? 'Searching…' : `${sortedResults.length} results for "${q}"`}
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                aria-label="Sort results"
                className="bg-[#091328] border border-[#40485d]/30 text-sm text-[#dee5ff] rounded-lg px-3 py-2 focus:outline-none focus:border-[#a7a5ff]/50"
              >
                <option value="relevance">Relevance</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>

            {error && (
              <div className="glass-card p-4 border border-red-500/20 text-red-400 text-sm mb-4">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading
                ? [...Array(6)].map((_, i) => <SkeletonCard key={i} />)
                : sortedResults.length === 0
                  ? (
                    <div className="col-span-full text-center py-16 text-[#a3aac4]">
                      <p className="text-4xl mb-3">🔍</p>
                      <p className="font-semibold">No results found</p>
                      <p className="text-sm mt-1">Try a different search term</p>
                    </div>
                  )
                  : sortedResults.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      compareMode={true}
                      selected={compareList.some((c) => c.id === p.id)}
                      onCompare={handleCompare}
                    />
                  ))
              }
            </div>
          </section>
        </div>
      </main>
    </>
  );
}

export default Search;

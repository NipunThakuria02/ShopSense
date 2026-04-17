import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../lib/utils';
import { getSearchSuggestions } from '../lib/gemini';

function SearchBar({ defaultValue = '' }) {
  const [query, setQuery] = useState(defaultValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const fetchSuggestions = useCallback(
    debounce(async (q) => {
      if (!q || q.length < 2) { setSuggestions([]); return; }
      setLoading(true);
      try {
        const suggs = await getSearchSuggestions(q);
        setSuggestions(suggs);
        setShowSuggestions(suggs.length > 0);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    }, 400),
    []
  );

  const handleChange = (e) => {
    setQuery(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleSearch = (q = query) => {
    if (!q.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
    if (e.key === 'Escape') setShowSuggestions(false);
  };

  useEffect(() => {
    const handler = (e) => { if (!e.target.closest('[data-search]')) setShowSuggestions(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative w-full max-w-2xl" data-search role="search">
      <div className="flex items-center gap-2 bg-[#091328] border border-[#40485d]/30 
                     focus-within:border-[#a7a5ff]/50 focus-within:shadow-[0_0_20px_rgba(167,165,255,0.1)]
                     rounded-2xl px-4 py-3.5 transition-all duration-300">
        <span className="text-[#a3aac4] text-lg shrink-0" aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          placeholder="Ask Sense: What are you looking for today?"
          aria-label="Search for products"
          aria-autocomplete="list"
          aria-expanded={showSuggestions}
          className="flex-1 bg-transparent text-[#dee5ff] placeholder-[#a3aac4] focus:outline-none text-sm"
        />
        {loading && <span className="text-xs text-[#a3aac4] animate-pulse">thinking...</span>}
        <button
          onClick={() => handleSearch()}
          aria-label="Search"
          className="btn-primary py-1.5 px-4 text-xs shrink-0"
        >
          Search
        </button>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          className="absolute z-40 top-full left-0 right-0 mt-2 glass-card border border-[#40485d]/20
                     rounded-xl overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] animate-fade-in"
          role="listbox"
          aria-label="Search suggestions"
        >
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                className="w-full text-left px-4 py-3 text-sm text-[#dee5ff] hover:bg-[#141f38]
                           transition-colors flex items-center gap-3"
                role="option"
                onClick={() => { setQuery(s); handleSearch(s); }}
              >
                <span className="text-[#a3aac4]">✨</span>
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;

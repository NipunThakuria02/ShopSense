import { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { getTrendingInsight } from '../lib/gemini';

const CATEGORIES = [
  { name: 'Electronics', value: 8400, icon: '💻' },
  { name: 'Fashion', value: 6200, icon: '👗' },
  { name: 'Home', value: 4800, icon: '🏠' },
  { name: 'Beauty', value: 3900, icon: '💄' },
  { name: 'Sports', value: 3100, icon: '⚽' },
];

const PRICE_TRENDS = [
  { week: 'W1', Laptop: 54000, Phone: 21000, Headphone: 8500 },
  { week: 'W2', Laptop: 52000, Phone: 20500, Headphone: 8200 },
  { week: 'W3', Laptop: 50000, Phone: 19800, Headphone: 7900 },
  { week: 'W4', Laptop: 49000, Phone: 18999, Headphone: 7599 },
];

const TRENDING = [
  { rank: 1, name: 'Wireless Earbuds', icon: '🎧', change: '+42%' },
  { rank: 2, name: 'Air Fryer', icon: '🍳', change: '+31%' },
  { rank: 3, name: 'Yoga Mat', icon: '🧘', change: '+27%' },
  { rank: 4, name: 'Power Bank', icon: '🔋', change: '+19%' },
  { rank: 5, name: 'LED Strip Lights', icon: '💡', change: '+15%' },
];

const COLORS = ['#a7a5ff', '#7c79ff', '#645efb', '#4F46E5', '#3730a3'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs text-[#dee5ff] shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: ₹{p.value?.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

function TrendDashboard() {
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    getTrendingInsight()
      .then(setInsight)
      .catch(() => setInsight('Shop smarter this week — electronics prices have dropped 8% on average!'))
      .finally(() => setInsightLoading(false));
  }, []);

  return (
    <div className={darkMode ? 'text-[#dee5ff]' : 'text-[#0f1930]'}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="section-heading">Trend Dashboard</h1>
          <p className="text-sm text-[#a3aac4] mt-1">What India is shopping this week</p>
        </div>
        <button
          onClick={() => setDarkMode((d) => !d)}
          aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
          className="btn-ghost text-sm flex items-center gap-2"
        >
          {darkMode ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* AI Insight Card */}
      <div className="glass-card p-5 mb-8 border border-[#645efb]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#645efb]/10 rounded-full blur-2xl" aria-hidden="true" />
        <div className="flex items-start gap-3 relative z-10">
          <span className="text-2xl" aria-hidden="true">✨</span>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#645efb] mb-1">AI Insight · Gemini</p>
            {insightLoading ? (
              <div className="skeleton h-4 w-64 mt-1" aria-label="Loading AI insight..." />
            ) : (
              <p className="text-sm text-[#dee5ff] leading-relaxed">{insight}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Bar chart */}
        <section className="glass-card p-5" aria-labelledby="bar-chart-title">
          <h2 id="bar-chart-title" className="text-sm font-bold mb-4 text-[#dee5ff]">
            📊 Top Categories This Week
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CATEGORIES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#40485d" opacity={0.3} />
              <XAxis dataKey="name" tick={{ fill: '#a3aac4', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#a3aac4', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {CATEGORIES.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Line chart */}
        <section className="glass-card p-5" aria-labelledby="line-chart-title">
          <h2 id="line-chart-title" className="text-sm font-bold mb-4 text-[#dee5ff]">
            📈 Price Trends (₹) — Last 4 Weeks
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={PRICE_TRENDS} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#40485d" opacity={0.3} />
              <XAxis dataKey="week" tick={{ fill: '#a3aac4', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#a3aac4', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="Laptop" stroke="#a7a5ff" strokeWidth={2} dot={{ fill: '#a7a5ff', r: 4 }} />
              <Line type="monotone" dataKey="Phone" stroke="#645efb" strokeWidth={2} dot={{ fill: '#645efb', r: 4 }} />
              <Line type="monotone" dataKey="Headphone" stroke="#ff9dd1" strokeWidth={2} dot={{ fill: '#ff9dd1', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex gap-4 mt-3 text-xs text-[#a3aac4]">
            {['Laptop', 'Phone', 'Headphone'].map((k, i) => (
              <span key={k} className="flex items-center gap-1">
                <span className="inline-block w-3 h-0.5 rounded" style={{ background: COLORS[i] }} />
                {k}
              </span>
            ))}
          </div>
        </section>
      </div>

      {/* Trending list */}
      <section className="glass-card p-5" aria-labelledby="trending-title">
        <h2 id="trending-title" className="text-sm font-bold mb-4 text-[#dee5ff]">🔥 What's Trending Now</h2>
        <div className="flex flex-col gap-2">
          {TRENDING.map((item) => (
            <div
              key={item.rank}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#141f38] transition-colors"
            >
              <span className="text-xl font-black text-gradient w-6 text-center">#{item.rank}</span>
              <span className="text-xl" aria-hidden="true">{item.icon}</span>
              <span className="flex-1 text-sm text-[#dee5ff] font-medium">{item.name}</span>
              <span className="text-xs font-semibold text-emerald-400">{item.change}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default TrendDashboard;

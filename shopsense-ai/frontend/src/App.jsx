import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { HelmetProvider } from 'react-helmet-async';
import ReactGA from 'react-ga4';
import Navbar from './components/Navbar';
import ChatWidget from './components/ChatWidget';

const Home = lazy(() => import('./pages/Home'));
const Search = lazy(() => import('./pages/Search'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

// Initialize GA4
if (import.meta.env.VITE_GA_MEASUREMENT_ID) {
  ReactGA.initialize(import.meta.env.VITE_GA_MEASUREMENT_ID);
}

function AppRoutes() {
  const location = useLocation();
  useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname + location.search });
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search" element={<Search />} />
      <Route path="/wishlist" element={<Wishlist />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={
        <main className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <p className="text-6xl mb-4">🛍️</p>
          <h1 className="text-2xl font-bold text-[#dee5ff] mb-2">Page Not Found</h1>
          <p className="text-[#a3aac4] mb-6">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn-primary">← Back to Home</a>
        </main>
      } />
    </Routes>
  );
}

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-t-[#645efb] border-[#40485d]/30 animate-spin" />
        <p className="text-sm text-[#a3aac4]">Loading...</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-[#060e20]">
        <Navbar />
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
        <ChatWidget />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#141f38',
              color: '#dee5ff',
              border: '1px solid rgba(64,72,93,0.3)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#a7a5ff', secondary: '#060e20' } },
            error: { iconTheme: { primary: '#ff6e84', secondary: '#060e20' } },
          }}
        />
      </div>
    </HelmetProvider>
  );
}

export default App;

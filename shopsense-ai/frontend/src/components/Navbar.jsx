import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/search', label: 'Search', icon: '🔍' },
  { to: '/wishlist', label: 'Wishlist', icon: '❤️' },
  { to: '/dashboard', label: 'Trends', icon: '📊' },
];

function Navbar() {
  const { currentUser, signInWithGoogle, signOut, loading } = useAuth();
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 w-full" role="banner">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between
                   bg-glass border-b border-[#40485d]/20"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <Link to="/" aria-label="ShopSense AI Home" className="flex items-center gap-2 group">
          <span className="text-2xl" aria-hidden="true">🛍️</span>
          <span className="font-extrabold text-lg text-gradient">ShopSense AI</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ to, label, icon }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150
                    ${isActive
                      ? 'bg-[#141f38] text-[#a7a5ff]'
                      : 'text-[#a3aac4] hover:text-[#dee5ff] hover:bg-[#0f1930]'}`}
                >
                  <span aria-hidden="true">{icon}</span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Auth */}
        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full skeleton" aria-label="Loading..." />
          ) : currentUser ? (
            <div className="flex items-center gap-2">
              <img
                src={currentUser.photoURL}
                alt={`${currentUser.displayName}'s profile`}
                className="w-8 h-8 rounded-full ring-2 ring-[#645efb]/40"
              />
              <span className="hidden sm:block text-xs text-[#a3aac4]">
                {currentUser.displayName?.split(' ')[0]}
              </span>
              <button
                onClick={signOut}
                aria-label="Sign out"
                className="btn-ghost text-xs px-3 py-1.5"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              aria-label="Sign in with Google"
              className="btn-primary text-xs flex items-center gap-2"
            >
              <span aria-hidden="true">G</span>
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-glass border-t border-[#40485d]/20">
        <ul className="flex items-center justify-around px-2 py-2" role="list">
          {NAV_LINKS.map(({ to, label, icon }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to));
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-label={label}
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg text-xs transition-all
                    ${isActive ? 'text-[#a7a5ff]' : 'text-[#a3aac4]'}`}
                >
                  <span className="text-xl" aria-hidden="true">{icon}</span>
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}

export default Navbar;

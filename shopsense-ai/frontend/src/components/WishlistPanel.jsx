import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import { formatPrice, generateId } from '../lib/utils';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';

function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="60" cy="60" r="60" fill="#0f1930" />
        <path d="M35 45h50l-6 30H41L35 45z" fill="#192540" stroke="#40485d" strokeWidth="2" />
        <path d="M35 45l-5-15H22" stroke="#40485d" strokeWidth="2" strokeLinecap="round" />
        <circle cx="48" cy="82" r="5" fill="#645efb" />
        <circle cx="72" cy="82" r="5" fill="#645efb" />
        <path d="M52 58c0-4.4 3.6-8 8-8s8 3.6 8 8" stroke="#a7a5ff" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <h2 className="text-2xl font-bold text-[#dee5ff] mt-6 mb-2">Your wishlist is empty</h2>
      <p className="text-[#a3aac4] text-sm mb-6">Browse products and tap the heart icon to save them here.</p>
      <a href="/search" className="btn-primary">Start Shopping →</a>
    </div>
  );
}

function WishlistPanel() {
  const { currentUser, signInWithGoogle } = useAuth();
  const { getWishlist, removeFromWishlist, updateTargetPrice } = useFirestore();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) { setLoading(false); return; }
    getWishlist(currentUser.uid).then((data) => {
      setItems(data);
      setLoading(false);
    });
  }, [currentUser]);

  const handleRemove = async (docId) => {
    await removeFromWishlist(currentUser.uid, docId);
    setItems((prev) => prev.filter((i) => i.id !== docId));
  };

  const handleTargetPrice = async (docId, val) => {
    const price = parseFloat(val);
    if (isNaN(price)) return;
    setItems((prev) => prev.map((i) => i.id === docId ? { ...i, targetPrice: price } : i));
    await updateTargetPrice(docId, price);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.text('ShopSense AI — My Wishlist', 14, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    items.forEach((item, i) => {
      const y = 30 + i * 14;
      doc.text(`${i + 1}. ${item.title}`, 14, y);
      doc.text(formatPrice(item.price), 160, y, { align: 'right' });
    });
    doc.save('shopsense-wishlist.pdf');
    toast.success('Wishlist exported as PDF!');
  };

  if (!currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-4xl mb-4" aria-hidden="true">🔐</p>
        <h2 className="text-xl font-bold text-[#dee5ff] mb-2">Sign in to view your wishlist</h2>
        <p className="text-[#a3aac4] text-sm mb-6">Your wishlist is saved securely in the cloud.</p>
        <button onClick={signInWithGoogle} className="btn-primary">Sign in with Google</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass-card p-4 h-72">
            <div className="skeleton h-40 w-full mb-3" />
            <div className="skeleton h-4 w-3/4 mb-2" />
            <div className="skeleton h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) return <EmptyWishlist />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="section-heading">My Wishlist <span className="text-[#a3aac4] font-normal text-base">({items.length})</span></h1>
        <button onClick={exportPDF} aria-label="Export wishlist as PDF" className="btn-ghost text-xs flex items-center gap-2">
          📄 Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const dropped = item.targetPrice > 0 && item.price <= item.targetPrice;
          return (
            <article
              key={item.id}
              className="glass-card p-4 flex flex-col gap-3"
              aria-label={`Wishlist item: ${item.title}`}
            >
              {dropped && (
                <span className="badge-price-drop" aria-label="Price dropped to your target!">
                  🎉 Price Dropped!
                </span>
              )}
              <img
                src={item.image || 'https://via.placeholder.com/300x200/0f1930/a7a5ff?text=Product'}
                alt={item.title}
                className="w-full h-40 object-cover rounded-lg"
                loading="lazy"
              />
              <h3 className="text-sm font-semibold text-[#dee5ff] leading-snug line-clamp-2">{item.title}</h3>
              <p className="text-lg font-bold text-gradient">{formatPrice(item.price)}</p>

              <div>
                <label htmlFor={`target-${item.id}`} className="text-xs text-[#a3aac4] mb-1 block">
                  Target Price (₹)
                </label>
                <input
                  id={`target-${item.id}`}
                  type="number"
                  placeholder="Set your target..."
                  defaultValue={item.targetPrice || ''}
                  onBlur={(e) => handleTargetPrice(item.id, e.target.value)}
                  className="w-full bg-[#091328] border border-[#40485d]/30 rounded-lg px-3 py-2
                             text-sm text-[#dee5ff] placeholder-[#6d758c] focus:outline-none
                             focus:border-[#a7a5ff]/50 transition-colors"
                  aria-label={`Target price for ${item.title}`}
                  min={0}
                />
              </div>

              <div className="flex gap-2 mt-auto">
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`View ${item.title}`}
                    className="btn-primary text-xs flex-1 text-center"
                  >
                    View →
                  </a>
                )}
                <button
                  onClick={() => handleRemove(item.id)}
                  aria-label={`Remove ${item.title} from wishlist`}
                  className="btn-ghost text-xs px-3 text-red-400 border-red-500/20 hover:bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

export default WishlistPanel;

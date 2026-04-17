import { useState } from 'react';
import { formatPrice, truncateText, renderStars } from '../lib/utils';
import { useAuth } from '../hooks/useAuth';
import { useFirestore } from '../hooks/useFirestore';
import toast from 'react-hot-toast';

function ProductCard({ product, onCompare, compareMode = false, selected = false }) {
  const { currentUser, signInWithGoogle } = useAuth();
  const { addToWishlist } = useFirestore();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      toast.error('Please sign in to save to wishlist');
      await signInWithGoogle();
      return;
    }

    try {
      setAdding(true);
      await addToWishlist(currentUser.uid, product);
      setWishlisted(true);
      setTimeout(() => setWishlisted(false), 3000);
    } catch {
      // toast already shown in hook
    } finally {
      setAdding(false);
    }
  };

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'INR',
    },
  };

  return (
    <article
      className={`product-card relative flex flex-col ${selected ? 'border-[#645efb]/60 ring-2 ring-[#645efb]/30' : ''}`}
      aria-label={`Product: ${product.title}`}
    >
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>

      {/* Compare checkbox */}
      {compareMode && (
        <button
          onClick={() => onCompare?.(product)}
          aria-label={`${selected ? 'Deselect' : 'Select'} ${product.title} for comparison`}
          className={`absolute top-3 left-3 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
            selected ? 'bg-[#645efb] border-[#645efb]' : 'border-[#6d758c] bg-transparent'
          }`}
        >
          {selected && <span className="text-white text-xs">✓</span>}
        </button>
      )}

      {/* Wishlist heart */}
      <button
        onClick={handleWishlist}
        aria-label={wishlisted ? 'Already in wishlist' : `Add ${product.title} to wishlist`}
        disabled={adding}
        className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center
                   bg-[#060e20]/60 backdrop-blur-sm transition-all duration-200
                   hover:scale-110 active:scale-95 ${wishlisted ? 'text-red-400' : 'text-[#a3aac4] hover:text-red-400'}`}
      >
        {adding ? '⏳' : wishlisted ? '❤️' : '🤍'}
      </button>

      {/* Product image */}
      <div className="w-full h-48 rounded-lg overflow-hidden bg-[#091328] mb-3">
        <img
          src={product.image}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/300x300/0f1930/a7a5ff?text=Product'; }}
        />
      </div>

      {/* Source badge */}
      {product.source && (
        <span className="text-[10px] uppercase tracking-widest text-[#a3aac4] font-medium mb-1">
          {product.source}
        </span>
      )}

      {/* Title */}
      <h3 className="text-sm font-semibold text-[#dee5ff] leading-snug mb-2">
        {truncateText(product.title, 60)}
      </h3>

      {/* Rating */}
      <div className="flex items-center gap-1.5 mb-2" aria-label={`Rating: ${product.rating} out of 5`}>
        <span className="text-amber-400 text-xs">{renderStars(product.rating || 4)}</span>
        <span className="text-xs text-[#a3aac4]">({product.rating || '4.0'})</span>
      </div>

      {/* Price */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#40485d]/20">
        <p className="text-base font-bold text-gradient">
          {typeof product.price === 'number' ? formatPrice(product.price) : product.price || '—'}
        </p>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View ${product.title} on ${product.source}`}
          className="btn-primary text-xs px-3 py-1.5"
        >
          View →
        </a>
      </div>
    </article>
  );
}

export default ProductCard;

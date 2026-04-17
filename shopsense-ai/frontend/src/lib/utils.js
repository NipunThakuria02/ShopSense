/**
 * Format a number to Indian rupee format
 * @param {number} amount
 * @returns {string} e.g. "₹1,000"
 */
export function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/**
 * Strip HTML tags and limit to 500 chars for safe Gemini input
 * @param {string} input
 * @returns {string}
 */
export function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  const noScript = input.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const stripped = noScript.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  return stripped.slice(0, 500).trim();
}

/**
 * Truncate text with ellipsis
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Calculate discount percentage
 * @param {number} original
 * @param {number} current
 * @returns {string} e.g. "25% off"
 */
export function calculateDiscount(original, current) {
  if (!original || !current || original <= current) return '0% off';
  const pct = Math.round(((original - current) / original) * 100);
  return `${pct}% off`;
}

/**
 * Render star rating as string of ★☆
 * @param {number} rating 0-5
 * @returns {string}
 */
export function renderStars(rating) {
  const full = Math.floor(rating);
  const empty = 5 - full;
  return '★'.repeat(full) + '☆'.repeat(empty);
}

/**
 * Debounce a function call
 * @param {Function} fn
 * @param {number} delay
 * @returns {Function}
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Generate a unique ID
 * @returns {string}
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Extract price from a string like "₹1,299" or "$19.99"
 * @param {string} priceStr
 * @returns {number}
 */
export function extractPrice(priceStr) {
  if (!priceStr) return 0;
  const cleaned = priceStr.replace(/[^0-9.]/g, '');
  return parseFloat(cleaned) || 0;
}

/**
 * Get relative time string
 * @param {Date|number} date
 * @returns {string}
 */
export function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Mock product image (placeholder via picsum)
 * @param {number} id seed
 * @returns {string} url
 */
export function productImage(id = 1) {
  const seeds = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1560343090-f0409e92791a?w=300&h=300&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=300&fit=crop',
  ];
  return seeds[id % seeds.length];
}

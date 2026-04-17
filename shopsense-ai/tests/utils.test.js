// Pure utility functions (copied from lib/utils.js for isolated testing)
function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₹0';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

function sanitizeInput(input) {
  if (!input || typeof input !== 'string') return '';
  // Strip script/style tag content entirely first
  const noScript = input.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
  const stripped = noScript.replace(/<[^>]*>/g, '').replace(/[<>]/g, '');
  return stripped.slice(0, 500).trim();
}

function truncateText(text, maxLength = 80) {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

function calculateDiscount(original, current) {
  if (!original || !current || original <= current) return '0% off';
  const pct = Math.round(((original - current) / original) * 100);
  return `${pct}% off`;
}

describe('formatPrice', () => {
  test('formats 1000 as ₹1,000', () => {
    expect(formatPrice(1000)).toBe('₹1,000');
  });
  test('formats 0 as ₹0', () => {
    expect(formatPrice(0)).toBe('₹0');
  });
  test('formats large amount', () => {
    expect(formatPrice(100000)).toBe('₹1,00,000');
  });
  test('returns ₹0 for null', () => {
    expect(formatPrice(null)).toBe('₹0');
  });
  test('returns ₹0 for NaN', () => {
    expect(formatPrice(NaN)).toBe('₹0');
  });
});

describe('sanitizeInput', () => {
  test('strips HTML tags', () => {
    expect(sanitizeInput('<script>alert(1)</script>hello')).toBe('hello');
  });
  test('strips HTML tags leaving surrounding text', () => {
    expect(sanitizeInput('Hello <b>world</b>')).toBe('Hello world');
  });
  test('limits to 500 characters', () => {
    const long = 'a'.repeat(600);
    expect(sanitizeInput(long).length).toBe(500);
  });
  test('returns empty string for null', () => {
    expect(sanitizeInput(null)).toBe('');
  });
  test('returns empty string for non-string', () => {
    expect(sanitizeInput(123)).toBe('');
  });
});

describe('truncateText', () => {
  test('truncates long text with ellipsis', () => {
    expect(truncateText('hello world', 5)).toBe('hello…');
  });
  test('does not truncate short text', () => {
    expect(truncateText('hi', 80)).toBe('hi');
  });
  test('returns empty string for null', () => {
    expect(truncateText(null)).toBe('');
  });
  test('uses default maxLength of 80', () => {
    const text = 'a'.repeat(100);
    expect(truncateText(text)).toHaveLength(81); // 80 chars + ellipsis
  });
});

describe('calculateDiscount', () => {
  test('calculates 25% discount', () => {
    expect(calculateDiscount(1000, 750)).toBe('25% off');
  });
  test('returns 0% when prices are equal', () => {
    expect(calculateDiscount(1000, 1000)).toBe('0% off');
  });
  test('returns 0% when current is higher', () => {
    expect(calculateDiscount(1000, 1200)).toBe('0% off');
  });
  test('calculates 50% discount', () => {
    expect(calculateDiscount(2000, 1000)).toBe('50% off');
  });
  test('handles null inputs', () => {
    expect(calculateDiscount(null, 500)).toBe('0% off');
  });
});

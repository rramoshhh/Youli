export const formatCurrency = (amount: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const clampText = (text: string, max = 140) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
};

export const buildAbsoluteUrl = (path: string) => {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return new URL(path, base).toString();
};

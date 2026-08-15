/** Formatting utilities */

/**
 * Formats a number as Indian Rupees.
 * e.g., 1299 → "₹1,299"
 */
export const formatPrice = (amount: number): string =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

/**
 * Formats an ISO date string to readable format.
 * e.g., "2024-06-15T10:30:00Z" → "15 Jun 2024, 4:00 PM"
 */
export const formatDate = (isoString: string): string =>
  new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(isoString));

/**
 * Formats an ISO string to relative time.
 * e.g., "2 hours ago"
 */
export const formatRelativeTime = (isoString: string): string => {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/**
 * Truncates a string to maxLength and adds ellipsis.
 */
export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

/**
 * Capitalizes the first letter of each word.
 */
export const titleCase = (str: string): string =>
  str.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

/**
 * Formats a Date object to YYYY-MM-DD string in local timezone
 * @param date - The Date object to format
 * @returns Formatted date string (e.g., "2024-01-15")
 */
export function formatDateLocal(date: Date): string {
  // Returns YYYY-MM-DD in local time
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

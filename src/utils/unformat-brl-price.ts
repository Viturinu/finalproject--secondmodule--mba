export function parseFromBRL(formatted: string): number {
  const cleaned = formatted.replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned);
}

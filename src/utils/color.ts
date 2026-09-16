/** True if a hex color is visually "light" (needs dark text on top of it). */
export function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  if ([r, g, b].some((n) => Number.isNaN(n))) return true;
  // Perceived brightness (standard luma formula).
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150;
}

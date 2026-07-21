export const NUCLEO_COLORS = [
  "var(--sky)",
  "var(--citrus)",
  "var(--lavender)",
  "var(--peach)",
  "var(--pink)",
  "#FFE5A0",
  "#D4F4DD",
];

export function corDoNucleo(titulo: string | null | undefined, cor: string | null | undefined) {
  if (cor) return cor;
  const idx = (titulo?.charCodeAt(0) ?? 0) % NUCLEO_COLORS.length;
  return NUCLEO_COLORS[idx];
}

import type { RegistroCategoria } from "@/types/entities";

export const CATEGORIA_COLORS: Record<RegistroCategoria, { bg: string; text: string }> = {
  diario: { bg: "var(--sky)", text: "#2A7BA6" },
  metas: { bg: "var(--citrus)", text: "#6A8A1A" },
  reflexao: { bg: "var(--lavender)", text: "#6B52C8" },
  projeto_pessoal: { bg: "var(--peach)", text: "#B87340" },
  financeiro: { bg: "#E8F5E9", text: "#2E7D32" },
  saude: { bg: "var(--pink)", text: "#C870A8" },
  outro: { bg: "#F3F5F9", text: "#545F6C" },
};

export const CATEGORIA_LABEL: Record<RegistroCategoria, string> = {
  diario: "Diário",
  metas: "Metas",
  reflexao: "Reflexão",
  projeto_pessoal: "Projeto Pessoal",
  financeiro: "Financeiro",
  saude: "Saúde",
  outro: "Outro",
};

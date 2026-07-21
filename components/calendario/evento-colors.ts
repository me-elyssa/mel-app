import type { EventoTipo } from "@/types/entities";

export const TIPO_COLORS: Record<EventoTipo, { bg: string; text: string; dot: string }> = {
  audiencia: { bg: "bg-[#DBEAFE]", text: "text-[#1D4ED8]", dot: "bg-[#3B82F6]" },
  reuniao: { bg: "bg-[#F3E8FF]", text: "text-[#7C3AED]", dot: "bg-[#8B5CF6]" },
  prazo: { bg: "bg-[#FEE2E2]", text: "text-[#B91C1C]", dot: "bg-[#EF4444]" },
  compromisso: { bg: "bg-[#FEF3C7]", text: "text-[#B45309]", dot: "bg-[#F59E0B]" },
  outro: { bg: "bg-[#F3F5F9]", text: "text-[#4B5563]", dot: "bg-[#9CA3AF]" },
};

export const TIPO_LABEL: Record<EventoTipo, string> = {
  audiencia: "Audiência",
  reuniao: "Reunião",
  prazo: "Prazo",
  compromisso: "Compromisso",
  outro: "Outro",
};

import { differenceInCalendarDays } from "date-fns";
import type { Nucleo } from "@/types/entities";

export const DIAS_REVISAO = 30;

/** Dias desde a última revisão; se nunca revisado, conta a partir da criação. */
export function diasSemRevisao(nucleo: Nucleo): number {
  return differenceInCalendarDays(new Date(), new Date(nucleo.ultima_revisao ?? nucleo.created_at));
}

/** Somente núcleos ativos entram no lembrete de revisão. */
export function revisaoAtrasada(nucleo: Nucleo): boolean {
  return nucleo.status === "ativo" && diasSemRevisao(nucleo) >= DIAS_REVISAO;
}

export function textoUltimaRevisao(nucleo: Nucleo): string {
  if (!nucleo.ultima_revisao) return "Nunca revisado";
  const d = diasSemRevisao(nucleo);
  if (d === 0) return "Revisado hoje";
  return d === 1 ? "Revisado há 1 dia" : `Revisado há ${d} dias`;
}

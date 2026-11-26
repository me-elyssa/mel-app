import type { EdcmDia } from "@/types/entities";

export function hojeISO(): string {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mm}-${dd}`;
}

/** Disciplina do dia, inferida do Bloco 1 (texto antes dos dois pontos). */
export function disciplinaDoDia(dia: EdcmDia): string {
  const b = (dia.bloco1 ?? "").trim();
  if (/^simulado/i.test(b)) return "Simulado";
  if (/^corre[çc][ãa]o/i.test(b)) return "Correção de simulado";
  if (/^descanso/i.test(b)) return "Descanso";
  if (/^revis[ãa]o|^quest[õo]es leves/i.test(b)) return "Revisão";
  const i = b.indexOf(":");
  return i > 0 ? b.slice(0, i).trim() : "Outros";
}

export function formatarDuracao(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${m}min`;
}

export function formatarCronometro(segundos: number): string {
  const s = Math.max(0, Math.floor(segundos));
  const h = String(Math.floor(s / 3600)).padStart(2, "0");
  const m = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const sec = String(s % 60).padStart(2, "0");
  return `${h}:${m}:${sec}`;
}

export function percentual(acertos: number, questoes: number): number | null {
  return questoes > 0 ? Math.round((acertos / questoes) * 100) : null;
}

export function formatarData(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${d}/${m}`;
}

/** Segunda-feira da semana da data (ISO), para agrupar a evolução semanal. */
export function inicioDaSemana(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = (dt.getUTCDay() + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - dow);
  return dt.toISOString().slice(0, 10);
}

export interface DesempenhoDisciplina {
  disciplina: string;
  questoes: number;
  acertos: number;
  segundos: number;
}

export function desempenhoPorDisciplina(dias: EdcmDia[]): DesempenhoDisciplina[] {
  const mapa = new Map<string, DesempenhoDisciplina>();
  for (const dia of dias) {
    if (dia.questoes === 0 && dia.segundos_estudados === 0) continue;
    const nome = disciplinaDoDia(dia);
    const atual = mapa.get(nome) ?? { disciplina: nome, questoes: 0, acertos: 0, segundos: 0 };
    atual.questoes += dia.questoes;
    atual.acertos += dia.acertos;
    atual.segundos += dia.segundos_estudados;
    mapa.set(nome, atual);
  }
  return [...mapa.values()].sort((a, b) => (percentual(a.acertos, a.questoes) ?? 101) - (percentual(b.acertos, b.questoes) ?? 101));
}

export interface EvolucaoSemana {
  semana: string;
  segundos: number;
  questoes: number;
  acertos: number;
  diasFeitos: number;
}

export function evolucaoSemanal(dias: EdcmDia[]): EvolucaoSemana[] {
  const mapa = new Map<string, EvolucaoSemana>();
  for (const dia of dias) {
    const semana = inicioDaSemana(dia.data);
    const atual = mapa.get(semana) ?? { semana, segundos: 0, questoes: 0, acertos: 0, diasFeitos: 0 };
    atual.segundos += dia.segundos_estudados;
    atual.questoes += dia.questoes;
    atual.acertos += dia.acertos;
    if (dia.feito) atual.diasFeitos += 1;
    mapa.set(semana, atual);
  }
  return [...mapa.values()].sort((a, b) => a.semana.localeCompare(b.semana));
}

/** Sequência de dias feitos consecutivos terminando no último dia já concluído até hoje. */
export function constancia(dias: EdcmDia[], hoje: string): number {
  const passados = dias.filter((d) => d.data <= hoje);
  let seq = 0;
  for (let i = passados.length - 1; i >= 0; i--) {
    if (passados[i].feito) seq++;
    else if (passados[i].data === hoje) continue; // hoje ainda pode ser concluído
    else break;
  }
  return seq;
}

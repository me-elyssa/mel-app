"use client";

import type { EdcmDia } from "@/types/entities";
import {
  desempenhoPorDisciplina,
  evolucaoSemanal,
  formatarData,
  formatarDuracao,
  percentual,
} from "./edcm-utils";

function corPorAcerto(pct: number | null): string {
  if (pct === null) return "#C9D0DB";
  if (pct >= 80) return "#16A34A";
  if (pct >= 60) return "#F59E0B";
  return "#EF4444";
}

export function DesempenhoDisciplinas({ dias }: { dias: EdcmDia[] }) {
  const dados = desempenhoPorDisciplina(dias);
  return (
    <section className="bg-white border border-[#E6EAF0] rounded-[16px] p-5">
      <h3 className="text-[#0B0F15] font-bold">Desempenho por disciplina</h3>
      <p className="text-xs text-[#6A7686] mt-1 mb-4">
        A disciplina é lida do Bloco 1 de cada dia. As mais fracas aparecem primeiro.
      </p>
      {dados.length === 0 ? (
        <p className="text-sm text-[#8A94A6] py-6 text-center">
          Registre questões e acertos nos dias do cronograma para ver o desempenho.
        </p>
      ) : (
        <ul className="space-y-3">
          {dados.map((d) => {
            const pct = percentual(d.acertos, d.questoes);
            return (
              <li key={d.disciplina}>
                <div className="flex items-baseline justify-between text-sm">
                  <span className="font-semibold text-[#0B0F15]">{d.disciplina}</span>
                  <span className="text-[#6A7686] text-xs tabular-nums">
                    {d.acertos}/{d.questoes} questões · {formatarDuracao(d.segundos)} · {pct === null ? "sem questões" : `${pct}%`}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#F3F5F9] mt-1 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct ?? 0}%`, background: corPorAcerto(pct) }} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function BarrasSemanais({
  titulo,
  valores,
  formato,
  cor,
}: {
  titulo: string;
  valores: { rotulo: string; valor: number }[];
  formato: (v: number) => string;
  cor: string;
}) {
  const max = Math.max(1, ...valores.map((v) => v.valor));
  return (
    <section className="bg-white border border-[#E6EAF0] rounded-[16px] p-5">
      <h3 className="text-[#0B0F15] font-bold mb-4">{titulo}</h3>
      <div className="flex items-end gap-2 h-40 overflow-x-auto" role="img" aria-label={titulo}>
        {valores.map((v) => (
          <div key={v.rotulo} className="flex flex-col items-center justify-end h-full min-w-[34px] flex-1">
            <span className="text-[10px] text-[#6A7686] tabular-nums mb-1">{v.valor > 0 ? formato(v.valor) : ""}</span>
            <div
              className="w-full rounded-t-[6px]"
              style={{ height: `${(v.valor / max) * 100}%`, minHeight: v.valor > 0 ? 3 : 0, background: cor }}
            />
            <span className="text-[10px] text-[#8A94A6] mt-1">{v.rotulo}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

export function EvolucaoSemanal({ dias }: { dias: EdcmDia[] }) {
  const semanas = evolucaoSemanal(dias);
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <BarrasSemanais
        titulo="Horas líquidas por semana"
        valores={semanas.map((s) => ({ rotulo: formatarData(s.semana), valor: s.segundos }))}
        formato={formatarDuracao}
        cor="#1E63FF"
      />
      <BarrasSemanais
        titulo="% de acerto por semana"
        valores={semanas.map((s) => ({ rotulo: formatarData(s.semana), valor: percentual(s.acertos, s.questoes) ?? 0 }))}
        formato={(v) => `${v}%`}
        cor="#16A34A"
      />
      <BarrasSemanais
        titulo="Dias concluídos por semana"
        valores={semanas.map((s) => ({ rotulo: formatarData(s.semana), valor: s.diasFeitos }))}
        formato={(v) => String(v)}
        cor="#7C3AED"
      />
    </div>
  );
}

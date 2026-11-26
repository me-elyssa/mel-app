"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import type { EdcmDia, UpdateEdcmDiaInput } from "@/types/entities";
import EditableText from "./EditableText";
import { formatarData, formatarDuracao, percentual } from "./edcm-utils";

interface Props {
  dias: EdcmDia[];
  hoje: string;
  onAtualizar: (id: string, input: UpdateEdcmDiaInput) => void;
  focarHoje: number;
}

function NumeroEditavel({ valor, onSalvar, rotulo }: { valor: number; onSalvar: (n: number) => void; rotulo: string }) {
  return (
    <input
      type="number"
      min={0}
      defaultValue={valor}
      key={valor}
      aria-label={rotulo}
      onBlur={(e) => {
        const n = Math.max(0, parseInt(e.target.value || "0", 10) || 0);
        if (n !== valor) onSalvar(n);
      }}
      onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
      className="w-16 text-sm text-center border border-[#E6EAF0] rounded-[8px] py-1 focus:outline-none focus:border-[#1E63FF]"
    />
  );
}

export default function CronogramaTabela({ dias, hoje, onAtualizar, focarHoje }: Props) {
  const linhaHoje = useRef<HTMLTableRowElement>(null);

  useEffect(() => {
    if (focarHoje > 0) linhaHoje.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [focarHoje]);

  const idHoje = dias.find((d) => d.data >= hoje)?.id;

  return (
    <div className="bg-white border border-[#E6EAF0] rounded-[16px] overflow-x-auto">
      <table className="w-full min-w-[1100px] text-left">
        <thead>
          <tr className="text-xs font-semibold text-[#6A7686] border-b border-[#E6EAF0]">
            <th className="px-3 py-3 w-20">Data</th>
            <th className="px-2 py-3 w-12">Dia</th>
            <th className="px-2 py-3 w-14 text-center">Feito</th>
            <th className="px-2 py-3 min-w-[260px]">Bloco 1 (1h30)</th>
            <th className="px-2 py-3 min-w-[220px]">Bloco 2 (1h)</th>
            <th className="px-2 py-3 min-w-[160px]">Bloco 3 (30 min)</th>
            <th className="px-2 py-3 w-20 text-center">Questões</th>
            <th className="px-2 py-3 w-20 text-center">Acertos</th>
            <th className="px-2 py-3 w-16 text-center">%</th>
            <th className="px-2 py-3 w-28">Fase</th>
            <th className="px-2 py-3 w-20 text-center">Estudado</th>
          </tr>
        </thead>
        <tbody>
          {dias.map((dia) => {
            const simulado = /^simulado/i.test(dia.bloco1 ?? "");
            const ehHoje = dia.data === hoje;
            const pct = percentual(dia.acertos, dia.questoes);
            return (
              <tr
                key={dia.id}
                ref={dia.id === idHoje ? linhaHoje : undefined}
                className={`border-b border-[#F3F5F9] align-top ${
                  simulado ? "bg-amber-50" : dia.feito ? "bg-[#F8FAFC]" : ""
                } ${ehHoje ? "outline outline-2 -outline-offset-2 outline-[#1E63FF]" : ""}`}
              >
                <td className="px-3 py-2 text-sm tabular-nums text-[#545F6C]">{formatarData(dia.data)}</td>
                <td className="px-2 py-2 text-sm text-[#545F6C]">{dia.dia_semana}</td>
                <td className="px-2 py-2 text-center">
                  <button
                    onClick={() => onAtualizar(dia.id, { feito: !dia.feito })}
                    aria-label={dia.feito ? "Desmarcar dia" : "Marcar dia como feito"}
                    aria-pressed={dia.feito}
                    className={`w-6 h-6 rounded-[6px] border inline-flex items-center justify-center transition-colors ${
                      dia.feito ? "bg-[#1E63FF] border-[#1E63FF] text-white" : "border-[#C9D0DB] bg-white"
                    }`}
                  >
                    {dia.feito && <Check className="w-4 h-4" />}
                  </button>
                </td>
                <td className={`py-1 ${dia.feito ? "opacity-60" : ""}`}>
                  <EditableText valor={dia.bloco1} onSalvar={(v) => onAtualizar(dia.id, { bloco1: v })} />
                </td>
                <td className={`py-1 ${dia.feito ? "opacity-60" : ""}`}>
                  <EditableText valor={dia.bloco2} onSalvar={(v) => onAtualizar(dia.id, { bloco2: v })} />
                </td>
                <td className={`py-1 ${dia.feito ? "opacity-60" : ""}`}>
                  <EditableText valor={dia.bloco3} onSalvar={(v) => onAtualizar(dia.id, { bloco3: v })} />
                </td>
                <td className="px-2 py-2 text-center">
                  <NumeroEditavel valor={dia.questoes} rotulo="Questões" onSalvar={(n) => onAtualizar(dia.id, { questoes: n })} />
                </td>
                <td className="px-2 py-2 text-center">
                  <NumeroEditavel
                    valor={dia.acertos}
                    rotulo="Acertos"
                    onSalvar={(n) => onAtualizar(dia.id, { acertos: dia.questoes > 0 ? Math.min(n, dia.questoes) : n })}
                  />
                </td>
                <td className="px-2 py-2 text-center text-sm font-semibold tabular-nums text-[#0B0F15]">
                  {pct === null ? "" : `${pct}%`}
                </td>
                <td className="px-2 py-2 text-xs text-[#6A7686]">{dia.fase}</td>
                <td className="px-2 py-2 text-center text-xs tabular-nums text-[#545F6C]">
                  {dia.segundos_estudados > 0 ? formatarDuracao(dia.segundos_estudados) : ""}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

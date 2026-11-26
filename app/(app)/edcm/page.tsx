"use client";

import { useMemo, useState } from "react";
import { Gavel, LocateFixed } from "lucide-react";
import Cronometro from "@/components/edcm/Cronometro";
import CronogramaTabela from "@/components/edcm/CronogramaTabela";
import { DesempenhoDisciplinas, EvolucaoSemanal } from "@/components/edcm/EdcmGraficos";
import { constancia, formatarDuracao, hojeISO, percentual } from "@/components/edcm/edcm-utils";
import { Button } from "@/components/ui/button";
import { useEdcmDias, useUpdateEdcmDia } from "@/lib/hooks/useEdcm";

type Aba = "cronograma" | "desempenho" | "evolucao";

const ABAS: { value: Aba; label: string }[] = [
  { value: "cronograma", label: "Cronograma" },
  { value: "desempenho", label: "Desempenho" },
  { value: "evolucao", label: "Evolução" },
];

function Indicador({ rotulo, valor, detalhe }: { rotulo: string; valor: string; detalhe?: string }) {
  return (
    <div className="bg-white border border-[#E6EAF0] rounded-[16px] p-4">
      <p className="text-xs font-semibold text-[#6A7686]">{rotulo}</p>
      <p className="text-2xl font-extrabold text-[#0B0F15] mt-1 tabular-nums">{valor}</p>
      {detalhe && <p className="text-xs text-[#8A94A6] mt-0.5">{detalhe}</p>}
    </div>
  );
}

export default function EdcmPage() {
  const { data: dias = [], isLoading, isError } = useEdcmDias();
  const atualizar = useUpdateEdcmDia();

  const [aba, setAba] = useState<Aba>("cronograma");
  const [fase, setFase] = useState<string>("todas");
  const [focarHoje, setFocarHoje] = useState(0);
  const hoje = hojeISO();

  const fases = useMemo(() => [...new Set(dias.map((d) => d.fase).filter((f): f is string => !!f))].sort(), [dias]);
  const diasFiltrados = useMemo(() => (fase === "todas" ? dias : dias.filter((d) => d.fase === fase)), [dias, fase]);

  const resumo = useMemo(() => {
    const feitos = dias.filter((d) => d.feito).length;
    const questoes = dias.reduce((s, d) => s + d.questoes, 0);
    const acertos = dias.reduce((s, d) => s + d.acertos, 0);
    const segundos = dias.reduce((s, d) => s + d.segundos_estudados, 0);
    return { feitos, questoes, acertos, segundos, pct: percentual(acertos, questoes) };
  }, [dias]);

  const progressoFases = useMemo(
    () =>
      fases.map((f) => {
        const doFase = dias.filter((d) => d.fase === f);
        return { fase: f, feitos: doFase.filter((d) => d.feito).length, total: doFase.length };
      }),
    [dias, fases]
  );

  const diaPadrao = dias.find((d) => d.data === hoje) ?? dias.find((d) => d.data >= hoje) ?? dias[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[#0B0F15] flex items-center gap-2">
            <Gavel className="w-6 h-6" /> Cronograma EDCM
          </h1>
          <p className="text-[#6A7686] text-sm mt-1">Especialização para magistratura · {dias.length} dias de estudo</p>
        </div>
        {aba === "cronograma" && dias.length > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setFocarHoje((n) => n + 1)}>
            <LocateFixed className="w-4 h-4" /> Ir para hoje
          </Button>
        )}
      </div>

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-[12px] p-4">
          Não foi possível carregar o cronograma. Verifique se a tabela <code>edcm_dia</code> foi criada no Supabase
          (arquivos <code>supabase/schema.sql</code> e <code>supabase/edcm_seed.sql</code>).
        </div>
      )}

      {!isLoading && !isError && dias.length === 0 && (
        <div className="text-center py-16">
          <Gavel className="w-12 h-12 text-[#DCDFE5] mx-auto mb-3" />
          <p className="text-[#8A94A6]">
            Nenhum dia cadastrado. Execute <code>supabase/edcm_seed.sql</code> para importar o cronograma.
          </p>
        </div>
      )}

      {dias.length > 0 && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Indicador rotulo="Dias concluídos" valor={`${resumo.feitos}/${dias.length}`} detalhe={`Sequência atual: ${constancia(dias, hoje)} dia(s)`} />
            <Indicador rotulo="Questões feitas" valor={String(resumo.questoes)} />
            <Indicador rotulo="Acerto geral" valor={resumo.pct === null ? "—" : `${resumo.pct}%`} detalhe={`${resumo.acertos} acertos`} />
            <Indicador rotulo="Horas líquidas" valor={formatarDuracao(resumo.segundos)} detalhe="registradas no cronômetro" />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
            <section className="bg-white border border-[#E6EAF0] rounded-[16px] p-5">
              <h3 className="text-[#0B0F15] font-bold mb-3">Progresso por fase</h3>
              <ul className="space-y-3">
                {progressoFases.map((p) => (
                  <li key={p.fase}>
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-[#0B0F15]">{p.fase}</span>
                      <span className="text-[#6A7686] tabular-nums text-xs">
                        {p.feitos}/{p.total} dias
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#F3F5F9] mt-1 overflow-hidden">
                      <div className="h-full bg-[var(--neon)]" style={{ width: `${(p.feitos / p.total) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </section>
            <Cronometro
              dias={dias}
              diaPadraoId={diaPadrao?.id}
              onSalvar={(id, segundos) => atualizar.mutate({ id, segundos_estudados: segundos })}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {ABAS.map((a) => (
              <button
                key={a.value}
                onClick={() => setAba(a.value)}
                className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                  aba === a.value ? "bg-[#1E63FF] text-white" : "bg-[#F3F5F9] text-[#545F6C] hover:bg-[#E6EAF0]"
                }`}
              >
                {a.label}
              </button>
            ))}
            {aba === "cronograma" && (
              <select
                value={fase}
                onChange={(e) => setFase(e.target.value)}
                aria-label="Filtrar por fase"
                className="ml-auto text-sm border border-[#E6EAF0] rounded-[10px] px-2 py-1.5 bg-white text-[#0B0F15]"
              >
                <option value="todas">Todas as fases</option>
                {fases.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            )}
          </div>

          {aba === "cronograma" && (
            <CronogramaTabela
              dias={diasFiltrados}
              hoje={hoje}
              focarHoje={focarHoje}
              onAtualizar={(id, input) => atualizar.mutate({ id, ...input })}
            />
          )}
          {aba === "desempenho" && <DesempenhoDisciplinas dias={dias} />}
          {aba === "evolucao" && <EvolucaoSemanal dias={dias} />}
        </>
      )}
    </div>
  );
}

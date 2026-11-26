"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EdcmDia } from "@/types/entities";
import { formatarCronometro, formatarData, formatarDuracao } from "./edcm-utils";

const STORAGE_KEY = "edcm_cronometro";

interface Estado {
  diaId: string;
  acumulado: number; // segundos já contados antes do último início
  iniciadoEm: number | null; // timestamp ms quando está rodando
}

function lerEstado(): Estado | null {
  try {
    const bruto = localStorage.getItem(STORAGE_KEY);
    return bruto ? (JSON.parse(bruto) as Estado) : null;
  } catch {
    return null;
  }
}

function salvarEstado(estado: Estado | null) {
  try {
    if (estado) localStorage.setItem(STORAGE_KEY, JSON.stringify(estado));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // armazenamento indisponível: o cronômetro funciona apenas nesta aba
  }
}

interface Props {
  dias: EdcmDia[];
  diaPadraoId: string | undefined;
  onSalvar: (diaId: string, segundosTotais: number) => void;
}

export default function Cronometro({ dias, diaPadraoId, onSalvar }: Props) {
  // O componente só monta depois que os dados carregam no cliente, então ler o localStorage aqui é seguro.
  const [estado, setEstado] = useState<Estado | null>(() => (typeof window === "undefined" ? null : lerEstado()));
  const [diaEscolhido, setDiaEscolhido] = useState<string | undefined>(undefined);
  const [agora, setAgora] = useState(() => Date.now());

  const diaId = estado?.diaId ?? diaEscolhido ?? diaPadraoId;

  const rodando = estado?.iniciadoEm != null;

  useEffect(() => {
    if (!rodando) return;
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [rodando]);

  const dia = useMemo(() => dias.find((d) => d.id === diaId), [dias, diaId]);

  const decorrido = estado
    ? estado.acumulado + (estado.iniciadoEm ? Math.floor((agora - estado.iniciadoEm) / 1000) : 0)
    : 0;

  const jaRegistrado = dia?.segundos_estudados ?? 0;
  const meta = (dia?.horas ?? 0) * 3600;
  const progresso = meta > 0 ? Math.min(100, ((jaRegistrado + decorrido) / meta) * 100) : 0;

  const iniciar = () => {
    if (!diaId) return;
    const novo: Estado = { diaId, acumulado: estado?.acumulado ?? 0, iniciadoEm: Date.now() };
    setAgora(Date.now());
    setEstado(novo);
    salvarEstado(novo);
  };

  const pausar = () => {
    if (!estado) return;
    const novo: Estado = { ...estado, acumulado: decorrido, iniciadoEm: null };
    setEstado(novo);
    salvarEstado(novo);
  };

  const encerrar = () => {
    if (!estado || !dia) return;
    if (decorrido >= 1) onSalvar(dia.id, jaRegistrado + decorrido);
    setEstado(null);
    salvarEstado(null);
  };

  return (
    <div className="bg-white border border-[#E6EAF0] rounded-[16px] p-5 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[#0B0F15] font-bold">Cronômetro de horas líquidas</h3>
        <select
          value={diaId ?? ""}
          disabled={!!estado}
          onChange={(e) => setDiaEscolhido(e.target.value)}
          className="text-sm border border-[#E6EAF0] rounded-[10px] px-2 py-1.5 bg-white text-[#0B0F15] disabled:opacity-60"
          aria-label="Dia do cronograma"
        >
          {dias.map((d) => (
            <option key={d.id} value={d.id}>
              {formatarData(d.data)} · {d.dia_semana}
            </option>
          ))}
        </select>
      </div>

      <div className="text-center">
        <div className="text-4xl font-extrabold tabular-nums text-[#0B0F15]" aria-live="off">
          {formatarCronometro(decorrido)}
        </div>
        <p className="text-xs text-[#6A7686] mt-1">
          Já registrado no dia: {formatarDuracao(jaRegistrado)}
          {meta > 0 && ` · meta ${formatarDuracao(meta)}`}
        </p>
      </div>

      <div className="h-2 rounded-full bg-[#F3F5F9] overflow-hidden" role="progressbar" aria-valuenow={Math.round(progresso)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full bg-[#1E63FF] transition-all" style={{ width: `${progresso}%` }} />
      </div>

      <div className="flex gap-2 justify-center">
        {rodando ? (
          <Button onClick={pausar} variant="outline" size="sm" className="gap-1.5">
            <Pause className="w-4 h-4" /> Pausar
          </Button>
        ) : (
          <Button onClick={iniciar} size="sm" className="gap-1.5" disabled={!diaId}>
            <Play className="w-4 h-4" /> {estado ? "Retomar" : "Iniciar"}
          </Button>
        )}
        <Button onClick={encerrar} variant="outline" size="sm" className="gap-1.5" disabled={!estado}>
          <Square className="w-4 h-4" /> Encerrar e salvar
        </Button>
      </div>
    </div>
  );
}

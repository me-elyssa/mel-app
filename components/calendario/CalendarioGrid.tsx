"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TIPO_COLORS } from "./evento-colors";
import type { Evento, Tarefa } from "@/types/entities";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface CalendarioGridProps {
  mes: Date;
  eventos: Evento[];
  tarefas: Tarefa[];
  diaSelecionado: string | null;
  onSelecionarDia: (data: string) => void;
  onMudarMes: (mes: Date) => void;
}

export default function CalendarioGrid({
  mes,
  eventos,
  tarefas,
  diaSelecionado,
  onSelecionarDia,
  onMudarMes,
}: CalendarioGridProps) {
  const inicio = startOfWeek(startOfMonth(mes), { weekStartsOn: 0 });
  const fim = endOfWeek(endOfMonth(mes), { weekStartsOn: 0 });
  const dias = eachDayOfInterval({ start: inicio, end: fim });

  const eventosPorDia = (dataStr: string) => eventos.filter((e) => e.data === dataStr);
  const tarefasPorDia = (dataStr: string) => tarefas.filter((t) => t.data_limite === dataStr);

  return (
    <div className="bg-white rounded-[20px] border border-[#EAECEF] p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[#0B0F15] capitalize">{format(mes, "MMMM yyyy", { locale: ptBR })}</h3>
        <div className="flex gap-1">
          <button
            onClick={() => onMudarMes(new Date(mes.getFullYear(), mes.getMonth() - 1, 1))}
            className="p-2 rounded-[10px] hover:bg-[#F3F5F9] text-[#545F6C]"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMudarMes(new Date(mes.getFullYear(), mes.getMonth() + 1, 1))}
            className="p-2 rounded-[10px] hover:bg-[#F3F5F9] text-[#545F6C]"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-[#9AA0A6] py-2">
            {d}
          </div>
        ))}

        {dias.map((dia) => {
          const dataStr = format(dia, "yyyy-MM-dd");
          const eventosDia = eventosPorDia(dataStr);
          const tarefasDia = tarefasPorDia(dataStr);
          const noMes = isSameMonth(dia, mes);
          const ehHoje = isSameDay(dia, new Date());
          const selecionado = dataStr === diaSelecionado;

          return (
            <button
              key={dataStr}
              onClick={() => onSelecionarDia(dataStr)}
              className={`aspect-square rounded-[12px] p-1.5 flex flex-col items-center gap-1 transition-colors ${
                selecionado
                  ? "bg-[#1E63FF] text-white"
                  : ehHoje
                  ? "bg-[var(--neon)] text-[#0B0F15]"
                  : noMes
                  ? "hover:bg-[#F3F5F9] text-[#0B0F15]"
                  : "text-[#C7CDD6] hover:bg-[#F8F9FB]"
              }`}
            >
              <span className="text-xs font-semibold">{format(dia, "d")}</span>
              <div className="flex gap-0.5 flex-wrap justify-center">
                {eventosDia.slice(0, 3).map((ev) => (
                  <span
                    key={ev.id}
                    className={`w-1.5 h-1.5 rounded-full ${selecionado ? "bg-white" : TIPO_COLORS[ev.tipo]?.dot ?? TIPO_COLORS.outro.dot}`}
                  />
                ))}
                {tarefasDia.length > 0 && (
                  <span className={`w-1.5 h-1.5 rounded-full ${selecionado ? "bg-white" : "bg-[#0B0F15]"}`} />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

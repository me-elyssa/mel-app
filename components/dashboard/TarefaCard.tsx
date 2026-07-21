"use client";

import { Calendar, FileText, Pencil, Trash2 } from "lucide-react";
import type { Tarefa } from "@/types/entities";

const PRIORIDADE_COLORS: Record<Tarefa["prioridade"], { bg: string; text: string; label: string }> = {
  baixa: { bg: "#E8F5E9", text: "#2E7D32", label: "Baixa" },
  media: { bg: "#FEF3C7", text: "#B45309", label: "Média" },
  alta: { bg: "#FEE2E2", text: "#B91C1C", label: "Alta" },
};

interface TarefaCardProps {
  tarefa: Tarefa;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function TarefaCard({ tarefa, onEditar, onExcluir }: TarefaCardProps) {
  const prioridade = PRIORIDADE_COLORS[tarefa.prioridade];

  return (
    <div
      onClick={onEditar}
      className="bg-white border border-[#E6EAF0] rounded-[12px] p-4 flex flex-col gap-2 hover:shadow-[0_4px_12px_rgba(14,23,38,0.08)] transition-shadow group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-semibold text-[#0B0F15] leading-snug line-clamp-2">{tarefa.titulo}</h4>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onExcluir();
          }}
          className="opacity-0 group-hover:opacity-100 p-1 rounded-[6px] hover:bg-red-50 text-[#9AA0A6] hover:text-red-500 flex-shrink-0 transition-opacity"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ backgroundColor: prioridade.bg, color: prioridade.text }}
        >
          {prioridade.label}
        </span>
        {tarefa.numero_processo && (
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#F3F5F9] text-[#545F6C] flex items-center gap-1">
            <FileText className="w-3 h-3" />
            {tarefa.numero_processo}
          </span>
        )}
      </div>

      {tarefa.data_limite && (
        <div className="flex items-center gap-1 text-xs text-[#8A94A6]">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(tarefa.data_limite + "T00:00:00").toLocaleDateString("pt-BR")}
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onEditar();
        }}
        className="opacity-0 group-hover:opacity-100 self-end p-1 rounded-[6px] hover:bg-[#F3F5F9] text-[#545F6C] transition-opacity"
      >
        <Pencil className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

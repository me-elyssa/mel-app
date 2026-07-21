"use client";

import { Brain, Pencil, Trash2 } from "lucide-react";
import { corDoNucleo } from "./colors";
import type { Nucleo } from "@/types/entities";

const STATUS_LABEL: Record<Nucleo["status"], string> = {
  ativo: "Ativo",
  em_pausa: "Em pausa",
  concluido: "Concluído",
};

interface NucleoCardProps {
  nucleo: Nucleo;
  onAbrir: () => void;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function NucleoCard({ nucleo, onAbrir, onEditar, onExcluir }: NucleoCardProps) {
  const cor = corDoNucleo(nucleo.titulo, nucleo.cor);

  return (
    <div
      onClick={onAbrir}
      className="bg-white border border-[#E6EAF0] rounded-[16px] p-5 flex flex-col gap-3 hover:shadow-[0_4px_16px_rgba(14,23,38,0.08)] transition-shadow group cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className="w-10 h-10 rounded-[12px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cor }}
        >
          <Brain className="w-5 h-5 text-[#0B0F15]" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEditar();
            }}
            className="p-1.5 rounded-[8px] hover:bg-[#F3F5F9] text-[#545F6C]"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExcluir();
            }}
            className="p-1.5 rounded-[8px] hover:bg-red-50 text-[#9AA0A6] hover:text-red-500"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 className="text-[#0B0F15] text-base font-semibold leading-snug line-clamp-2">{nucleo.titulo}</h3>

      {nucleo.descricao && (
        <p className="text-[#6A7686] text-sm leading-relaxed line-clamp-2">{nucleo.descricao}</p>
      )}

      <div className="flex items-center gap-2 mt-auto pt-2 border-t border-[#F3F5F9]">
        {nucleo.area && (
          <span className="text-xs font-medium text-[#9AA0A6] bg-[#F3F5F9] px-2.5 py-1 rounded-[8px]">
            {nucleo.area}
          </span>
        )}
        <span className="text-xs font-semibold text-[#545F6C] ml-auto">{STATUS_LABEL[nucleo.status]}</span>
      </div>
    </div>
  );
}

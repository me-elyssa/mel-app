"use client";

import { useState } from "react";
import { Pencil, Trash2, FileText } from "lucide-react";
import { CATEGORIA_COLORS, CATEGORIA_LABEL } from "./categoria-colors";
import type { RegistroPessoal } from "@/types/entities";

const LIMITE = 180;

interface RegistroCardProps {
  registro: RegistroPessoal;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function RegistroCard({ registro, onEditar, onExcluir }: RegistroCardProps) {
  const [expandido, setExpandido] = useState(false);
  const cor = CATEGORIA_COLORS[registro.categoria];
  const conteudo = registro.conteudo ?? "";
  const precisaTruncar = conteudo.length > LIMITE;
  const textoExibido = expandido || !precisaTruncar ? conteudo : conteudo.slice(0, LIMITE) + "...";

  return (
    <div className="bg-white border border-[#E6EAF0] rounded-[16px] p-5 flex flex-col gap-3 group">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: cor.bg, color: cor.text }}
          >
            {CATEGORIA_LABEL[registro.categoria]}
          </span>
          {registro.data && (
            <span className="text-xs text-[#9AA0A6]">
              {new Date(registro.data + "T00:00:00").toLocaleDateString("pt-BR")}
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button onClick={onEditar} className="p-1.5 rounded-[8px] hover:bg-[#F3F5F9] text-[#545F6C]">
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button onClick={onExcluir} className="p-1.5 rounded-[8px] hover:bg-red-50 text-[#9AA0A6] hover:text-red-500">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h3 className="text-[#0B0F15] text-base font-semibold leading-snug">{registro.titulo}</h3>

      {conteudo && (
        <p className="text-[#545F6C] text-sm leading-relaxed whitespace-pre-wrap">
          {textoExibido}{" "}
          {precisaTruncar && (
            <button
              onClick={() => setExpandido((v) => !v)}
              className="text-[#1E63FF] font-semibold hover:underline"
            >
              {expandido ? "Ver menos" : "Ver mais"}
            </button>
          )}
        </p>
      )}

      {registro.file_url && (
        <a
          href={registro.file_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-[#1E63FF] hover:underline"
        >
          <FileText className="w-3.5 h-3.5" />
          {registro.file_name || "Arquivo anexado"}
        </a>
      )}
    </div>
  );
}

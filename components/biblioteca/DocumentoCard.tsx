"use client";

import { motion } from "framer-motion";
import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Documento, DocumentoArea, DocumentoTipo } from "@/types/entities";

const AREA_COLORS: Record<DocumentoArea, { bg: string; text: string; label: string }> = {
  pesquisa: { bg: "var(--sky)", text: "#2A7BA6", label: "Pesquisa" },
  faculdade: { bg: "var(--lavender)", text: "#6B52C8", label: "Faculdade" },
  trabalho: { bg: "var(--peach)", text: "#B87340", label: "Trabalho" },
  pessoal: { bg: "var(--citrus)", text: "#6A8A1A", label: "Pessoal" },
};

const TIPO_LABEL: Record<DocumentoTipo, string> = {
  pdf: "PDF",
  artigo: "Artigo",
  jurisprudencia: "Jurisprudência",
  doutrina: "Doutrina",
  modelo: "Modelo",
  livro: "Livro",
  outro: "Outro",
};

interface DocumentoCardProps {
  documento: Documento;
  onEditar: () => void;
  onExcluir: () => void;
  onAbrir: () => void;
}

export default function DocumentoCard({ documento, onEditar, onExcluir, onAbrir }: DocumentoCardProps) {
  const area = AREA_COLORS[documento.area] || { bg: "#F3F5F9", text: "#545F6C", label: documento.area };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      onClick={onAbrir}
      className="bg-white border border-[#E6EAF0] rounded-[16px] p-5 flex flex-col gap-3 hover:shadow-[0_4px_16px_rgba(14,23,38,0.08)] transition-shadow group cursor-pointer"
    >
      {/* Topo */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs font-semibold px-2.5 py-1 rounded-[999px]"
            style={{ backgroundColor: area.bg, color: area.text }}
          >
            {area.label}
          </span>
          <span className="text-xs font-medium text-[#9AA0A6] bg-[#F3F5F9] px-2.5 py-1 rounded-[8px]">
            {TIPO_LABEL[documento.tipo] || documento.tipo}
          </span>
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

      {/* Título */}
      <h3 className="text-[#0B0F15] text-base font-semibold leading-snug line-clamp-2">{documento.titulo}</h3>

      {/* Descrição */}
      {documento.descricao && (
        <p className="text-[#6A7686] text-sm leading-relaxed line-clamp-2">{documento.descricao}</p>
      )}

      {/* Tags */}
      {documento.tags && documento.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {documento.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#EEF2FF] text-[#3730A3] rounded-full">
              #{tag}
            </span>
          ))}
          {documento.tags.length > 4 && (
            <span className="text-[10px] text-[#8A94A6]">+{documento.tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Metadados */}
      <div className="flex items-center gap-3 text-xs text-[#9AA0A6] mt-auto pt-2 border-t border-[#F3F5F9]">
        {documento.autores && <span className="truncate">{documento.autores}</span>}
        {documento.ano && <span className="flex-shrink-0">{documento.ano}</span>}
        {documento.file_url && (
          <span className="ml-auto flex-shrink-0 flex items-center gap-1 text-[#1E63FF] font-medium">
            <ExternalLink className="w-3.5 h-3.5" />
            Ver
          </span>
        )}
      </div>
    </motion.div>
  );
}

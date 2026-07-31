"use client";

import PreviewSidebar from "@/components/shared/PreviewSidebar";
import RichTextContent from "@/components/ui/rich-text-content";
import type { Documento } from "@/types/entities";

const AREA_LABEL: Record<string, string> = {
  pesquisa: "Pesquisa",
  faculdade: "Faculdade",
  trabalho: "Trabalho",
  pessoal: "Pessoal",
};

interface DocumentoSidebarProps {
  documento: Documento;
  onFechar: () => void;
  onEditar?: () => void;
  onExcluir?: () => void;
}

export default function DocumentoSidebar({ documento, onFechar, onEditar, onExcluir }: DocumentoSidebarProps) {
  return (
    <PreviewSidebar titulo={documento.titulo} fileUrl={documento.file_url} onFechar={onFechar} onEditar={onEditar} onExcluir={onExcluir}>
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3F5F9] text-[#545F6C]">
          {AREA_LABEL[documento.area] ?? documento.area}
        </span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-[8px] bg-[#F3F5F9] text-[#9AA0A6]">
          {documento.tipo}
        </span>
      </div>

      {documento.descricao && (
        <div>
          <p className="text-xs font-semibold text-[#9AA0A6] uppercase mb-1">Descrição</p>
          <RichTextContent html={documento.descricao} className="text-sm text-[#0B0F15]" />
        </div>
      )}

      {(documento.autores || documento.ano) && (
        <div className="grid grid-cols-2 gap-4">
          {documento.autores && (
            <div>
              <p className="text-xs font-semibold text-[#9AA0A6] uppercase mb-1">Autores</p>
              <p className="text-sm text-[#0B0F15]">{documento.autores}</p>
            </div>
          )}
          {documento.ano && (
            <div>
              <p className="text-xs font-semibold text-[#9AA0A6] uppercase mb-1">Ano</p>
              <p className="text-sm text-[#0B0F15]">{documento.ano}</p>
            </div>
          )}
        </div>
      )}

      {documento.tags && documento.tags.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#9AA0A6] uppercase mb-1">Tags</p>
          <div className="flex flex-wrap gap-1">
            {documento.tags.map((tag) => (
              <span key={tag} className="text-[10px] font-semibold px-1.5 py-0.5 bg-[#EEF2FF] text-[#3730A3] rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </PreviewSidebar>
  );
}

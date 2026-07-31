"use client";

import PreviewSidebar from "@/components/shared/PreviewSidebar";
import RichTextContent from "@/components/ui/rich-text-content";
import { CATEGORIA_COLORS, CATEGORIA_LABEL } from "./categoria-colors";
import type { RegistroPessoal } from "@/types/entities";

interface RegistroSidebarProps {
  registro: RegistroPessoal;
  onFechar: () => void;
  onEditar: () => void;
  onExcluir: () => void;
}

export default function RegistroSidebar({ registro, onFechar, onEditar, onExcluir }: RegistroSidebarProps) {
  const cor = CATEGORIA_COLORS[registro.categoria];

  return (
    <PreviewSidebar titulo={registro.titulo} fileUrl={registro.file_url} onFechar={onFechar} onEditar={onEditar} onExcluir={onExcluir}>
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

      {registro.conteudo && (
        <RichTextContent html={registro.conteudo} className="text-sm text-[#0B0F15]" />
      )}
    </PreviewSidebar>
  );
}

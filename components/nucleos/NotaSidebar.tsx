"use client";

import PreviewSidebar from "@/components/shared/PreviewSidebar";
import RichTextContent from "@/components/ui/rich-text-content";
import type { Nota } from "@/types/entities";

const NOTA_TIPO_LABEL: Record<string, string> = {
  ideia: "Ideia",
  reflexao: "Reflexão",
  link: "Link",
  trecho: "Trecho",
  referencia: "Referência",
  insight: "Insight",
  pessoal: "Pessoal",
};

interface NotaSidebarProps {
  nota: Nota;
  onFechar: () => void;
  onExcluir: () => void;
}

export default function NotaSidebar({ nota, onFechar, onExcluir }: NotaSidebarProps) {
  return (
    <PreviewSidebar
      titulo={nota.titulo || nota.file_name || NOTA_TIPO_LABEL[nota.tipo] || "Nota"}
      fileUrl={nota.file_url}
      onFechar={onFechar}
      onExcluir={onExcluir}
    >
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3F5F9] text-[#545F6C] inline-block">
        {NOTA_TIPO_LABEL[nota.tipo] ?? nota.tipo}
      </span>

      {nota.conteudo && <RichTextContent html={nota.conteudo} className="text-sm text-[#0B0F15]" />}
    </PreviewSidebar>
  );
}

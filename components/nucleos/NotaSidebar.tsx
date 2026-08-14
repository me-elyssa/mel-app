"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import PreviewSidebar from "@/components/shared/PreviewSidebar";
import RichTextContent from "@/components/ui/rich-text-content";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Nota, UpdateNotaInput } from "@/types/entities";

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
  onSalvar?: (input: UpdateNotaInput) => Promise<void>;
}

export default function NotaSidebar({ nota, onFechar, onExcluir, onSalvar }: NotaSidebarProps) {
  const [editando, setEditando] = useState(false);
  const [titulo, setTitulo] = useState(nota.titulo ?? "");
  const [conteudo, setConteudo] = useState(nota.conteudo ?? "");
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!onSalvar) return;
    setSalvando(true);
    await onSalvar({ titulo: titulo || null, conteudo: conteudo || null });
    setSalvando(false);
    setEditando(false);
  };

  const handleCancelar = () => {
    setTitulo(nota.titulo ?? "");
    setConteudo(nota.conteudo ?? "");
    setEditando(false);
  };

  return (
    <PreviewSidebar
      titulo={nota.titulo || nota.file_name || NOTA_TIPO_LABEL[nota.tipo] || "Nota"}
      fileUrl={nota.file_url}
      onFechar={onFechar}
      onExcluir={onExcluir}
      onEditar={onSalvar && !editando ? () => setEditando(true) : undefined}
    >
      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#F3F5F9] text-[#545F6C] inline-block">
        {NOTA_TIPO_LABEL[nota.tipo] ?? nota.tipo}
      </span>

      {editando ? (
        <div className="space-y-3">
          <Input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Título (opcional)" />
          <RichTextEditor value={conteudo} onChange={setConteudo} placeholder="Capture sua ideia..." />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={handleCancelar} className="text-[#6A7686]">
              Cancelar
            </Button>
            <Button type="button" onClick={handleSalvar} disabled={salvando}>
              {salvando ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar"}
            </Button>
          </div>
        </div>
      ) : (
        nota.conteudo && <RichTextContent html={nota.conteudo} className="text-sm text-[#0B0F15]" />
      )}
    </PreviewSidebar>
  );
}

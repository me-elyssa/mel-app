"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, Trash2, FileText, ExternalLink, Brain, CheckCircle2, Circle, RefreshCw } from "lucide-react";
import RegistroNucleoForm from "./RegistroNucleoForm";
import NotaSidebar from "./NotaSidebar";
import { corDoNucleo } from "./colors";
import { stripHtml } from "@/components/ui/rich-text-content";
import DocumentoSidebar from "@/components/biblioteca/DocumentoSidebar";
import { useNotas, useCreateNota, useUpdateNota, useDeleteNota } from "@/lib/hooks/useNotas";
import { useDocumentosPorNucleo } from "@/lib/hooks/useDocumentos";
import { useUpdateNucleo } from "@/lib/hooks/useNucleos";
import { revisaoAtrasada, textoUltimaRevisao } from "@/lib/revisao";
import type { Documento, Nota, Nucleo } from "@/types/entities";

const NOTA_TIPO_LABEL: Record<string, string> = {
  ideia: "Ideia",
  reflexao: "Reflexão",
  link: "Link",
  trecho: "Trecho",
  referencia: "Referência",
  insight: "Insight",
  pessoal: "Pessoal",
};

interface NucleoDetalheProps {
  nucleo: Nucleo;
  onVoltar: () => void;
}

export default function NucleoDetalhe({ nucleo, onVoltar }: NucleoDetalheProps) {
  const { data: notas = [] } = useNotas(nucleo.id);
  const { data: documentos = [] } = useDocumentosPorNucleo(nucleo.id);
  const createNota = useCreateNota();
  const updateNota = useUpdateNota();
  const deleteNota = useDeleteNota();
  const updateNucleo = useUpdateNucleo();
  const [notaAberta, setNotaAberta] = useState<Nota | undefined>(undefined);
  const [documentoAberto, setDocumentoAberto] = useState<Documento | undefined>(undefined);

  const cor = corDoNucleo(nucleo.titulo, nucleo.cor);
  const atrasada = revisaoAtrasada(nucleo);

  return (
    <div className="space-y-6">
      <button
        onClick={onVoltar}
        className="flex items-center gap-1.5 text-sm font-semibold text-[#545F6C] hover:text-[#0B0F15]"
      >
        <ArrowLeft className="w-4 h-4" />
        Voltar
      </button>

      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: cor }}
        >
          <Brain className="w-6 h-6 text-[#0B0F15]" />
        </div>
        <div>
          <h1 className="text-[#0B0F15]">{nucleo.titulo}</h1>
          {nucleo.descricao && <p className="text-[#6A7686] text-sm mt-0.5">{nucleo.descricao}</p>}
        </div>
        <div className="ml-auto flex flex-col items-end gap-1 flex-shrink-0">
          <button
            onClick={() => updateNucleo.mutate({ id: nucleo.id, ultima_revisao: new Date().toISOString() })}
            disabled={updateNucleo.isPending}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-[10px] border border-[#E6EAF0] hover:bg-[#F3F5F9] text-[#0B0F15] disabled:opacity-50"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Marcar como revisado
          </button>
          <span className={`text-[11px] ${atrasada ? "text-[#B91C1C] font-semibold" : "text-[#8A94A6]"}`}>
            {textoUltimaRevisao(nucleo)}
          </span>
        </div>
      </div>

      <div className="space-y-8">
        {/* Notas */}
        <div className="space-y-4">
          <h3 className="text-[#0B0F15]">Notas</h3>
          <RegistroNucleoForm nucleoId={nucleo.id} onCriar={(input) => createNota.mutateAsync(input)} />

          <div className="space-y-2">
            {notas.length === 0 ? (
              <p className="text-sm text-[#8A94A6] text-center py-6">Nenhuma nota ainda</p>
            ) : (
              notas.map((nota) => (
                <div
                  key={nota.id}
                  className="bg-white border border-[#E6EAF0] rounded-[12px] p-3.5 flex items-start gap-3"
                >
                  <button
                    onClick={() => updateNota.mutate({ id: nota.id, processada: !nota.processada })}
                    title={nota.processada ? "Marcar como pendente" : "Marcar como processada"}
                    className="mt-0.5 flex-shrink-0 text-[#9AA0A6] hover:text-[#2E7D32]"
                  >
                    {nota.processada ? (
                      <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setNotaAberta(nota)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#F3F5F9] text-[#545F6C]">
                        {NOTA_TIPO_LABEL[nota.tipo] ?? nota.tipo}
                      </span>
                      {nota.titulo && <span className="text-sm font-semibold text-[#0B0F15] truncate">{nota.titulo}</span>}
                    </div>
                    {nota.conteudo && (
                      <p className="text-sm text-[#545F6C] line-clamp-3">{stripHtml(nota.conteudo)}</p>
                    )}
                    {nota.file_url && (
                      <span className="text-xs text-[#1E63FF] flex items-center gap-1 mt-1">
                        <ExternalLink className="w-3 h-3" />
                        {nota.file_name || "Arquivo"}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => deleteNota.mutate({ id: nota.id, nucleoId: nucleo.id })}
                    className="p-1.5 rounded-[8px] hover:bg-red-50 text-[#9AA0A6] hover:text-red-500 flex-shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Documentos (somente leitura) */}
        <div className="space-y-4">
          <h3 className="text-[#0B0F15]">Documentos vinculados</h3>
          <div className="space-y-2">
            {documentos.length === 0 ? (
              <p className="text-sm text-[#8A94A6] text-center py-6">Nenhum documento vinculado</p>
            ) : (
              documentos.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setDocumentoAberto(doc)}
                  className="bg-white border border-[#E6EAF0] rounded-[12px] p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[#F3F5F9]"
                >
                  <FileText className="w-4 h-4 text-[#9AA0A6] flex-shrink-0" />
                  <span className="text-sm font-medium text-[#0B0F15] flex-1 truncate">{doc.titulo}</span>
                  {doc.file_url && <ExternalLink className="w-3.5 h-3.5 text-[#1E63FF] flex-shrink-0" />}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {notaAberta && (
          <NotaSidebar
            nota={notaAberta}
            onFechar={() => setNotaAberta(undefined)}
            onExcluir={() => {
              deleteNota.mutate({ id: notaAberta.id, nucleoId: nucleo.id });
              setNotaAberta(undefined);
            }}
            onSalvar={async (input) => {
              const atualizada = await updateNota.mutateAsync({ id: notaAberta.id, ...input });
              setNotaAberta(atualizada);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {documentoAberto && (
          <DocumentoSidebar documento={documentoAberto} onFechar={() => setDocumentoAberto(undefined)} />
        )}
      </AnimatePresence>
    </div>
  );
}

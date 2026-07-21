"use client";

import { motion } from "framer-motion";
import { X, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { isGoogleDriveUrl } from "@/lib/googleDrive";
import DriveFileCard from "@/components/shared/DriveFileCard";
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
  onEditar: () => void;
  onExcluir: () => void;
}

export default function DocumentoSidebar({ documento, onFechar, onEditar, onExcluir }: DocumentoSidebarProps) {
  const isPdf = documento.file_url?.toLowerCase().endsWith(".pdf");
  const isDrive = !!documento.file_url && isGoogleDriveUrl(documento.file_url);

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onFechar}
        className="fixed inset-0 bg-black/40 z-50"
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "tween", duration: 0.25 }}
        className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-white z-50 shadow-2xl flex flex-col"
      >
        <div className="flex items-center justify-between p-5 border-b border-[#EAECEF]">
          <h3 className="text-[#0B0F15] line-clamp-1">{documento.titulo}</h3>
          <div className="flex items-center gap-1">
            <button onClick={onEditar} className="p-2 rounded-lg hover:bg-[#F3F5F9] text-[#545F6C]">
              <Pencil className="w-4 h-4" />
            </button>
            <button onClick={onExcluir} className="p-2 rounded-lg hover:bg-red-50 text-[#9AA0A6] hover:text-red-500">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onFechar} className="p-2 rounded-lg hover:bg-[#F3F5F9] text-[#8A94A6]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {documento.file_url && isDrive ? (
            <div className="m-5">
              <DriveFileCard url={documento.file_url} />
            </div>
          ) : documento.file_url && isPdf ? (
            <iframe src={documento.file_url} className="w-full h-[420px] border-b border-[#EAECEF]" title={documento.titulo} />
          ) : documento.file_url ? (
            <a
              href={documento.file_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 m-5 p-4 rounded-[12px] bg-[#F3F5F9] text-[#1E63FF] font-medium text-sm hover:bg-[#EAECEF]"
            >
              <ExternalLink className="w-4 h-4" />
              Abrir arquivo / link
            </a>
          ) : null}

          <div className="p-5 space-y-4">
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
                <p className="text-sm text-[#0B0F15] leading-relaxed">{documento.descricao}</p>
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
          </div>
        </div>
      </motion.div>
    </>
  );
}

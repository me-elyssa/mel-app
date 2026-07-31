"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { X, Pencil, Trash2 } from "lucide-react";
import FilePreview from "@/components/shared/FilePreview";

interface PreviewSidebarProps {
  titulo: string;
  fileUrl?: string | null;
  onFechar: () => void;
  onEditar?: () => void;
  onExcluir?: () => void;
  children?: ReactNode;
}

export default function PreviewSidebar({ titulo, fileUrl, onFechar, onEditar, onExcluir, children }: PreviewSidebarProps) {
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
          <h3 className="text-[#0B0F15] line-clamp-1">{titulo}</h3>
          <div className="flex items-center gap-1">
            {onEditar && (
              <button onClick={onEditar} className="p-2 rounded-lg hover:bg-[#F3F5F9] text-[#545F6C]">
                <Pencil className="w-4 h-4" />
              </button>
            )}
            {onExcluir && (
              <button onClick={onExcluir} className="p-2 rounded-lg hover:bg-red-50 text-[#9AA0A6] hover:text-red-500">
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button onClick={onFechar} className="p-2 rounded-lg hover:bg-[#F3F5F9] text-[#8A94A6]">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {fileUrl && <FilePreview url={fileUrl} title={titulo} />}
          <div className="p-5 space-y-4">{children}</div>
        </div>
      </motion.div>
    </>
  );
}

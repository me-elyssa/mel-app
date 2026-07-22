"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TagInput } from "@/components/ui/tag-input";
import { uploadFile } from "@/lib/storage";
import { isGoogleDriveUrl } from "@/lib/googleDrive";
import DriveFileCard from "@/components/shared/DriveFileCard";
import type { CreateDocumentoInput, Documento } from "@/types/entities";

const AREA_OPTS = [
  { value: "pesquisa", label: "Pesquisa" },
  { value: "faculdade", label: "Faculdade" },
  { value: "trabalho", label: "Trabalho" },
  { value: "pessoal", label: "Pessoal" },
];

const TIPO_OPTS = [
  { value: "pdf", label: "PDF" },
  { value: "artigo", label: "Artigo" },
  { value: "jurisprudencia", label: "Jurisprudência" },
  { value: "doutrina", label: "Doutrina" },
  { value: "modelo", label: "Modelo" },
  { value: "livro", label: "Livro" },
  { value: "outro", label: "Outro" },
];

const defaultForm: CreateDocumentoInput = {
  titulo: "",
  descricao: "",
  area: "pesquisa",
  tipo: "pdf",
  file_url: "",
  autores: "",
  ano: "",
  tags: [],
  nucleo_id: null,
};

interface DocumentoFormProps {
  documento?: Documento;
  onSalvar: (form: CreateDocumentoInput) => Promise<void>;
  onFechar: () => void;
}

export default function DocumentoForm({ documento, onSalvar, onFechar }: DocumentoFormProps) {
  const [form, setForm] = useState<CreateDocumentoInput>(
    documento ? { ...defaultForm, ...documento } : defaultForm
  );
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [erroUpload, setErroUpload] = useState("");

  const set = <K extends keyof CreateDocumentoInput>(k: K, v: CreateDocumentoInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErroUpload("");
    try {
      const url = await uploadFile(file, "documentos", "uploads");
      set("file_url", url);
    } catch (err) {
      setErroUpload(err instanceof Error ? err.message : "Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim()) return;
    setLoading(true);
    await onSalvar(form);
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onFechar}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.97 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EAECEF]">
          <h3 className="text-[#0B0F15]">{documento ? "Editar documento" : "Novo documento"}</h3>
          <button onClick={onFechar} className="p-2 rounded-lg hover:bg-[#F3F5F9] text-[#8A94A6]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Título *</label>
            <Input
              value={form.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Ex: Princípios do Direito Civil"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Área</label>
              <select
                value={form.area}
                onChange={(e) => set("area", e.target.value as CreateDocumentoInput["area"])}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              >
                {AREA_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => set("tipo", e.target.value as CreateDocumentoInput["tipo"])}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              >
                {TIPO_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Autores</label>
              <Input
                value={form.autores ?? ""}
                onChange={(e) => set("autores", e.target.value)}
                placeholder="Ex: Maria Helena Diniz"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Ano</label>
              <Input
                value={form.ano ?? ""}
                onChange={(e) => set("ano", e.target.value)}
                placeholder="Ex: 2024"
                maxLength={4}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Arquivo ou link</label>
            <div className="flex gap-2">
              <Input
                value={form.file_url ?? ""}
                onChange={(e) => set("file_url", e.target.value)}
                placeholder="https://... ou faça upload"
                className="flex-1"
              />
              <label className="flex items-center justify-center w-[48px] h-[48px] rounded-[12px] border border-[#E6EAF0] cursor-pointer hover:bg-[#F3F5F9] flex-shrink-0">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#545F6C]" />
                ) : (
                  <Upload className="w-4 h-4 text-[#545F6C]" />
                )}
                <input type="file" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            {erroUpload && <p className="mt-1 text-xs text-red-500">{erroUpload}</p>}
            {form.file_url && isGoogleDriveUrl(form.file_url) && (
              <div className="mt-2">
                <DriveFileCard url={form.file_url} onClick={(e) => e.preventDefault()} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Tags</label>
            <TagInput value={form.tags ?? []} onChange={(tags) => set("tags", tags)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Descrição</label>
            <textarea
              value={form.descricao ?? ""}
              onChange={(e) => set("descricao", e.target.value)}
              rows={3}
              className="w-full rounded-[12px] border border-[#EAECEF] px-3 py-2 text-sm text-[#0B0F15] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onFechar} className="text-[#6A7686]">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading || !form.titulo.trim()} className="h-[44px] px-6">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : documento ? "Salvar" : "Criar documento"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

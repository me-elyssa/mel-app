"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Type, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/storage";
import { CATEGORIA_LABEL } from "./categoria-colors";
import type { CreateRegistroPessoalInput, RegistroCategoria, RegistroPessoal } from "@/types/entities";

const CATEGORIA_OPTS: { value: RegistroCategoria; label: string }[] = (
  Object.keys(CATEGORIA_LABEL) as RegistroCategoria[]
).map((value) => ({ value, label: CATEGORIA_LABEL[value] }));

function hoje() {
  return new Date().toISOString().slice(0, 10);
}

const defaultForm: CreateRegistroPessoalInput = {
  titulo: "",
  conteudo: "",
  categoria: "diario",
  data: hoje(),
  file_url: "",
  file_name: "",
};

interface RegistroFormProps {
  registro?: RegistroPessoal;
  onSalvar: (form: CreateRegistroPessoalInput) => Promise<void>;
  onFechar: () => void;
}

export default function RegistroForm({ registro, onSalvar, onFechar }: RegistroFormProps) {
  const [form, setForm] = useState<CreateRegistroPessoalInput>(
    registro ? { ...defaultForm, ...registro } : defaultForm
  );
  const [modoArquivo, setModoArquivo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof CreateRegistroPessoalInput>(k: K, v: CreateRegistroPessoalInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadFile(file, "registros", "uploads");
      set("file_url", url);
      set("file_name", file.name);
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
        className="bg-white rounded-[20px] shadow-2xl w-full max-w-[520px] max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#EAECEF]">
          <h3 className="text-[#0B0F15]">{registro ? "Editar registro" : "Novo registro"}</h3>
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
              placeholder="Ex: Reflexões da semana"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Categoria</label>
              <select
                value={form.categoria}
                onChange={(e) => set("categoria", e.target.value as RegistroCategoria)}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              >
                {CATEGORIA_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Data</label>
              <input
                type="date"
                value={form.data ?? hoje()}
                onChange={(e) => set("data", e.target.value)}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setModoArquivo(false)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                !modoArquivo ? "bg-[#1E63FF] text-white" : "bg-[#F3F5F9] text-[#545F6C]"
              }`}
            >
              <Type className="w-3 h-3" />
              Texto
            </button>
            <button
              type="button"
              onClick={() => setModoArquivo(true)}
              className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                modoArquivo ? "bg-[#1E63FF] text-white" : "bg-[#F3F5F9] text-[#545F6C]"
              }`}
            >
              <Paperclip className="w-3 h-3" />
              Arquivo
            </button>
          </div>

          {modoArquivo ? (
            <label className="flex items-center justify-center h-[48px] rounded-[12px] border border-dashed border-[#C7CDD6] bg-white cursor-pointer text-sm text-[#545F6C] hover:bg-[#F3F5F9]">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : form.file_name || "Escolher arquivo"}
              <input type="file" className="hidden" onChange={handleFileChange} />
            </label>
          ) : (
            <textarea
              value={form.conteudo ?? ""}
              onChange={(e) => set("conteudo", e.target.value)}
              placeholder="Escreva aqui..."
              rows={5}
              className="w-full rounded-[12px] border border-[#EAECEF] px-3 py-2 text-sm text-[#0B0F15] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />
          )}

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onFechar} className="text-[#6A7686]">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || uploading || !form.titulo.trim()} className="h-[44px] px-6">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : registro ? "Salvar" : "Criar registro"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

"use client";

import { useState } from "react";
import { Loader2, Paperclip, Type } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/lib/storage";
import type { CreateNotaInput, NotaTipo } from "@/types/entities";

const TIPO_OPTS: { value: NotaTipo; label: string }[] = [
  { value: "ideia", label: "Ideia" },
  { value: "reflexao", label: "Reflexão" },
  { value: "link", label: "Link" },
  { value: "trecho", label: "Trecho" },
  { value: "referencia", label: "Referência" },
  { value: "insight", label: "Insight" },
];

interface RegistroNucleoFormProps {
  nucleoId: string;
  onCriar: (input: CreateNotaInput) => Promise<void>;
}

export default function RegistroNucleoForm({ nucleoId, onCriar }: RegistroNucleoFormProps) {
  const [titulo, setTitulo] = useState("");
  const [tipo, setTipo] = useState<NotaTipo>("ideia");
  const [conteudo, setConteudo] = useState("");
  const [modoArquivo, setModoArquivo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [erroUpload, setErroUpload] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setErroUpload("");
    try {
      const url = await uploadFile(file, "notas", "uploads");
      setFileUrl(url);
      setFileName(file.name);
    } catch (err) {
      setErroUpload(err instanceof Error ? err.message : "Erro ao enviar arquivo.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conteudo.trim() && !fileUrl) return;
    setLoading(true);
    await onCriar({
      titulo: titulo || null,
      conteudo: conteudo || null,
      tipo,
      nucleo_id: nucleoId,
      processada: false,
      file_url: fileUrl || null,
      file_name: fileName || null,
    });
    setTitulo("");
    setConteudo("");
    setFileUrl("");
    setFileName("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#F8F9FB] rounded-[14px] p-4 space-y-3">
      <div className="flex items-center gap-2 flex-wrap">
        {TIPO_OPTS.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => setTipo(o.value)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-full transition-colors ${
              tipo === o.value ? "bg-[#0B0F15] text-white" : "bg-white text-[#545F6C] border border-[#E6EAF0]"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <Input
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Título (opcional)"
        className="h-[40px] bg-white"
      />

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setModoArquivo(false)}
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            !modoArquivo ? "bg-[#1E63FF] text-white" : "bg-white text-[#545F6C] border border-[#E6EAF0]"
          }`}
        >
          <Type className="w-3 h-3" />
          Texto
        </button>
        <button
          type="button"
          onClick={() => setModoArquivo(true)}
          className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
            modoArquivo ? "bg-[#1E63FF] text-white" : "bg-white text-[#545F6C] border border-[#E6EAF0]"
          }`}
        >
          <Paperclip className="w-3 h-3" />
          Arquivo
        </button>
      </div>

      {modoArquivo ? (
        <div className="space-y-1">
          <label className="flex items-center justify-center h-[40px] rounded-[10px] border border-dashed border-[#C7CDD6] bg-white cursor-pointer text-xs text-[#545F6C] hover:bg-[#F3F5F9]">
            {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : fileName || "Escolher arquivo"}
            <input type="file" className="hidden" onChange={handleFileChange} />
          </label>
          {erroUpload && <p className="text-xs text-red-500">{erroUpload}</p>}
        </div>
      ) : (
        <textarea
          value={conteudo}
          onChange={(e) => setConteudo(e.target.value)}
          placeholder="Capture sua ideia..."
          rows={2}
          className="w-full rounded-[10px] border border-[#E6EAF0] px-3 py-2 text-sm text-[#0B0F15] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
        />
      )}

      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={loading || uploading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}

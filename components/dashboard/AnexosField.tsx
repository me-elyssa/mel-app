"use client";

import { useState } from "react";
import { FileText, Link2, Loader2, Paperclip, Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { uploadFile } from "@/lib/storage";
import type { TarefaAnexo } from "@/types/entities";

interface AnexosFieldProps {
  value: TarefaAnexo[];
  onChange: (anexos: TarefaAnexo[]) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

function normalizarUrl(raw: string): string | null {
  const texto = raw.trim();
  if (!texto) return null;
  const comProtocolo = /^https?:\/\//i.test(texto) ? texto : `https://${texto}`;
  try {
    const url = new URL(comProtocolo);
    return url.hostname.includes(".") ? url.toString() : null;
  } catch {
    return null;
  }
}

function nomeDoLink(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default function AnexosField({ value, onChange, onUploadingChange }: AnexosFieldProps) {
  const [link, setLink] = useState("");
  const [uploading, setUploading] = useState(false);
  const [erro, setErro] = useState("");

  const adicionarLink = () => {
    const url = normalizarUrl(link);
    if (!url) {
      setErro("Informe um link válido.");
      return;
    }
    setErro("");
    onChange([...value, { tipo: "link", url, nome: nomeDoLink(url) }]);
    setLink("");
  };

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const arquivos = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (arquivos.length === 0) return;
    setUploading(true);
    onUploadingChange?.(true);
    setErro("");
    const enviados: TarefaAnexo[] = [];
    try {
      for (const arquivo of arquivos) {
        const url = await uploadFile(arquivo, "documentos", "tarefas");
        enviados.push({ tipo: "arquivo", url, nome: arquivo.name });
      }
    } catch (err) {
      setErro(err instanceof Error ? err.message : "Erro ao enviar arquivo.");
    } finally {
      if (enviados.length > 0) onChange([...value, ...enviados]);
      setUploading(false);
      onUploadingChange?.(false);
    }
  };

  const remover = (index: number) => onChange(value.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-[#0B0F15]">Anexos (arquivos e links)</label>

      {value.length > 0 && (
        <ul className="space-y-1.5">
          {value.map((anexo, i) => (
            <li
              key={`${anexo.url}-${i}`}
              className="flex items-center gap-2 rounded-[10px] border border-[#E6EAF0] bg-[#F8F9FB] px-3 py-2"
            >
              {anexo.tipo === "link" ? (
                <Link2 className="w-4 h-4 text-[#1E63FF] flex-shrink-0" />
              ) : (
                <FileText className="w-4 h-4 text-[#3730A3] flex-shrink-0" />
              )}
              <a
                href={anexo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 truncate text-sm text-[#0B0F15] hover:text-[#1E63FF]"
                title={anexo.url}
              >
                {anexo.nome}
              </a>
              <button
                type="button"
                onClick={() => remover(i)}
                aria-label={`Remover ${anexo.nome}`}
                className="p-1 rounded-[6px] text-[#9AA0A6] hover:bg-red-50 hover:text-red-500 flex-shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <Input
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            if (erro) setErro("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              adicionarLink();
            }
          }}
          placeholder="Cole um link (Drive, site, modelo...)"
          className="flex-1 text-sm"
        />
        <button
          type="button"
          onClick={adicionarLink}
          disabled={!link.trim()}
          className="h-[44px] px-3 rounded-[12px] border border-[#EAECEF] text-[#545F6C] hover:bg-[#F3F5F9] disabled:opacity-40 flex items-center gap-1 text-sm font-semibold"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      <label className="flex items-center justify-center gap-2 h-[44px] rounded-[12px] border border-dashed border-[#C7CDD6] bg-white cursor-pointer text-sm text-[#545F6C] hover:bg-[#F3F5F9]">
        {uploading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <Paperclip className="w-4 h-4" />
            Anexar arquivo
          </>
        )}
        <input type="file" multiple className="hidden" onChange={handleFiles} disabled={uploading} />
      </label>

      {erro && <p className="text-xs text-red-500">{erro}</p>}
    </div>
  );
}

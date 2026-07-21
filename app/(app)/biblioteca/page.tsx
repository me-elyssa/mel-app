"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Search, BookOpen } from "lucide-react";
import DocumentoCard from "@/components/biblioteca/DocumentoCard";
import DocumentoForm from "@/components/biblioteca/DocumentoForm";
import DocumentoSidebar from "@/components/biblioteca/DocumentoSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useDocumentos,
  useCreateDocumento,
  useUpdateDocumento,
  useDeleteDocumento,
} from "@/lib/hooks/useDocumentos";
import type { CreateDocumentoInput, Documento, DocumentoArea, DocumentoTipo } from "@/types/entities";

const AREAS: { value: DocumentoArea | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pesquisa", label: "Pesquisa" },
  { value: "faculdade", label: "Faculdade" },
  { value: "trabalho", label: "Trabalho" },
  { value: "pessoal", label: "Pessoal" },
];

const TIPOS: { value: DocumentoTipo | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pdf", label: "PDF" },
  { value: "artigo", label: "Artigo" },
  { value: "jurisprudencia", label: "Jurisprudência" },
  { value: "doutrina", label: "Doutrina" },
  { value: "modelo", label: "Modelo" },
  { value: "livro", label: "Livro" },
  { value: "outro", label: "Outro" },
];

export default function BibliotecaPage() {
  const { data: documentos = [] } = useDocumentos();
  const createDocumento = useCreateDocumento();
  const updateDocumento = useUpdateDocumento();
  const deleteDocumento = useDeleteDocumento();

  const [areaAtiva, setAreaAtiva] = useState<DocumentoArea | "todos">("todos");
  const [tipoAtivo, setTipoAtivo] = useState<DocumentoTipo | "todos">("todos");
  const [filtroBusca, setFiltroBusca] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Documento | undefined>(undefined);
  const [aberto, setAberto] = useState<Documento | undefined>(undefined);

  const documentosFiltrados = useMemo(() => {
    return documentos.filter((d) => {
      const matchArea = areaAtiva === "todos" || d.area === areaAtiva;
      const matchTipo = tipoAtivo === "todos" || d.tipo === tipoAtivo;
      const matchBusca = d.titulo.toLowerCase().includes(filtroBusca.toLowerCase());
      return matchArea && matchTipo && matchBusca;
    });
  }, [documentos, areaAtiva, tipoAtivo, filtroBusca]);

  const handleSalvar = async (form: CreateDocumentoInput) => {
    if (editando) {
      await updateDocumento.mutateAsync({ id: editando.id, ...form });
    } else {
      await createDocumento.mutateAsync(form);
    }
    setShowForm(false);
    setEditando(undefined);
  };

  const handleExcluir = async (id: string) => {
    await deleteDocumento.mutateAsync(id);
    setAberto(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0B0F15]">Biblioteca de Documentos</h1>
          <p className="text-[#6A7686] text-sm mt-1">{documentos.length} documentos no total</p>
        </div>
        <Button
          onClick={() => {
            setEditando(undefined);
            setShowForm(true);
          }}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Novo documento
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9AA0A6]" />
        <Input
          value={filtroBusca}
          onChange={(e) => setFiltroBusca(e.target.value)}
          placeholder="Buscar por título..."
          className="pl-11"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {AREAS.map((a) => (
          <button
            key={a.value}
            onClick={() => setAreaAtiva(a.value)}
            className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
              areaAtiva === a.value ? "bg-[#1E63FF] text-white" : "bg-[#F3F5F9] text-[#545F6C] hover:bg-[#E6EAF0]"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {TIPOS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTipoAtivo(t.value)}
            className={`text-xs font-medium px-3 py-1 rounded-[8px] transition-colors ${
              tipoAtivo === t.value ? "bg-[#0B0F15] text-white" : "bg-[#F3F5F9] text-[#9AA0A6] hover:bg-[#E6EAF0]"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {documentosFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-[#DCDFE5] mx-auto mb-3" />
          <p className="text-[#8A94A6]">Nenhum documento encontrado</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documentosFiltrados.map((documento) => (
            <DocumentoCard
              key={documento.id}
              documento={documento}
              onAbrir={() => setAberto(documento)}
              onEditar={() => {
                setEditando(documento);
                setShowForm(true);
              }}
              onExcluir={() => handleExcluir(documento.id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <DocumentoForm
            documento={editando}
            onSalvar={handleSalvar}
            onFechar={() => {
              setShowForm(false);
              setEditando(undefined);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {aberto && (
          <DocumentoSidebar
            documento={aberto}
            onFechar={() => setAberto(undefined)}
            onEditar={() => {
              setEditando(aberto);
              setAberto(undefined);
              setShowForm(true);
            }}
            onExcluir={() => handleExcluir(aberto.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

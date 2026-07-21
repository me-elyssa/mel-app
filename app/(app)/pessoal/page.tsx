"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, User } from "lucide-react";
import RegistroCard from "@/components/pessoal/RegistroCard";
import RegistroForm from "@/components/pessoal/RegistroForm";
import { CATEGORIA_LABEL } from "@/components/pessoal/categoria-colors";
import { Button } from "@/components/ui/button";
import {
  useRegistros,
  useCreateRegistro,
  useUpdateRegistro,
  useDeleteRegistro,
} from "@/lib/hooks/useRegistros";
import type { CreateRegistroPessoalInput, RegistroCategoria, RegistroPessoal } from "@/types/entities";

const FILTROS: { value: RegistroCategoria | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  ...(Object.keys(CATEGORIA_LABEL) as RegistroCategoria[]).map((value) => ({
    value,
    label: CATEGORIA_LABEL[value],
  })),
];

export default function PessoalPage() {
  const { data: registros = [] } = useRegistros();
  const createRegistro = useCreateRegistro();
  const updateRegistro = useUpdateRegistro();
  const deleteRegistro = useDeleteRegistro();

  const [categoriaAtiva, setCategoriaAtiva] = useState<RegistroCategoria | "todos">("todos");
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<RegistroPessoal | undefined>(undefined);

  const registrosFiltrados = useMemo(() => {
    if (categoriaAtiva === "todos") return registros;
    return registros.filter((r) => r.categoria === categoriaAtiva);
  }, [registros, categoriaAtiva]);

  const handleSalvar = async (form: CreateRegistroPessoalInput) => {
    if (editando) {
      await updateRegistro.mutateAsync({ id: editando.id, ...form });
    } else {
      await createRegistro.mutateAsync(form);
    }
    setShowForm(false);
    setEditando(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0B0F15]">Registros Pessoais</h1>
          <p className="text-[#6A7686] text-sm mt-1">{registros.length} registros no total</p>
        </div>
        <Button
          onClick={() => {
            setEditando(undefined);
            setShowForm(true);
          }}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Novo registro
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTROS.map((f) => (
          <button
            key={f.value}
            onClick={() => setCategoriaAtiva(f.value)}
            className={`text-sm font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
              categoriaAtiva === f.value ? "bg-[#1E63FF] text-white" : "bg-[#F3F5F9] text-[#545F6C] hover:bg-[#E6EAF0]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {registrosFiltrados.length === 0 ? (
        <div className="text-center py-16">
          <User className="w-12 h-12 text-[#DCDFE5] mx-auto mb-3" />
          <p className="text-[#8A94A6]">Nenhum registro encontrado</p>
        </div>
      ) : (
        <div className="space-y-3">
          {registrosFiltrados.map((registro) => (
            <RegistroCard
              key={registro.id}
              registro={registro}
              onEditar={() => {
                setEditando(registro);
                setShowForm(true);
              }}
              onExcluir={() => deleteRegistro.mutate(registro.id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <RegistroForm
            registro={editando}
            onSalvar={handleSalvar}
            onFechar={() => {
              setShowForm(false);
              setEditando(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

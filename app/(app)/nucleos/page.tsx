"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Plus, Brain } from "lucide-react";
import NucleoCard from "@/components/nucleos/NucleoCard";
import NucleoForm from "@/components/nucleos/NucleoForm";
import NucleoDetalhe from "@/components/nucleos/NucleoDetalhe";
import { Button } from "@/components/ui/button";
import { useNucleos, useCreateNucleo, useUpdateNucleo, useDeleteNucleo } from "@/lib/hooks/useNucleos";
import type { CreateNucleoInput, Nucleo } from "@/types/entities";

export default function NucleosPage() {
  const { data: nucleos = [] } = useNucleos();
  const createNucleo = useCreateNucleo();
  const updateNucleo = useUpdateNucleo();
  const deleteNucleo = useDeleteNucleo();

  const [selecionado, setSelecionado] = useState<Nucleo | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Nucleo | undefined>(undefined);

  const handleSalvar = async (form: CreateNucleoInput) => {
    if (editando) {
      await updateNucleo.mutateAsync({ id: editando.id, ...form });
    } else {
      await createNucleo.mutateAsync(form);
    }
    setShowForm(false);
    setEditando(undefined);
  };

  const handleExcluir = async (id: string) => {
    await deleteNucleo.mutateAsync(id);
    if (selecionado?.id === id) setSelecionado(undefined);
  };

  if (selecionado) {
    return <NucleoDetalhe nucleo={selecionado} onVoltar={() => setSelecionado(undefined)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0B0F15]">Núcleos de Conhecimento</h1>
          <p className="text-[#6A7686] text-sm mt-1">{nucleos.length} núcleos no total</p>
        </div>
        <Button
          onClick={() => {
            setEditando(undefined);
            setShowForm(true);
          }}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Novo núcleo
        </Button>
      </div>

      {nucleos.length === 0 ? (
        <div className="text-center py-16">
          <Brain className="w-12 h-12 text-[#DCDFE5] mx-auto mb-3" />
          <p className="text-[#8A94A6]">Nenhum núcleo criado ainda</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {nucleos.map((nucleo) => (
            <NucleoCard
              key={nucleo.id}
              nucleo={nucleo}
              onAbrir={() => setSelecionado(nucleo)}
              onEditar={() => {
                setEditando(nucleo);
                setShowForm(true);
              }}
              onExcluir={() => handleExcluir(nucleo.id)}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <NucleoForm
            nucleo={editando}
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

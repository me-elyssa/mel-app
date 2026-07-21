"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { BookOpen, Brain, User, CalendarDays, Plus } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import KanbanBoard from "@/components/dashboard/KanbanBoard";
import TarefaForm from "@/components/dashboard/TarefaForm";
import ProximosEventos from "@/components/dashboard/ProximosEventos";
import { Button } from "@/components/ui/button";
import { useDocumentos } from "@/lib/hooks/useDocumentos";
import { useNucleos } from "@/lib/hooks/useNucleos";
import { useRegistros } from "@/lib/hooks/useRegistros";
import { useEventos } from "@/lib/hooks/useEventos";
import { useTarefas, useCreateTarefa, useUpdateTarefa, useDeleteTarefa } from "@/lib/hooks/useTarefas";
import type { CreateTarefaInput, Tarefa } from "@/types/entities";

export default function DashboardPage() {
  const { data: documentos = [] } = useDocumentos();
  const { data: nucleos = [] } = useNucleos();
  const { data: registros = [] } = useRegistros();
  const { data: eventos = [] } = useEventos();
  const { data: tarefas = [] } = useTarefas();

  const createTarefa = useCreateTarefa();
  const updateTarefa = useUpdateTarefa();
  const deleteTarefa = useDeleteTarefa();

  const [tarefaEditando, setTarefaEditando] = useState<Tarefa | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const handleSalvar = async (form: CreateTarefaInput) => {
    if (tarefaEditando) {
      await updateTarefa.mutateAsync({ id: tarefaEditando.id, ...form });
    } else {
      await createTarefa.mutateAsync(form);
    }
    setShowForm(false);
    setTarefaEditando(undefined);
  };

  const handleEditar = (tarefa: Tarefa) => {
    setTarefaEditando(tarefa);
    setShowForm(true);
  };

  const handleNovaTarefa = () => {
    setTarefaEditando(undefined);
    setShowForm(true);
  };

  const handleStatusChange = (id: string, status: Tarefa["status"]) => {
    updateTarefa.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#0B0F15]">Bem-vinda</h1>
        <p className="text-[#6A7686] text-sm mt-1">Aqui está o resumo do seu dia.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href="/biblioteca">
          <StatsCard
            title="Biblioteca"
            icon={BookOpen}
            bgColor="var(--sky)"
            iconColor="#2A7BA6"
            trend={`${documentos.length} documentos`}
          />
        </Link>
        <Link href="/nucleos">
          <StatsCard
            title="Núcleos"
            icon={Brain}
            bgColor="var(--lavender)"
            iconColor="#6B52C8"
            trend={`${nucleos.length} núcleos`}
          />
        </Link>
        <Link href="/pessoal">
          <StatsCard
            title="Pessoal"
            icon={User}
            bgColor="var(--peach)"
            iconColor="#B87340"
            trend={`${registros.length} registros`}
          />
        </Link>
        <Link href="/calendario">
          <StatsCard
            title="Calendário"
            icon={CalendarDays}
            bgColor="var(--citrus)"
            iconColor="#6A8A1A"
            trend={`${eventos.length} eventos`}
          />
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <div className="bg-white rounded-[20px] border border-[#EAECEF] p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[#0B0F15]">Tarefas</h3>
            <Button size="sm" onClick={handleNovaTarefa} className="gap-1.5">
              <Plus className="w-4 h-4" />
              Nova tarefa
            </Button>
          </div>
          <KanbanBoard
            tarefas={tarefas}
            onEditar={handleEditar}
            onExcluir={(id) => deleteTarefa.mutate(id)}
            onStatusChange={handleStatusChange}
          />
        </div>

        <ProximosEventos />
      </div>

      <AnimatePresence>
        {showForm && (
          <TarefaForm
            tarefa={tarefaEditando}
            onSalvar={handleSalvar}
            onFechar={() => {
              setShowForm(false);
              setTarefaEditando(undefined);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

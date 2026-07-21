"use client";

import { useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Plus, Calendar as CalendarIcon, FileText } from "lucide-react";
import CalendarioGrid from "@/components/calendario/CalendarioGrid";
import EventoModal from "@/components/calendario/EventoModal";
import { TIPO_COLORS, TIPO_LABEL } from "@/components/calendario/evento-colors";
import { Button } from "@/components/ui/button";
import { useEventos, useCreateEvento, useUpdateEvento, useDeleteEvento } from "@/lib/hooks/useEventos";
import { useTarefas } from "@/lib/hooks/useTarefas";
import type { CreateEventoInput, Evento } from "@/types/entities";

export default function CalendarioPage() {
  const { data: eventos = [] } = useEventos();
  const { data: tarefas = [] } = useTarefas();
  const createEvento = useCreateEvento();
  const updateEvento = useUpdateEvento();
  const deleteEvento = useDeleteEvento();

  const [mes, setMes] = useState(() => new Date());
  const [diaSelecionado, setDiaSelecionado] = useState<string | null>(format(new Date(), "yyyy-MM-dd"));
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState<Evento | undefined>(undefined);

  const hoje = format(new Date(), "yyyy-MM-dd");

  const eventosDoDia = useMemo(
    () => eventos.filter((e) => e.data === diaSelecionado),
    [eventos, diaSelecionado]
  );
  const tarefasDoDia = useMemo(
    () => tarefas.filter((t) => t.data_limite === diaSelecionado),
    [tarefas, diaSelecionado]
  );

  const proximosEventos = useMemo(
    () =>
      [...eventos]
        .filter((e) => e.data >= hoje)
        .sort((a, b) => a.data.localeCompare(b.data))
        .slice(0, 8),
    [eventos, hoje]
  );

  const handleSalvar = async (form: CreateEventoInput) => {
    if (editando) {
      await updateEvento.mutateAsync({ id: editando.id, ...form });
    } else {
      await createEvento.mutateAsync(form);
    }
    setShowForm(false);
    setEditando(undefined);
  };

  const handleExcluir = async () => {
    if (!editando) return;
    await deleteEvento.mutateAsync(editando.id);
    setShowForm(false);
    setEditando(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0B0F15]">Calendário</h1>
          <p className="text-[#6A7686] text-sm mt-1">{eventos.length} eventos no total</p>
        </div>
        <Button
          onClick={() => {
            setEditando(undefined);
            setShowForm(true);
          }}
          className="gap-1.5"
        >
          <Plus className="w-4 h-4" />
          Novo evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        <CalendarioGrid
          mes={mes}
          eventos={eventos}
          tarefas={tarefas}
          diaSelecionado={diaSelecionado}
          onSelecionarDia={setDiaSelecionado}
          onMudarMes={setMes}
        />

        <div className="space-y-4">
          {/* Detalhes do dia */}
          <div className="bg-white rounded-[20px] border border-[#EAECEF] p-5">
            <h3 className="text-[#0B0F15] mb-4 capitalize">
              {diaSelecionado
                ? format(new Date(diaSelecionado + "T00:00:00"), "EEEE, d 'de' MMMM", { locale: ptBR })
                : "Selecione um dia"}
            </h3>

            {eventosDoDia.length === 0 && tarefasDoDia.length === 0 ? (
              <p className="text-sm text-[#8A94A6]">Nada agendado para este dia</p>
            ) : (
              <div className="space-y-2">
                {eventosDoDia.map((ev) => {
                  const c = TIPO_COLORS[ev.tipo] ?? TIPO_COLORS.outro;
                  return (
                    <button
                      key={ev.id}
                      onClick={() => {
                        setEditando(ev);
                        setShowForm(true);
                      }}
                      className="w-full flex items-center gap-2 p-2.5 rounded-[10px] hover:bg-[#F8F9FB] text-left"
                    >
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${c.dot}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#0B0F15] truncate">{ev.titulo}</p>
                        <p className="text-xs text-[#8A94A6]">
                          {TIPO_LABEL[ev.tipo]}
                          {ev.hora_inicio ? ` · ${ev.hora_inicio}` : ""}
                        </p>
                      </div>
                    </button>
                  );
                })}
                {tarefasDoDia.map((t) => (
                  <div key={t.id} className="flex items-center gap-2 p-2.5 rounded-[10px] bg-[#F8F9FB]">
                    <FileText className="w-3.5 h-3.5 text-[#545F6C] flex-shrink-0" />
                    <p className="text-sm font-medium text-[#0B0F15] truncate">{t.titulo}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Próximos eventos */}
          <div className="bg-white rounded-[20px] border border-[#EAECEF] p-5">
            <h3 className="text-[#0B0F15] mb-4 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-[#1E63FF]" />
              Próximos eventos
            </h3>
            {proximosEventos.length === 0 ? (
              <p className="text-sm text-[#8A94A6]">Nenhum evento agendado</p>
            ) : (
              <div className="space-y-1">
                {proximosEventos.map((ev) => {
                  const c = TIPO_COLORS[ev.tipo] ?? TIPO_COLORS.outro;
                  return (
                    <button
                      key={ev.id}
                      onClick={() => setDiaSelecionado(ev.data)}
                      className="w-full flex items-center gap-2 p-2 rounded-[10px] hover:bg-[#F8F9FB] text-left"
                    >
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
                      <span className="text-xs text-[#0B0F15] truncate flex-1">{ev.titulo}</span>
                      <span className="text-[10px] text-[#9AA0A6] flex-shrink-0">
                        {format(new Date(ev.data + "T00:00:00"), "d/MM")}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <EventoModal
            evento={editando}
            dataInicial={diaSelecionado ?? undefined}
            onSalvar={handleSalvar}
            onExcluir={editando ? handleExcluir : undefined}
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

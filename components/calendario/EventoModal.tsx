"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TIPO_LABEL } from "./evento-colors";
import type { CreateEventoInput, Evento, EventoTipo } from "@/types/entities";

const TIPO_OPTS: { value: EventoTipo; label: string }[] = (
  Object.keys(TIPO_LABEL) as EventoTipo[]
).map((value) => ({ value, label: TIPO_LABEL[value] }));

interface EventoModalProps {
  evento?: Evento;
  dataInicial?: string;
  onSalvar: (form: CreateEventoInput) => Promise<void>;
  onExcluir?: () => Promise<void>;
  onFechar: () => void;
}

export default function EventoModal({ evento, dataInicial, onSalvar, onExcluir, onFechar }: EventoModalProps) {
  const defaultForm: CreateEventoInput = {
    titulo: "",
    descricao: "",
    data: dataInicial ?? new Date().toISOString().slice(0, 10),
    hora_inicio: "",
    hora_fim: "",
    tipo: "compromisso",
    local: "",
    tarefa_id: null,
  };

  const [form, setForm] = useState<CreateEventoInput>(evento ? { ...defaultForm, ...evento } : defaultForm);
  const [loading, setLoading] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const set = <K extends keyof CreateEventoInput>(k: K, v: CreateEventoInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.titulo.trim() || !form.data) return;
    setLoading(true);
    await onSalvar(form);
    setLoading(false);
  };

  const handleExcluir = async () => {
    if (!onExcluir) return;
    setExcluindo(true);
    await onExcluir();
    setExcluindo(false);
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
          <h3 className="text-[#0B0F15]">{evento ? "Editar evento" : "Novo evento"}</h3>
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
              placeholder="Ex: Audiência de conciliação"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Data *</label>
              <input
                type="date"
                value={form.data}
                onChange={(e) => set("data", e.target.value)}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={(e) => set("tipo", e.target.value as EventoTipo)}
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
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Hora início</label>
              <input
                type="time"
                value={form.hora_inicio ?? ""}
                onChange={(e) => set("hora_inicio", e.target.value)}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Hora fim</label>
              <input
                type="time"
                value={form.hora_fim ?? ""}
                onChange={(e) => set("hora_fim", e.target.value)}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Local</label>
            <Input
              value={form.local ?? ""}
              onChange={(e) => set("local", e.target.value)}
              placeholder="Ex: Fórum Central, sala 4"
            />
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

          <div className="flex justify-between items-center gap-3 pt-2">
            {evento && onExcluir ? (
              <Button type="button" variant="ghost" onClick={handleExcluir} className="text-red-500 gap-1.5">
                {excluindo ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Excluir
              </Button>
            ) : (
              <span />
            )}
            <div className="flex gap-3">
              <Button type="button" variant="ghost" onClick={onFechar} className="text-[#6A7686]">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading || !form.titulo.trim()} className="h-[44px] px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : evento ? "Salvar" : "Criar evento"}
              </Button>
            </div>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

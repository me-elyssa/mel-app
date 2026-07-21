"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { CreateTarefaInput, Tarefa } from "@/types/entities";

const STATUS_OPTS = [
  { value: "pendente", label: "Pendente" },
  { value: "em_progresso", label: "Em progresso" },
  { value: "concluido", label: "Concluído" },
];
const PRIORIDADE_OPTS = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
];
const COMPLEXIDADE_OPTS = [
  { value: "facil", label: "Fácil" },
  { value: "media", label: "Média" },
  { value: "complexa", label: "Complexa" },
];
const CATEGORIA_OPTS = [
  { value: "processo", label: "Processo" },
  { value: "documento", label: "Documento" },
  { value: "pesquisa", label: "Pesquisa" },
  { value: "reuniao", label: "Reunião" },
  { value: "prazo", label: "Prazo" },
  { value: "outro", label: "Outro" },
];

const defaultForm: CreateTarefaInput = {
  titulo: "",
  descricao: "",
  status: "pendente",
  prioridade: "media",
  complexidade: "media",
  categoria: "outro",
  numero_processo: "",
  data_limite: "",
  nucleo_id: null,
};

interface TarefaFormProps {
  tarefa?: Tarefa;
  onSalvar: (form: CreateTarefaInput) => Promise<void>;
  onFechar: () => void;
}

export default function TarefaForm({ tarefa, onSalvar, onFechar }: TarefaFormProps) {
  const [form, setForm] = useState<CreateTarefaInput>(
    tarefa ? { ...defaultForm, ...tarefa } : defaultForm
  );
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof CreateTarefaInput>(k: K, v: CreateTarefaInput[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

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
          <h3 className="text-[#0B0F15]">{tarefa ? "Editar tarefa" : "Nova tarefa"}</h3>
          <button onClick={onFechar} className="p-2 rounded-lg hover:bg-[#F3F5F9] text-[#8A94A6]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Título *</label>
            <Input
              value={form.titulo}
              onChange={(e) => set("titulo", e.target.value)}
              placeholder="Ex: Elaborar petição inicial"
              className="w-full"
              autoFocus
            />
          </div>

          {/* Status + Prioridade */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as CreateTarefaInput["status"])}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              >
                {STATUS_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Prioridade</label>
              <select
                value={form.prioridade}
                onChange={(e) => set("prioridade", e.target.value as CreateTarefaInput["prioridade"])}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              >
                {PRIORIDADE_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Complexidade + Categoria */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Complexidade</label>
              <select
                value={form.complexidade}
                onChange={(e) => set("complexidade", e.target.value as CreateTarefaInput["complexidade"])}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              >
                {COMPLEXIDADE_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Categoria</label>
              <select
                value={form.categoria}
                onChange={(e) => set("categoria", e.target.value as CreateTarefaInput["categoria"])}
                className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
              >
                {CATEGORIA_OPTS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Número do processo */}
          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Nº Processo / Documento</label>
            <Input
              value={form.numero_processo ?? ""}
              onChange={(e) => set("numero_processo", e.target.value)}
              placeholder="Ex: 0001234-56.2024.8.26.0100"
              className="w-full font-mono text-sm"
            />
          </div>

          {/* Data limite */}
          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Data limite</label>
            <input
              type="date"
              value={form.data_limite ?? ""}
              onChange={(e) => set("data_limite", e.target.value)}
              className="w-full h-[44px] rounded-[12px] border border-[#EAECEF] px-3 text-sm text-[#0B0F15] bg-white focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Descrição / Observações</label>
            <textarea
              value={form.descricao ?? ""}
              onChange={(e) => set("descricao", e.target.value)}
              placeholder="Contexto, observações relevantes..."
              rows={3}
              className="w-full rounded-[12px] border border-[#EAECEF] px-3 py-2 text-sm text-[#0B0F15] bg-white resize-none focus:outline-none focus:ring-2 focus:ring-[#1E63FF]"
            />
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onFechar} className="text-[#6A7686]">
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading || !form.titulo.trim()}
              className="h-[44px] px-6"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : tarefa ? "Salvar" : "Criar tarefa"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

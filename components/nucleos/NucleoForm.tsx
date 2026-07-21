"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NUCLEO_COLORS } from "./colors";
import type { CreateNucleoInput, Nucleo } from "@/types/entities";

const STATUS_OPTS = [
  { value: "ativo", label: "Ativo" },
  { value: "em_pausa", label: "Em pausa" },
  { value: "concluido", label: "Concluído" },
];

const defaultForm: CreateNucleoInput = {
  titulo: "",
  descricao: "",
  area: "",
  cor: NUCLEO_COLORS[0],
  status: "ativo",
  ultima_revisao: null,
};

interface NucleoFormProps {
  nucleo?: Nucleo;
  onSalvar: (form: CreateNucleoInput) => Promise<void>;
  onFechar: () => void;
}

export default function NucleoForm({ nucleo, onSalvar, onFechar }: NucleoFormProps) {
  const [form, setForm] = useState<CreateNucleoInput>(
    nucleo ? { ...defaultForm, ...nucleo } : defaultForm
  );
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof CreateNucleoInput>(k: K, v: CreateNucleoInput[K]) =>
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
          <h3 className="text-[#0B0F15]">{nucleo ? "Editar núcleo" : "Novo núcleo"}</h3>
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
              placeholder="Ex: Direito Civil Avançado"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Área</label>
            <Input
              value={form.area ?? ""}
              onChange={(e) => set("area", e.target.value)}
              placeholder="Ex: Faculdade"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Status</label>
            <select
              value={form.status}
              onChange={(e) => set("status", e.target.value as CreateNucleoInput["status"])}
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
            <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Cor</label>
            <div className="flex gap-2">
              {NUCLEO_COLORS.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  onClick={() => set("cor", cor)}
                  className="w-9 h-9 rounded-full flex items-center justify-center border-2"
                  style={{ backgroundColor: cor, borderColor: form.cor === cor ? "#1E63FF" : "transparent" }}
                >
                  {form.cor === cor && <Check className="w-4 h-4 text-[#0B0F15]" />}
                </button>
              ))}
            </div>
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

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={onFechar} className="text-[#6A7686]">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !form.titulo.trim()} className="h-[44px] px-6">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : nucleo ? "Salvar" : "Criar núcleo"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

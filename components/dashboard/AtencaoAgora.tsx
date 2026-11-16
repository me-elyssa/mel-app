"use client";

import Link from "next/link";
import { differenceInCalendarDays, format } from "date-fns";
import { AlertTriangle, BellRing, Brain, CheckCircle2, ClipboardList, Calendar, StickyNote } from "lucide-react";
import { motion } from "framer-motion";
import { useEventos } from "@/lib/hooks/useEventos";
import { useTarefas } from "@/lib/hooks/useTarefas";
import { useNucleos } from "@/lib/hooks/useNucleos";
import { useNotasPendentes } from "@/lib/hooks/useNotas";
import { DIAS_REVISAO, diasSemRevisao, revisaoAtrasada } from "@/lib/revisao";

const JANELA_DIAS = 3;

type Urgencia = "atrasado" | "hoje" | "breve";

interface Item {
  id: string;
  origem: "tarefa" | "evento";
  titulo: string;
  data: string;
  hora: string | null;
  dias: number;
  urgencia: Urgencia;
}

const ESTILO: Record<Urgencia, { bg: string; text: string }> = {
  atrasado: { bg: "#FEE2E2", text: "#B91C1C" },
  hoje: { bg: "#D9FF63", text: "#0B0F15" },
  breve: { bg: "#FEF3C7", text: "#B45309" },
};

function rotulo(dias: number): string {
  if (dias < 0) return dias === -1 ? "Atrasado 1 dia" : `Atrasado ${Math.abs(dias)} dias`;
  if (dias === 0) return "Hoje";
  if (dias === 1) return "Amanhã";
  return `Em ${dias} dias`;
}

function classificar(dias: number): Urgencia | null {
  if (dias < 0) return "atrasado";
  if (dias === 0) return "hoje";
  if (dias <= JANELA_DIAS) return "breve";
  return null;
}

export default function AtencaoAgora() {
  const { data: tarefas = [] } = useTarefas();
  const { data: eventos = [] } = useEventos();
  const { data: nucleos = [] } = useNucleos();
  const { data: notasPendentes = [] } = useNotasPendentes();

  const hoje = new Date();
  const hojeStr = format(hoje, "yyyy-MM-dd");
  const itens: Item[] = [];

  for (const t of tarefas) {
    if (t.status === "concluido" || !t.data_limite) continue;
    const dias = differenceInCalendarDays(new Date(t.data_limite + "T00:00:00"), new Date(hojeStr + "T00:00:00"));
    const urgencia = classificar(dias);
    if (urgencia) {
      itens.push({ id: t.id, origem: "tarefa", titulo: t.titulo, data: t.data_limite, hora: null, dias, urgencia });
    }
  }

  for (const e of eventos) {
    if (e.concluido) continue;
    const dias = differenceInCalendarDays(new Date(e.data + "T00:00:00"), new Date(hojeStr + "T00:00:00"));
    const urgencia = classificar(dias);
    if (urgencia) {
      itens.push({ id: e.id, origem: "evento", titulo: e.titulo, data: e.data, hora: e.hora_inicio, dias, urgencia });
    }
  }

  itens.sort((a, b) => a.dias - b.dias || (a.hora ?? "").localeCompare(b.hora ?? ""));

  const nucleosParaRevisar = nucleos
    .filter(revisaoAtrasada)
    .sort((a, b) => diasSemRevisao(b) - diasSemRevisao(a));

  const atrasados = itens.filter((i) => i.urgencia === "atrasado").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[20px] border border-[#EAECEF] shadow-[0_2px_12px_rgba(15,23,42,0.06)] p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[#0B0F15] flex items-center gap-2">
          <BellRing className="w-5 h-5 text-[#1E63FF]" />
          Atenção agora
        </h3>
        {atrasados > 0 && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FEE2E2] text-[#B91C1C] flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {atrasados} {atrasados === 1 ? "atrasado" : "atrasados"}
          </span>
        )}
      </div>

      {itens.length === 0 && nucleosParaRevisar.length === 0 && notasPendentes.length === 0 ? (
        <div className="flex items-center gap-2 text-sm text-[#8A94A6] py-2">
          <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
          Nada pendente por enquanto.
        </div>
      ) : (
        <div className="space-y-2">
          {itens.map((i) => {
            const estilo = ESTILO[i.urgencia];
            const Icone = i.origem === "tarefa" ? ClipboardList : Calendar;
            return (
              <Link
                key={`${i.origem}-${i.id}`}
                href={i.origem === "tarefa" ? "/" : "/calendario"}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-[#F8F9FB] transition-colors"
              >
                <Icone className="w-4 h-4 text-[#8A94A6] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B0F15] truncate">{i.titulo}</p>
                  <p className="text-xs text-[#8A94A6]">
                    {i.origem === "tarefa" ? "Prazo da tarefa" : "Evento"} ·{" "}
                    {new Date(i.data + "T00:00:00").toLocaleDateString("pt-BR")}
                    {i.hora ? ` · ${i.hora}` : ""}
                  </p>
                </div>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: estilo.bg, color: estilo.text }}
                >
                  {rotulo(i.dias)}
                </span>
              </Link>
            );
          })}

          {notasPendentes.length > 0 && (
            <Link
              href="/nucleos"
              className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-[#F8F9FB] transition-colors"
            >
              <StickyNote className="w-4 h-4 text-[#8A94A6] flex-shrink-0" />
              <p className="flex-1 min-w-0 text-sm font-semibold text-[#0B0F15] truncate">
                {notasPendentes.length}{" "}
                {notasPendentes.length === 1 ? "nota aguardando processamento" : "notas aguardando processamento"}
              </p>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309]">
                Pendente
              </span>
            </Link>
          )}

          {nucleosParaRevisar.map((n) => (
            <Link
              key={`nucleo-${n.id}`}
              href="/nucleos"
              className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-[#F8F9FB] transition-colors"
            >
              <Brain className="w-4 h-4 text-[#8A94A6] flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#0B0F15] truncate">{n.titulo}</p>
                <p className="text-xs text-[#8A94A6]">
                  {n.ultima_revisao ? "Sem revisão" : "Nunca revisado"} há mais de {DIAS_REVISAO} dias
                </p>
              </div>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EDE7F6] text-[#5E35B1] flex-shrink-0">
                Revisar
              </span>
            </Link>
          ))}
        </div>
      )}
    </motion.div>
  );
}

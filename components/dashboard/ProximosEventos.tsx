"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { useEventos } from "@/lib/hooks/useEventos";
import { TIPO_COLORS, TIPO_LABEL } from "@/components/calendario/evento-colors";

export default function ProximosEventos() {
  const { data: eventos = [], isLoading } = useEventos();

  const hoje = format(new Date(), "yyyy-MM-dd");
  const proximos = [...eventos]
    .filter((e) => e.data >= hoje)
    .sort((a, b) => a.data.localeCompare(b.data))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
      className="bg-white rounded-[20px] border border-[#EAECEF] shadow-[0_2px_12px_rgba(15,23,42,0.06)] p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-[#0B0F15] flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#1E63FF]" />
          Próximos eventos
        </h3>
        <Link
          href="/calendario"
          className="text-xs font-semibold text-[#1E63FF] hover:underline flex items-center gap-1"
        >
          Ver todos
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-14 bg-[#F3F5F9] rounded-[12px] animate-pulse" />
          ))}
        </div>
      ) : proximos.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-10 h-10 text-[#DCDFE5] mx-auto mb-3" />
          <p className="text-sm text-[#8A94A6]">Nenhum evento agendado</p>
          <Link href="/calendario" className="text-xs text-[#1E63FF] hover:underline mt-1 inline-block">
            Criar evento
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {proximos.map((ev) => {
            const c = TIPO_COLORS[ev.tipo] || TIPO_COLORS.outro;
            const dataFmt = format(new Date(ev.data + "T00:00:00"), "EEE, d 'de' MMM", { locale: ptBR });
            const isHoje = ev.data === hoje;
            return (
              <Link
                key={ev.id}
                href="/calendario"
                className="flex items-center gap-3 px-3 py-3 rounded-[12px] hover:bg-[#F8F9FB] transition-colors group"
              >
                <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${c.dot}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#0B0F15] truncate group-hover:text-[#1E63FF] transition-colors">
                    {ev.titulo}
                  </p>
                  <p className="text-xs text-[#8A94A6] capitalize">
                    {dataFmt}{ev.hora_inicio ? ` · ${ev.hora_inicio}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {isHoje && (
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#D9FF63] text-[#0B0F15] rounded-full">
                      Hoje
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}>
                    {TIPO_LABEL[ev.tipo] || "Evento"}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}

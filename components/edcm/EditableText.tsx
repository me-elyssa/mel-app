"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  valor: string | null;
  onSalvar: (novo: string) => void;
  placeholder?: string;
}

/** Texto que vira campo de edição ao clicar e salva ao sair do campo. */
export default function EditableText({ valor, onSalvar, placeholder = "—" }: Props) {
  const [editando, setEditando] = useState(false);
  const [rascunho, setRascunho] = useState(valor ?? "");
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editando && ref.current) {
      ref.current.focus();
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [editando]);

  const concluir = () => {
    setEditando(false);
    if (rascunho.trim() !== (valor ?? "")) onSalvar(rascunho.trim());
  };

  if (editando) {
    return (
      <textarea
        ref={ref}
        value={rascunho}
        onChange={(e) => {
          setRascunho(e.target.value);
          e.target.style.height = "auto";
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onBlur={concluir}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setRascunho(valor ?? "");
            setEditando(false);
          } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            e.currentTarget.blur();
          }
        }}
        className="w-full text-sm border border-[#1E63FF] rounded-[8px] px-2 py-1 resize-none focus:outline-none bg-white"
        rows={2}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setRascunho(valor ?? "");
        setEditando(true);
      }}
      className="text-left text-sm text-[#0B0F15] hover:bg-[#F3F5F9] rounded-[8px] px-2 py-1 w-full"
      title="Clique para editar"
    >
      {valor || <span className="text-[#B6BDC9]">{placeholder}</span>}
    </button>
  );
}

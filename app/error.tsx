"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
      <h2 className="text-[#0B0F15] mb-2">Algo deu errado</h2>
      <p className="text-[#6A7686] text-sm mb-5 max-w-sm">{error.message || "Ocorreu um erro inesperado."}</p>
      <Button onClick={reset}>Tentar novamente</Button>
    </div>
  );
}

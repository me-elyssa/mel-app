"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });

    setLoading(false);
    if (error) {
      setErro("E-mail ou senha incorretos.");
      return;
    }

    router.replace("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB] p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[20px] border border-[#E6EAF0] shadow-[0_4px_16px_rgba(15,23,42,0.06)] p-8 w-full max-w-[400px] space-y-4"
      >
        <div>
          <h1 className="text-[#0B0F15]">Mel</h1>
          <p className="text-sm text-[#6A7686] mt-1">Entre para continuar</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0B0F15] mb-1">E-mail</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-[#0B0F15] mb-1">Senha</label>
          <Input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p className="text-sm text-red-500">{erro}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Entrar"}
        </Button>
      </form>
    </div>
  );
}

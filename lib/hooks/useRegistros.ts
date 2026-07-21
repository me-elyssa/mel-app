import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CreateRegistroPessoalInput, RegistroPessoal, UpdateRegistroPessoalInput } from "@/types/entities";

export function useRegistros() {
  return useQuery({
    queryKey: ["registros"],
    queryFn: async (): Promise<RegistroPessoal[]> => {
      const { data, error } = await supabase
        .from("registro_pessoal")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateRegistro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateRegistroPessoalInput) => {
      const { data, error } = await supabase.from("registro_pessoal").insert([input]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["registros"] }),
  });
}

export function useUpdateRegistro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateRegistroPessoalInput & { id: string }) => {
      const { data, error } = await supabase.from("registro_pessoal").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["registros"] }),
  });
}

export function useDeleteRegistro() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("registro_pessoal").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["registros"] }),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CreateNotaInput, Nota, UpdateNotaInput } from "@/types/entities";

export function useNotas(nucleoId: string) {
  return useQuery({
    queryKey: ["notas-nucleo", nucleoId],
    queryFn: async (): Promise<Nota[]> => {
      const { data, error } = await supabase
        .from("nota")
        .select("*")
        .eq("nucleo_id", nucleoId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!nucleoId,
  });
}

export function useCreateNota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateNotaInput) => {
      const { data, error } = await supabase.from("nota").insert([input]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["notas-nucleo", data.nucleo_id] }),
  });
}

export function useUpdateNota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateNotaInput & { id: string }) => {
      const { data, error } = await supabase.from("nota").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => queryClient.invalidateQueries({ queryKey: ["notas-nucleo", data.nucleo_id] }),
  });
}

export function useDeleteNota() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; nucleoId: string }) => {
      const { error } = await supabase.from("nota").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_data, variables) =>
      queryClient.invalidateQueries({ queryKey: ["notas-nucleo", variables.nucleoId] }),
  });
}

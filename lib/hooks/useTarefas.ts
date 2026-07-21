import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CreateTarefaInput, Tarefa, UpdateTarefaInput } from "@/types/entities";

export function useTarefas() {
  return useQuery({
    queryKey: ["tarefas"],
    queryFn: async (): Promise<Tarefa[]> => {
      const { data, error } = await supabase
        .from("tarefa")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateTarefa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTarefaInput) => {
      const { data, error } = await supabase.from("tarefa").insert([input]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });
}

export function useUpdateTarefa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateTarefaInput & { id: string }) => {
      const { data, error } = await supabase.from("tarefa").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });
}

export function useDeleteTarefa() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tarefa").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tarefas"] }),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CreateEventoInput, Evento, UpdateEventoInput } from "@/types/entities";

export function useEventos() {
  return useQuery({
    queryKey: ["eventos"],
    queryFn: async (): Promise<Evento[]> => {
      const { data, error } = await supabase
        .from("evento")
        .select("*")
        .order("data", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateEvento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateEventoInput) => {
      const { data, error } = await supabase.from("evento").insert([input]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["eventos"] }),
  });
}

export function useUpdateEvento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateEventoInput & { id: string }) => {
      const { data, error } = await supabase.from("evento").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["eventos"] }),
  });
}

export function useDeleteEvento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("evento").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["eventos"] }),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CreateNucleoInput, Nucleo, UpdateNucleoInput } from "@/types/entities";

export function useNucleos() {
  return useQuery({
    queryKey: ["nucleos"],
    queryFn: async (): Promise<Nucleo[]> => {
      const { data, error } = await supabase
        .from("nucleo")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateNucleo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateNucleoInput) => {
      const { data, error } = await supabase.from("nucleo").insert([input]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["nucleos"] }),
  });
}

export function useUpdateNucleo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateNucleoInput & { id: string }) => {
      const { data, error } = await supabase.from("nucleo").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["nucleos"] }),
  });
}

export function useDeleteNucleo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("nucleo").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["nucleos"] }),
  });
}

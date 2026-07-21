import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { CreateDocumentoInput, Documento, UpdateDocumentoInput } from "@/types/entities";

export function useDocumentos() {
  return useQuery({
    queryKey: ["documentos"],
    queryFn: async (): Promise<Documento[]> => {
      const { data, error } = await supabase
        .from("documento")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useDocumentosPorNucleo(nucleoId: string) {
  return useQuery({
    queryKey: ["docs-nucleo", nucleoId],
    queryFn: async (): Promise<Documento[]> => {
      const { data, error } = await supabase
        .from("documento")
        .select("*")
        .eq("nucleo_id", nucleoId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!nucleoId,
  });
}

export function useCreateDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateDocumentoInput) => {
      const { data, error } = await supabase.from("documento").insert([input]).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documentos"] }),
  });
}

export function useUpdateDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateDocumentoInput & { id: string }) => {
      const { data, error } = await supabase.from("documento").update(input).eq("id", id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documentos"] }),
  });
}

export function useDeleteDocumento() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("documento").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["documentos"] }),
  });
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { EdcmDia, UpdateEdcmDiaInput } from "@/types/entities";

const KEY = ["edcm_dia"];

export function useEdcmDias() {
  return useQuery({
    queryKey: KEY,
    queryFn: async (): Promise<EdcmDia[]> => {
      const { data, error } = await supabase.from("edcm_dia").select("*").order("data", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useUpdateEdcmDia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateEdcmDiaInput & { id: string }) => {
      const { data, error } = await supabase
        .from("edcm_dia")
        .update({ ...input, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data as EdcmDia;
    },
    // Atualização otimista: a marcação de "Feito" e os números respondem na hora.
    onMutate: async ({ id, ...input }) => {
      await queryClient.cancelQueries({ queryKey: KEY });
      const anterior = queryClient.getQueryData<EdcmDia[]>(KEY);
      queryClient.setQueryData<EdcmDia[]>(KEY, (dias) =>
        dias?.map((d) => (d.id === id ? { ...d, ...input } : d))
      );
      return { anterior };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.anterior) queryClient.setQueryData(KEY, ctx.anterior);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

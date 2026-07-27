// Helpers de formulário: o estado inicial vem da entidade salva, mas o payload
// enviado ao Supabase precisa ser limpo antes de sair daqui.

// Colunas geradas pelo banco — nunca devem ir no insert/update.
const CAMPOS_GERADOS = ["id", "created_at", "updated_at"];

// Monta o estado inicial a partir da entidade salva, descartando os campos
// gerados (senão o update reescreve `updated_at` com o valor antigo).
export function formInicial<T extends object>(padrao: T, entidade?: object): T {
  if (!entidade) return padrao;
  const limpo = Object.fromEntries(
    Object.entries(entidade).filter(([k]) => !CAMPOS_GERADOS.includes(k))
  );
  return { ...padrao, ...limpo } as T;
}

// Converte string vazia em null: colunas `date`, `time` e `uuid` rejeitam ""
// com "invalid input syntax", e nas colunas de texto null é o valor correto
// para "não preenchido".
export function normalizarPayload<T extends object>(form: T): T {
  return Object.fromEntries(
    Object.entries(form).map(([k, v]) => [k, v === "" ? null : v])
  ) as T;
}

export function mensagemErro(err: unknown, fallback: string): string {
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
  }
  return fallback;
}

export interface Nucleo {
  id: string;
  titulo: string;
  descricao: string | null;
  area: string | null;
  cor: string | null;
  status: "ativo" | "em_pausa" | "concluido";
  ultima_revisao: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateNucleoInput = Omit<Nucleo, "id" | "created_at" | "updated_at">;
export type UpdateNucleoInput = Partial<CreateNucleoInput>;

export interface Tarefa {
  id: string;
  titulo: string;
  descricao: string | null;
  status: "pendente" | "em_progresso" | "concluido";
  prioridade: "baixa" | "media" | "alta";
  complexidade: "facil" | "media" | "complexa";
  categoria: "processo" | "documento" | "pesquisa" | "reuniao" | "prazo" | "outro";
  numero_processo: string | null;
  data_limite: string | null;
  nucleo_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateTarefaInput = Omit<Tarefa, "id" | "created_at" | "updated_at">;
export type UpdateTarefaInput = Partial<CreateTarefaInput>;

export type DocumentoArea = "pesquisa" | "faculdade" | "trabalho" | "pessoal";
export type DocumentoTipo =
  | "pdf"
  | "artigo"
  | "jurisprudencia"
  | "doutrina"
  | "modelo"
  | "livro"
  | "outro";

export interface Documento {
  id: string;
  titulo: string;
  descricao: string | null;
  area: DocumentoArea;
  tipo: DocumentoTipo;
  file_url: string | null;
  autores: string | null;
  ano: string | null;
  tags: string[] | null;
  nucleo_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateDocumentoInput = Omit<Documento, "id" | "created_at" | "updated_at">;
export type UpdateDocumentoInput = Partial<CreateDocumentoInput>;

export type NotaTipo =
  | "ideia"
  | "reflexao"
  | "link"
  | "trecho"
  | "referencia"
  | "insight"
  | "pessoal";

export interface Nota {
  id: string;
  titulo: string | null;
  conteudo: string | null;
  tipo: NotaTipo;
  nucleo_id: string;
  processada: boolean;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateNotaInput = Omit<Nota, "id" | "created_at" | "updated_at">;
export type UpdateNotaInput = Partial<CreateNotaInput>;

export type RegistroCategoria =
  | "diario"
  | "metas"
  | "reflexao"
  | "projeto_pessoal"
  | "financeiro"
  | "saude"
  | "outro";

export interface RegistroPessoal {
  id: string;
  titulo: string;
  conteudo: string | null;
  categoria: RegistroCategoria;
  data: string | null;
  file_url: string | null;
  file_name: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateRegistroPessoalInput = Omit<RegistroPessoal, "id" | "created_at" | "updated_at">;
export type UpdateRegistroPessoalInput = Partial<CreateRegistroPessoalInput>;

export type EventoTipo = "audiencia" | "reuniao" | "prazo" | "compromisso" | "outro";

export interface Evento {
  id: string;
  titulo: string;
  descricao: string | null;
  data: string;
  hora_inicio: string | null;
  hora_fim: string | null;
  tipo: EventoTipo;
  local: string | null;
  tarefa_id: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateEventoInput = Omit<Evento, "id" | "created_at" | "updated_at">;
export type UpdateEventoInput = Partial<CreateEventoInput>;

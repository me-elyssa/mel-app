-- Mel — schema Supabase (revisado)
-- Rode no SQL editor do projeto Supabase antes de usar o app.

create extension if not exists "uuid-ossp";

create table nucleo (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  descricao text,
  area text,
  cor text default 'var(--lavender)',
  status text check (status in ('ativo', 'em_pausa', 'concluido')) default 'ativo',
  ultima_revisao timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table tarefa (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  descricao text,
  status text check (status in ('pendente', 'em_progresso', 'concluido')) default 'pendente',
  prioridade text check (prioridade in ('baixa', 'media', 'alta')) default 'media',
  complexidade text check (complexidade in ('facil', 'media', 'complexa')) default 'media',
  categoria text check (categoria in ('processo', 'documento', 'pesquisa', 'reuniao', 'prazo', 'outro')),
  numero_processo text,
  data_limite date,
  nucleo_id uuid references nucleo(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table documento (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  descricao text,
  area text check (area in ('pesquisa', 'faculdade', 'trabalho', 'pessoal')),
  tipo text check (tipo in ('pdf', 'artigo', 'jurisprudencia', 'doutrina', 'modelo', 'livro', 'outro')),
  file_url text,
  autores text,
  ano text,
  tags text[],
  nucleo_id uuid references nucleo(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table nota (
  id uuid primary key default uuid_generate_v4(),
  titulo text,
  conteudo text,
  tipo text check (tipo in ('ideia', 'reflexao', 'link', 'trecho', 'referencia', 'insight', 'pessoal')),
  nucleo_id uuid not null references nucleo(id) on delete cascade,
  processada boolean default false,
  file_url text,
  file_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table registro_pessoal (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  conteudo text,
  categoria text check (categoria in ('diario', 'metas', 'reflexao', 'projeto_pessoal', 'financeiro', 'saude', 'outro')),
  data date,
  file_url text,
  file_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table evento (
  id uuid primary key default uuid_generate_v4(),
  titulo text not null,
  descricao text,
  data date not null,
  hora_inicio time,
  hora_fim time,
  tipo text check (tipo in ('audiencia', 'reuniao', 'prazo', 'compromisso', 'outro')),
  local text,
  tarefa_id uuid references tarefa(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: habilitar e liberar para usuários autenticados (ajustar conforme necessidade real de multi-tenant)
alter table nucleo enable row level security;
alter table tarefa enable row level security;
alter table documento enable row level security;
alter table nota enable row level security;
alter table registro_pessoal enable row level security;
alter table evento enable row level security;

create policy "Authenticated read/write nucleo" on nucleo for all using (auth.role() = 'authenticated');
create policy "Authenticated read/write tarefa" on tarefa for all using (auth.role() = 'authenticated');
create policy "Authenticated read/write documento" on documento for all using (auth.role() = 'authenticated');
create policy "Authenticated read/write nota" on nota for all using (auth.role() = 'authenticated');
create policy "Authenticated read/write registro_pessoal" on registro_pessoal for all using (auth.role() = 'authenticated');
create policy "Authenticated read/write evento" on evento for all using (auth.role() = 'authenticated');

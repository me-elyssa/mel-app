# Mel — Planejamento Técnico Completo

## 1. Decisões Estratégicas

- **Stack destino:** Next.js + Supabase + Vercel (ou Netlify)
- **Justificativa:** Melhor integração com Vercel, roteamento nativo, API routes nativas, suporte integrado ao Supabase
- **Abordagem:** Fidelidade máxima ao design e funcionalidades do original (Base44 + Vite)
- **Dados:** Mockados durante o protótipo, integração real com Supabase em produção

---

## 2. Arquitetura de Dados

### Entidades (Tabelas Supabase)

#### `Nucleo`
- `id` (uuid, pk)
- `titulo` (text, required)
- `descricao` (text)
- `area` (text)
- `cor` (text, hex ou var CSS)
- `status` (enum: ativo, em_pausa, concluido)
- `ultima_revisao` (timestamp)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `Tarefa`
- `id` (uuid, pk)
- `titulo` (text, required)
- `descricao` (text)
- `status` (enum: pendente, em_progresso, concluido)
- `prioridade` (enum: baixa, media, alta)
- `complexidade` (enum: facil, media, complexa)
- `categoria` (text: processo, documento, pesquisa, reuniao, prazo, outro)
- `numero_processo` (text)
- `data_limite` (date)
- `nucleo_id` (uuid, fk → Nucleo, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `Documento`
- `id` (uuid, pk)
- `titulo` (text, required)
- `descricao` (text)
- `area` (enum: pesquisa, faculdade, trabalho, pessoal)
- `tipo` (enum: pdf, artigo, jurisprudencia, doutrina, modelo, livro, outro)
- `file_url` (text)
- `autores` (text)
- `ano` (text)
- `tags` (text[], array)
- `nucleo_id` (uuid, fk → Nucleo, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `Nota`
- `id` (uuid, pk)
- `titulo` (text)
- `conteudo` (text)
- `tipo` (enum: ideia, reflexao, link, trecho, referencia, insight, pessoal)
- `nucleo_id` (uuid, fk → Nucleo)
- `processada` (boolean, default: false)
- `file_url` (text)
- `file_name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `RegistroPessoal`
- `id` (uuid, pk)
- `titulo` (text, required)
- `conteudo` (text)
- `categoria` (enum: diario, metas, reflexao, projeto_pessoal, financeiro, saude, outro)
- `data` (date)
- `file_url` (text)
- `file_name` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### `Evento`
- `id` (uuid, pk)
- `titulo` (text, required)
- `descricao` (text)
- `data` (date, required)
- `hora_inicio` (time)
- `hora_fim` (time)
- `tipo` (enum: audiencia, reuniao, prazo, compromisso, outro)
- `local` (text)
- `tarefa_id` (uuid, fk → Tarefa, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

---

## 3. Estrutura de Rotas (Next.js)

```
/app
├── layout.tsx                 # Layout global com Sidebar
├── page.tsx                   # Dashboard (/)
├── biblioteca
│   └── page.tsx              # Biblioteca de Documentos
├── nucleos
│   └── page.tsx              # Núcleos de Conhecimento
├── pessoal
│   └── page.tsx              # Registros Pessoais
├── calendario
│   └── page.tsx              # Calendário
└── api
    └── [entidade]
        ├── route.ts          # GET, POST, PATCH, DELETE
        └── [id]
            └── route.ts      # GET, PATCH, DELETE específico
```

---

## 4. Componentes por Página

### 4.1 Dashboard (`/`)

**Responsabilidade:** Central de comando com visão geral e atalhos para as outras seções.

**Componentes:**
- `Saudação`: Mensagem personalizada "Bem-vinda"
- `StatsCard` (×4): Contadores clicáveis para Biblioteca, Núcleos, Pessoal, Calendário
- `KanbanBoard`: Exibição de tarefas por status com drag-and-drop
- `ProximosEventos`: Painel lateral com próximos 4-8 eventos

**Dados renderizados:**
- Contagem total de: Documentos, Núcleos, Registros Pessoais, Eventos
- Tarefas agrupadas por status (pendente, em_progresso, concluido)
- Próximos eventos ordenados por data

**Padrão de dados:**
```javascript
useQuery(["dashboard"], async () => ({
  documentos: await fetchDocumentos(),
  nucleos: await fetchNucleos(),
  registros: await fetchRegistros(),
  eventos: await fetchEventos(),
  tarefas: await fetchTarefas(),
}))
```

---

### 4.2 Biblioteca de Documentos (`/biblioteca`)

**Responsabilidade:** Gestão centralizada de arquivos, artigos e referências.

**Componentes:**
- `DocumentoCard`: Card que exibe documento (com ícone de tipo, área, autores, ano)
- `DocumentoForm`: Modal para criar/editar documento
  - Campos: título, área, tipo, descrição, autores, ano, arquivo/link, tags
  - Upload via Supabase Storage ou URL externa
  - TagInput para gerenciar tags
- `DocumentoSidebar`: Painel lateral deslizante com detalhes do documento
  - Visualizador de PDF via `<iframe>`
  - Metadados completos
  - Ações de editar/excluir

**Filtros:**
- Por **Área** (pesquisa, faculdade, trabalho, pessoal) — pills com ícone
- Por **Tipo** (pdf, artigo, jurisprudência, doutrina, modelo, livro, outro) — chips

**Padrão:**
```javascript
useQuery(["documentos"], fetchDocumentos)
useMutation(createDocumento, updateDocumento, deleteDocumento)
```

---

### 4.3 Núcleos de Conhecimento (`/nucleos`)

**Responsabilidade:** Agrupadores temáticos de conhecimento com vinculação de notas e documentos.

**Componentes:**

**Listagem:**
- `NucleoCard`: Card que exibe núcleo (com ícone Brain colorido, título, descricao, área, status)
  - Click → navega para detalhamento
  - Hover → revelaações de editar/excluir
- `NucleoForm`: Modal para criar/editar núcleo
  - Campos: título, descrição, área, status, cor identificadora
  - Color picker com 7 cores pré-definidas

**Detalhamento (master-detail na mesma página):**
- `NucleoDetalhe`: Exibe o núcleo selecionado com duas seções
  - Seção esquerda: Listagem de **Notas** vinculadas
    - `RegistroNucleoForm`: Captura rápida de notas (sem fricção)
      - Campos: título (opt), tipo (6 opções), conteúdo (texto ou arquivo)
      - Tipos: ideia, reflexão, link, trecho, referência, insight
    - Exibição em lista com opções de excluir
  - Seção direita: Listagem de **Documentos** vinculados (somente leitura)
- Botão de voltar para lista

**Padrão:**
```javascript
useQuery(["nucleos"], fetchNucleos)
useQuery(["notas-nucleo", nucleoId], fetchNotas)
useQuery(["docs-nucleo", nucleoId], fetchDocumentos)
useMutation(createNota, deleteNota, ...)
```

---

### 4.4 Registros Pessoais (`/pessoal`)

**Responsabilidade:** Diário, metas e reflexões com categorização.

**Componentes:**
- `RegistroCard`: Card expansível que exibe registro
  - Mostra: categoria (badge colorida), data, título, preview do conteúdo
  - Conteúdo truncado a 180 caracteres com botão "Ver mais / Ver menos"
  - Ações de editar/excluir no hover
- `RegistroForm`: Modal para criar/editar registro
  - Campos: título, categoria (7 opções), data (padrão hoje), conteúdo (texto ou arquivo)
  - Switcher texto/arquivo
  - Upload via Supabase Storage

**Filtros:**
- Por categoria: Todos, Diário, Metas, Reflexão, Projeto Pessoal, Financeiro, Saúde, Outro
- Exibição em lista vertical

**Cores de categoria:**
| Categoria | Background | Text |
|---|---|---|
| diario | `--sky` (#BEEAFF) | #2A7BA6 |
| metas | `--citrus` (#E6FFA6) | #6A8A1A |
| reflexao | `--lavender` (#E9E2FF) | #6B52C8 |
| projeto_pessoal | `--peach` (#FFD7B5) | #B87340 |
| financeiro | #E8F5E9 | #2E7D32 |
| saude | `--pink` (#F7C6E5) | #C870A8 |
| outro | #F3F5F9 | #545F6C |

**Padrão:**
```javascript
useQuery(["registros"], fetchRegistros)
useMutation(createRegistro, updateRegistro, deleteRegistro)
```

---

### 4.5 Calendário (`/calendario`)

**Responsabilidade:** Visualização mensal de eventos e tarefas com prazos.

**Componentes:**
- Grid mensal com navegação (anterior/próximo)
  - Exibe dias da semana iniciando no domingo
  - Cada célula mostra pontos coloridos para eventos e tarefas
  - Click em dia → abre painel lateral de detalhes
- `EventoModal`: Modal para criar/editar/excluir evento
  - Campos: título, data, tipo, horário (início/fim), local, descrição
  - Tipos: audiência, reunião, prazo, compromisso, outro
- Painel lateral
  - Seção 1: Detalhes do dia selecionado
    - Listagem de eventos do dia com cores por tipo
    - Listagem de tarefas com prazo no dia
  - Seção 2: Próximos eventos (próximos 8, ordenados por data)

**Cores por tipo de evento:**
| Tipo | Background | Text | Dot |
|---|---|---|---|
| audiencia | #DBEAFE | #1D4ED8 | #3B82F6 |
| reuniao | #F3E8FF | #7C3AED | #8B5CF6 |
| prazo | #FEE2E2 | #B91C1C | #EF4444 |
| compromisso | #FEF3C7 | #B45309 | #F59E0B |
| outro | #F3F5F9 | #4B5563 | #9CA3AF |

**Padrão:**
```javascript
useQuery(["eventos"], fetchEventos)
useQuery(["tarefas"], fetchTarefas)
useMutation(createEvento, updateEvento, deleteEvento)
```

---

## 5. Design System

### Cores Nomeadas (CSS Variables)

| Nome | Hex | Uso |
|---|---|---|
| `--primary-blue` | #1E63FF | Botões, links, accents |
| `--neon` | #D9FF63 | Item ativo na sidebar, highlights |
| `--text` | #0B0F15 | Texto principal |
| `--peach` | #FFD7B5 | Dashboard card, categoria |
| `--sky` | #BEEAFF | Dashboard card, categoria |
| `--citrus` | #E6FFA6 | Dashboard card, categoria |
| `--lavender` | #E9E2FF | Dashboard card, categoria |
| `--pink` | #F7C6E5 | Dashboard card, categoria |
| `--ink-400` | #9AA0A6 | Texto muted |
| `--border` | #E6EAF0 | Bordas padrão |
| `--sidebar-bg` | #EFF3F7 | Fundo sidebar |
| `--text-primary` | #0B0F15 | Texto principal |
| `--text-secondary` | #545F6C | Texto secundário |
| `--text-muted` | #6A7686 | Texto muted |

### Tipografia

- **Font:** Questrial (Google Fonts) + fallback Inter
- **Letter-spacing:** `-0.02em` em headings, `-0.01em` no body
- **h1:** `clamp(1.75rem, 5vw, 2.5rem)`, weight 800
- **h2:** `clamp(1.5rem, 4vw, 2rem)`, weight 700
- **h3:** `clamp(1.125rem, 3vw, 1.5rem)`, weight 600
- **Body:** font-size normal, weight 400

### Componentes UI Padrão

- **Input:** height 48px, border-radius 12px, border 1px solid #E6EAF0
- **Button:** bg-[#1E63FF], hover:bg-[#1552D6], height 48px, rounded-[12px]
- **Card:** border-radius 16px-20px, border 1px solid #E6EAF0, padding 16px-20px
- **Modal:** fixed overlay com `bg-black/50`, animação Framer Motion

---

## 6. Padrões de Implementação

### Data Fetching com React Query

```typescript
// Exemplo: Fetch de documentos
useQuery(
  ["documentos"],
  () => supabase.from("Documento").select("*"),
  { staleTime: 0 }
)

// Exemplo: Mutation com invalidação
useMutation(
  (data) => supabase.from("Documento").insert(data),
  { onSuccess: () => queryClient.invalidateQueries(["documentos"]) }
)
```

### Formulários Modais

Padrão universal via Framer Motion:
1. `<AnimatePresence>` envolvendo o modal
2. `initial={{ opacity: 0, scale: 0.96, y: 16 }}`
3. `animate={{ opacity: 1, scale: 1, y: 0 }}`
4. `exit={{ opacity: 0, scale: 0.96 }}`
5. Backdrop com `onClick` para fechar

### Drag-and-drop (Kanban)

- Biblioteca: `@hello-pangea/dnd`
- `<DragDropContext onDragEnd={handleDragEnd}>`
- Cada coluna é um `<Droppable droppableId={statusId}>`
- Cada card é um `<Draggable>`

### Upload de Arquivos

```typescript
const { file_url } = await supabase.storage
  .from("bucket-name")
  .upload(`path/${file.name}`, file)
```

---

## 7. Estrutura do Projeto

```
mel-app/
├── app/
│   ├── layout.tsx              # Layout global com Sidebar
│   ├── page.tsx                # Dashboard
│   ├── biblioteca/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── DocumentoCard.tsx
│   │       ├── DocumentoForm.tsx
│   │       └── DocumentoSidebar.tsx
│   ├── nucleos/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── NucleoCard.tsx
│   │       ├── NucleoForm.tsx
│   │       ├── NucleoDetalhe.tsx
│   │       ├── RegistroNucleoForm.tsx
│   │       └── NucleoCard.tsx
│   ├── pessoal/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── RegistroCard.tsx
│   │       └── RegistroForm.tsx
│   ├── calendario/
│   │   ├── page.tsx
│   │   └── components/
│   │       ├── CalendarioGrid.tsx
│   │       └── EventoModal.tsx
│   └── api/
│       └── [...]/
├── components/
│   ├── shared/
│   │   ├── Layout.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   └── ...
│   ├── ui/
│   │   ├── Input.tsx
│   │   ├── Button.tsx
│   │   ├── TagInput.tsx
│   │   └── ...
│   └── dashboard/
│       ├── StatsCard.tsx
│       ├── KanbanBoard.tsx
│       ├── TarefaCard.tsx
│       └── ProximosEventos.tsx
├── lib/
│   ├── supabase.ts
│   ├── queryClient.ts
│   └── utils.ts
├── styles/
│   ├── globals.css
│   └── ...
├── types/
│   └── entities.ts
└── package.json
```

---

## 8. Dependências Principais

```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "@tanstack/react-query": "^5.0.0",
  "@supabase/supabase-js": "^2.0.0",
  "framer-motion": "^10.0.0",
  "@hello-pangea/dnd": "^16.0.0",
  "date-fns": "^2.30.0",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.0.0",
  "clsx": "^2.0.0"
}
```

---

## 9. Considerações Especiais

### Autenticação
- Supabase Auth (integrado nativamente)
- Proteção de rotas via middleware Next.js
- Logout via `supabase.auth.signOut()`

### Storage de Arquivos
- Supabase Storage para PDFs, imagens, documentos
- Limite de upload: ≤5MB (configurável)
- Estrutura de pastas: `/documentos`, `/registros`, `/notas`

### Real-time Sync
- React Query handles refetch automático após mutações
- Considerar Supabase Realtime para atualizações colaborativas (future)

### Performance
- Skeleton loaders durante fetch
- Paginação para listas longas (future)
- Memoização de componentes pesados (NucleoDetalhe, Calendario)

---

## 10. Próximas Fases

1. **Fase 1 (Atual):** Planejamento completo ✓
2. **Fase 2:** Setup inicial Next.js + Supabase
3. **Fase 3:** Implementação de cada página
4. **Fase 4:** Testes e refinamentos
5. **Fase 5:** Deploy no Vercel

---

**Documento atualizado:** Junho 2025
**Versão:** 1.0

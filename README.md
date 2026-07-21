# Mel

App de organização pessoal e jurídica — Dashboard, Biblioteca de Documentos, Núcleos de Conhecimento, Registros Pessoais e Calendário. Next.js 16 (App Router) + Supabase + Tailwind v3.

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Criar projeto no Supabase

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra o **SQL Editor** e rode o conteúdo de [`supabase/schema.sql`](supabase/schema.sql) — cria as 6 tabelas (`nucleo`, `tarefa`, `documento`, `nota`, `registro_pessoal`, `evento`) e as policies de RLS.
3. Em **Storage**, crie 3 buckets públicos (leitura pública, escrita autenticada):
   - `documentos` — arquivos da Biblioteca
   - `notas` — anexos das notas de Núcleos
   - `registros` — anexos dos Registros Pessoais

### 3. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha com as credenciais reais do seu projeto (Settings → API no painel Supabase):

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
```

Sem isso, o app builda e renderiza (com `.env.local` placeholder), mas nenhuma operação de dados funciona de fato.

### 4. Criar seu usuário

O app exige login (Supabase Auth). Crie seu usuário em **Authentication → Users → Add user** no painel do Supabase (marque "Auto Confirm User"), ou via API:

```bash
curl -X POST "https://SEU_PROJETO.supabase.co/auth/v1/admin/users" \
  -H "apikey: SUA_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer SUA_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"voce@email.com","password":"sua-senha","email_confirm":true}'
```

### 5. Rodar localmente

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000) — você será redirecionada para `/login`.

## Estrutura

- `app/(app)/` — páginas autenticadas (App Router): `/`, `/biblioteca`, `/nucleos`, `/pessoal`, `/calendario`, com `AppShell` (sidebar)
- `app/login/` — tela de login, sem sidebar
- `proxy.ts` — proteção de rotas (equivalente ao antigo `middleware.ts`, renomeado no Next.js 16): redireciona sem sessão → `/login`
- `components/` — componentes por domínio (`dashboard/`, `biblioteca/`, `nucleos/`, `pessoal/`, `calendario/`, `shared/`, `ui/`)
- `lib/hooks/` — hooks de dados (React Query + Supabase), um arquivo por entidade
- `lib/supabase.ts` / `lib/supabaseServer.ts` — clientes Supabase (browser/server)
- `types/entities.ts` — tipos TypeScript das 6 entidades
- `supabase/schema.sql` — schema SQL de referência

## Notas de escopo

- Login é simples (e-mail/senha), sem fluxo de cadastro público — usuários são criados manualmente no painel/API do Supabase. Adequado para uso pessoal (uma única usuária).
- Dark mode, paginação avançada e Supabase Realtime estão fora do escopo desta fase.

## Deploy

Recomendado: [Vercel](https://vercel.com/new) (integração nativa com Next.js). Configure as mesmas variáveis de ambiente no painel do projeto antes do primeiro deploy.

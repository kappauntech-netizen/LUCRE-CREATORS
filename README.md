# Lucre Creators

Fundação da **Creator Commerce Network** da Lucre. O repositório contém quatro superfícies:

- website público e candidatura;
- Creator App mobile-first;
- Brand App com limites multi-tenant;
- Lucre Control Center (Admin).

A interface inclui a logo vetorial oficial da Lucre e seleção global entre português do Brasil, português de Portugal, espanhol, inglês, francês e italiano. A preferência de idioma e o tema são preservados no dispositivo.

Os layouts e limites de acesso das três áreas autenticadas estão implementados. Os motores avançados ainda não foram construídos; os painéis vazios mostram `—` e estados de configuração, sem métricas comerciais inventadas.

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS 4 + componentes no padrão shadcn/ui
- Lucide Icons
- Supabase Auth, PostgreSQL e Storage (configuração externa)
- Vercel como destino principal

## Rodar localmente

Requisitos: Node.js 22 e pnpm 11.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Sem as variáveis do Supabase, o website e as áreas internas funcionam em **modo de prévia**, sem persistir dados e sem liberar login real.

## Configurar o Supabase

1. Crie um projeto no Supabase.
2. Execute, em ordem, `0001_foundation.sql`, `0002_platform_foundation.sql` e `0003_storage_security.sql` no SQL Editor.
3. Copie `.env.example` para `.env.local` e preencha URL, anon key e service role key.
4. Defina `ADMIN_LOGIN_EMAIL` e uma **nova senha forte** em `ADMIN_INITIAL_PASSWORD`.
5. Crie o administrador:

```bash
pnpm seed:admin
```

O alias padrão de entrada é `lucre`. A senha nunca fica no código ou na migration; o Supabase Auth armazena somente o hash seguro. Como uma senha foi exposta na conversa de planejamento, não a reutilize.

## Implantar na Vercel

1. Envie apenas o conteúdo desta pasta para a raiz do novo repositório GitHub.
2. Na Vercel, importe o repositório e mantenha **Framework Preset: Next.js** e **Root Directory: `./`**.
3. Cadastre todas as variáveis de `.env.example` necessárias em **Project Settings → Environment Variables**, incluindo `RATE_LIMIT_SALT` e `NEXT_PUBLIC_SITE_URL`.
4. Faça o deploy. O comando utilizado será `pnpm build`.

O arquivo `.openai/hosting.json` existe somente para a prévia local do Codex/Sites. O projeto continua compatível com Vercel por usar os scripts oficiais do Next.js.

## Segurança

- `SUPABASE_SERVICE_ROLE_KEY` é usada somente em rotas server-side.
- O formulário público escreve por API protegida; o navegador nunca recebe a service role.
- RBAC, multi-tenancy e RLS são aplicados desde a fundação.
- Rate limits são persistentes e os logs críticos são imutáveis.
- Roles e status não podem ser promovidos pelo próprio usuário.
- Dados financeiros e métricas reais não possuem mocks persistidos.

## Escopo atual

Comece por [docs/IMPLEMENTATION_SUMMARY.md](docs/IMPLEMENTATION_SUMMARY.md). A pasta `docs/` também contém os mapas de arquivos, banco, rotas, componentes, autenticação, RBAC e Design System exigidos no handoff da Foundation.

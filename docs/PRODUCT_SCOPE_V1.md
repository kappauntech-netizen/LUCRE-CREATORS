# Product Scope — V1 Foundation

## Loop prioritário

`creator → candidatura → aprovação → oportunidade → campanha → conteúdo → resultado → pagamento → repetição`

## Implementado nesta fundação

- Design system Lucre / Creators com dark e light mode.
- Website público, narrativa inicial e CTAs separados para creator e marca.
- Candidatura do creator e briefing inicial da marca preparados para persistência.
- Login Supabase com alias administrativo e roteamento por role.
- RBAC com nove papéis e proteção server-side das áreas internas.
- Creator App mobile-first com overview e módulos essenciais.
- Lucre Control Center com visão operacional, creators, marcas, campanhas, revisão, financeiro e analytics.
- Banco PostgreSQL para os objetos do loop principal.
- Seed seguro do primeiro `SUPER_ADMIN`.

## Estados vazios intencionais

O produto não apresenta creators, campanhas, receita ou performance fictícia. Enquanto o banco não possui eventos reais, os dashboards exibem `—` e estados vazios explicativos.

## Fora da V1

- Brand Dashboard autônomo.
- Marketplace e matching automatizado.
- Chat tripartite.
- App nativo, PWA e push.
- Pagamentos automatizados.
- Integrações completas com redes sociais.
- IA, Academy, Community e gamificação operacional.
- Remuneração multinível de referrals.

Esses itens continuam previstos no roadmap, mas não bloqueiam a validação do loop principal.

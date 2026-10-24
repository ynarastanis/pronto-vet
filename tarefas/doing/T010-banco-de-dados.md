# T010 — Banco Neon e implementação Prisma dos serviços

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T005–T009 e checkpoint de validação aprovado pelo usuário
- **Referência na spec:** §5, §9, §11, §13
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T010* (passos, interfaces e testes exatos)

## Objetivo

Modelos da spec no Prisma 7 com adapter Neon, migration inicial, implementação Prisma do contrato de serviços (erros P2002/P2025 → erros de domínio) e seed idempotente a partir dos dados de demonstração.

## Critérios de aceite

- [ ] Modelos idênticos à spec §5
- [ ] Migration inicial aplicada no branch de dev do Neon
- [ ] Seed rodado duas vezes sem duplicatas
- [ ] Fluxos de T007–T009 repetidos sem FONTE_DADOS, com o mesmo comportamento do mock
- [ ] Nenhum import de Prisma fora de src/servicos/prisma/, src/lib/db.ts e prisma/
- [ ] `npm run build` passando
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Herdado da revisão da T005 (paridade memória ↔ Prisma; não há teste automático contra o banco, então conferir manualmente):
- **Ordenação:** a collation do Neon costuma ser `C`/`C.UTF-8` (conferir com `SHOW lc_collate`), que ordena por bytes. Extrair um `compararNomes(a, b)` compartilhado em `src/servicos/` (usado pela memória também) e ordenar em JS após a consulta.
- **Busca:** aplicar `trim()` no termo; `ILIKE` com ctype `C` não ignora maiúsculas fora do ASCII ("ção" × "ÇÃO") — se for o caso, filtrar em JS com a mesma regra da memória; confirmar que `%` e `_` são tratados literalmente.
- **Erros:** P2002 só vira `ErroNomeDuplicado` se `meta.target` for o `nome`; P2003 (procedimento excluído durante o upsert) → `ErroNaoEncontrado`.

Decisões do Líder para esta execução (2026-10-24):
- **Pré-requisitos atendidos:** checkpoint aprovado; `.env.local` já tem `DATABASE_URL` (pooled) e `DATABASE_URL_UNPOOLED` (direta) do branch `development` do Neon (ADR-014). **Não leia nem imprima os valores**; para conferir, mostre só nomes e hosts.
- **Versões:** `prisma`, `@prisma/client` e `@prisma/adapter-neon` em **7.10.1** fixo (a tag `latest` do `prisma` é a 8.0 rc — não usar). `@neondatabase/serverless` 1.2.x se o adapter exigir.
- **Nome da variável direta:** `DATABASE_URL_UNPOOLED` (não `DIRECT_URL`) no `prisma.config.ts`.
- **Build:** o script `build` continua `next build` (a CI não tem banco). Criar o script **`vercel-build`**: `prisma generate && prisma migrate deploy && next build` — a Vercel usa `vercel-build` quando existe, então migrations rodam só lá (Preview → branch do PR; Production → branch `production`). `postinstall: prisma generate` para a CI tipar.
- **Seed:** só para o branch `development` e uso local (`npm run db:seed`); **não** roda na Vercel.
- **Verificação contra o banco:** como só há testes unitários (ADR-007), escreva um script de verificação **fora do repositório** (scratchpad) que exercita `servicosPrisma()` contra o branch `development` com os mesmos casos dos testes de contrato da memória (ordenação, busca com acento/maiúscula/`%`/`_`, duplicado no criar e no atualizar, inexistentes, cascata, upsert, cópias) e limpa o que criou. Cole a saída na Implementação. Não é preciso fazer login no app.
- **Verificação do app:** `FONTE_DADOS` removido só do processo (`FONTE_DADOS= npx next build` / `next start` em porta livre), conferindo por `curl` que `/entrar` responde e que `/` sem sessão redireciona — sem ler a senha.
- **Paridade:** o checklist "Herdado da revisão da T005" acima é obrigatório; registre na Implementação o `lc_collate` encontrado e a decisão para ordenação e busca.
- **Branch:** `t010-banco` (já criado). Commits `T010: ...`. Push e PR são do Líder.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```


# T010 — Banco Neon e implementação Prisma dos serviços

- **Status:** concluída
- **Prioridade:** P1
- **Depende de:** T005–T009 e checkpoint de validação aprovado pelo usuário
- **Referência na spec:** §5, §9, §11, §13
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T010* (passos, interfaces e testes exatos)

## Objetivo

Modelos da spec no Prisma 7 com adapter Neon, migration inicial, implementação Prisma do contrato de serviços (erros P2002/P2025 → erros de domínio) e seed idempotente a partir dos dados de demonstração.

## Critérios de aceite

- [x] Modelos idênticos à spec §5
- [x] Migration inicial aplicada no branch de dev do Neon
- [x] Seed rodado duas vezes sem duplicatas
- [x] Fluxos de T007–T009 repetidos sem FONTE_DADOS, com o mesmo comportamento do mock
- [x] Nenhum import de Prisma fora de src/servicos/prisma/, src/lib/db.ts e prisma/
- [x] `npm run build` passando
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

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

- **Resumo:** Schema Prisma 7.10.1 idêntico à spec §5 e migration `20261024232923_inicial` aplicada no branch `development` do Neon (hosts: `ep-bold-recipe-b6nc0kpx[-pooler].c-2.sa-east-1.aws.neon.tech`). `src/lib/db.ts` cria o único `PrismaClient` (adapter `PrismaNeon`, singleton em `globalThis`). `servicosPrisma()` implementa o contrato e está ligado em `servicos()`. Seed idempotente (`npm run db:seed`) rodou duas vezes sem duplicatas (2 procedimentos, 2 profissionais nas duas execuções). Scripts: `postinstall: prisma generate`, `db:migrate`, `db:seed`, `vercel-build` (`prisma generate && prisma migrate deploy && next build`); `build` continua `next build`.
- **`lc_collate` encontrado:** `C.UTF-8` (`lc_ctype` também `C.UTF-8`; PostgreSQL 18.6). Ordena por bytes, então não serve para pt-BR.
- **Decisões de paridade memória ↔ Prisma:**
  - **Ordenação:** `compararNomes` (`localeCompare` pt-BR) extraído para `src/servicos/nomes.ts`, usado pela memória e pelo Prisma; o Prisma ordena em JS depois da consulta (profissionais, `listar`, `listarCompletos`). Conferido no banco: Ágata, andré, Bruno.
  - **Busca:** `nomeContemTermo` (`trim()` no termo + `toLowerCase().includes`) compartilhado; o Prisma busca os procedimentos (id, nome, flag de descrição) e filtra em JS. Não usei `ILIKE` porque, com ctype `C`, "ção" × "ÇÃO" não casaria; `%` e `_` ficam literais por construção. Verificado no banco: "ção", "ÇÃO", termo com espaços, `%` e `_`.
  - **Erros:** `traduzirErroPrisma` (pela forma do objeto): P2002 só vira `ErroNomeDuplicado` se o alvo contiver `nome` (aceita `meta.target` e `meta.driverAdapterError.cause.constraint.fields`, que é o formato real do adapter Neon, visto no banco); P2025 e P2003 viram `ErroNaoEncontrado`; outros erros voltam intactos.
  - **Demais:** nome do procedimento é aparado na escrita (igual à memória); `excluir` com `deleteMany` (no-op se inexistente) e cascata pelo FK; `salvarDescricaoAnestesica` confere o procedimento antes e faz `upsert` por `procedimentoId`; os retornos só têm os campos de domínio (sem datas, `procedimentoId`). O seed usa `update: {}` para não sobrescrever edições feitas depois.
- **Arquivos:** `prisma/schema.prisma`, `prisma.config.ts` (lê `.env.local` via dotenv, URL `DATABASE_URL_UNPOOLED`, seed), `prisma/migrations/20261024232923_inicial/`, `prisma/seed.ts`, `prisma/carregar-env.ts`, `src/lib/db.ts`, `src/servicos/nomes.ts` (+ teste), `src/servicos/prisma/{erros,erros.test,profissionais,procedimentos,index}.ts`, `src/servicos/index.ts`, `src/servicos/memoria/{procedimentos,profissionais}.ts` (usam `nomes.ts`), `package.json`/`package-lock.json`, `.gitignore` (`/src/generated/`), `eslint.config.mjs` (ignora `src/generated/**`), `ARCHITECT.md` (ADR-016).
- **Desvios do plano:**
  1. Dependências novas em `devDependencies`: `tsx` e `dotenv` (previstas no plano, registradas na ADR-016). `prisma`, `@prisma/client` e `@prisma/adapter-neon` fixos em 7.10.1 (`@neondatabase/serverless` 1.2.0 veio pelo adapter).
  2. `db:seed` roda `tsx --conditions=react-server`, senão o `import "server-only"` de `db.ts` lança fora do Next.
  3. Filtro/ordenação em JS em vez de `ILIKE`/`orderBy` (ver acima).
  4. O `migrate dev` criou o banco shadow sem problemas no Neon; nenhum recurso foi criado manualmente.
- **Commits:** `20d1c68` extrai compararNomes e nomeContemTermo; `53a5049` schema, migration e dependências; `f42def7` serviços Prisma e tradução de erros; `b824269` seed e ADR-016; mais o commit desta seção da tarefa.
- **Verificação contra o banco** (script fora do repositório, em `C:\Users\gabri\AppData\Local\Temp\claude\C--Users-gabri-code-pronto-vet\e314720b-2716-4345-854b-614cd913d484\scratchpad\t010\verificar.ts`; usa prefixo `ZZ-VERIF-T010 ` e limpa o que criou; "restos" = 0):

```
lc_collate(datcollate)=C.UTF-8 lc_ctype=C.UTF-8 provider=b PostgreSQL 18.6 (fd34222) on aarch64-unknown-linux-gnu
P2002 bruto: {"code":"P2002","meta":{"driverAdapterError":{"name":"DriverAdapterError","cause":{"originalCode":"23505", ... "kind":"UniqueConstraintViolation","constraint":{"fields":["nome"]},"table":"ProcedimentoCirurgico"}},"modelName":"ProcedimentoCirurgico"}}
OK    profissionais ordenados pt-BR (Ágata, andré, Bruno)
OK    atualiza profissional
OK    profissional sem createdAt/updatedAt
OK    atualizar profissional inexistente -> ErroNaoEncontrado
OK    exclui profissional
OK    excluir profissional inexistente e no-op
OK    criar retorna Procedimento de dominio, sem descricao
OK    nome e aparado ao criar
   ordem: ["ZZ-VERIF-T010 100% _FELINO_","ZZ-VERIF-T010 CASTRAÇÃO","ZZ-VERIF-T010 OHE ELETIVA FELINA"]
OK    busca pelo prefixo traz os 3
OK    busca sem diferenciar maiusculas (ASCII)
OK    busca com acento minusculo casa CASTRAÇÃO
OK    busca com trim
OK    busca 'ção' casa CASTRAÇÃO
OK    busca 'ÇÃO' casa CASTRAÇÃO
OK    '%' e literal
OK    '_' e literal
OK    resumo: sem descricao
OK    criar duplicado -> ErroNomeDuplicado
OK    criar duplicado com espacos -> ErroNomeDuplicado
OK    atualizar para nome existente -> ErroNomeDuplicado
OK    atualizar mantendo o proprio nome
OK    atualizar procedimento inexistente -> ErroNaoEncontrado
OK    obter inexistente -> null
OK    salvar descricao em inexistente -> ErroNaoEncontrado
OK    upsert cria descricao
OK    upsert atualiza descricao (mpa -> null)
OK    descricao sem id/procedimentoId/datas
OK    uma unica descricao por procedimento
OK    resumo: com descricao
OK    listarCompletos so traz com descricao
OK    retornos sao copias isoladas
OK    excluir procedimento
OK    cascata remove descricao
OK    excluir procedimento inexistente e no-op
OK    seed visivel via listarCompletos
restos apos limpeza: 0
TUDO OK
```

- **Seed (duas execuções):** `Seed concluído: 2 procedimento(s), 2 profissional(is).` nas duas.
- **Verificação do app sem `FONTE_DADOS`** (`FONTE_DADOS= npx next build` e `next start -p 3457`, encerrado depois): `/entrar` → 200; `/` → 307 para `/entrar`; `/procedimentos` → 307 para `/entrar`. Login não foi exercitado (senha não lida); os fluxos de dados foram cobertos pelo script acima, que chama a mesma camada de serviços usada pelas páginas e actions.
- **Saída de lint / typecheck / testes / build** (build com `FONTE_DADOS=memoria DATABASE_URL= DATABASE_URL_UNPOOLED=`, como na CI; `prisma generate` também confirmado com as URLs vazias):

```
> eslint .            (sem saída, exit 0)
> tsc --noEmit        (sem saída, exit 0)
 Test Files  15 passed (15)
      Tests  124 passed (124)
✓ Compiled successfully in 2.4s
  Finished TypeScript in 5.9s ...
✓ Generating static pages using 10 workers (8/8) in 1135ms
Route (app): / , /_not-found , /entrar , /procedimentos , /procedimentos/[id] , /procedimentos/novo , /profissionais
```

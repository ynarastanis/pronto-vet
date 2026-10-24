# T005 — Camada de serviços e mock em memória

- **Status:** concluída
- **Prioridade:** P1
- **Depende de:** T002, T003
- **Referência na spec:** §13
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T005* (passos, interfaces e testes exatos)

## Objetivo

Contratos `ServicoProfissionais` / `ServicoProcedimentos`, erros de domínio, `escolherFonte`, `servicos()` e a implementação em memória com dados de demonstração, para validar a experiência antes do banco.

## Critérios de aceite

- [x] Tipos e interfaces idênticos à spec §13
- [x] Todos os testes de contrato e de `escolherFonte` listados no plano
- [x] `FONTE_DADOS` ausente ou diferente de `memoria` nunca usa o mock
- [x] Dados de demonstração com um procedimento completo, um incompleto e um profissional de cada papel
- [x] `.env.example` com `FONTE_DADOS`
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Pode rodar em paralelo com T006. Nada de Prisma nesta tarefa.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** contratos da spec §13, erros de domínio, escolherFonte (só "memoria" ativa o mock), servicos() com server-only apenas em index.ts, mock em memória com dados de demonstração (singleton em globalThis, clones via structuredClone).
- **Arquivos:** src/servicos/{tipos,erros,fonte,index}.ts, src/servicos/memoria/{dados-demonstracao,profissionais,procedimentos,index}.ts, testes fonte.test.ts e memoria/memoria.test.ts, .env.example.
- **Commits:** c095957 (T005: adiciona camada de serviços com implementação em memória)
- **Saída de lint / typecheck / testes:**

```
vitest run src/servicos (antes da implementação): 2 arquivos falharam (módulos ausentes)
vitest run src/servicos (depois): Test Files 2 passed, Tests 20 passed
npm run lint: sem erros
npm run typecheck: sem erros
npm test: Test Files 7 passed, Tests 55 passed
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado
- **Verificado pelo Revisor:** `npx vitest run src/servicos` → 2 arquivos, 20 testes passando; `npm run lint` e `npm run typecheck` sem erros; `npm test` → 7 arquivos, 55 testes passando. `ProcedimentoCompleto` atribuível a `DadosProcedimento` (conferido com `tsc --strict` em arquivo à parte, inclusive como array). Os 9 campos anestésicos da demonstração são idênticos à fixture de `src/lib/texto/anestesico.test.ts`. Tipos e interfaces batem com a spec §13 e com o que T007, T008 e T009 consomem. `escolherFonte` falha fechado: só `memoria` (com trim e sem diferenciar maiúsculas) ativa o mock; `undefined`, `""`, `"mock"` e `"memória"` caem em `prisma`, que lança a mensagem exata da spec.
- **Bloqueantes:** nenhum.
- **Sugestões opcionais / observações:**
  - [ ] `src/servicos/memoria/dados-demonstracao.ts:13` — os limites do texto cirúrgico batem com o plano (começa em "Incisão retro umbilical com lâmina n° 23", termina em "…dermorrafia nylon 2-0 sultan."; a prescrição começa em "Prescrito:"), mas a spec e o plano não trazem o texto completo, então não dá para conferir palavra a palavra. "pediculos ocaríamos" parece corretor automático de "pedículos ovarianos"; "continuo" e "Sid" também podem ter vindo assim do original — Líder: conferir com o texto que o usuário enviou e manter fiel ao original.
  - [ ] `src/servicos/memoria/profissionais.ts:7`, `procedimentos.ts:21`, `procedimentos.ts:32` — **para T010:** `localeCompare(..., "pt-BR")` não é reproduzido por `orderBy: { nome: "asc" }` em todas as collations. Com collation `C`/`C.UTF-8` (comum no Neon; conferir com `SHOW lc_collate`) a ordem sai por bytes: `["Bruno","OHE","Zé","abc","andré","ohe","Ágata","Élio"]`, contra a ordem pt-BR `["abc","Ágata","andré","Bruno","Élio","ohe","OHE","Zé"]`. Prisma não aceita `COLLATE` no `orderBy`. Sugestão: extrair agora um `compararNomes(a, b)` em `src/servicos/` e fazer T010 ordenar em memória depois da consulta, já que os volumes são pequenos. Isso também resolve a ordem não determinística entre nomes iguais de profissionais.
  - [ ] `src/servicos/memoria/procedimentos.ts:20` — **para T010:** `contains` + `mode: "insensitive"` vira `ILIKE`. (a) A busca precisa receber `busca.trim()`, porque o plano de T010 não menciona trim e a memória faz. (b) Com ctype `C`, o `ILIKE` só ignora maiúsculas em ASCII, então "ção" não acharia "ÇÃO", enquanto `toLowerCase()` acha. (c) Conferir se o Prisma escapa `%` e `_` em `contains`, porque a memória trata esses caracteres literalmente.
  - [ ] `src/servicos/memoria/procedimentos.ts:7` — a igualdade exata após trim equivale ao `@unique` do Postgres com collation determinística (diferencia maiúsculas). OK. **Para T010:** um upsert concorrente em `DescricaoAnestesica.procedimentoId` (`@unique`) também gera P2002, e `traduzirErroPrisma` o transformaria em `ErroNomeDuplicado`. Checar `meta.target` ou mapear P2002 para `ErroNomeDuplicado` só em `criar`/`atualizar` de procedimento. Já um P2003 (procedimento excluído entre a checagem e o upsert) não é mapeado e vira erro genérico. Aceitável, mas vale saber.
  - [ ] `src/servicos/memoria/profissionais.ts:10` — `procedimentos` faz trim do nome e `profissionais` não. O Zod já faz trim nos dois, então não há bug. É só uma inconsistência, e o Prisma também não fará trim.
  - [ ] `src/servicos/memoria/memoria.test.ts:165` — o isolamento das cópias só é testado em `obter`. Poderia cobrir também `listar`/`listarCompletos` e `profissionais.listar`. A implementação está correta (todos usam `structuredClone` ou criam objetos novos).

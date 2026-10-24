# T005 — Camada de serviços e mock em memória

- **Status:** implementando
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
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [x] `arquivo:linha` — …

# T005 — Camada de serviços e mock em memória

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T002, T003
- **Referência na spec:** §13
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T005* (passos, interfaces e testes exatos)

## Objetivo

Contratos `ServicoProfissionais` / `ServicoProcedimentos`, erros de domínio, `escolherFonte`, `servicos()` e a implementação em memória com dados de demonstração, para validar a experiência antes do banco.

## Critérios de aceite

- [ ] Tipos e interfaces idênticos à spec §13
- [ ] Todos os testes de contrato e de `escolherFonte` listados no plano
- [ ] `FONTE_DADOS` ausente ou diferente de `memoria` nunca usa o mock
- [ ] Dados de demonstração com um procedimento completo, um incompleto e um profissional de cada papel
- [ ] `.env.example` com `FONTE_DADOS`
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Pode rodar em paralelo com T006. Nada de Prisma nesta tarefa.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [ ] `arquivo:linha` — …

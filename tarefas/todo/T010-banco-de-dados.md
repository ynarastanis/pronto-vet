# T010 — Banco Neon e implementação Prisma dos serviços

- **Status:** a fazer
- **Prioridade:** P2
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

PRÉ-REQUISITOS: checkpoint de validação aprovado; o Líder pede ao usuário as URLs do Neon (pooled e direta) de um branch de dev antes de despachar. Usar Prisma 7.10.x, não a 8.0 rc.

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

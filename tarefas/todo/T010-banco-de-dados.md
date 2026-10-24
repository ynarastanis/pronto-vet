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

Herdado da revisão da T005 (paridade memória ↔ Prisma; não há teste automático contra o banco, então conferir manualmente):
- **Ordenação:** a collation do Neon costuma ser `C`/`C.UTF-8` (conferir com `SHOW lc_collate`), que ordena por bytes. Extrair um `compararNomes(a, b)` compartilhado em `src/servicos/` (usado pela memória também) e ordenar em JS após a consulta.
- **Busca:** aplicar `trim()` no termo; `ILIKE` com ctype `C` não ignora maiúsculas fora do ASCII ("ção" × "ÇÃO") — se for o caso, filtrar em JS com a mesma regra da memória; confirmar que `%` e `_` são tratados literalmente.
- **Erros:** P2002 só vira `ErroNomeDuplicado` se `meta.target` for o `nome`; P2003 (procedimento excluído durante o upsert) → `ErroNaoEncontrado`.

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


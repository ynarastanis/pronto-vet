# T007 — Cadastro de profissionais

- **Status:** a fazer
- **Prioridade:** P2
- **Depende de:** T003, T005, T006, T012
- **Referência na spec:** §5, §7
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T007* (passos, interfaces e testes exatos)

## Objetivo

Página /profissionais com adicionar, editar e excluir, em duas colunas por papel.

## Critérios de aceite

- [ ] Toda action chama exigirSessao() primeiro
- [ ] Textos de interface exatamente como no plano
- [ ] `npm run build` passando
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- UI: carregar o skill `frontend-design:frontend-design` e seguir `docs/design/sistema-visual.md`; usar `CabecalhoPagina`, `EstadoVazio` e `Ficha` da T012. Animações conforme a seção "Movimento".

- ADR-012: páginas em `src/app/(app)/`; `await exigirSessao()` é a **primeira linha de cada `page.tsx` e de cada action**, antes de ler dados, e fica **fora** de qualquer `try/catch` (o `redirect()` lança `NEXT_REDIRECT`). O layout do grupo sozinho **não** protege navegações no cliente.

Pode rodar em paralelo com T008. Quem chegar primeiro cria src/components/confirmar-exclusao.tsx.

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

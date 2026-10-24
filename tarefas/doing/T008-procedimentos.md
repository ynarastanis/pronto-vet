# T008 — Cadastro de procedimentos e descrição anestésica

- **Status:** implementando
- **Prioridade:** P2
- **Depende de:** T003, T005, T006, T012
- **Referência na spec:** §5, §7, §9
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T008* (passos, interfaces e testes exatos)

## Objetivo

Lista com busca e selo, criação, edição, exclusão e descrição anestésica 1:1 (upsert).

## Critérios de aceite

- [ ] Nome duplicado mostra "Já existe um procedimento com este nome."
- [ ] Id inexistente → página não encontrada
- [ ] Opcionais vazios salvos como null
- [ ] `npm run build` passando
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- UI: carregar o skill `frontend-design:frontend-design` e seguir `docs/design/sistema-visual.md`; usar `CabecalhoPagina`, `EstadoVazio` e `Ficha` da T012. Animações conforme a seção "Movimento".

- ADR-012: páginas em `src/app/(app)/`; `await exigirSessao()` é a **primeira linha de cada `page.tsx` e de cada action**, antes de ler dados, e fica **fora** de qualquer `try/catch` (o `redirect()` lança `NEXT_REDIRECT`). O layout do grupo sozinho **não** protege navegações no cliente.

Pode rodar em paralelo com T007.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```


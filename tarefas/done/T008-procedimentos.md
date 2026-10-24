# T008 — Cadastro de procedimentos e descrição anestésica

- **Status:** concluída
- **Prioridade:** P2
- **Depende de:** T003, T005, T006, T012
- **Referência na spec:** §5, §7, §9
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T008* (passos, interfaces e testes exatos)

## Objetivo

Lista com busca e selo, criação, edição, exclusão e descrição anestésica 1:1 (upsert).

## Critérios de aceite

- [x] Nome duplicado mostra "Já existe um procedimento com este nome."
- [x] Id inexistente → página não encontrada
- [x] Opcionais vazios salvos como null
- [x] `npm run build` passando
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- UI: carregar o skill `frontend-design:frontend-design` e seguir `docs/design/sistema-visual.md`; usar `CabecalhoPagina`, `EstadoVazio` e `Ficha` da T012. Animações conforme a seção "Movimento".

- ADR-012: páginas em `src/app/(app)/`; `await exigirSessao()` é a **primeira linha de cada `page.tsx` e de cada action**, antes de ler dados, e fica **fora** de qualquer `try/catch` (o `redirect()` lança `NEXT_REDIRECT`). O layout do grupo sozinho **não** protege navegações no cliente.

Pode rodar em paralelo com T007.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** Lista com busca (`?q=`) em superfície única com divisórias e selo "sem descrição anestésica"; criação, edição, exclusão (ConfirmarExclusao da T007) e descrição anestésica 1:1 por upsert. Formulários com campos controlados para não perder o texto digitado quando a action devolve erro (o React zera formulários não controlados). Textareas de procedimento em Literata, mínimo de 8 linhas e crescimento automático. Erros com `.erro-campo`. `exigirSessao()` primeiro em cada page e action, fora de try/catch; `redirect()`/`notFound()` fora de try/catch.
- **Arquivos:** src/actions/procedimentos.ts; src/app/(app)/procedimentos/{page,novo/page,[id]/page}.tsx; src/components/procedimentos/{campo,formulario-procedimento,formulario-descricao-anestesica}.tsx
- **Commits:** T008: adiciona cadastro de procedimentos e descrição anestésica
- **Verificação manual (next dev, FONTE_DADOS=memoria, navegador do painel):** nome duplicado mostra "Já existe um procedimento com este nome." mantendo o texto digitado; salvar sem ASA mostra "Selecione a classificação ASA."; toasts "Procedimento salvo." e "Descrição anestésica salva."; selo some ao salvar a descrição; opcionais vazios voltam vazios após recarregar; excluir remove e volta à lista; /procedimentos/xyz mostra "Página não encontrada"; busca sem resultado mostra "Nenhum procedimento encontrado.". Só Server Actions via curl (POST progressivo) travam em actions com bind; o fluxo real do navegador foi usado no lugar.
- **Saída de lint / typecheck / testes:**

```
npm run lint       -> sem erros
npm run typecheck  -> sem erros
npm test           -> 7 arquivos, 55 testes passando
npm run build      -> sucesso (rotas /procedimentos, /procedimentos/[id], /procedimentos/novo)
```

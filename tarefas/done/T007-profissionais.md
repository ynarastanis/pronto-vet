# T007 — Cadastro de profissionais

- **Status:** concluída
- **Prioridade:** P2
- **Depende de:** T003, T005, T006, T012
- **Referência na spec:** §5, §7
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T007* (passos, interfaces e testes exatos)

## Objetivo

Página /profissionais com adicionar, editar e excluir, em duas colunas por papel.

## Critérios de aceite

- [x] Toda action chama exigirSessao() primeiro
- [x] Textos de interface exatamente como no plano
- [x] `npm run build` passando
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- UI: carregar o skill `frontend-design:frontend-design` e seguir `docs/design/sistema-visual.md`; usar `CabecalhoPagina`, `EstadoVazio` e `Ficha` da T012. Animações conforme a seção "Movimento".

- ADR-012: páginas em `src/app/(app)/`; `await exigirSessao()` é a **primeira linha de cada `page.tsx` e de cada action**, antes de ler dados, e fica **fora** de qualquer `try/catch` (o `redirect()` lança `NEXT_REDIRECT`). O layout do grupo sozinho **não** protege navegações no cliente.

Pode rodar em paralelo com T008. Quem chegar primeiro cria src/components/confirmar-exclusao.tsx.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** Página /profissionais com formulário inline (Nome, Papel, Adicionar), duas colunas Cirurgiões/Anestesistas em superfície única com divisórias, edição inline (Salvar/Cancelar), exclusão com ConfirmarExclusao, toast "Profissional salvo.". Actions chamam exigirSessao() primeiro, fora de try/catch; ErroNaoEncontrado em atualizar vira notFound(). Os formulários passam a Server Action direto a useActionState (mantém envio progressivo); o nome só é limpo após sucesso (campos controlados, pois o React reseta o form também em erro). Itens novos entram com .item-lista (só os adicionados após a carga), exclusão usa .item-lista-saida (180ms antes da action), erros usam .erro-campo. Colunas vazias usam EstadoVazio.
- **Arquivos:** src/components/confirmar-exclusao.tsx; src/actions/profissionais.ts; src/app/(app)/profissionais/page.tsx; src/components/profissionais/{campos-profissional,formulario-profissional,item-profissional,lista-profissionais}.tsx
- **Commits:** T007: adiciona ConfirmarExclusao; T007: adiciona cadastro de profissionais; T007: preenche implementação
- **Verificação manual (curl, FONTE_DADOS=memoria):** login ok; GET sem sessão redireciona para /entrar; nome vazio devolve "Informe o nome."; criar um de cada papel aparece na coluna certa; atualizar via action trocou o profissional de coluna; excluir via action removeu; action de excluir sem sessão redireciona (307). Não exercitado (precisa de navegador com login): diálogo de exclusão, edição inline, animações e layout em 375px.
- **Desvios:** nenhum em arquivos compartilhados. Scratchpad compartilhado com a T008: usei subpasta própria.
- **Saída de lint / typecheck / testes / build:** lint e typecheck sem erros; vitest 7 arquivos, 55 testes passando; build ok (rotas /profissionais e /procedimentos* listadas).

```
```

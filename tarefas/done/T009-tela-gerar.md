# T009 — Tela Gerar

- **Status:** concluída
- **Prioridade:** P1
- **Depende de:** T002, T005, T006, T012
- **Referência na spec:** §7 (Tela Gerar)
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T009* (passos, interfaces e testes exatos)

## Objetivo

Tela principal: escolher procedimento, profissionais e peso; prévias dos dois textos com botões Copiar separados.

## Critérios de aceite

- [x] Testes de preferencias.ts do plano
- [x] Só procedimentos com descrição anestésica aparecem
- [x] Copiar funciona em cada cartão; fallback "Use Ctrl+C para copiar."
- [x] Profissional salvo e excluído é ignorado sem erro
- [x] `npm run build` passando
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- Contraste: `--copiado` sobre branco é 3,07:1 — use-o só na faixa/varredura e no ícone; o rótulo "Copiado" fica em `--tinta` ou `--primary`.

- UI: carregar o skill `frontend-design:frontend-design` e seguir `docs/design/sistema-visual.md`; usar `CabecalhoPagina`, `EstadoVazio` e `Ficha` da T012. Animações conforme a seção "Movimento".

- ADR-012: páginas em `src/app/(app)/`; `await exigirSessao()` é a **primeira linha de cada `page.tsx` e de cada action**, antes de ler dados, e fica **fora** de qualquer `try/catch` (o `redirect()` lança `NEXT_REDIRECT`). O layout do grupo sozinho **não** protege navegações no cliente.



---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** Tela Gerar: painel de escolhas sticky (300px) com combobox de procedimento (Popover + Command, busca sem acento), selects de cirurgião/anestesista (com "Nenhum") e peso; duas Fichas com prévia em Literata. Copiar com varredura da faixa e check "Copiado" por 2s, fallback com seleção do texto e toast "Use Ctrl+C para copiar.". Crossfade ao trocar de procedimento; ao mudar peso/profissional só as linhas alteradas recebem realce (função pura linhasAlteradas, TDD). Preferências em localStorage com id excluído ignorado. page.tsx chama exigirSessao() na primeira linha, fora de try/catch; dados só via servicos().
- **Arquivos:** src/lib/preferencias.ts (+ .test.ts), src/lib/linhas-alteradas.ts (+ .test.ts), src/components/botao-copiar.tsx, src/components/gerar/{cartao-texto,combobox-procedimento,formulario-gerar}.tsx, src/app/(app)/page.tsx
- **Commits:** 30da726 (lib), 0bc3606 (tela)
- **Verificação visual (painel do navegador, sessão logada):** 1280px escuro, 900px e 375px claro. Confirmado: escolher procedimento, realce só na linha alterada (cirurgião e peso), localStorage gravado e restaurado após recarregar, id salvo inexistente volta a "Nenhum", sem rolagem horizontal em 375px, copiar com sucesso (clipboard simulado): data-copiado=true, .check-copiado, rótulo em --tinta, texto correto do cartão. O clipboard real foi negado pelo painel, o que exercitou o fallback (texto selecionado). Não verificado: crossfade entre procedimentos (só há um procedimento completo na demonstração; coberto por leitura do código), 375px em escuro e 1280px em claro, contraste medido.
- **Saída de lint / typecheck / testes / build:**

```
npm run lint       -> sem erros nem avisos
npm run typecheck  -> sem erros
npm test           -> Test Files 9 passed (9), Tests 67 passed (67)
npm run build      -> Compiled successfully, TypeScript ok, build concluído (saída completa em scratchpad/t009/gates.txt)
```

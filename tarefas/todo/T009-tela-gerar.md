# T009 — Tela Gerar

- **Status:** a fazer
- **Prioridade:** P1
- **Depende de:** T002, T005, T006, T012
- **Referência na spec:** §7 (Tela Gerar)
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T009* (passos, interfaces e testes exatos)

## Objetivo

Tela principal: escolher procedimento, profissionais e peso; prévias dos dois textos com botões Copiar separados.

## Critérios de aceite

- [ ] Testes de preferencias.ts do plano
- [ ] Só procedimentos com descrição anestésica aparecem
- [ ] Copiar funciona em cada cartão; fallback "Use Ctrl+C para copiar."
- [ ] Profissional salvo e excluído é ignorado sem erro
- [ ] `npm run build` passando
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- UI: carregar o skill `frontend-design:frontend-design` e seguir `docs/design/sistema-visual.md`; usar `CabecalhoPagina`, `EstadoVazio` e `Ficha` da T012. Animações conforme a seção "Movimento".

- ADR-012: páginas em `src/app/(app)/`; `await exigirSessao()` é a **primeira linha de cada `page.tsx` e de cada action**, antes de ler dados, e fica **fora** de qualquer `try/catch` (o `redirect()` lança `NEXT_REDIRECT`). O layout do grupo sozinho **não** protege navegações no cliente.



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

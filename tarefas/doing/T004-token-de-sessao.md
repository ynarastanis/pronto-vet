# T004 — Token de sessão e verificação de senha

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T001
- **Referência na spec:** §8
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T004* (passos, interfaces e testes exatos)

## Objetivo

assinarToken, verificarToken e senhaConfere com Web Crypto, falhando fechado sem segredo/senha configurados.

## Critérios de aceite

- [ ] Só crypto.subtle (sem node:crypto)
- [ ] verificarToken nunca lança
- [ ] Sem APP_PASSWORD/APP_SECRET: nenhum acesso é concedido
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Pode rodar em paralelo com T002 e T003.

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

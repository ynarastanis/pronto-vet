# T004 — Token de sessão e verificação de senha

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T001
- **Referência na spec:** §8
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T004* (passos, interfaces e testes exatos)

## Objetivo

assinarToken, verificarToken e senhaConfere com Web Crypto, falhando fechado sem segredo/senha configurados.

## Critérios de aceite

- [x] Só crypto.subtle (sem node:crypto)
- [x] verificarToken nunca lança
- [x] Sem APP_PASSWORD/APP_SECRET: nenhum acesso é concedido
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Pode rodar em paralelo com T002 e T003.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** assinarToken, verificarToken e senhaConfere com Web Crypto (crypto.subtle, HMAC-SHA256 e SHA-256), sem node:crypto. verificarToken nunca lança (try/catch, valida formato, base64url e expiração, usa crypto.subtle.verify). Sem segredo/senha: assinarToken lança "APP_SECRET não configurado", verificarToken e senhaConfere retornam false. TDD: teste falhou (módulo inexistente) e depois passou.
- **Arquivos:** src/lib/auth/token.ts, src/lib/auth/token.test.ts
- **Commits:** 09efee6 T004: adiciona token HMAC de sessão e verificação de senha
- **Saída de lint / typecheck / testes:**

```
npx vitest run src/lib/auth -> 1 arquivo, 9 testes passando
npm run lint      -> eslint . (sem erros)
npm run typecheck -> tsc --noEmit (sem erros)
npm test          -> Test Files 5 passed (5); Tests 31 passed (31)
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [ ] `arquivo:linha` — …

# T006 — Login, proxy e barra de navegação

- **Status:** a fazer
- **Prioridade:** P1
- **Depende de:** T003, T004 (pode rodar em paralelo com T005)
- **Referência na spec:** §7, §8
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T006* (passos, interfaces e testes exatos)

## Objetivo

Página /entrar, actions entrar/sair, exigirSessao, proxy.ts protegendo as rotas e barra de navegação.

## Critérios de aceite

- [ ] Todos os cenários da verificação manual do plano conferidos e descritos na Implementação
- [ ] Senha errada responde após ~1 s com "Senha incorreta."
- [ ] `npm run build` passando
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- Herdado da revisão da T004: tratar `APP_SECRET` só com espaços como não configurado (simetria com `APP_PASSWORD`). Ajustar `assinarToken`/`verificarToken` em `src/lib/auth/token.ts` para `!segredo?.trim()`, com teste (TDD).



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

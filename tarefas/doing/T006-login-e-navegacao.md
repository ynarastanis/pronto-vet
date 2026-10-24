# T006 — Login, proxy e barra de navegação

- **Status:** em revisão
- **Prioridade:** P1
- **Depende de:** T003, T004 (pode rodar em paralelo com T005)
- **Referência na spec:** §7, §8
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T006* (passos, interfaces e testes exatos)

## Objetivo

Página /entrar, actions entrar/sair, exigirSessao, proxy.ts protegendo as rotas e barra de navegação.

## Critérios de aceite

- [x] Todos os cenários da verificação manual do plano conferidos e descritos na Implementação
- [x] Senha errada responde após ~1 s com "Senha incorreta."
- [x] `npm run build` passando
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- Herdado da revisão da T004: tratar `APP_SECRET` só com espaços como não configurado (simetria com `APP_PASSWORD`). Ajustar `assinarToken`/`verificarToken` em `src/lib/auth/token.ts` para `!segredo?.trim()`, com teste (TDD).



---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** Item herdado: `assinarToken`/`verificarToken` tratam `APP_SECRET` só com espaços como não configurado (TDD). Login: `sessao.ts` (criarSessao/encerrarSessao/exigirSessao), `proxy.ts`, actions `entrar`/`sair`, página `/entrar` com `FormularioEntrar` (useActionState) e `BarraNavegacao` (client, oculta em `/entrar`, link ativo destacado, botão Sair) no layout. Desvio de implementação: o matcher do proxy usa `[.]` em vez de `\.`, porque o path-to-regexp do Next descartava a barra invertida e o proxy só rodava em `/`.
- **Arquivos:** src/lib/auth/token.ts, token.test.ts, sessao.ts; src/proxy.ts; src/actions/auth.ts; src/app/entrar/page.tsx; src/app/layout.tsx; src/components/entrar/formulario-entrar.tsx; src/components/barra-navegacao.tsx
- **Commits:** 8b719fb (APP_SECRET), bb69ae7 (login e navegação)
- **Verificação manual** (`next dev` + curl, `.env.local` ignorado pelo git, removido ao final; Server Action submetida via multipart com os campos `$ACTION_*` do HTML):
  - Verificado: `/` sem cookie -> 307 `/entrar`; `/procedimentos` sem cookie -> 307 `/entrar`; `/favicon.ico` não é redirecionado.
  - Verificado: senha errada e senha vazia -> "Senha incorreta." após ~1,07 s; `/entrar` sem barra de navegação.
  - Verificado: senha certa -> 303 para `/`; cookie `sessao` com HttpOnly, SameSite=lax, Path=/, Max-Age=2592000 (sem Secure em dev); `/` mostra Gerar/Procedimentos/Profissionais/Sair; `/entrar` com cookie -> 307 `/`; cookie adulterado -> 307 `/entrar`.
  - Verificado: Sair -> cookie expirado, 303 `/entrar`; `/` depois -> 307 `/entrar`.
  - Verificado: com `APP_PASSWORD` vazia, nem senha vazia nem qualquer outra (inclusive a antiga) entra.
  - Não verificado (sem navegador): aparência/responsividade, destaque visual do link ativo, rótulo "Entrando…" durante o envio, foco automático. `Secure` em produção só por leitura do código.
- **Saída de lint / typecheck / testes:**

```
npm run lint       -> sem erros
npm run typecheck  -> sem erros
npm test           -> Test Files 7 passed (7), Tests 55 passed (55)
npm run build      -> Compiled successfully; rotas /, /_not-found, /entrar; "ƒ Proxy (Middleware)"
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [x] `arquivo:linha` — …

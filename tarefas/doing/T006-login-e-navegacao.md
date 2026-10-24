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

**Decisões da rodada 1 (para a rodada 2) — ver ADR-012:**
1. Bloqueante 1: trocar o matcher pela lista explícita proposta pelo Revisor e reexecutar os cenários do Revisor (`/x.y`, `/procedimentos/a.b`, `/index.rsc` → 307 sem cookie; `/favicon.ico`, `/file.svg`, `_next/static` → 200).
2. Bloqueante 2: corrigir/remover o comentário errado do matcher.
3. Criar o grupo `src/app/(app)/` com `layout.tsx` que faz `await exigirSessao()` e renderiza a `BarraNavegacao`; mover `src/app/page.tsx` para `src/app/(app)/page.tsx`. O `src/app/layout.tsx` raiz deixa de renderizar a barra. `/entrar` e `not-found` ficam fora do grupo (sem barra para quem não tem sessão).
4. Comentário de uma linha em `exigirSessao` avisando que não pode ficar dentro de `try/catch`.

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

### Rodada 2

- **Resumo:** (1) matcher do proxy trocado pela lista explícita do Revisor (`_next/static/`, `_next/image$`, `favicon\.ico$` e arquivos de primeiro nível por extensão); (2) comentário errado removido e substituído por um que remete à ADR-012; (3) criado o grupo `src/app/(app)/` com `layout.tsx` (`await exigirSessao()` + `BarraNavegacao`); `src/app/page.tsx` movido para `src/app/(app)/page.tsx`; o `layout.tsx` raiz não renderiza mais a barra, e o teste `caminho === "/entrar"` da barra foi removido por ficar sem função; (4) comentário em `exigirSessao` avisando que não pode ficar em `try/catch`. O item herdado (`APP_SECRET` só com espaços) já estava na rodada 1.
- **Arquivos:** src/proxy.ts, src/lib/auth/sessao.ts, src/app/layout.tsx, src/app/(app)/layout.tsx, src/app/(app)/page.tsx (movido), src/components/barra-navegacao.tsx
- **Commits:** d45510f
- **Verificação manual** (`next dev` em porta livre + curl, `.env.local` de teste ignorado e removido ao final):
  - Sem cookie: `/`, `/x.y`, `/procedimentos`, `/procedimentos/a.b`, `/index.rsc` e `/naoexiste` -> 307 `/entrar`. `/favicon.ico`, `/file.svg` e um chunk de `/_next/static/` -> 200; `/entrar` -> 200.
  - 404 sem sessão (`/nada.svg`, caminho que o proxy deixa passar): 404 com "Página não encontrada" e sem `nav` "Principal" (sem barra).
  - Cenários da rodada 1 repetidos: senha errada -> "Senha incorreta." em ~1,09 s; senha certa -> 303 `/` com cookie HttpOnly, SameSite=lax, Max-Age=2592000; com cookie, `/` tem barra (Gerar, Sair) e `/entrar` -> 307 `/`; cookie adulterado -> 307 `/entrar`; Sair -> cookie expirado, 303 `/entrar`, depois `/` -> 307; `APP_PASSWORD` vazia -> nem senha vazia nem a antiga entram (~1,06 s). Com cookie, `/procedimentos`, `/x.y` etc. dão 404 (páginas ainda não existem), sem redirecionamento.
  - Não verificado: aparência no navegador.
- **Saída de lint / typecheck / testes:**

```
npm run lint       -> sem erros
npm run typecheck  -> sem erros (rodado após o build; logo após o dev, .next/types velho apontava src/app/page.js)
npm test           -> Test Files 7 passed (7), Tests 55 passed (55)
npm run build      -> Compiled successfully; "ƒ /" (dinâmica), "○ /_not-found", "○ /entrar"; "ƒ Proxy (Middleware)"
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** alterações solicitadas
- **Verificação do Revisor:** `npm run lint`, `npm run typecheck` e `npm test` (7 arquivos, 55 testes) passando. `next dev` com `.env.local` de teste (ignorado pelo git, removido ao final) e `next build && next start` numa cópia isolada, exercitados com curl. Matcher compilado com o próprio `getMiddlewareMatchers` do Next 16.4.3 para cada variante.
  - Confirmado: `/` e `/procedimentos` sem cookie → 307 `/entrar`; senha errada e vazia → "Senha incorreta." em ~1,06–1,13 s; senha certa → 303 `/` (Location fixo, sem parâmetro de destino: sem open redirect); cookie `sessao` com HttpOnly, SameSite=lax, Path=/, Max-Age=2592000; `/entrar` com cookie → 307 `/`; expiração ou assinatura adulteradas → 307 `/entrar`; Sair → `sessao=; Path=/; Expires=1970` e 303 `/entrar`, depois `/` → 307; `APP_PASSWORD` vazia → nem senha vazia nem espaço entram, mesma mensagem e mesmo atraso (sem vazar se a senha está configurada).
  - Confirmado: Server Action executa em caminho que o proxy pula (POST da action `sair` em `/x.y` → 303), o que reforça `exigirSessao()` em toda action.
- **Apontamentos bloqueantes:**
  - [ ] `src/proxy.ts:19-21` — o matcher exclui **qualquer** caminho com ponto (`.*[.].*`), o que contraria a spec §8 ("protege todas as rotas, exceto `/entrar` e assets estáticos"). Ficam fora do proxy: `/procedimentos/a.b` (rota dinâmica `[id]` da T008 com id contendo ponto), qualquer página futura numa URL com ponto, POSTs de Server Actions nesses caminhos e as formas de transporte que o Next acrescenta de propósito ao matcher (`/index.rsc`, `/procedimentos.rsc`, `…/.segments/….segment.rsc`; ver a regexp gerada). Localmente `next dev`/`next start` respondem 404 a essas formas `.rsc`, então não reproduzi vazamento de conteúdo; mas a própria build marca `/` como estática (○), e páginas sem API dinâmica serão pré-renderizadas e ficarão protegidas só pelo proxy, então o comportamento do host (Vercel) para esses arquivos não pode ficar descoberto. — Trocar por lista explícita de arquivos estáticos de primeiro nível, mantendo `\\.` como na doc: `"/((?!_next/static/|_next/image$|favicon\\.ico$|[^/]+\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest)$).*)"`. Testei esse matcher numa cópia isolada com `next build && next start`: `/x.y`, `/procedimentos/a.b` e `/index.rsc` sem cookie → 307 `/entrar`; `/favicon.ico`, `/file.svg` e os chunks de `/_next/static/` → 200; login e `/` com cookie funcionam.
  - [ ] `src/proxy.ts:19` — o comentário está errado e vai induzir a próxima pessoa a erro: o path-to-regexp não descarta a barra. Em TS, `"\."` vira `"."` antes de chegar ao Next (é o JS que descarta o escape); `"\\."`, como na doc (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md:94`), gera exatamente a mesma regexp que `[.]`. Conferido com `getMiddlewareMatchers`. — Remover o comentário (ou corrigi-lo) junto com a troca do matcher.
- **Sugestões (não bloqueantes):**
  - [ ] `src/components/barra-navegacao.tsx:17` — a barra (com Gerar/Procedimentos/Profissionais/Sair) aparece na página 404 para quem não tem sessão (ex.: `/x.y` hoje). Com o matcher corrigido isso quase some (só sobra em caminhos de arquivo estático inexistente). Opcional: aceitar como está.
  - [ ] Defesa em profundidade nas páginas (decisão do Líder, fora do plano atual): mover as páginas protegidas para um grupo `src/app/(app)/` com `layout.tsx` que chama `await exigirSessao()` (deixando `/entrar` fora do grupo para não criar loop). Isso também torna as páginas dinâmicas, coerente com a ADR-010, e evita que uma página com dados seja pré-renderizada como estática. Se adotado, registrar no plano/ARCHITECT.md.
  - [ ] Nota para T007/T008: `exigirSessao()` funciona como primeira linha (assinatura `Promise<void>`, `import "server-only"`, redireciona via `redirect()`), mas precisa ficar **fora** de qualquer `try/catch`, porque `redirect()` lança `NEXT_REDIRECT`; um `catch` genérico engoliria o redirect e deixaria a action seguir sem sessão.
  - Conferidos sem ressalva: `token.ts` com `!segredo?.trim()` e teste novo (item herdado da T004); `secure` por `NODE_ENV === "production"` (vale também em Preview na Vercel); `sair` sem exigir sessão é inofensivo; `APP_SECRET` ausente com senha certa → `criarSessao` lança e cai no `error.tsx` (falha fechada).

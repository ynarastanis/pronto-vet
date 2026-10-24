# T001 — Base do projeto

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** nenhuma
- **Referência na spec:** §4, §11, §12
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T001* (passos, interfaces e testes exatos)

## Objetivo

Criar o app Next.js 16 com Tailwind, shadcn/ui, Vitest, scripts de qualidade, layout pt-BR e páginas de erro.

## Critérios de aceite

- [x] App gerado sem sobrescrever CLAUDE.md, AGENTS.md, ARCHITECT.md, docs/, tarefas/, .claude/
- [x] `<html lang="pt-BR">`, `error.tsx` e `not-found.tsx` em pt-BR
- [x] Componentes shadcn listados no plano instalados
- [x] `.env.example` com as 4 variáveis
- [x] `npm run build` passando
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Atenção: create-next-app 16 gera AGENTS.md/CLAUDE.md próprios — mesclar notas úteis, nunca substituir os nossos.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** App Next.js 16.4.3 gerado em pasta temporária e copiado para a raiz sem tocar em CLAUDE.md/AGENTS.md/ARCHITECT.md/docs/tarefas/.claude. Tailwind 4, shadcn (base-nova) com os 11 componentes do plano (mais dialog e input-group, dependências do shadcn), Vitest 5.0.5, scripts lint/typecheck/test, layout pt-BR com Toaster, page provisória, error.tsx e not-found.tsx em pt-BR, .env.example com as 4 variáveis. Desvios: @types/node subiu de ^20 para 24 (peer do vitest 5); o shadcn gerou `import { cn } from "cn"` (pacote npm de terceiros) e foi corrigido para clsx + tailwind-merge em `src/lib/utils.ts`, pacote `cn` removido; layout usa `{ children: React.ReactNode }` em vez do global `LayoutProps` (não existe antes do build, quebrava o typecheck).
- **Arquivos:** package.json, package-lock.json, tsconfig.json, next.config.ts, eslint.config.mjs, vitest.config.ts, components.json, .env.example, .gitignore (mesclado), public/, src/app/{layout,page,error,not-found}.tsx, src/app/globals.css, src/components/ui/*, src/lib/utils.ts, src/lib/sanidade.test.ts, CLAUDE.md (seção Notas do Next.js).
- **Commits:** ver `git log --grep "^T001"`.
- **Saída de lint / typecheck / testes:**

```
npm run lint       -> eslint .  (sem erros)
npm run typecheck  -> tsc --noEmit (sem erros)
npm test           -> Test Files 1 passed (1) | Tests 1 passed (1)
npm run build      -> Next.js 16.4.3 (Turbopack) Compiled successfully; rotas: / (static), /_not-found (static)
curl localhost:3000 (next dev) -> <h1>Gerar</h1>, <html lang="pt-BR">; /nao-existe -> 404
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** alterações solicitadas
- **Verificação do Revisor:** `npm run lint` (exit 0), `npm run typecheck` (exit 0), `npm test` (1 arquivo, 1 teste passando), `npm run build` (Next.js 16.4.3, rotas `/` e `/_not-found` estáticas; CSS gerado contém as utilities do Tailwind). `AGENTS.md`, `ARCHITECT.md`, `docs/`, `tarefas/` e `.claude/` intactos no commit; `CLAUDE.md` só recebeu a seção "Notas do Next.js". Nenhum `import ... from "cn"` restante.
- **Apontamentos bloqueantes:**
  - [ ] `src/app/error.tsx:3` e `:7` — o botão "Tentar novamente" chama `reset()`. No Next 16.4 (`node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/error.md`, seções `retry`/`reset`), `reset()` só limpa o estado e re-renderiza **sem re-buscar** o conteúdo; para erros de Server Component (o caso típico deste app: falha transitória no Neon) o botão reexibe o mesmo erro. A doc recomenda `retry()` (estável desde 16.3). O plano pedia `reset()`, mas foi escrito antes dessa mudança — e o próprio `CLAUDE.md` manda seguir a doc local. — Trocar para `({ retry }: { error: unknown; retry: () => void })` e `onClick={() => retry()}`; registrar o desvio do plano no resumo da implementação.
- **Sugestões (não bloqueantes):**
  - [ ] `src/components/ui/command.tsx:37-38` e `src/components/ui/dialog.tsx:75` — textos padrão em inglês lidos por leitor de tela ("Command Palette", "Search for a command to run...", "Close"). — Traduzir ("Paleta de comandos", "Buscar…", "Fechar") agora ou na tarefa que primeiro usar esses componentes (T008/T009).
  - [ ] `src/app/` — sem `global-error.tsx`: erro no layout raiz cai na página 500 padrão, em inglês. — Avaliar com o Líder se cabe uma tarefa curta (fora do plano atual; YAGNI até lá).
  - [ ] `next.config.ts:5` — `cacheComponents: true` muda a semântica de leitura dinâmica (cookies da sessão, dados por request exigem `<Suspense>`/`connection()`), o que afeta T006–T009. — Registrar como ADR em `ARCHITECT.md` ou alertar nas tarefas seguintes; hoje só consta em `CLAUDE.md`.
  - [ ] `package.json:24` — `shadcn` está em `dependencies` (só é usado pelo `@import "shadcn/tailwind.css"` no build). — Mover para `devDependencies` é opcional; não afeta a Vercel.
  - [ ] `src/app/error.tsx:7` — botão HTML cru em vez de `Button` de `@/components/ui/button`. — Usar o componente para manter o visual consistente.

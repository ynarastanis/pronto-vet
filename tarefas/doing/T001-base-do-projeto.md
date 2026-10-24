# T001 — Base do projeto

- **Status:** em revisão
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
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [x] `arquivo:linha` — …

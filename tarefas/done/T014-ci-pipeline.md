# T014 — CI no GitHub Actions e documentação do pipeline

- **Status:** concluída
- **Prioridade:** P1
- **Depende de:** nenhuma (antes da T010)
- **Branch:** `t014-ci-pipeline`
- **Referência:** ADR-015, `AGENTS.md` › "Branches, PR e CI"

## Objetivo

Rodar os portões de qualidade automaticamente em todo PR e push no `main`, e documentar no README como rodar o app e como o deploy funciona (Vercel + Neon).

## Critérios de aceite

- [x] `.github/workflows/ci.yml`: dispara em `pull_request` (para `main`) e `push` em `main`; job `qualidade` em `ubuntu-latest`, Node 24 (`actions/setup-node` com cache npm), `npm ci`, depois `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
- [x] Build da CI não precisa de banco nem segredo: `env` do job com `FONTE_DADOS=memoria`, `APP_PASSWORD=ci-senha-falsa`, `APP_SECRET=ci-segredo-falso-nao-usado-em-producao`, `NEXT_TELEMETRY_DISABLED=1`
- [x] `concurrency` cancelando execuções antigas do mesmo PR; `permissions: contents: read`
- [x] Versões das actions fixadas em major (`actions/checkout@v4` ou mais recente estável, `actions/setup-node@v4` ou mais recente estável) — confira a versão estável atual
- [x] `README.md` em pt-BR: o que é o app; rodar localmente com mock (`FONTE_DADOS=memoria`) e com banco (`.env.local` vindo de `neon deploy --profile ynara`, branch `development`); scripts; testar no celular pela rede local (`npx next dev -H <ip>`); fluxo de branch → PR → CI → Preview (Vercel + branch do Neon) → merge → Production; variáveis de ambiente (tabela da ADR-015); contas (GitHub/Neon/Vercel são da Ynara; perfil `ynara` na CLI do Neon); links para spec, `ARCHITECT.md`, `AGENTS.md`, `docs/design/sistema-visual.md`
- [x] Nenhuma dependência nova
- [x] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando localmente

## Notas do Líder

- Migrations no build (`prisma migrate deploy && next build`) ficam para a T010, junto com o Prisma.
- Proteção de branch não está disponível (repositório privado, GitHub Free): não tente configurá-la.
- Não faça push nem abra PR: o Líder faz isso.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** Criado o workflow de CI (job `qualidade`, Node 24, cache npm, `actions/checkout@v7` e `actions/setup-node@v7`, as majors estáveis atuais: v7.0.1 e v7.1.0) e o README em pt-BR. Validado o YAML com `js-yaml` (já presente em node_modules) e rodada a sequência do job, com o mesmo `env`, numa cópia limpa do repositório (sem `.env.local`, `.git`, `.neon`, `node_modules`, `.next`), no scratchpad.
- **Arquivos:** `.github/workflows/ci.yml`, `README.md`, `tarefas/doing/T014-ci-pipeline.md`
- **Commits:** 0c7e959 (workflow), bd825e2 (README), mais o commit desta seção.
- **Saída de lint / typecheck / testes:** (cópia limpa, com FONTE_DADOS=memoria e segredos falsos)

```
npm ci          -> found 0 vulnerabilities
npm run lint    -> eslint . (sem erros)
npm run typecheck -> tsc --noEmit (sem erros)
npm test        -> Test Files 13 passed (13) / Tests 110 passed (110)
npm run build   -> Compiled; 8/8 páginas geradas, rotas listadas, exit 0
```

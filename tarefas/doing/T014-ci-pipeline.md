# T014 — CI no GitHub Actions e documentação do pipeline

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** nenhuma (antes da T010)
- **Branch:** `t014-ci-pipeline`
- **Referência:** ADR-015, `AGENTS.md` › "Branches, PR e CI"

## Objetivo

Rodar os portões de qualidade automaticamente em todo PR e push no `main`, e documentar no README como rodar o app e como o deploy funciona (Vercel + Neon).

## Critérios de aceite

- [ ] `.github/workflows/ci.yml`: dispara em `pull_request` (para `main`) e `push` em `main`; job `qualidade` em `ubuntu-latest`, Node 24 (`actions/setup-node` com cache npm), `npm ci`, depois `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`
- [ ] Build da CI não precisa de banco nem segredo: `env` do job com `FONTE_DADOS=memoria`, `APP_PASSWORD=ci-senha-falsa`, `APP_SECRET=ci-segredo-falso-nao-usado-em-producao`, `NEXT_TELEMETRY_DISABLED=1`
- [ ] `concurrency` cancelando execuções antigas do mesmo PR; `permissions: contents: read`
- [ ] Versões das actions fixadas em major (`actions/checkout@v4` ou mais recente estável, `actions/setup-node@v4` ou mais recente estável) — confira a versão estável atual
- [ ] `README.md` em pt-BR: o que é o app; rodar localmente com mock (`FONTE_DADOS=memoria`) e com banco (`.env.local` vindo de `neon deploy --profile ynara`, branch `development`); scripts; testar no celular pela rede local (`npx next dev -H <ip>`); fluxo de branch → PR → CI → Preview (Vercel + branch do Neon) → merge → Production; variáveis de ambiente (tabela da ADR-015); contas (GitHub/Neon/Vercel são da Ynara; perfil `ynara` na CLI do Neon); links para spec, `ARCHITECT.md`, `AGENTS.md`, `docs/design/sistema-visual.md`
- [ ] Nenhuma dependência nova
- [ ] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando localmente

## Notas do Líder

- Migrations no build (`prisma migrate deploy && next build`) ficam para a T010, junto com o Prisma.
- Proteção de branch não está disponível (repositório privado, GitHub Free): não tente configurá-la.
- Não faça push nem abra PR: o Líder faz isso.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```

# T011 — Fechamento do deploy

- **Status:** concluída
- **Prioridade:** P2
- **Depende de:** T010, T014, T015
- **Branch:** `t011-fechamento-deploy`
- **Referência:** spec §11, ADR-015, ADR-018

## Objetivo

Deixar a documentação e a configuração coerentes com o que está em produção depois da T010, T014, T015 e da ADR-018 (projeto Neon único, criado pela integração da Vercel).

## Critérios de aceite

- [x] Build com migrations: já entregue pela T010 (`vercel-build`). O README explica a diferença entre `build` (CI, sem banco) e `vercel-build` (Vercel, com `prisma migrate deploy`).
- [x] README sem o trecho "O acesso a dados via Prisma chega com a T010; até lá, use o mock".
- [x] Tabela de scripts do README com `db:migrate`, `db:seed`, `vercel-build` e `postinstall`.
- [x] Seção "Com banco" do README com os comandos da ADR-018: projeto `long-lab-10816041`, org `org-patient-pond-01447185`, branch `development`, `neon env pull --profile ynara`, e o aviso de descartar `@neon/env` se o `neon init` o re-adicionar ao `package.json`.
- [x] Fluxo de deploy do README com o branch `main` do Neon (não `production`) e os branches `preview/<git-branch>` dos Previews.
- [x] Nota no README: variável de ambiente nova ou alterada na Vercel só vale em deploy feito depois dela — fazer Redeploy.
- [x] Nota no README sobre limpar periodicamente os branches `preview/*` do Neon (comando da ADR-018).
- [x] Tabela de variáveis do README com `main` no lugar de `production`. A tabela da ADR-015 não muda: é histórica; o README é a referência viva.
- [x] Seção "Contas" do README sem o projeto antigo `green-cherry-00787842`.
- [x] `.gitignore` com `.claude/launch.json` (configuração local do navegador do app).
- [x] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando.

## Notas do Líder

- `neon.ts` não muda: é só política de branches; o vínculo com o projeto fica em `.neon/`, que é ignorado pelo git.
- **Não rodar `npm ci`**: o usuário costuma deixar `next dev` rodando e o Windows trava arquivos nativos — o `npm ci` apaga a `node_modules` e falha no meio (aconteceu em 2026-10-25). Use `npm install` se precisar.
- Push e PR são do Líder.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** README atualizado para o deploy com o projeto Neon único (ADR-018): seção "Com banco" com `neon init`/`neon env pull` e aviso sobre `@neon/env`; tabela de scripts com `vercel-build`, `db:migrate`, `db:seed` e `postinstall` e diferença entre `build` (CI, sem banco) e `vercel-build`; fluxo de deploy com branch `main` e `preview/<git-branch>`; nota de Redeploy ao mudar variáveis na Vercel; nota e comando para limpar `preview/*`; tabela de variáveis com `main`; seção "Contas" sem o projeto antigo. Removido o trecho "chega com a T010". `.claude/launch.json` adicionado ao `.gitignore` (confirmado: sai do `git status`). Nenhum código do app alterado; `npm ci` não foi rodado.
- **Arquivos:** `README.md`, `.gitignore`, `tarefas/doing/T011-preparar-deploy.md`
- **Commits:** `6c66ff0` T011: atualiza README para o deploy com Neon único e ignora .claude/launch.json
- **Saída de lint / typecheck / testes:**

```
npm run lint       -> sem erros
npm run typecheck  -> sem erros
npm test           -> Test Files 15 passed (15); Tests 126 passed (126)
npm run build      -> Compiled successfully; 8 páginas geradas
```

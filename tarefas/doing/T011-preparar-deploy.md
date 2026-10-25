# T011 — Fechamento do deploy

- **Status:** implementando
- **Prioridade:** P2
- **Depende de:** T010, T014, T015
- **Branch:** `t011-fechamento-deploy`
- **Referência:** spec §11, ADR-015, ADR-018

## Objetivo

Deixar a documentação e a configuração coerentes com o que está em produção depois da T010, T014, T015 e da ADR-018 (projeto Neon único, criado pela integração da Vercel).

## Critérios de aceite

- [ ] Build com migrations: já entregue pela T010 (`vercel-build`). O README explica a diferença entre `build` (CI, sem banco) e `vercel-build` (Vercel, com `prisma migrate deploy`).
- [ ] README sem o trecho "O acesso a dados via Prisma chega com a T010; até lá, use o mock".
- [ ] Tabela de scripts do README com `db:migrate`, `db:seed`, `vercel-build` e `postinstall`.
- [ ] Seção "Com banco" do README com os comandos da ADR-018: projeto `long-lab-10816041`, org `org-patient-pond-01447185`, branch `development`, `neon env pull --profile ynara`, e o aviso de descartar `@neon/env` se o `neon init` o re-adicionar ao `package.json`.
- [ ] Fluxo de deploy do README com o branch `main` do Neon (não `production`) e os branches `preview/<git-branch>` dos Previews.
- [ ] Nota no README: variável de ambiente nova ou alterada na Vercel só vale em deploy feito depois dela — fazer Redeploy.
- [ ] Nota no README sobre limpar periodicamente os branches `preview/*` do Neon (comando da ADR-018).
- [ ] Tabela de variáveis do README com `main` no lugar de `production`. A tabela da ADR-015 não muda: é histórica; o README é a referência viva.
- [ ] Seção "Contas" do README sem o projeto antigo `green-cherry-00787842`.
- [ ] `.gitignore` com `.claude/launch.json` (configuração local do navegador do app).
- [ ] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando.

## Notas do Líder

- `neon.ts` não muda: é só política de branches; o vínculo com o projeto fica em `.neon/`, que é ignorado pelo git.
- **Não rodar `npm ci`**: o usuário costuma deixar `next dev` rodando e o Windows trava arquivos nativos — o `npm ci` apaga a `node_modules` e falha no meio (aconteceu em 2026-10-25). Use `npm install` se precisar.
- Push e PR são do Líder.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```

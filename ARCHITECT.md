# Decisões de arquitetura

Registro das decisões (ADRs curtos). Nova decisão = nova entrada no fim, com número sequencial. Decisões não são apagadas; se mudarem, uma nova entrada marca a anterior como **substituída**.

Formato: **Contexto** · **Decisão** · **Consequências**.

---

## ADR-001 — Next.js App Router com Server Actions

- **Status:** aceita (2026-10-24)
- **Contexto:** CRUD simples para uma equipe, hospedado no free tier da Vercel. Nenhum consumidor externo de API.
- **Decisão:** Server Components para leitura e Server Actions para escrita. Sem camada REST.
- **Consequências:** menos código e menos funções serverless. Se um dia houver app mobile, uma API precisará ser criada.

## ADR-002 — Prisma + Postgres no Neon

- **Status:** aceita (2026-10-24)
- **Contexto:** requisito do projeto.
- **Decisão:** Prisma como ORM; `DATABASE_URL` com pooler para o runtime e `DIRECT_URL` direta para migrations. `PrismaClient` singleton em `src/lib/db.ts`.
- **Consequências:** migrations versionadas em `prisma/migrations`, aplicadas com `prisma migrate deploy` no build.

## ADR-003 — Autenticação por senha compartilhada

- **Status:** aceita (2026-10-24)
- **Contexto:** uma única equipe; não é preciso saber quem editou o quê.
- **Decisão:** `APP_PASSWORD` em variável de ambiente; cookie httpOnly com token `expiracao.HMAC-SHA256(APP_SECRET)` válido por 30 dias; verificação no proxy/middleware do Next e em toda Server Action.
- **Consequências:** sem tabela de usuários. Revogar acesso = trocar `APP_PASSWORD` e `APP_SECRET`. Sem auditoria por pessoa.

## ADR-004 — Campos estruturados definidos no código

- **Status:** aceita (2026-10-24)
- **Contexto:** os textos do prontuário seguem um formato padronizado.
- **Decisão:** cada campo da descrição anestésica é uma coluna; rótulos e ordem das linhas ficam nas funções de geração. Rótulos configuráveis no banco foram rejeitados (YAGNI).
- **Consequências:** mudar um rótulo exige deploy. Formato consistente entre procedimentos.

## ADR-005 — Descrição anestésica como entidade 1:1 do procedimento cirúrgico

- **Status:** aceita (2026-10-24)
- **Decisão:** `DescricaoAnestesica` com `procedimentoId @unique` e `onDelete: Cascade`. Procedimento sem descrição anestésica é permitido, mas não aparece na tela Gerar.
- **Consequências:** cadastro em duas etapas; a exportação sempre tem os dois textos.

## ADR-006 — Geração de texto em funções puras no cliente

- **Status:** aceita (2026-10-24)
- **Decisão:** `gerarTextoCirurgico` e `gerarTextoAnestesico` em `src/lib/texto/`, sem I/O, executadas no cliente para prévia instantânea. Nada do paciente (peso) é persistido.
- **Consequências:** é a principal superfície de testes unitários.

## ADR-007 — Testes apenas unitários de funções

- **Status:** aceita (2026-10-24)
- **Decisão:** Vitest para funções puras (`src/lib/`). Sem testes de componentes, sem E2E (Playwright descartado).
- **Consequências:** UI e integração com banco são verificadas manualmente pelo Implementador e pelo Revisor.

## ADR-008 — UI com Tailwind CSS + shadcn/ui

- **Status:** aceita (2026-10-24)
- **Decisão:** Tailwind para estilos; componentes shadcn/ui (select com busca, toast, dialog de confirmação).
- **Consequências:** componentes copiados para `src/components/ui`, sem dependência de biblioteca de UI fechada.

## ADR-009 — Camada de serviços com mock em memória antes do banco

- **Status:** aceita (2026-10-24)
- **Contexto:** o usuário quer validar a experiência (telas, fluxos, textos gerados) antes de conectar ao Neon.
- **Decisão:** contratos `ServicoProfissionais` e `ServicoProcedimentos` em `src/servicos/tipos.ts`, com implementação em memória (dados de demonstração) e, depois do checkpoint de validação, implementação Prisma. Páginas e actions acessam dados apenas via `servicos()`. Erros de domínio (`ErroNomeDuplicado`, `ErroNaoEncontrado`) substituem códigos do Prisma fora de `src/servicos/prisma/`. `FONTE_DADOS=memoria` ativa o mock; qualquer outro valor ou ausência usa Prisma (falha segura em produção).
- **Consequências:** Prisma fica isolado e trocável; a implementação em memória ganha testes de contrato. O mock só é confiável localmente (memória por instância em serverless). Complementa ADR-002; o mapeamento de erros sai das actions e vai para a implementação Prisma.

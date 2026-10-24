# Pronto Vet — Regras gerais

App web para armazenar templates de procedimentos veterinários (descrição cirúrgica + descrição anestésica) e gerar os textos para colar no prontuário da clínica.

- Spec: `docs/superpowers/specs/2026-10-24-pronto-vet-design.md`
- Decisões de arquitetura: `ARCHITECT.md`
- Workflow de agentes e papéis: `AGENTS.md`
- Quadro de tarefas: `tarefas/`

@AGENTS.md

## Idioma

- **Português do Brasil** é o idioma oficial: UI, mensagens de erro, textos gerados, nomes de domínio no código (`ProcedimentoCirurgico`, `gerarTextoAnestesico`), tarefas, commits e documentação.
- Termos técnicos sem tradução natural ficam em inglês (`props`, `hook`, `Server Action`).
- Use acentuação correta em todo texto visível ao usuário.

## Stack

Next.js (App Router, Server Components + Server Actions), Prisma, Postgres (Neon), Tailwind CSS + shadcn/ui, Zod, Vitest. Deploy no free tier da Vercel.

## Regras de código

- TypeScript estrito; sem `any` sem justificativa em comentário.
- Leitura de dados em Server Components; escrita apenas via Server Actions em `src/actions/`.
- Toda Server Action: (1) verifica a sessão, (2) valida com o schema Zod de `src/lib/validacao/`, (3) retorna `{ ok: true }` ou `{ ok: false, erros }`.
- Lógica de domínio em **funções puras** em `src/lib/` — sem I/O, sem `Date.now()` implícito (receba "agora" como parâmetro quando precisar).
- Um único `PrismaClient` em `src/lib/db.ts`.
- Não persistir nenhum dado de paciente.
- Não adicionar dependências fora da stack sem registrar a decisão em `ARCHITECT.md`.
- YAGNI: nada fora do escopo da spec sem tarefa aprovada pelo Líder.

## Testes

- Apenas **testes unitários de funções** (Vitest). Sem testes de componentes e sem E2E.
- TDD para funções em `src/lib/`: teste falhando primeiro, depois implementação.
- Antes de declarar uma tarefa pronta: `npm run lint`, `npm run typecheck` e `npm test` passando — cole a saída no arquivo da tarefa.

## Git

- Commits pequenos, mensagem em pt-BR no imperativo, prefixados com o ID da tarefa: `T003: adiciona schema de profissional`.
- Nunca commitar `.env`; manter `.env.example` atualizado.

## Segredos e ambiente

`DATABASE_URL`, `DIRECT_URL`, `APP_PASSWORD`, `APP_SECRET` — apenas via variáveis de ambiente.

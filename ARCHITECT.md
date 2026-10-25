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

## ADR-010 — Sem Cache Components (renderização dinâmica padrão)

- **Status:** aceita (2026-10-24)
- **Contexto:** o `create-next-app` 16.4 habilita `cacheComponents` e `partialPrefetching` no `next.config.ts`. Todas as páginas do app ficam atrás de login (leem cookie) e mostram dados que mudam a cada edição; com Cache Components, cada leitura dinâmica exige `Suspense` ou `"use cache"`, o que adiciona complexidade sem ganho para uma equipe pequena.
- **Decisão:** remover `cacheComponents` e `partialPrefetching` do `next.config.ts`. Páginas renderizam dinamicamente; após escritas, as Server Actions chamam `revalidatePath`.
- **Consequências:** modelo mental mais simples para T006–T009. Se performance virar problema, reavaliar com nova ADR.

## ADR-011 — `retry()` em vez de `reset()` no `error.tsx`

- **Status:** aceita (2026-10-24)
- **Contexto:** no Next 16.3+, `reset()` só re-renderiza o segmento no cliente; não busca de novo os dados do Server Component. Uma falha transitória (ex.: banco) voltaria a mostrar o erro.
- **Decisão:** `error.tsx` usa `retry()`. O plano (T001) citava `reset()`; esta ADR o substitui.
- **Consequências:** "Tentar novamente" realmente refaz a requisição.

## ADR-012 — Proteção de páginas em duas camadas: proxy + layout do grupo `(app)`

- **Status:** aceita (2026-10-24)
- **Contexto:** a revisão da T006 mostrou que um matcher do proxy permissivo demais (excluir todo caminho com ponto) deixa páginas, formas `.rsc` e POSTs de Server Actions sem verificação. Páginas sem API dinâmica seriam pré-renderizadas e protegidas só pelo proxy.
- **Decisão:**
  1. O matcher do `src/proxy.ts` exclui apenas `_next/static/`, `_next/image` e uma lista explícita de arquivos estáticos de primeiro nível (`svg|png|jpg|jpeg|gif|webp|ico|txt|xml|webmanifest`).
  2. Todas as páginas protegidas ficam no grupo de rotas `src/app/(app)/`, cujo `layout.tsx` chama `await exigirSessao()` e renderiza a barra de navegação. `/entrar` fica fora do grupo.
  3. **Cada `page.tsx` protegida chama `await exigirSessao()` na primeira linha**, antes de ler qualquer dado. (Revisão da T006, rodada 2: layouts não re-renderizam em navegação no cliente — uma requisição RSC sem cookie com o layout `(app)` já montado recebeu 200 com o conteúdo da página, e o código da página roda mesmo quando o layout redireciona; ver `node_modules/next/dist/docs/01-app/02-guides/authentication.md`.)
  4. `exigirSessao()` é chamada fora de qualquer `try/catch` (o `redirect()` funciona lançando `NEXT_REDIRECT`).
- **Consequências:** camadas reais: proxy (todas as requisições) + `exigirSessao()` em cada página e em cada Server Action. O layout do grupo só garante a verificação no carregamento completo e torna as páginas dinâmicas (coerente com ADR-010); **não** é uma camada de proteção por si só. Rotas das T007–T009 vivem em `src/app/(app)/` (URLs inalteradas).

## ADR-013 — Sistema visual próprio, movimento só com CSS

- **Status:** aceita (2026-10-24)
- **Contexto:** o usuário pediu UI moderna, com animações e transições suaves e tema verde.
- **Decisão:** sistema visual em `docs/design/sistema-visual.md` (verde cirúrgico, Onest + Literata via `next/font`, fichas com faixa de campo cirúrgico, modo escuro automático com `next-themes`). Animações apenas com CSS e `tw-animate-css` (já instalados) — sem biblioteca de animação adicional. Toda animação respeita `prefers-reduced-motion`.
- **Consequências:** nenhuma dependência nova; T012 cria tokens, fontes, utilitários de movimento e componentes base antes das telas T007–T009.

## ADR-014 — Neon via CLI `neon` (perfil da Ynara) e variáveis no padrão do Neon

- **Status:** aceita (2026-10-24). Substitui, na ADR-002, o nome `DIRECT_URL`.
- **Contexto:** o projeto Neon (`green-cherry-00787842`, org `org-muddy-sea-26273725`) é da conta da Ynara; o usuário do computador usa outra conta por padrão. A integração Neon ↔ Vercel e o `neon init` usam os nomes `DATABASE_URL` (pooled) e `DATABASE_URL_UNPOOLED` (direta).
- **Decisão:**
  1. Conexão direta passa a se chamar `DATABASE_URL_UNPOOLED` (spec, `.env.example`, plano e `prisma.config.ts` da T010).
  2. Branches do Neon: `production` (padrão, usado pela Vercel em produção), `development` (usado no `.env.local`), e um branch por Preview criado pela integração da Vercel.
  3. Todo comando da CLI `neon` neste projeto usa `--profile ynara`; o perfil padrão da máquina fica para a conta do usuário.
  4. `neon.ts` (política de branches) fica versionado; `@neon/config` é `devDependency` (só tipa o `neon.ts`). `@neon/env`, adicionado pelo `neon init`, foi removido por não ser usado. A pasta `.neon` (vínculo local) fica no `.gitignore`.
  5. `neon init` rodou com `--no-agent-setup`: o plugin/MCP do Neon não foi instalado no Claude Code do usuário, para não ligar a conta da Ynara à configuração global dele.
- **Consequências:** nenhuma variável renomeada à mão na Vercel; a T010 lê `DATABASE_URL` no runtime e `DATABASE_URL_UNPOOLED` nas migrations.

## ADR-015 — CI no GitHub Actions, deploy pela integração da Vercel, uma tarefa por PR

- **Status:** aceita (2026-10-24)
- **Contexto:** o usuário aprovou o fluxo branch → PR → CI → Preview → merge → Production. Repositório privado no GitHub Free (sem proteção de branch). Vercel Hobby e Neon Free.
- **Decisão:**
  1. **CI** (`.github/workflows/ci.yml`): lint, typecheck, test e build em todo PR para `main` e todo push em `main`. Build da CI com `FONTE_DADOS=memoria` e segredos falsos — sem banco.
  2. **Deploy**: integração Git nativa da Vercel. Cada PR gera um Preview; cada merge no `main` gera Production. Nada de deploy por Actions.
  3. **Banco por Preview**: integração Neon ↔ Vercel com branch do Neon por Preview (apagado ao fechar o PR). Production usa o branch `production`.
  4. **Migrations** rodam no build da Vercel (`prisma migrate deploy && next build`, a partir da T010).
  5. **Uma tarefa = um branch `tNNN-slug` = um PR.** Merge só com a CI verde — garantido pelo processo (o Líder confere `gh pr checks`), pois a proteção de branch exige GitHub Pro em repositório privado.
  6. Variáveis na Vercel:

| Variável | Production | Preview | Origem |
|---|---|---|---|
| `DATABASE_URL` | branch `production` | branch do PR | integração Neon |
| `DATABASE_URL_UNPOOLED` | branch `production` | branch do PR | integração Neon |
| `APP_PASSWORD` | senha da equipe | outra senha | usuário |
| `APP_SECRET` | segredo A | segredo B | usuário |
| `FONTE_DADOS` | não definir | não definir | — |

- **Consequências:** todo código chega ao `main` por PR com CI verde e preview conferível. Até a T010, deploys da Vercel sobem sem banco (páginas com dados falham em runtime) — esperado.

## ADR-016 — Prisma 7.10.1 com adapter Neon, ordenação/busca em JS e scripts de banco

- **Status:** aceita (2026-10-24), registrada pelo Implementador da T010 por pedido do Líder.
- **Contexto:** a tag `latest` do `prisma` é a 8.0 rc; o banco `development` do Neon usa `lc_collate = C.UTF-8` (ordena por bytes) e `ILIKE` não ignora maiúsculas acentuadas nesse ctype.
- **Decisão:**
  1. `prisma`, `@prisma/client` e `@prisma/adapter-neon` fixos em 7.10.1 (`@neondatabase/serverless` 1.2.0 vem como dependência do adapter). Generator `prisma-client` em `src/generated/prisma` (ignorado no git e no ESLint), gerado no `postinstall`.
  2. `tsx` e `dotenv` entram como `devDependencies` (seed e `prisma.config.ts` carregam `.env.local`); o seed roda com `--conditions=react-server` para que `import "server-only"` de `src/lib/db.ts` não lance fora do Next.
  3. Listagem e busca de procedimentos e ordenação de profissionais são feitas em JS com `compararNomes` e `nomeContemTermo` (`src/servicos/nomes.ts`), compartilhadas com a memória: paridade exata de ordem pt-BR e de busca (acentos, maiúsculas, `%` e `_` literais) independentemente da collation do banco. O volume é pequeno.
  4. `build` continua `next build` (a CI não tem banco); `vercel-build` = `prisma generate && prisma migrate deploy && next build`. O seed é só local (`npm run db:seed`).
- **Consequências:** nenhuma dependência de runtime fora da stack além do adapter Neon; trocar de collation ou de banco não muda o comportamento observável.

## ADR-017 — Driver HTTP do Neon (`PrismaNeonHttp`) e escrita sem `include`

- **Status:** aceita (2026-10-24), registrada pelo Implementador da T015 por pedido do Líder.
- **Contexto:** a T015 pede menos latência por navegação. O adapter `@prisma/adapter-neon` 7.10.1 expõe `PrismaNeon` (WebSocket, `Pool`) e `PrismaNeonHttp` (uma requisição HTTP por consulta, sem conexão persistente), sem dependência nova. O HTTP não suporta transação (`startTransaction` lança "Transactions are not supported in HTTP mode").
- **Decisão:**
  1. `src/lib/db.ts` usa `new PrismaNeonHttp(DATABASE_URL, {})`.
  2. Nenhum serviço usa `$transaction`; mas o Prisma abre transação implícita em `create`/`update` com `include` (escrita + leitura da relação). Em `ServicoProcedimentos`, `criar` devolve `descricaoAnestesica: null` (procedimento novo não tem) e `atualizar` lê a descrição em consulta separada. `upsert` de `DescricaoAnestesica` (chave única `procedimentoId`, igual no `where` e no `create`) vira `INSERT ... ON CONFLICT` nativo e funciona.
  3. O adapter HTTP não converte erros do Postgres: a violação de unicidade chega com `code: "23505"` (não `P2002`), sem `meta.target`; a restrição só aparece na mensagem (`..._nome_key`). `traduzirErroPrisma` trata esse formato para devolver `ErroNomeDuplicado`.
- **Consequências:** qualquer futura escrita com relação aninhada ou `$transaction` exigirá voltar ao `PrismaNeon` (WebSocket) ou reestruturar a operação. Ganho medido é pequeno (ver tarefa T015).

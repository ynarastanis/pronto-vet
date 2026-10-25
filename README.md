# Pronto Vet

App web para armazenar templates de procedimentos veterinários (descrição cirúrgica e descrição anestésica) e gerar os textos prontos para colar no prontuário da clínica. Nenhum dado de paciente é guardado.

Stack: Next.js (App Router), Prisma, Postgres (Neon), Tailwind CSS + shadcn/ui, Zod e Vitest. Deploy na Vercel.

## Rodar localmente

Requisitos: Node 24 e npm.

```bash
npm ci
```

### Com dados de demonstração (mock em memória)

Não precisa de banco. Copie o exemplo de variáveis e mantenha `FONTE_DADOS=memoria`:

```bash
cp .env.example .env.local
# edite .env.local: defina APP_PASSWORD e APP_SECRET (ex.: openssl rand -base64 32)
npm run dev
```

Abra http://localhost:3000. Os dados ficam só na memória do servidor e voltam ao estado inicial a cada reinício.

### Com banco (Neon, branch `development`)

O projeto Neon é da conta da Ynara e é um só (ADR-018): `long-lab-10816041`, na org `org-patient-pond-01447185`. Use sempre o perfil `ynara` da CLI do Neon. Para vincular a pasta ao branch `development` (uma vez por máquina):

```bash
neon init --profile ynara --org-id org-patient-pond-01447185 --project-id long-lab-10816041 --branch development --no-agent-setup
```

Atenção: o `neon init` pode re-adicionar `@neon/env` ao `package.json`; descarte essa alteração (ADR-014, item 4).

Para gerar o `.env.local` apontando para o branch `development` (variáveis `DATABASE_URL` e `DATABASE_URL_UNPOOLED`):

```bash
neon env pull --profile ynara
```

Depois, acrescente `APP_PASSWORD` e `APP_SECRET` e remova (ou deixe em branco) `FONTE_DADOS`. Para aplicar as migrations e popular o banco de desenvolvimento: `npm run db:migrate` e `npm run db:seed`.

Nunca commite `.env` nem `.env.local`.

### Testar no celular pela rede local

Com o computador e o celular na mesma rede Wi-Fi, descubra o IP do computador e suba o servidor nele:

```bash
npx next dev -H <ip-do-computador>
```

Abra `http://<ip-do-computador>:3000` no celular.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção, sem banco (usado pela CI) |
| `npm run vercel-build` | Build da Vercel: `prisma generate`, `prisma migrate deploy` e `next build` (precisa de `DATABASE_URL_UNPOOLED`) |
| `npm start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `npm test` | Testes unitários (Vitest) |
| `npm run db:migrate` | `prisma migrate dev`: cria e aplica migrations no banco local (`development`) |
| `npm run db:seed` | Popula o banco local com dados de demonstração |
| `npm run db:reset` | **Apaga** tudo o que foi feito no branch `development` do Neon e o recria como cópia atual do `main` (produção). Sem confirmação. Exige a CLI `neon` instalada e o perfil `ynara` logado |
| `postinstall` | Roda sozinho após `npm install`/`npm ci`: `prisma generate` |

## Fluxo de trabalho e deploy

1. Cada tarefa vive em um branch `tNNN-slug` criado a partir do `main` atualizado e vira um Pull Request. Ninguém commita direto no `main`.
2. Todo PR para o `main` (e todo push no `main`) dispara a CI do GitHub Actions (`.github/workflows/ci.yml`): `lint`, `typecheck`, `test` e `build`. O build da CI usa `FONTE_DADOS=memoria` e segredos falsos, sem banco, por isso roda `build` e não `vercel-build`.
3. A integração Git da Vercel gera um **Preview** para cada PR. A integração Neon ↔ Vercel cria um branch do Neon `preview/<git-branch>` por Preview; a Vercel usa `vercel-build`, que aplica as migrations nesse branch.
4. Com a CI verde e, em mudanças de UI ou de banco, o Preview conferido, o PR é mesclado com `gh pr merge --squash --delete-branch`.
5. O merge no `main` gera o deploy de **Production**, que usa o branch `main` do Neon (o padrão do projeto) e também roda `vercel-build`.
6. Os branches `preview/*` **não** são apagados após o merge: limpe-os periodicamente.

```bash
neon branches delete --profile ynara --org-id org-patient-pond-01447185 --project-id long-lab-10816041 preview/<nome>
```

A proteção de branch não está disponível (repositório privado no GitHub Free): a regra de só mesclar com a CI verde é garantida pelo processo.

## Variáveis de ambiente

| Variável | Production | Preview | Origem |
|---|---|---|---|
| `DATABASE_URL` | branch `main` | branch do PR | integração Neon |
| `DATABASE_URL_UNPOOLED` | branch `main` | branch do PR | integração Neon |
| `APP_PASSWORD` | senha da equipe | outra senha | usuário |
| `APP_SECRET` | segredo A | segredo B | usuário |
| `FONTE_DADOS` | não definir | não definir | — |

Variável de ambiente nova ou alterada na Vercel só vale em deploys feitos depois da mudança: depois de editá-la, faça **Redeploy**.

`FONTE_DADOS=memoria` é só para desenvolvimento local; produção nunca o define. Veja `.env.example`.

## Contas

- GitHub (`ynarastanis/pronto-vet`), Neon (projeto `long-lab-10816041`, org `org-patient-pond-01447185`, branches `main`, `development` e `preview/*`) e Vercel são da Ynara.
- Na CLI do Neon, use sempre `--profile ynara`; o perfil padrão da máquina pertence a outra conta.
- Antes de `git push` ou `gh`, confira `gh auth status`: a conta ativa deve ser `ynarastanis`.

## Documentação

- Spec: [`docs/superpowers/specs/2026-10-24-pronto-vet-design.md`](docs/superpowers/specs/2026-10-24-pronto-vet-design.md)
- Decisões de arquitetura: [`ARCHITECT.md`](ARCHITECT.md)
- Workflow de agentes, branches e CI: [`AGENTS.md`](AGENTS.md)
- Sistema visual: [`docs/design/sistema-visual.md`](docs/design/sistema-visual.md)
- Regras do projeto: [`CLAUDE.md`](CLAUDE.md)

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

O projeto Neon é da conta da Ynara. Use sempre o perfil `ynara` da CLI do Neon (ADR-014):

```bash
neon deploy --profile ynara
```

O comando gera o `.env.local` apontando para o branch `development` (variáveis `DATABASE_URL` e `DATABASE_URL_UNPOOLED`). Depois, acrescente `APP_PASSWORD` e `APP_SECRET` e remova (ou deixe em branco) `FONTE_DADOS`. O acesso a dados via Prisma chega com a T010; até lá, use o mock.

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
| `npm run build` | Build de produção |
| `npm start` | Serve o build de produção |
| `npm run lint` | ESLint |
| `npm run typecheck` | Checagem de tipos (`tsc --noEmit`) |
| `npm test` | Testes unitários (Vitest) |

## Fluxo de trabalho e deploy

1. Cada tarefa vive em um branch `tNNN-slug` criado a partir do `main` atualizado e vira um Pull Request. Ninguém commita direto no `main`.
2. Todo PR para o `main` (e todo push no `main`) dispara a CI do GitHub Actions (`.github/workflows/ci.yml`): `lint`, `typecheck`, `test` e `build`. O build da CI usa `FONTE_DADOS=memoria` e segredos falsos, sem banco.
3. A integração Git da Vercel gera um **Preview** para cada PR. A integração Neon ↔ Vercel cria um branch do Neon por Preview e o apaga ao fechar o PR.
4. Com a CI verde e, em mudanças de UI ou de banco, o Preview conferido, o PR é mesclado com `gh pr merge --squash --delete-branch`.
5. O merge no `main` gera o deploy de **Production**, que usa o branch `production` do Neon.

A proteção de branch não está disponível (repositório privado no GitHub Free): a regra de só mesclar com a CI verde é garantida pelo processo.

## Variáveis de ambiente

| Variável | Production | Preview | Origem |
|---|---|---|---|
| `DATABASE_URL` | branch `production` | branch do PR | integração Neon |
| `DATABASE_URL_UNPOOLED` | branch `production` | branch do PR | integração Neon |
| `APP_PASSWORD` | senha da equipe | outra senha | usuário |
| `APP_SECRET` | segredo A | segredo B | usuário |
| `FONTE_DADOS` | não definir | não definir | — |

`FONTE_DADOS=memoria` é só para desenvolvimento local; produção nunca o define. Veja `.env.example`.

## Contas

- GitHub (`ynarastanis/pronto-vet`), Neon (projeto `green-cherry-00787842`, org `org-muddy-sea-26273725`, branches `production` e `development`) e Vercel são da Ynara.
- Na CLI do Neon, use sempre `--profile ynara`; o perfil padrão da máquina pertence a outra conta.
- Antes de `git push` ou `gh`, confira `gh auth status`: a conta ativa deve ser `ynarastanis`.

## Documentação

- Spec: [`docs/superpowers/specs/2026-10-24-pronto-vet-design.md`](docs/superpowers/specs/2026-10-24-pronto-vet-design.md)
- Decisões de arquitetura: [`ARCHITECT.md`](ARCHITECT.md)
- Workflow de agentes, branches e CI: [`AGENTS.md`](AGENTS.md)
- Sistema visual: [`docs/design/sistema-visual.md`](docs/design/sistema-visual.md)
- Regras do projeto: [`CLAUDE.md`](CLAUDE.md)

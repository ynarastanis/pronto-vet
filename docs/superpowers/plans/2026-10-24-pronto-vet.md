# Pronto Vet — Plano de Implementação

> **Para agentes:** a execução segue o workflow de `AGENTS.md` (Implementador Sonnet por tarefa → Revisor Opus em sessão limpa), equivalente a superpowers:subagent-driven-development. Cada task abaixo corresponde a um arquivo `tarefas/todo/T<NNN>-*.md`. Passos usam checkbox (`- [ ]`).

**Objetivo:** app web em pt-BR para cadastrar profissionais e procedimentos (descrição cirúrgica + descrição anestésica) e gerar os dois textos de prontuário para copiar separadamente.

**Arquitetura:** Next.js App Router — Server Components leem via Prisma, Server Actions escrevem com validação Zod. Geração de texto em funções puras no cliente. Acesso protegido por senha compartilhada com cookie HMAC verificado no `proxy.ts` e em toda Server Action.

**Stack:** Next.js 16, React, TypeScript, Prisma 7 + `@prisma/adapter-neon`, Postgres (Neon), Zod 4, Tailwind CSS 4, shadcn/ui, Vitest 5.

**Spec:** `docs/superpowers/specs/2026-10-24-pronto-vet-design.md` — ler junto com este plano.

## Restrições globais

- Todo texto visível ao usuário em **português do Brasil**, com acentuação.
- Versões: `next@16.4.x`, `prisma`/`@prisma/client`/`@prisma/adapter-neon@7.10.x` (**não** usar a 8.0 rc, que está na tag `latest` do npm), `zod@4.x`, `vitest@5.x`, `tailwindcss@4.x`, `shadcn@4.x`. Seguir a documentação oficial dessas versões (Next 16 usa `src/proxy.ts` exportando `proxy`; Prisma 7 usa `prisma.config.ts`, generator `prisma-client` com `output` e driver adapter obrigatório).
- Dependências permitidas além das acima: as que o `shadcn` instala, `server-only`, `dotenv`, `tsx`. Qualquer outra → registrar ADR em `ARCHITECT.md` antes.
- Testes: apenas unitários de funções (`src/**/*.test.ts`), Vitest, ambiente `node`.
- Scripts obrigatórios em `package.json`: `lint` (`eslint .`), `typecheck` (`tsc --noEmit`), `test` (`vitest run`).
- Commits: `T<NNN>: <descrição pt-BR no imperativo>`.
- Nenhum dado de paciente persistido; peso só existe no estado do cliente.
- Variáveis de ambiente: `DATABASE_URL` (pooled), `DIRECT_URL` (direta), `APP_PASSWORD`, `APP_SECRET`.

## Foco de revisão

1. **Textareas enviam `\r\n`** → texto gerado deve sair só com `\n` (T002).
2. **Campo opcional só com espaços** → tratado como vazio: salvo como `null` (T003) e linha omitida (T002).
3. **Peso digitado com unidade** ("5 kg", "5kg") → não gerar "5 kg kg" (T002).
4. **`APP_PASSWORD` ou `APP_SECRET` ausentes/vazios no ambiente** → login sempre recusado, token nunca válido; falhar fechado (T004).
5. **Profissional salvo no `localStorage` foi excluído** → seleção ignorada, sem erro (T009).

## Dependências entre tasks

```
T001 ─┬─ T002 ───────────────┐
      ├─ T003 ─┬─ T006 ─┬─ T007
      ├─ T004 ─┘        ├─ T008
      └─ T005 ──────────┴─ T009 ── T010
```

T002, T003, T004 e T005 podem rodar em paralelo após T001 (arquivos disjuntos). T007 e T008 podem rodar em paralelo (arquivos disjuntos; ambos só *leem* `src/lib/`).

## Mapa de arquivos

| Arquivo | Responsabilidade | Task |
|---|---|---|
| `package.json`, `vitest.config.ts`, `.env.example`, `src/app/layout.tsx`, `src/app/error.tsx`, `src/app/not-found.tsx`, `src/components/ui/*` | Base do projeto | T001 |
| `src/lib/texto/tipos.ts`, `cirurgico.ts`, `anestesico.ts`, `normalizar.ts` (+ `.test.ts`) | Geração dos textos | T002 |
| `src/lib/validacao/validar.ts`, `profissional.ts`, `procedimento.ts`, `descricao-anestesica.ts` (+ `.test.ts`) | Schemas Zod e resultado das actions | T003 |
| `src/lib/auth/token.ts` (+ `.test.ts`) | Token HMAC e comparação de senha | T004 |
| `prisma/schema.prisma`, `prisma.config.ts`, `prisma/seed.ts`, `src/lib/db.ts`, `src/lib/erros-prisma.ts` (+ `.test.ts`) | Banco | T005 |
| `src/lib/auth/sessao.ts`, `src/proxy.ts`, `src/actions/auth.ts`, `src/app/entrar/page.tsx`, `src/components/barra-navegacao.tsx` | Login e navegação | T006 |
| `src/actions/profissionais.ts`, `src/app/profissionais/page.tsx`, `src/components/profissionais/*` | CRUD de profissionais | T007 |
| `src/actions/procedimentos.ts`, `src/app/procedimentos/**`, `src/components/procedimentos/*`, `src/components/confirmar-exclusao.tsx` | CRUD de procedimentos + descrição anestésica | T008 |
| `src/lib/preferencias.ts` (+ `.test.ts`), `src/app/page.tsx`, `src/components/gerar/*`, `src/components/botao-copiar.tsx` | Tela Gerar | T009 |
| `README.md`, ajustes em `package.json` | Deploy | T010 |

---

### Task T001: Base do projeto

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `postcss.config.mjs`, `vitest.config.ts`, `.env.example`, `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`, `src/app/error.tsx`, `src/app/not-found.tsx`, `src/components/ui/*`, `src/lib/utils.ts`
- Modify: `.gitignore` (mesclar)
- Test: `src/lib/sanidade.test.ts`

**Interfaces:**
- Produces: alias `@/*` → `src/*`; scripts `lint`, `typecheck`, `test`; componentes shadcn `button input label textarea select card alert-dialog badge sonner command popover`.

- [ ] **Passo 1: Gerar o app em pasta temporária** — `create-next-app` recusa diretório com arquivos e **gera seus próprios `AGENTS.md`/`CLAUDE.md`**. Rodar `npx create-next-app@16.4.3 <scratch>/pronto-vet-base --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` e copiar para a raiz **sem** sobrescrever `CLAUDE.md`, `AGENTS.md`, `ARCHITECT.md`, `docs/`, `tarefas/`, `.claude/`. Mesclar o `.gitignore` gerado com o existente. Se o Next gerou instruções úteis no `AGENTS.md` dele, anexá-las numa seção "Notas do Next.js" do nosso `CLAUDE.md`.
- [ ] **Passo 2: Ajustar `layout.tsx`** — `<html lang="pt-BR">`, `metadata = { title: "Pronto Vet", description: "Templates de descrições cirúrgicas e anestésicas" }`, `<Toaster />` do sonner.
- [ ] **Passo 3: `page.tsx` provisória** — apenas `<h1>Gerar</h1>` (substituída em T009).
- [ ] **Passo 4: `error.tsx`** (client) com "Algo deu errado. Tente novamente." e botão "Tentar novamente" chamando `reset()`; **`not-found.tsx`** com "Página não encontrada." e link "Voltar ao início".
- [ ] **Passo 5: shadcn** — `npx shadcn@4 init` e `npx shadcn@4 add button input label textarea select card alert-dialog badge sonner command popover`.
- [ ] **Passo 6: Vitest** — `npm i -D vitest@5`; `vitest.config.ts` com `test: { include: ["src/**/*.test.ts"], environment: "node" }` e `resolve.alias` `"@"` → `src`. Scripts: `"lint": "eslint ."`, `"typecheck": "tsc --noEmit"`, `"test": "vitest run"`.
- [ ] **Passo 7: Teste de sanidade** — `src/lib/sanidade.test.ts`: `it("roda testes", () => expect(1 + 1).toBe(2))`.
- [ ] **Passo 8: `.env.example`**

```
# Neon — conexão com pooler (runtime)
DATABASE_URL=
# Neon — conexão direta (migrations)
DIRECT_URL=
# Senha compartilhada da equipe
APP_PASSWORD=
# Chave para assinar o cookie de sessão (ex.: openssl rand -base64 32)
APP_SECRET=
```

- [ ] **Passo 9: Verificar** — `npm run lint && npm run typecheck && npm test && npm run build` → todos com sucesso; `npm run dev` mostra "Gerar".
- [ ] **Passo 10: Commit** — `T001: cria base Next.js com Tailwind, shadcn e Vitest`.

---

### Task T002: Geração dos textos

**Files:**
- Create: `src/lib/texto/tipos.ts`, `src/lib/texto/normalizar.ts`, `src/lib/texto/cirurgico.ts`, `src/lib/texto/anestesico.ts`
- Test: `src/lib/texto/cirurgico.test.ts`, `src/lib/texto/anestesico.test.ts`

**Interfaces:**
- Produces:

```ts
// tipos.ts
export type DadosDescricaoAnestesica = {
  asa: string;
  mpa: string | null; inducao: string | null; manutencao: string | null;
  bloqueioLocal: string | null; analgesiaTrans: string | null;
  antibioticoPre: string | null; posImediato: string | null; observacoes: string | null;
};
export type DadosProcedimento = {
  nome: string; descricaoTecnica: string; prescricao: string;
  descricaoAnestesica: DadosDescricaoAnestesica;
};
export type EntradaGeracao = {
  procedimento: DadosProcedimento;
  cirurgiao: string | null;   // nome
  anestesista: string | null; // nome
  peso: string;               // livre, pode ser ""
};
// normalizar.ts
export function normalizarTexto(valor: string | null | undefined): string; // \r\n e \r → \n; trim; null/undefined → ""
// cirurgico.ts / anestesico.ts
export function gerarTextoCirurgico(entrada: EntradaGeracao): string;
export function gerarTextoAnestesico(entrada: EntradaGeracao): string;
```

Fixture comum nos testes (exemplos da spec):

```ts
const procedimento: DadosProcedimento = {
  nome: "OHE ELETIVA FELINA",
  descricaoTecnica: "Incisão retro umbilical com lâmina n° 23.\nSem intercorrências.",
  prescricao: "Prescrito: dipirona 25 mg/kg bid 5 dias.\nRetorno em 15 dias.",
  descricaoAnestesica: {
    asa: "I",
    mpa: "Cetamina (2mg/kg) + Xilazina (0,5mg/kg) + Morfina (0,2mg/kg) + Midazolam (0,2mg/kg) Administrados IM",
    inducao: "Propofol (4mg/kg) dose efeito IV",
    manutencao: "Isoflurano",
    bloqueioLocal: "Lidocaína (4mg/kg)",
    analgesiaTrans: "Fentanil (4mcg/kg) IV",
    antibioticoPre: "Cefalotina (30mg/kg) IV",
    posImediato: "Dipirona (25mg/kg) + Meloxicam (0,05mg/kg) SC + Tramadol (3mg/kg) SC",
    observacoes: "Sem intercorrências. Parâmetros fisiológicos se mantiveram dentro da normalidade para a espécie.",
  },
};
const entrada: EntradaGeracao = { procedimento, cirurgiao: "Dra. Ana Souza", anestesista: "Dr. Bruno Lima", peso: "4,2" };
```

- [ ] **Passo 1: Testes do cirúrgico (falhando)**

```ts
it("gera o texto cirúrgico completo", () => {
  expect(gerarTextoCirurgico(entrada)).toBe(
    "PROCEDIMENTO CIRÚRGICO: OHE ELETIVA FELINA\n\n" +
    "CIRURGIÃO: Dra. Ana Souza\nANESTESISTA: Dr. Bruno Lima\n\n" +
    "Incisão retro umbilical com lâmina n° 23.\nSem intercorrências.\n\n" +
    "Prescrito: dipirona 25 mg/kg bid 5 dias.\nRetorno em 15 dias."
  );
});
it("usa -- para cirurgião e anestesista ausentes", ...)       // contém "CIRURGIÃO: --\nANESTESISTA: --"
it("remove espaços nas pontas dos campos", ...)              // descricaoTecnica "  a\nb  " → bloco "a\nb"
it("normaliza \\r\\n para \\n", ...)                          // prescricao "x\r\ny" → resultado não contém "\r"
```

- [ ] **Passo 2: Rodar** `npx vitest run src/lib/texto` → FAIL (módulo inexistente).
- [ ] **Passo 3: Implementar** `normalizarTexto` e `gerarTextoCirurgico` (blocos unidos por `"\n\n"`, sem `\n` final).
- [ ] **Passo 4: Testes do anestésico (falhando)**

```ts
it("gera o texto anestésico completo", () => {
  expect(gerarTextoAnestesico(entrada)).toBe([
    "CIRURGIÃO: Dra. Ana Souza",
    "ANESTESISTA: Dr. Bruno Lima",
    "Peso do paciente: 4,2 kg",
    "ASA: I",
    "Procedimento: OHE ELETIVA FELINA",
    "Medicação Pré Anestésica: Cetamina (2mg/kg) + Xilazina (0,5mg/kg) + Morfina (0,2mg/kg) + Midazolam (0,2mg/kg) Administrados IM",
    "INDUÇÃO: Propofol (4mg/kg) dose efeito IV",
    "MANUTENÇÃO: Isoflurano",
    "BLOQUEIO LOCAL: Lidocaína (4mg/kg)",
    "ANALGESIA TRANS: Fentanil (4mcg/kg) IV",
    "ANTIBIOTICO PRÉ: Cefalotina (30mg/kg) IV",
    "PÓS IMEDIATO: Dipirona (25mg/kg) + Meloxicam (0,05mg/kg) SC + Tramadol (3mg/kg) SC",
    "Sem intercorrências. Parâmetros fisiológicos se mantiveram dentro da normalidade para a espécie.",
  ].join("\n"));
});
it("omite linhas de campos opcionais nulos, vazios ou só com espaços", ...)
  // bloqueioLocal: null, analgesiaTrans: "", observacoes: "   " →
  // não contém "BLOQUEIO LOCAL", "ANALGESIA TRANS"; última linha é "PÓS IMEDIATO: ..."
it("usa -- quando o peso está em branco", ...)                // peso "" e "   " → linha "Peso do paciente: -- kg"
it("não duplica a unidade quando o peso já tem kg", ...)      // "5 kg", "5kg", "5 KG" → "Peso do paciente: 5 kg"
it("usa -- para profissionais ausentes", ...)
it("normaliza \\r\\n em campos com várias linhas", ...)       // posImediato "a\r\nb" → contém "PÓS IMEDIATO: a\nb"
```

- [ ] **Passo 5: Rodar** → FAIL nos novos testes.
- [ ] **Passo 6: Implementar** `gerarTextoAnestesico`. Peso: `normalizarTexto`, remover sufixo `/\s*kg$/i`, vazio → `--`. Linhas opcionais em ordem fixa, cada uma `rótulo + ": " + valor`; `observacoes` sem rótulo.
- [ ] **Passo 7: Rodar** `npm test` → PASS; `npm run lint && npm run typecheck` → OK.
- [ ] **Passo 8: Commit** — `T002: adiciona geração dos textos cirúrgico e anestésico`.

---

### Task T003: Validação (Zod)

**Files:**
- Create: `src/lib/validacao/validar.ts`, `profissional.ts`, `procedimento.ts`, `descricao-anestesica.ts`
- Test: `src/lib/validacao/validacao.test.ts`

**Interfaces:**
- Produces:

```ts
// validar.ts
export type ErrosCampos = Record<string, string>;
export type ResultadoValidacao<T> = { ok: true; dados: T } | { ok: false; erros: ErrosCampos };
export type ResultadoAcao = { ok: true } | { ok: false; erros: ErrosCampos } | null; // estado do useActionState
export function validarFormulario<T>(schema: z.ZodType<T>, formData: FormData): ResultadoValidacao<T>;
  // Object.fromEntries(formData) → safeParse; primeira mensagem por campo (issue.path[0])
// profissional.ts
export const schemaProfissional; export type DadosProfissional = { nome: string; papel: "CIRURGIAO" | "ANESTESISTA" };
// procedimento.ts
export const schemaProcedimento; export type DadosProcedimentoForm = { nome: string; descricaoTecnica: string; prescricao: string };
// descricao-anestesica.ts
export const OPCOES_ASA = ["I","II","III","IV","V","I E","II E","III E","IV E","V E"] as const;
export const schemaDescricaoAnestesica; export type DadosDescricaoAnestesicaForm; // campos opcionais: string | null
```

Regras e mensagens (exatas):

| Campo | Regra | Mensagem |
|---|---|---|
| `nome` (profissional) | trim, 1–120 | "Informe o nome." / "Máximo de 120 caracteres." |
| `papel` | enum | "Selecione o papel." |
| `nome` (procedimento) | trim, 1–150 | "Informe o nome." / "Máximo de 150 caracteres." |
| `descricaoTecnica` | trim, 1–10000 | "Informe a descrição da técnica." / "Máximo de 10000 caracteres." |
| `prescricao` | trim, 1–10000 | "Informe a prescrição." / "Máximo de 10000 caracteres." |
| `asa` | ∈ `OPCOES_ASA` | "Selecione a classificação ASA." |
| opcionais anestésicos | trim; vazio → `null`; ≤2000 | "Máximo de 2000 caracteres." |

O trim dos campos de texto **não** altera quebras de linha internas (normalização de `\r\n` é feita na geração, T002).

- [ ] **Passo 1: Testes (falhando)** — cada um monta `FormData` e chama `validarFormulario`:

```ts
it("aceita profissional e remove espaços do nome")        // " Ana " + CIRURGIAO → dados.nome "Ana"
it("rejeita profissional sem nome")                        // erros.nome "Informe o nome."
it("rejeita nome com 121 caracteres")                      // "Máximo de 120 caracteres."
it("rejeita papel inválido")                               // papel "OUTRO" → erros.papel "Selecione o papel."
it("rejeita procedimento com técnica só com espaços")      // erros.descricaoTecnica "Informe a descrição da técnica."
it("rejeita procedimento sem prescrição")                  // campo ausente → erros.prescricao "Informe a prescrição."
it("aceita ASA emergencial 'II E' e rejeita 'VI'")
it("converte opcionais vazios ou só com espaços em null")  // mpa "" e inducao "   " → null
it("rejeita opcional com 2001 caracteres")                 // erros.mpa "Máximo de 2000 caracteres."
```

- [ ] **Passo 2: Rodar** `npx vitest run src/lib/validacao` → FAIL.
- [ ] **Passo 3: Implementar** schemas (Zod 4: mensagens via `{ error: "..." }`) e `validarFormulario`.
- [ ] **Passo 4: Rodar** `npm test`, `npm run lint`, `npm run typecheck` → OK.
- [ ] **Passo 5: Commit** — `T003: adiciona schemas de validação em pt-BR`.

---

### Task T004: Token de sessão e senha

**Files:**
- Create: `src/lib/auth/token.ts`
- Test: `src/lib/auth/token.test.ts`

**Interfaces:**
- Produces (somente Web Crypto `crypto.subtle`, sem `node:crypto`, para rodar no proxy e no servidor):

```ts
export const NOME_COOKIE = "sessao";
export const DURACAO_SESSAO_MS = 30 * 24 * 60 * 60 * 1000;
export async function assinarToken(segredo: string | undefined, expiraEm: number): Promise<string>;
  // "<expiraEm>.<base64url(HMAC-SHA256(segredo, String(expiraEm)))>"; segredo vazio/ausente → throw new Error("APP_SECRET não configurado")
export async function verificarToken(token: string | undefined, segredo: string | undefined, agora: number): Promise<boolean>;
  // nunca lança; false se malformado, assinatura inválida, segredo ausente ou agora >= expiraEm
export async function senhaConfere(digitada: string, esperada: string | undefined): Promise<boolean>;
  // compara SHA-256 das duas em tempo constante; esperada vazia/ausente → false
```

- [ ] **Passo 1: Testes (falhando)**

```ts
it("verifica token válido antes da expiração")            // assinar(s, 2000); verificar(t, s, 1000) → true
it("recusa token expirado")                               // verificar(t, s, 2000) → false
it("recusa assinatura adulterada")                        // troca último caractere → false
it("recusa token assinado com outro segredo")
it("recusa token malformado sem lançar")                  // undefined, "", "abc", "x.y", "123.", ".abc" → false
it("recusa expiração adulterada")                         // "9999.<assinatura de 2000>" → false
it("falha fechado sem segredo")                           // verificar(t, undefined|"", 0) → false; assinar("", 1) rejeita com "APP_SECRET não configurado"
it("senhaConfere aceita igual e recusa diferente")
it("senhaConfere recusa quando APP_PASSWORD não está definida") // ("", undefined), ("", "") → false
```

- [ ] **Passo 2: Rodar** `npx vitest run src/lib/auth` → FAIL.
- [ ] **Passo 3: Implementar** com `crypto.subtle.importKey`/`sign`/`verify` (o `verify` do HMAC já é tempo constante) e `digest("SHA-256")` + comparação byte a byte acumulando XOR.
- [ ] **Passo 4: Rodar** `npm test`, lint, typecheck → OK.
- [ ] **Passo 5: Commit** — `T004: adiciona token HMAC de sessão e verificação de senha`.

---

### Task T005: Banco de dados

**Pré-requisito (Líder):** pedir ao usuário as URLs do Neon (`DATABASE_URL` pooled e `DIRECT_URL`) de um branch de desenvolvimento e gravá-las em `.env` local (não commitado).

**Files:**
- Create: `prisma/schema.prisma`, `prisma.config.ts`, `prisma/migrations/*`, `prisma/seed.ts`, `src/lib/db.ts`, `src/lib/erros-prisma.ts`
- Test: `src/lib/erros-prisma.test.ts`
- Modify: `package.json` (scripts `postinstall: prisma generate`, `db:migrate: prisma migrate dev`, `db:seed: tsx prisma/seed.ts`), `.gitignore` (`src/generated/`)

**Interfaces:**
- Consumes: nada além de T001 (o tipo de retorno abaixo é escrito inline para não depender de T003; é compatível com `ResultadoAcao`).
- Produces:

```ts
// db.ts (import "server-only")
export const db: PrismaClient; // singleton em globalThis no dev; adapter PrismaNeon({ connectionString: process.env.DATABASE_URL })
// erros-prisma.ts
export function traduzirErroPrisma(erro: unknown): { ok: false; erros: Record<string, string> } | null;
  // code "P2002" → { ok: false, erros: { nome: "Já existe um procedimento com este nome." } }; outros → null
```

Modelos: exatamente os da spec §5 (`Papel`, `Profissional`, `ProcedimentoCirurgico`, `DescricaoAnestesica`). Generator `prisma-client` com `output = "../src/generated/prisma"`. `prisma.config.ts` com `import "dotenv/config"`, schema `prisma/schema.prisma`, migrations `prisma/migrations`, `seed: "tsx prisma/seed.ts"` e datasource url `DIRECT_URL`.

- [ ] **Passo 1: Teste (falhando)** — `traduzirErroPrisma({ code: "P2002" })` → objeto acima; `traduzirErroPrisma(new Error("x"))` → `null`; `traduzirErroPrisma({ code: "P2025" })` → `null`.
- [ ] **Passo 2: Rodar** → FAIL. **Passo 3: Implementar** (checagem por forma do objeto, sem `instanceof`). **Passo 4: Rodar** → PASS.
- [ ] **Passo 5: Schema e migration** — `npm run db:migrate -- --name inicial` → migration criada e aplicada no branch de dev.
- [ ] **Passo 6: `db.ts`** conforme Interfaces.
- [ ] **Passo 7: Seed** — idempotente (`upsert` por `nome`): procedimento `"OVARIOHISTECTOMIA (DEMONSTRAÇÃO)"` com a técnica e a prescrição do exemplo cirúrgico da spec e a descrição anestésica do exemplo anestésico; profissionais `"Cirurgião Exemplo"` (CIRURGIAO) e `"Anestesista Exemplo"` (ANESTESISTA), criados só se não existir profissional com o mesmo nome. Rodar `npm run db:seed` duas vezes → sem duplicatas.
- [ ] **Passo 8: Verificar** — `npm test && npm run lint && npm run typecheck && npm run build` → OK.
- [ ] **Passo 9: Commit** — `T005: adiciona schema Prisma, migration inicial e seed`.

---

### Task T006: Login, proxy e navegação

**Files:**
- Create: `src/lib/auth/sessao.ts`, `src/proxy.ts`, `src/actions/auth.ts`, `src/app/entrar/page.tsx`, `src/components/entrar/formulario-entrar.tsx`, `src/components/barra-navegacao.tsx`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Consumes: `NOME_COOKIE`, `DURACAO_SESSAO_MS`, `assinarToken`, `verificarToken`, `senhaConfere` (T004); `ResultadoAcao` (T003).
- Produces:

```ts
// sessao.ts (import "server-only")
export async function criarSessao(): Promise<void>;   // cookie httpOnly, secure em produção, sameSite "lax", path "/", maxAge 30 dias
export async function encerrarSessao(): Promise<void>;
export async function exigirSessao(): Promise<void>;  // sessão inválida → redirect("/entrar"); primeira linha de TODA Server Action
// actions/auth.ts ("use server")
export async function entrar(estado: ResultadoAcao, formData: FormData): Promise<ResultadoAcao>;
  // senha errada → espera 1000 ms → { ok: false, erros: { senha: "Senha incorreta." } }; certa → criarSessao(); redirect("/")
export async function sair(): Promise<void>; // encerrarSessao(); redirect("/entrar")
```

- `src/proxy.ts`: exporta `proxy(request)` e `config.matcher` excluindo `_next/static`, `_next/image`, `favicon.ico` e arquivos com extensão. Sem token válido e rota ≠ `/entrar` → redirect `/entrar`. Com token válido em `/entrar` → redirect `/`.
- `/entrar`: card centralizado "Pronto Vet", campo "Senha" (`type="password"`, `autoFocus`), botão "Entrar" (desabilitado com "Entrando…" durante o envio), erro abaixo do campo.
- Barra (renderizada no layout fora de `/entrar`): links **Gerar** (`/`), **Procedimentos**, **Profissionais**, link ativo destacado; botão **Sair** (form com action `sair`). Responsiva.

- [ ] **Passo 1: Implementar** `sessao.ts`, `proxy.ts`, `actions/auth.ts`, página e barra.
- [ ] **Passo 2: Verificar manualmente** com `.env` contendo `APP_PASSWORD` e `APP_SECRET`, `npm run dev`:
  - `/` sem cookie → redireciona para `/entrar`
  - senha errada → "Senha incorreta." após ~1 s
  - senha certa → `/` com a barra; cookie `sessao` httpOnly
  - **Sair** → `/entrar`; voltar para `/` → redireciona de novo
  - com `APP_PASSWORD` vazia no `.env` → nenhuma senha entra (inclusive vazia)
- [ ] **Passo 3: Rodar** `npm test && npm run lint && npm run typecheck && npm run build` → OK.
- [ ] **Passo 4: Commit** — `T006: adiciona login por senha compartilhada e barra de navegação`.

---

### Task T007: Profissionais

**Files:**
- Create: `src/actions/profissionais.ts`, `src/app/profissionais/page.tsx`, `src/components/profissionais/formulario-profissional.tsx`, `src/components/profissionais/item-profissional.tsx`
- Create: `src/components/confirmar-exclusao.tsx` (se T008 ainda não criou; quem chegar primeiro cria, o outro reutiliza)

**Interfaces:**
- Consumes: `db` (T005); `schemaProfissional`, `validarFormulario`, `ResultadoAcao` (T003); `exigirSessao` (T006).
- Produces:

```ts
// actions/profissionais.ts ("use server") — todas chamam exigirSessao() primeiro e revalidatePath("/profissionais") e revalidatePath("/")
export async function criarProfissional(estado: ResultadoAcao, formData: FormData): Promise<ResultadoAcao>;
export async function atualizarProfissional(id: string, estado: ResultadoAcao, formData: FormData): Promise<ResultadoAcao>;
export async function excluirProfissional(id: string): Promise<void>;
// confirmar-exclusao.tsx (client)
export function ConfirmarExclusao(props: { titulo: string; descricao: string; acao: () => Promise<void>; rotuloBotao?: string }): JSX.Element;
  // AlertDialog; botões "Cancelar" e "Excluir"
```

- Página: título "Profissionais"; formulário inline no topo (Nome, Papel: select "Cirurgião"/"Anestesista", botão "Adicionar"); duas colunas **Cirurgiões** / **Anestesistas** (empilhadas no celular), ordenadas por nome; cada item com "Editar" (edição inline de nome e papel, "Salvar"/"Cancelar") e "Excluir" (título "Excluir profissional?", descrição "Esta ação não pode ser desfeita."). Coluna vazia: "Nenhum cirurgião cadastrado." / "Nenhum anestesista cadastrado.". Toast "Profissional salvo." após salvar.
- Excluir id inexistente → ignorar silenciosamente (`deleteMany`).

- [ ] **Passo 1: Implementar** actions, página e componentes.
- [ ] **Passo 2: Verificar manualmente** — adicionar um de cada papel; nome vazio mostra "Informe o nome."; editar troca de coluna ao mudar papel; excluir com confirmação.
- [ ] **Passo 3: Rodar** `npm test && npm run lint && npm run typecheck && npm run build` → OK.
- [ ] **Passo 4: Commit** — `T007: adiciona cadastro de profissionais`.

---

### Task T008: Procedimentos e descrição anestésica

**Files:**
- Create: `src/actions/procedimentos.ts`, `src/app/procedimentos/page.tsx`, `src/app/procedimentos/novo/page.tsx`, `src/app/procedimentos/[id]/page.tsx`, `src/components/procedimentos/formulario-procedimento.tsx`, `src/components/procedimentos/formulario-descricao-anestesica.tsx`
- Create/reutilizar: `src/components/confirmar-exclusao.tsx` (ver T007)

**Interfaces:**
- Consumes: `db`, `traduzirErroPrisma` (T005); `schemaProcedimento`, `schemaDescricaoAnestesica`, `OPCOES_ASA`, `validarFormulario`, `ResultadoAcao` (T003); `exigirSessao` (T006).
- Produces:

```ts
// actions/procedimentos.ts ("use server") — exigirSessao() primeiro; revalidatePath("/procedimentos") e revalidatePath("/")
export async function criarProcedimento(estado: ResultadoAcao, formData: FormData): Promise<ResultadoAcao>;      // sucesso → redirect(`/procedimentos/${id}`)
export async function atualizarProcedimento(id: string, estado: ResultadoAcao, formData: FormData): Promise<ResultadoAcao>;
export async function excluirProcedimento(id: string): Promise<void>;                                            // redirect("/procedimentos")
export async function salvarDescricaoAnestesica(procedimentoId: string, estado: ResultadoAcao, formData: FormData): Promise<ResultadoAcao>; // upsert
```

- Erros de banco: `traduzirErroPrisma(e) ?? throw e`. Atualizar/salvar com id inexistente (P2025) → `notFound()`.
- `/procedimentos`: título "Procedimentos", botão "Novo procedimento", busca por nome via `?q=` (`contains`, `mode: "insensitive"`), lista ordenada por nome; selo (Badge) **"sem descrição anestésica"**; vazio: "Nenhum procedimento cadastrado." / com busca: "Nenhum procedimento encontrado.".
- `/procedimentos/novo`: campos "Nome do procedimento", "Descrição da técnica" (textarea), "Prescrição" (textarea, placeholder "Prescrito: …"); botão "Salvar".
- `/procedimentos/[id]`: mesmo formulário preenchido + seção **"Descrição anestésica"** com select "ASA" (`OPCOES_ASA`) e textareas "Medicação pré-anestésica", "Indução", "Manutenção", "Bloqueio local", "Analgesia trans", "Antibiótico pré", "Pós imediato", "Observações" (placeholder "Sem intercorrências…"); botão "Salvar descrição anestésica". Botão "Excluir procedimento" (título "Excluir procedimento?", descrição "A descrição anestésica deste procedimento também será removida. Esta ação não pode ser desfeita."). Id inexistente → `notFound()`.
- Toasts: "Procedimento salvo." / "Descrição anestésica salva.".

- [ ] **Passo 1: Implementar** actions, páginas e formulários.
- [ ] **Passo 2: Verificar manualmente** — criar procedimento (aparece com selo), nome duplicado mostra "Já existe um procedimento com este nome.", salvar descrição anestésica (selo some), campos opcionais vazios salvos como `null` (conferir com `npx prisma studio`), excluir remove ambos, `/procedimentos/xyz` mostra "Página não encontrada.".
- [ ] **Passo 3: Rodar** `npm test && npm run lint && npm run typecheck && npm run build` → OK.
- [ ] **Passo 4: Commit** — `T008: adiciona cadastro de procedimentos e descrição anestésica`.

---

### Task T009: Tela Gerar

**Files:**
- Create: `src/lib/preferencias.ts`, `src/components/gerar/formulario-gerar.tsx`, `src/components/gerar/cartao-texto.tsx`, `src/components/botao-copiar.tsx`
- Modify: `src/app/page.tsx`
- Test: `src/lib/preferencias.test.ts`

**Interfaces:**
- Consumes: `db` (T005); `gerarTextoCirurgico`, `gerarTextoAnestesico`, `DadosProcedimento`, `EntradaGeracao` (T002).
- Produces:

```ts
// preferencias.ts
export const CHAVE_CIRURGIAO = "prontovet:cirurgiaoId";
export const CHAVE_ANESTESISTA = "prontovet:anestesistaId";
export function resolverIdSalvo(idSalvo: string | null, idsDisponiveis: string[]): string | null; // id ausente da lista → null
export function lerPreferencia(chave: string): string | null;          // try/catch; localStorage indisponível → null
export function gravarPreferencia(chave: string, valor: string | null): void; // try/catch; null remove
// botao-copiar.tsx (client)
export function BotaoCopiar(props: { texto: string; alvoRef: React.RefObject<HTMLElement | null> }): JSX.Element;
// cartao-texto.tsx
export function CartaoTexto(props: { titulo: string; texto: string | null }): JSX.Element; // texto null → estado vazio
```

- `page.tsx` (Server Component): busca procedimentos **com** `descricaoAnestesica` (`where: { descricaoAnestesica: { isNot: null } }`, include, ordem por nome) e profissionais (ordem por nome), separa por papel, passa para `FormularioGerar`. Se não houver procedimento completo: "Nenhum procedimento completo. Cadastre um procedimento com descrição anestésica." com link para `/procedimentos`.
- `FormularioGerar` (client): "Procedimento" (Combobox com busca: Popover + Command), "Cirurgião", "Anestesista" (selects com opção "Nenhum"), "Peso (kg)" (`inputMode="decimal"`, placeholder "ex.: 4,5"). Ao montar, aplica `resolverIdSalvo(lerPreferencia(...), ids)`; ao mudar profissional, `gravarPreferencia`. Monta `EntradaGeracao` a cada render.
- Cartões **"Descrição Cirúrgica"** e **"Descrição Anestésica"**: lado a lado em `md:` e empilhados no celular; texto em `<pre>` com `whitespace-pre-wrap` e fonte legível; estado vazio "Selecione um procedimento para ver as descrições.".
- `BotaoCopiar`: `navigator.clipboard.writeText`; sucesso → rótulo "Copiado ✓" por 2000 ms; falha → seleciona o conteúdo de `alvoRef` (Range/Selection) e toast "Use Ctrl+C para copiar.". Desabilitado quando não há texto.

- [ ] **Passo 1: Testes (falhando)** — `preferencias.test.ts`:

```ts
it("mantém id salvo que ainda existe")             // resolverIdSalvo("a", ["a","b"]) → "a"
it("ignora id de profissional excluído")           // resolverIdSalvo("x", ["a"]) → null
it("retorna null sem id salvo")                     // resolverIdSalvo(null, ["a"]) → null
it("lerPreferencia retorna null sem localStorage")  // ambiente node, sem globalThis.localStorage → null, sem lançar
```

- [ ] **Passo 2: Rodar** → FAIL. **Passo 3: Implementar** `preferencias.ts`. **Passo 4: Rodar** → PASS.
- [ ] **Passo 5: Implementar** página e componentes.
- [ ] **Passo 6: Verificar manualmente** (com o seed): escolher procedimento, profissionais e peso → prévias corretas e atualizando ao digitar; "Copiar" de cada cartão cola só aquele texto num editor; recarregar mantém cirurgião/anestesista; excluir o cirurgião salvo e recarregar → seleção volta para "Nenhum" sem erro; layout empilha em 375 px.
- [ ] **Passo 7: Rodar** `npm test && npm run lint && npm run typecheck && npm run build` → OK.
- [ ] **Passo 8: Commit** — `T009: adiciona tela de geração com cópia dos textos`.

---

### Task T010: Preparação do deploy

**Files:**
- Modify: `package.json` (`"build": "prisma migrate deploy && next build"`)
- Create: `README.md`

**Interfaces:**
- Consumes: tudo das tasks anteriores.

- [ ] **Passo 1: Script de build** conforme acima; confirmar que `postinstall` roda `prisma generate`.
- [ ] **Passo 2: `README.md`** em pt-BR: o que é o app; rodar localmente (`npm install`, copiar `.env.example` para `.env`, `npm run db:migrate`, `npm run db:seed`, `npm run dev`); comandos `lint`/`typecheck`/`test`; deploy (criar projeto no Neon, copiar URLs pooled e direta, importar repositório na Vercel, configurar as 4 variáveis de ambiente em Production e Preview, gerar `APP_SECRET` com `openssl rand -base64 32`; trocar `APP_PASSWORD` + `APP_SECRET` para revogar acessos); link para spec, `ARCHITECT.md` e `AGENTS.md`.
- [ ] **Passo 3: Verificar** — `npm run build` com `.env` de dev aplica migrations (nenhuma pendente) e conclui; `npm start` serve o app e o fluxo login → gerar → copiar funciona.
- [ ] **Passo 4: Commit** — `T010: prepara build e documentação de deploy`.

O deploy em si (conta Vercel, projeto Neon de produção, variáveis) é feito pelo usuário ou pelo papel **Verificador de deploy**, com aprovação do usuário.

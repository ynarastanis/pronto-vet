# Pronto Vet — Design

- **Data:** 2026-10-24
- **Status:** aprovado em conversa; aguardando revisão da spec escrita
- **Idioma oficial do app:** português do Brasil (UI, mensagens, textos gerados)

## 1. Objetivo

App web para uma única clínica/equipe veterinária armazenar **templates de procedimentos** e gerar, em poucos cliques, os textos de prontuário prontos para colar no sistema da clínica:

- **Descrição Cirúrgica** — técnica cirúrgica + prescrição (cuidados pós-operatórios).
- **Descrição Anestésica** — protocolo anestésico do mesmo procedimento.

Os dois textos são **sempre gerados juntos**, mas **copiados separadamente** (cada um tem seu botão "Copiar"), pois são colados em lugares diferentes do prontuário.

**Critério de sucesso:** o profissional escolhe procedimento, cirurgião, anestesista, digita o peso (opcional) e copia os dois textos — sem redigitar nada.

## 2. Usuários e acesso

- Uma única clínica/equipe; todos compartilham profissionais e templates.
- Acesso protegido por **senha compartilhada única** (sem cadastro de usuários).
- Nenhum dado de paciente é persistido.

## 3. Fora do escopo (YAGNI)

Cálculo de doses, logins individuais, histórico de exportações, multi-clínica, exportação em PDF, rótulos de campos configuráveis no banco, testes end-to-end.

## 4. Arquitetura

- **Next.js (App Router)** com Server Components para leitura e **Server Actions** para escrita.
- **Prisma** como ORM, **Postgres no Neon**.
- Hospedagem no **free tier da Vercel**.
- UI: **Tailwind CSS + shadcn/ui**; `<html lang="pt-BR">`.
- Validação: **Zod**, mesmos schemas no cliente e no servidor.
- Geração de texto: **funções puras** executadas no cliente (prévia instantânea).
- Acesso a dados: **camada de serviços** (`src/servicos/`) com duas implementações do mesmo contrato — **memória** (mock com dados de demonstração, para validar a experiência antes do banco) e **Prisma**. Páginas e actions nunca importam o Prisma diretamente. Ver §13.

## 5. Modelo de dados

```prisma
enum Papel {
  CIRURGIAO
  ANESTESISTA
}

model Profissional {
  id        String   @id @default(cuid())
  nome      String
  papel     Papel
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ProcedimentoCirurgico {
  id                  String               @id @default(cuid())
  nome                String               @unique
  descricaoTecnica    String               @db.Text
  prescricao          String               @db.Text
  descricaoAnestesica DescricaoAnestesica?
  createdAt           DateTime             @default(now())
  updatedAt           DateTime             @updatedAt
}

model DescricaoAnestesica {
  id             String                @id @default(cuid())
  procedimentoId String                @unique
  procedimento   ProcedimentoCirurgico @relation(fields: [procedimentoId], references: [id], onDelete: Cascade)
  asa            String
  mpa            String?               @db.Text
  inducao        String?               @db.Text
  manutencao     String?               @db.Text
  bloqueioLocal  String?               @db.Text
  analgesiaTrans String?               @db.Text
  antibioticoPre String?               @db.Text
  posImediato    String?               @db.Text
  observacoes    String?               @db.Text
  createdAt      DateTime              @default(now())
  updatedAt      DateTime              @updatedAt
}
```

### Regras de domínio

- Profissional tem apenas **nome** e **um único papel** (cirurgião **ou** anestesista).
- Um procedimento cirúrgico tem **no máximo uma** descrição anestésica (1:1). Ela é criada/editada a partir da página do procedimento e é apagada junto com ele (cascade).
- Um procedimento **sem** descrição anestésica é permitido (cadastro em andamento): aparece na lista com o selo "sem descrição anestésica" e **não aparece** na tela Gerar.
- `nome` do procedimento é único e é usado nos dois textos.
- `prescricao` é texto livre e inclui o próprio prefixo "Prescrito: …" quando desejado — o app não adiciona rótulo.
- `asa` é escolhido em select: `I`, `II`, `III`, `IV`, `V`, cada um com variante emergencial `E` (ex.: `II E`).
- Exclusões são definitivas, sempre com confirmação. Não há registros dependentes de profissionais (nada é persistido na geração).

## 6. Formato dos textos gerados

Marcadores `{...}` são substituídos. Valores ausentes:

- Cirurgião / anestesista não selecionado → `--`
- Peso em branco → `--` (linha fica `Peso do paciente: -- kg`)
- Campo opcional da descrição anestésica vazio → **a linha inteira é omitida**
- Quebras de linha dos campos de texto são preservadas; espaços nas pontas são removidos.

### 6.1 Descrição Cirúrgica

```
PROCEDIMENTO CIRÚRGICO: {nome}

CIRURGIÃO: {cirurgiao}
ANESTESISTA: {anestesista}

{descricaoTecnica}

{prescricao}
```

### 6.2 Descrição Anestésica

```
CIRURGIÃO: {cirurgiao}
ANESTESISTA: {anestesista}
Peso do paciente: {peso} kg
ASA: {asa}
Procedimento: {nome}
Medicação Pré Anestésica: {mpa}
INDUÇÃO: {inducao}
MANUTENÇÃO: {manutencao}
BLOQUEIO LOCAL: {bloqueioLocal}
ANALGESIA TRANS: {analgesiaTrans}
ANTIBIOTICO PRÉ: {antibioticoPre}
PÓS IMEDIATO: {posImediato}
{observacoes}
```

As linhas de `Medicação Pré Anestésica` até `{observacoes}` são omitidas quando o campo correspondente estiver vazio. As linhas de cirurgião, anestesista, peso, ASA e procedimento sempre aparecem.

### 6.3 Interface das funções

```ts
type EntradaGeracao = {
  procedimento: ProcedimentoComAnestesia; // nome, descricaoTecnica, prescricao, descricaoAnestesica (não nula)
  cirurgiao: string | null;               // nome
  anestesista: string | null;             // nome
  peso: string;                           // livre, pode ser ""
};

gerarTextoCirurgico(entrada: EntradaGeracao): string
gerarTextoAnestesico(entrada: EntradaGeracao): string
```

Funções puras, sem I/O, em `src/lib/texto/`. O peso é texto livre (aceita "4,5", "4.5", "aprox. 5").

## 7. Telas e fluxo

| Rota | Função |
|---|---|
| `/entrar` | Campo de senha → cookie de sessão → redireciona para `/`. |
| `/` **Gerar** | Tela principal (abaixo). |
| `/procedimentos` | Lista com busca por nome; selo "sem descrição anestésica"; botão "Novo procedimento". |
| `/procedimentos/novo` | Formulário cirúrgico: nome, descrição da técnica, prescrição. |
| `/procedimentos/[id]` | Edição do cirúrgico e, abaixo, formulário da Descrição Anestésica (criar/editar); excluir procedimento com confirmação. |
| `/profissionais` | Duas colunas (Cirurgiões / Anestesistas); adicionar inline (nome + papel), editar, excluir. |

Barra superior: **Gerar · Procedimentos · Profissionais · Sair**. Layout responsivo (desktop da clínica e celular).

### Tela Gerar

1. Campos: **Procedimento** (select com busca; só procedimentos com descrição anestésica), **Cirurgião** (só papel CIRURGIAO), **Anestesista** (só papel ANESTESISTA), **Peso (kg)** (texto livre, opcional).
2. Dois cartões — **Descrição Cirúrgica** e **Descrição Anestésica** — lado a lado no desktop, empilhados no celular. Cada um mostra a prévia do texto e um botão **Copiar**, que exibe "Copiado ✓" por 2 s.
3. A prévia atualiza a cada alteração (gerada no cliente).
4. Sem procedimento selecionado, os cartões mostram um estado vazio orientando a escolher um.
5. Últimos cirurgião e anestesista escolhidos ficam no `localStorage` (leitura/escrita em try/catch; se o id salvo não existir mais, é ignorado).
6. Se `navigator.clipboard` falhar, o texto é selecionado e é exibida a mensagem "Use Ctrl+C para copiar".

## 8. Autenticação

- Variáveis de ambiente: `APP_PASSWORD` (senha da equipe) e `APP_SECRET` (chave HMAC).
- Login compara a senha em tempo constante; em caso de erro, espera ~1 s antes de responder.
- Sucesso: cookie `sessao` (httpOnly, Secure em produção, SameSite=Lax, 30 dias) contendo token `expiracao.assinaturaHMAC-SHA256`.
- Proxy/middleware do Next verifica o token via Web Crypto e protege todas as rotas, exceto `/entrar` e assets estáticos; sem sessão válida → redireciona para `/entrar`.
- Toda Server Action revalida a sessão (defesa em profundidade).
- "Sair" apaga o cookie. Trocar `APP_SECRET` invalida todas as sessões.
- Funções `assinarToken` / `verificarToken` são puras (recebem segredo e "agora") para serem testáveis.

## 9. Validação e erros

- Schemas Zod em `src/lib/validacao/`:
  - Profissional: `nome` obrigatório (1–120 caracteres, trim), `papel` ∈ enum.
  - Procedimento: `nome` obrigatório (1–150, trim), `descricaoTecnica` e `prescricao` obrigatórias (até 10 000).
  - Descrição anestésica: `asa` ∈ lista válida; demais campos opcionais (até 2 000); string vazia vira `null`.
- Server Actions retornam `{ ok: true }` ou `{ ok: false, erros: Record<campo, string> }`; mensagens em pt-BR exibidas junto ao campo.
- Serviço lança `ErroNomeDuplicado` (nome de procedimento duplicado) → action devolve "Já existe um procedimento com este nome." no campo `nome`.
- Serviço lança `ErroNaoEncontrado` → página "não encontrado".
- A implementação Prisma converte P2002 → `ErroNomeDuplicado` e P2025 → `ErroNaoEncontrado`; nenhum código Prisma vaza para fora de `src/servicos/prisma/`.
- Erros inesperados → `error.tsx` com "Algo deu errado. Tente novamente."
- Confirmação antes de excluir; excluir procedimento avisa que a descrição anestésica também será removida.

## 10. Testes

- **Apenas testes unitários de funções**, com **Vitest**. Sem testes de componentes e sem E2E.
- Cobertura obrigatória:
  - `gerarTextoCirurgico` / `gerarTextoAnestesico`: textos completos conforme os exemplos, omissão de campos vazios, `--` para peso/profissional ausentes, preservação de quebras de linha, trim.
  - Schemas Zod: casos válidos, inválidos e normalização (vazio → `null`).
  - `assinarToken` / `verificarToken`: válido, expirado, assinatura adulterada, segredo diferente.
  - Implementação em memória dos serviços e `escolherFonte`: testes de contrato (§13).
- A implementação Prisma não tem teste automatizado (seria integração); é verificada manualmente repetindo os fluxos validados com o mock.
- Desenvolvimento em TDD para essas funções.

## 11. Deploy e ambiente

- Neon: `DATABASE_URL` (pooled, runtime) e `DATABASE_URL_UNPOOLED` (direta, migrations).
- Prisma Client gerado no install/build; `prisma migrate deploy` no build da Vercel.
- `prisma/seed.ts` opcional, reaproveitando os mesmos dados de demonstração do mock em memória.
- `.env.example` documenta `FONTE_DADOS`, `DATABASE_URL`, `DATABASE_URL_UNPOOLED`, `APP_PASSWORD`, `APP_SECRET`.
- Em produção (Vercel) `FONTE_DADOS` **não** é definida (ou é diferente de `memoria`), então o app usa Prisma.
- Versões: as estáveis mais recentes de Next.js, Prisma, Tailwind e shadcn/ui no momento da implementação; o plano de implementação fixa as versões e segue a documentação oficial de cada uma (ex.: nome do arquivo de proxy/middleware e configuração do Prisma variam entre versões principais).

## 12. Estrutura de pastas prevista

```
src/
  app/
    entrar/
    procedimentos/
      novo/
      [id]/
    profissionais/
    page.tsx            # Gerar
    layout.tsx
    error.tsx
  components/
  lib/
    texto/              # gerarTextoCirurgico, gerarTextoAnestesico (+ testes)
    validacao/          # schemas Zod (+ testes)
    auth/               # assinarToken, verificarToken, sessão (+ testes)
    db.ts               # PrismaClient singleton
  actions/              # Server Actions por entidade
  servicos/
    tipos.ts            # contratos + tipos de domínio
    erros.ts            # ErroNomeDuplicado, ErroNaoEncontrado
    fonte.ts            # escolherFonte (+ teste)
    memoria/            # mock em memória + dados de demonstração (+ testes de contrato)
    prisma/             # implementação Prisma
    index.ts            # servicos()
prisma/
  schema.prisma
  seed.ts
```

## 13. Camada de serviços

Objetivo: validar a experiência completa (telas, fluxos, textos) com dados em memória **antes** de conectar ao Neon, e depois trocar para o banco sem tocar em páginas e actions.

### Contrato

```ts
type Papel = "CIRURGIAO" | "ANESTESISTA";
type Profissional = { id: string; nome: string; papel: Papel };
type Procedimento = {
  id: string; nome: string; descricaoTecnica: string; prescricao: string;
  descricaoAnestesica: DadosDescricaoAnestesica | null;
};
type ProcedimentoCompleto = Procedimento & { descricaoAnestesica: DadosDescricaoAnestesica };
type ProcedimentoResumo = { id: string; nome: string; temDescricaoAnestesica: boolean };

interface ServicoProfissionais {
  listar(): Promise<Profissional[]>;                                       // ordenado por nome (pt-BR)
  criar(dados: DadosProfissional): Promise<Profissional>;
  atualizar(id: string, dados: DadosProfissional): Promise<Profissional>;  // ErroNaoEncontrado
  excluir(id: string): Promise<void>;                                      // id inexistente: no-op
}

interface ServicoProcedimentos {
  listar(busca?: string): Promise<ProcedimentoResumo[]>;                   // busca por nome sem diferenciar maiúsculas; ordenado por nome
  listarCompletos(): Promise<ProcedimentoCompleto[]>;                      // só com descrição anestésica
  obter(id: string): Promise<Procedimento | null>;
  criar(dados: DadosProcedimentoForm): Promise<Procedimento>;              // ErroNomeDuplicado
  atualizar(id: string, dados: DadosProcedimentoForm): Promise<Procedimento>; // ErroNaoEncontrado | ErroNomeDuplicado
  excluir(id: string): Promise<void>;                                      // remove a descrição anestésica junto; inexistente: no-op
  salvarDescricaoAnestesica(procedimentoId: string, dados: DadosDescricaoAnestesicaForm): Promise<void>; // upsert; ErroNaoEncontrado
}

type Servicos = { profissionais: ServicoProfissionais; procedimentos: ServicoProcedimentos };
```

### Implementação em memória (mock)

- Estado em `globalThis` (sobrevive ao hot reload do `next dev`); reinicia ao reiniciar o servidor.
- Inicia com dados de demonstração: o procedimento "OVARIOHISTECTOMIA (DEMONSTRAÇÃO)" com os textos dos exemplos fornecidos, um procedimento de demonstração **sem** descrição anestésica (para exibir o selo) e um profissional de cada papel.
- Retorna cópias (alterar um objeto retornado não altera o estado); ids via `crypto.randomUUID()`.
- Mesmas regras do banco: nome de procedimento único (comparação exata após trim), cascata na exclusão.
- Uso apenas local: em serverless (Vercel) cada instância teria memória própria.

### Seleção da fonte

- `FONTE_DADOS=memoria` (trim, sem diferenciar maiúsculas) → mock.
- Qualquer outro valor ou ausente → Prisma. Produção nunca cai no mock por falta de configuração.
- Antes de a implementação Prisma existir, a fonte Prisma lança "Fonte de dados não configurada. Defina FONTE_DADOS=memoria para usar dados de demonstração."

### Checkpoint de validação

Depois das telas prontas sobre o mock, o usuário valida a experiência localmente. Só então a implementação Prisma é construída.

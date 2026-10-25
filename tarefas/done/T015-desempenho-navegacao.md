# T015 — Desempenho na navegação

- **Status:** concluída
- **Prioridade:** P1
- **Depende de:** T010 (branch empilhado sobre `t010-banco`; rebase no `main` após o merge do PR #3)
- **Branch:** `t015-desempenho`
- **Referência:** `docs/design/sistema-visual.md` (Movimento, Layout), ADR-010, ADR-016

## Objetivo

Eliminar a sensação de ~1s de travamento ao navegar entre telas no Preview/produção: resposta visual imediata no clique e menos latência no servidor.

## Critérios de aceite

- [x] `loading.tsx` em `src/app/(app)/` (Gerar), `src/app/(app)/procedimentos/`, `src/app/(app)/procedimentos/[id]/` e `src/app/(app)/profissionais/`, com esqueletos fiéis ao layout final de cada tela (mesmas dimensões e grade, para não pular ao trocar), cor `--muted`/`--campo-suave`, brilho suave (shimmer) desligado com `prefers-reduced-motion`, `aria-busy="true"` e texto `sr-only` "Carregando…"
- [x] Esqueletos não causam overflow em 360px e acompanham a escala de telas grandes (rem)
- [x] Driver HTTP do Neon (`PrismaNeonHttp` ou o equivalente da 7.10.1 — confira na doc/README instalado) no lugar do WebSocket **se** nenhuma operação dos serviços usar transação interativa; se alguma usar, documente e mantenha WebSocket
- [x] Medição antes/depois contra o branch `development` (script fora do repo): tempo da 1ª consulta (conexão fria) e das seguintes, para `listarCompletos` + `profissionais.listar` em paralelo, com WebSocket e com HTTP; tabela na Implementação
- [x] `export const preferredRegion` **não** é necessário (região das funções já está em São Paulo nas configurações da Vercel) — não adicione
- [x] Nenhuma dependência nova (salvo se o adapter HTTP exigir algo já transitivo; registre)
- [x] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando

## Notas do Líder

- Consultas já estão em paralelo (`Promise.all` na Gerar); uma consulta por tela nas demais.
- Região das funções: usuário configurou São Paulo na Vercel (2026-10-24). Região do banco criado pela Vercel ainda não confirmada.
- Carregar o skill `frontend-design:frontend-design`; o sistema visual prevalece. Conferência visual é do usuário.
- Commits `T015: ...`. Push e PR são do Líder.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** `loading.tsx` com esqueletos nas 4 rotas (Gerar, Procedimentos, Procedimento/[id], Profissionais), com componentes compartilhados em `src/components/esqueleto.tsx` e shimmer em `globals.css` (desligado com `prefers-reduced-motion`). Driver do Neon trocado para `PrismaNeonHttp`. Nenhuma dependência nova. `preferredRegion` não adicionado.
- **Arquivos:** `src/components/esqueleto.tsx`; `src/app/(app)/loading.tsx`, `procedimentos/loading.tsx`, `procedimentos/[id]/loading.tsx`, `profissionais/loading.tsx`; `src/app/globals.css` (`.esqueleto`, `pv-brilho`); `src/lib/db.ts`; `src/servicos/prisma/procedimentos.ts`; `src/servicos/prisma/erros.ts` e `erros.test.ts`; `ARCHITECT.md` (ADR-017).
- **Commits:** `2794734` T015: troca o driver do Neon para HTTP e trata o erro 23505 cru; `359d34d` T015: adiciona loading.tsx com esqueletos fiéis e registra ADR-017; mais o commit desta seção.
- **Decisões e desvios:**
  - Nenhum `$transaction` interativo nos serviços, mas `create`/`update` com `include` abrem transação implícita no Prisma e falhavam no HTTP ("Transactions are not supported in HTTP mode"). Em vez de manter o WebSocket, `criar` passou a devolver `descricaoAnestesica: null` e `atualizar` lê a descrição em consulta separada (uma ida a mais ao banco no atualizar). O `upsert` de `DescricaoAnestesica` funciona (vira ON CONFLICT nativo).
  - O adapter HTTP não converte erro do Postgres: a duplicidade chega como `code: "23505"`, sem `meta.target`. `traduzirErroPrisma` ganhou o caso (restrição `_nome_key` na mensagem), com 2 testes novos. Sem isso, "nome duplicado" viraria erro genérico.
  - `--campo-suave` não existe nos tokens; o esqueleto usa `--muted` misturado a 40% de `--border` (só `--muted` quase some sobre o fundo da página) e o brilho usa `--card`.
  - `/procedimentos/novo` não tem `loading.tsx` próprio e herda o da lista de procedimentos (esqueleto de lista ao abrir o formulário). Fora do escopo pedido.
  - Conferência visual dos esqueletos não foi feita (é do usuário).
- **Medição** (branch `development`, script fora do repo; cada linha é um processo novo: 1ª rodada de `listarCompletos` + `profissionais.listar` em paralelo = fria, depois 5 rodadas; tempos em ms):

| Driver | Processo | Fria | Seguintes (5) | Média seguintes |
|---|---|---|---|---|
| WebSocket | 1 | 1556 | 100, 100, 82, 99, 85 | 93 |
| WebSocket | 2 | 433 | 92, 89, 104, 93, 90 | 94 |
| WebSocket | 3 | 436 | 103, 101, 98, 104, 106 | 102 |
| WebSocket | 4 | 433 | 105, 96, 114, 90, 96 | 100 |
| HTTP | 1 | 438 | 129, 89, 90, 89, 87 | 97 |
| HTTP | 2 | 464 | 93, 87, 88, 87, 85 | 88 |
| HTTP | 3 | 381 | 132, 88, 88, 87, 87 | 96 |

  Leitura: conexão fria igual (mediana ≈435 ms WS, ≈438 ms HTTP; o 1556 foi o 1º processo, com o compute do Neon acordando); consultas seguintes ≈10% mais rápidas no HTTP (≈88 ms vs ≈97 ms, descontando a 1ª após a fria). Medido de Node local, não da função da Vercel: o ganho do HTTP em serverless (sem handshake de WebSocket por instância fria) não aparece aqui. O ganho dominante da tarefa vem dos esqueletos.
- **Verificação de contrato da T010 após a troca** (`scratchpad/t010/verificar.ts`, contra `development`): 35 OK, "TUDO OK", restos após limpeza: 0 (cobre listar, criar, duplicado, inexistente, cascata).
- **Saída de lint / typecheck / testes / build:**

```
npm run lint       -> eslint . (sem avisos nem erros)
npm run typecheck  -> tsc --noEmit (sem erros)
npm test           -> Test Files 15 passed (15); Tests 126 passed (126)
npm run build      -> compilou; rotas /, /procedimentos, /procedimentos/[id], /procedimentos/novo, /profissionais dinâmicas
```

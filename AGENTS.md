# Workflow agêntico

## Papéis

| Papel | Modelo | Contexto | Responsabilidade |
|---|---|---|---|
| **Líder** | Opus (sessão principal) | Conversa com o usuário | Discute prioridades e fluxos com o usuário, cria e prioriza tarefas, move cartões no quadro, despacha o Implementador, roda os portões de qualidade, mantém `ARCHITECT.md`. Não implementa código de produto. |
| **Implementador** | **Sonnet** — sempre | Subagente `implementador` | Executa **uma** tarefa por vez, em TDD, até passar lint/typecheck/testes/build; registra o que fez no arquivo da tarefa. |

> **Revisor removido em 2026-10-24** por decisão do usuário (processo lento demais). A qualidade passa a ser garantida pelos portões automáticos abaixo. `.claude/agents/revisor.md` fica no repositório, sem uso, caso o papel volte.

### Papéis sugeridos (ativar quando fizer sentido)

- **Arquiteto** (Opus) — quando surgir uma decisão que mude interfaces ou o modelo de dados: escreve a proposta de ADR em `ARCHITECT.md` para o Líder levar ao usuário. Hoje o Líder acumula esse papel.
- **Verificador de deploy** (Sonnet) — antes de cada release: roda o build de produção, `prisma migrate deploy` em branch do Neon e confere variáveis de ambiente na Vercel.

## Regras de modelo

- Implementação: **sempre** modelo `sonnet` (`.claude/agents/implementador.md`).

## Portões de qualidade (obrigatórios para fechar uma tarefa)

O **Líder** roda ele mesmo, após o retorno do Implementador — não confia só na saída colada:

```
npm run lint && npm run typecheck && npm test && npm run build
```

Tudo verde → tarefa concluída. Qualquer falha → volta ao Implementador com a saída do erro.

A conferência visual no navegador é feita **pelo usuário** (decisão de 2026-10-24); o Líder não abre o navegador para conferir telas.

## Quadro de tarefas (`tarefas/`)

```
tarefas/
  todo/    # aprovadas pelo Líder, ordenadas por prioridade (P1, P2, P3) e ID
  doing/   # em implementação
  done/    # portões verdes; entra no main via PR
  _modelo.md
```

- Um arquivo por tarefa: `T<NNN>-<slug>.md`, baseado em `tarefas/_modelo.md`.
- Mover cartão = mover o arquivo (`git mv`) e atualizar o campo `Status`.
- Só o **Líder** cria tarefas e move de `todo` → `doing` e `doing` → `done`.

## Branches, PR e CI (ADR-015)

- Uma tarefa = um branch `tNNN-slug` criado a partir do `main` atualizado = um PR. Ajustes pequenos sem tarefa usam um branch `ajuste-<slug>`.
- Ninguém commita direto no `main`. A proteção de branch não está disponível (repositório privado no GitHub Free), então a regra é do processo.
- O Implementador só commita no branch; **push, PR e merge são do Líder**.
- Antes de qualquer `git push` ou `gh`, o Líder confere `gh auth status`: a conta ativa precisa ser `ynarastanis`. Senão, `gh auth switch --user ynarastanis`.
- **Merge** só com a CI verde (`gh pr checks <n>` todo verde) e, para mudanças de UI ou de banco, depois de o usuário conferir o Preview da Vercel no link do PR. Merge com `gh pr merge --squash --delete-branch`.
- Comandos da CLI do Neon sempre com `--profile ynara` (ADR-014).

## Ciclo de uma tarefa

1. **Líder** escolhe a tarefa de maior prioridade em `todo/` com dependências concluídas, cria o branch `tNNN-slug` a partir do `main` atualizado, move o arquivo para `doing/` com `Status: implementando` e commita no branch.
2. **Líder** despacha o **Implementador** (Sonnet) com o caminho do arquivo da tarefa.
3. **Implementador** lê a tarefa, a spec e `CLAUDE.md`; implementa em TDD; roda lint, typecheck, testes e build; faz commit(s) `T<NNN>: ...` no branch; preenche a seção *Implementação*. Retorna ao Líder.
4. **Líder** roda os portões localmente. Vermelho → devolve ao Implementador.
5. Verde → **Líder** move a tarefa para `done/` com `Status: concluída` (commit no branch), faz push, abre o PR (`gh pr create`, corpo em pt-BR com o resumo da tarefa) e acompanha a CI.
6. CI verde (e Preview conferido pelo usuário, quando aplicável) → **Líder** faz o merge e volta o checkout local para o `main` atualizado.

## Escalonamento ao usuário

**Checkpoint de validação da experiência:** concluídas T001–T009 e T012 (telas sobre o mock em memória), o Líder **para** e pede ao usuário que valide o app localmente (`FONTE_DADOS=memoria npm run dev`). Ajustes viram novas tarefas; T010 (banco) só começa com o aval do usuário.

O Líder também para e consulta o usuário quando: uma tarefa exige mudar a spec ou o modelo de dados; o mesmo portão falha duas vezes seguidas na mesma tarefa; surge dependência nova fora da stack.

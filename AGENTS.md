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

## Quadro de tarefas (`tarefas/`)

```
tarefas/
  todo/    # aprovadas pelo Líder, ordenadas por prioridade (P1, P2, P3) e ID
  doing/   # em implementação
  done/    # portões de qualidade verdes
  _modelo.md
```

- Um arquivo por tarefa: `T<NNN>-<slug>.md`, baseado em `tarefas/_modelo.md`.
- Mover cartão = mover o arquivo (`git mv`) e atualizar o campo `Status`.
- Só o **Líder** cria tarefas e move de `todo` → `doing` e `doing` → `done`.

## Ciclo de uma tarefa

1. **Líder** escolhe a tarefa de maior prioridade em `todo/` com dependências concluídas, move para `doing/` com `Status: implementando`.
2. **Líder** despacha o **Implementador** (Sonnet) com o caminho do arquivo da tarefa.
3. **Implementador** lê a tarefa, a spec e `CLAUDE.md`; implementa em TDD; roda lint, typecheck, testes e build; faz commit(s) `T<NNN>: ...`; preenche a seção *Implementação*. Retorna ao Líder.
4. **Líder** roda os portões de qualidade. Verde → move para `done/` com `Status: concluída`. Vermelho → devolve ao Implementador.

## Escalonamento ao usuário

**Checkpoint de validação da experiência:** concluídas T001–T009 e T012 (telas sobre o mock em memória), o Líder **para** e pede ao usuário que valide o app localmente (`FONTE_DADOS=memoria npm run dev`). Ajustes viram novas tarefas; T010 (banco) só começa com o aval do usuário.

O Líder também para e consulta o usuário quando: uma tarefa exige mudar a spec ou o modelo de dados; o mesmo portão falha duas vezes seguidas na mesma tarefa; surge dependência nova fora da stack.

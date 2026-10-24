# Workflow agêntico

## Papéis

| Papel | Modelo | Contexto | Responsabilidade |
|---|---|---|---|
| **Líder** | Opus (sessão principal) | Conversa com o usuário | Discute prioridades e fluxos com o usuário, cria e prioriza tarefas, move cartões no quadro, despacha Implementador e Revisor, mantém `ARCHITECT.md`. Não implementa código de produto. |
| **Implementador** | **Sonnet** — sempre | Subagente `implementador` | Executa **uma** tarefa por vez, em TDD, até passar lint/typecheck/testes; registra o que fez no arquivo da tarefa. |
| **Revisor** | **Opus** — sempre | Subagente `revisor`, **sessão limpa** (nunca fork; recebe só o ID da tarefa) | Revisa o diff da tarefa contra critérios de aceite, spec, `CLAUDE.md` e `ARCHITECT.md`. Aprova ou devolve com apontamentos. Não edita código. |

### Papéis sugeridos (ativar quando fizer sentido)

- **Arquiteto** (Opus) — quando surgir uma decisão que mude interfaces ou o modelo de dados: escreve a proposta de ADR em `ARCHITECT.md` para o Líder levar ao usuário. Hoje o Líder acumula esse papel.
- **Verificador de deploy** (Sonnet) — antes de cada release: roda o build de produção, `prisma migrate deploy` em branch do Neon e confere variáveis de ambiente na Vercel.

## Regras de modelo

- Implementação: **sempre** `subagent_type: "implementador"` (modelo `sonnet`, definido em `.claude/agents/implementador.md`).
- Revisão: **sempre** `subagent_type: "revisor"` (modelo `opus`, definido em `.claude/agents/revisor.md`), em sessão nova — nunca `fork`, nunca reaproveitar o contexto do Implementador.
- O Revisor de uma tarefa nunca é a mesma sessão que a implementou.

## Quadro de tarefas (`tarefas/`)

```
tarefas/
  todo/    # aprovadas pelo Líder, ordenadas por prioridade (P1, P2, P3) e ID
  doing/   # em implementação ou em revisão (campo `Status`)
  done/    # aprovadas pelo Revisor
  _modelo.md
```

- Um arquivo por tarefa: `T<NNN>-<slug>.md` (ex.: `T004-gerar-texto-anestesico.md`), baseado em `tarefas/_modelo.md`.
- Mover cartão = mover o arquivo (`git mv`) e atualizar o campo `Status`.
- Só o **Líder** cria tarefas e move de `todo` → `doing` e `doing` → `done`.

## Ciclo de uma tarefa

1. **Líder** escolhe a tarefa de maior prioridade em `todo/` com dependências concluídas, move para `doing/` com `Status: implementando`.
2. **Líder** despacha o **Implementador** (Sonnet) com o caminho do arquivo da tarefa.
3. **Implementador** lê a tarefa, a spec e `CLAUDE.md`; implementa em TDD; roda lint, typecheck e testes; faz commit(s) `T<NNN>: ...`; preenche a seção *Implementação* (resumo, arquivos, saída dos comandos, commits). Retorna ao Líder.
4. **Líder** muda `Status: em revisão` e despacha o **Revisor** (Opus, sessão limpa) apenas com o caminho da tarefa.
5. **Revisor** lê tarefa, spec, `CLAUDE.md`, `ARCHITECT.md` e o diff dos commits da tarefa; preenche a seção *Revisão* com `Veredito: aprovado` ou `Veredito: alterações solicitadas` e a lista de apontamentos (arquivo:linha).
6. Se houver alterações: **Líder** volta `Status: implementando` e despacha um novo Implementador com os apontamentos. Repete 3–5.
7. Aprovado: **Líder** move para `done/` com `Status: concluída`.

## Escalonamento ao usuário

O Líder para e consulta o usuário quando: uma tarefa exige mudar a spec ou o modelo de dados; o Revisor e o Implementador divergem duas rodadas seguidas; surge dependência nova fora da stack.

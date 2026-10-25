# T011 — Fechamento do deploy

- **Status:** implementando
- **Prioridade:** P2
- **Depende de:** T010, T014, T015
- **Branch:** `t011-fechamento-deploy`
- **Referência na spec:** §11
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T011* (passos, interfaces e testes exatos)

## Objetivo

Deixar a documentação e a configuração coerentes com o que está em produção depois da T010/T014/T015 e da ADR-018 (projeto Neon único criado pela Vercel).

## Critérios de aceite

- [ ] Build com migrations: já entregue pela T010 () — só conferir que o README explica  × - [ ] README atualizado: remover "Prisma chega com a T010; até lá use o mock"; tabela de scripts com , , , ; seção de banco local com os comandos da ADR-018 (projeto , org , branch , , aviso de descartar  se o  o re-adicionar); fluxo de deploy com branch  (não ) e branches ; nota "variável nova só vale em deploy feito depois dela: faça Redeploy"; limpeza periódica de branches ; seção Contas sem o projeto antigo
- [ ] Tabela de variáveis do README e da ADR-015 com  no lugar de  (editar a tabela da ADR-015 não — ela é histórica; o README é a referência viva)
- [ ]  com  (config local do navegador do app)
- [ ] , , Unknown command: "test"


Did you mean this?
  npm test # Test a package
To see a list of supported npm commands, run:
  npm help e  passando

## Notas do Líder

-  não muda (é só política de branches; o vínculo fica em , ignorado).
- Não rodar Unknown command: "ci"


Did you mean this?
  npm ci # Clean install a project
To see a list of supported npm commands, run:
  npm help: o usuário costuma ter  rodando e o Windows trava arquivos nativos (aconteceu em 2026-10-25). Use Unknown command: "install"


Did you mean one of these?
  npm install # Install a package
  npm uninstall # Remove a package
To see a list of supported npm commands, run:
  npm help se precisar.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```


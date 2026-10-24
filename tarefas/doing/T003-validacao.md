# T003 — Schemas de validação (Zod)

- **Status:** em revisão
- **Prioridade:** P1
- **Depende de:** T001
- **Referência na spec:** §9
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T003* (passos, interfaces e testes exatos)

## Objetivo

Schemas Zod com mensagens em pt-BR, validarFormulario e os tipos ResultadoValidacao/ResultadoAcao.

## Critérios de aceite

- [x] Mensagens exatamente como na tabela do plano
- [x] Opcionais vazios ou só com espaços viram null
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Pode rodar em paralelo com T002 e T004.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** Instalado zod 4.6.7. Schemas de profissional, procedimento e descrição anestésica com mensagens pt-BR; validarFormulario (primeira mensagem por campo) e tipos ResultadoValidacao/ResultadoAcao. Opcionais ausentes, vazios ou só com espaços viram null. Quebras de linha internas preservadas. 11 testes.
- **Arquivos:** src/lib/validacao/{validar,profissional,procedimento,descricao-anestesica}.ts, validacao.test.ts; package.json, package-lock.json
- **Commits:** T003: adiciona schemas de validação em pt-BR
- **Saída de lint / typecheck / testes:**

```
npx vitest run src/lib/validacao -> 1 file, 11 tests passed
npm run lint      -> sem erros
npm run typecheck -> sem erros
npm test          -> Test Files 5 passed (5), Tests 31 passed (31)
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [ ] `arquivo:linha` — …

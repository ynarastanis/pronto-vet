# T003 — Schemas de validação (Zod)

- **Status:** concluída
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
- **Veredito:** aprovado
- **Verificação do Revisor:** `npx vitest run src/lib/validacao` → 1 arquivo, 11 testes passando; `npm test` → 5 arquivos, 31 testes passando; `npm run lint` e `npm run typecheck` sem erros. Checagem de tipos à parte (arquivo descartável fora do repositório, `tsc --strict`): `DadosProfissional`, `DadosProcedimentoForm` e `DadosDescricaoAnestesicaForm` são exatamente os tipos do plano (opcionais `string | null`, chaves obrigatórias, sem `?`); `DadosDescricaoAnestesicaForm` é atribuível a `DadosDescricaoAnestesica` de `src/lib/texto/tipos.ts` (T002); `ResultadoAcao`/`ErrosCampos`/`ResultadoValidacao` idênticos ao plano; `validarFormulario(schemaDescricaoAnestesica, fd)` infere `ResultadoValidacao<DadosDescricaoAnestesicaForm>` e o ramo de erro é atribuível a `ResultadoAcao` (uso previsto em T006–T008).
- **Foco de revisão item 2:** conferido em execução — opcionais com `""`, `"   "`, `"\r\n\t "` e NBSP viram `null`; `"0"` é preservado; ausente vira `null`; o limite de 2000 é aplicado após o trim; quebras internas (`\r\n`) preservadas. Mensagens conferidas uma a uma contra a tabela do plano.
- **Apontamentos bloqueantes:** nenhum.
- **Sugestões opcionais (não bloqueiam):**
  - [ ] `src/lib/validacao/descricao-anestesica.ts:18` — `z.string()` dos opcionais não tem `error`; uma requisição forjada enviando arquivo em vez de texto devolve "Invalid input: expected string, received File" (inglês). Inalcançável pela UI (textareas) — se quiser fechar, dar uma mensagem pt-BR genérica ao `z.string({ error: ... })` (ex.: "Valor inválido.").
  - [ ] `src/lib/validacao/validacao.test.ts:94` — poderia cobrir o limite de 2000 contado após o trim (2000 caracteres + espaços nas pontas → aceito), já que é o comportamento escolhido.

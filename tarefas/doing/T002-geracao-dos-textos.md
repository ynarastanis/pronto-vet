# T002 — Geração dos textos cirúrgico e anestésico

- **Status:** em revisão
- **Prioridade:** P1
- **Depende de:** T001
- **Referência na spec:** §6
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T002* (passos, interfaces e testes exatos)

## Objetivo

Funções puras gerarTextoCirurgico e gerarTextoAnestesico, em TDD, conforme o formato da spec.

## Critérios de aceite

- [x] Todos os testes listados no plano, com os valores exatos
- [x] \r\n normalizado, opcionais vazios/só espaços omitidos, peso vazio vira --, sem "kg kg"
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

Pode rodar em paralelo com T003 e T004.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** normalizarTexto (CRLF e CR viram LF, trim, null vira ""), gerarTextoCirurgico e gerarTextoAnestesico como funções puras; peso sem sufixo kg duplicado, "--" para ausentes, opcionais vazios omitidos. 10 testes (4 cirúrgico, 6 anestésico).
- **Arquivos:** src/lib/texto/{tipos,normalizar,cirurgico,anestesico}.ts, cirurgico.test.ts, anestesico.test.ts
- **Commits:** 1d579ab (T002: adiciona geração dos textos cirúrgico e anestésico), mais o commit de preenchimento desta seção
- **Saída de lint / typecheck / testes:**

```
npx vitest run src/lib/texto -> 2 files, 10 tests passed
npm run lint      -> sem erros
npm run typecheck -> sem erros
npm test          -> 5 files, 31 tests passed (inclui arquivos de outras tarefas)
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [ ] `arquivo:linha` — …

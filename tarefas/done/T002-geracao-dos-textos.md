# T002 — Geração dos textos cirúrgico e anestésico

- **Status:** concluída
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
- **Veredito:** aprovado
- **Verificação do Revisor:** commit `1d579ab` lido por completo (só `src/lib/texto/`). `npm run lint` OK, `npm run typecheck` OK, `npm test` 5 arquivos / 31 testes OK, `npx vitest run src/lib/texto` 2 arquivos / 10 testes OK. Interfaces idênticas ao plano; os 10 testes batem com os valores exatos do plano; rótulos e ordem conferem com a spec §6.1/§6.2; arquivos em UTF-8 NFC, sem CR. Sonda extra com casos de borda (fora do repositório): `\r` isolado e `\r\n` em nome, técnica, prescrição e opcionais viram `\n`; opcional só com `"\r\n"`, `"\t"` ou `" \r\n "` é omitido; peso `"kg"` → `--`, `" 5 kg "` / `"5 Kg\r\n"` → `5 kg`, `"4.5"` e `"aprox. 5"` preservados; profissional `"  "` ou `""` → `--`; sem `\n` final nos dois textos.
- **Apontamentos bloqueantes:** nenhum.
- **Sugestões opcionais:**
  - [ ] `src/lib/texto/anestesico.ts:9` — o peso `"5kg."` (ou `"5 kgs"`) ainda gera `5kg. kg`, porque a regex só remove `kg` no fim exato — opcional: aceitar pontuação final (`/\s*kg\.?$/i`). Fora do que o plano exige; só vale se a equipe digitar assim.
  - [ ] `src/lib/texto/cirurgico.ts:4` e `src/lib/texto/anestesico.ts:4` — `nomeOuTraco` está duplicada — opcional: exportar de `normalizar.ts`.
  - [ ] `src/lib/texto/cirurgico.test.ts:52` e `src/lib/texto/anestesico.test.ts:89` — o título do teste usa `"\r\n"` sem escape, então o nome tem CR/LF de verdade e quebra a linha na saída do Vitest — opcional: usar `"\\r\\n"`, como no plano.
  - [ ] `src/lib/texto/cirurgico.test.ts` — nenhum teste cobre `\r` isolado (só `\r\n`), embora `normalizarTexto` trate esse caso — opcional: um caso a mais.

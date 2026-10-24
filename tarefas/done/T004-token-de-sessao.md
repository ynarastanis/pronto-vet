# T004 — Token de sessão e verificação de senha

- **Status:** concluída
- **Prioridade:** P1
- **Depende de:** T001
- **Referência na spec:** §8
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T004* (passos, interfaces e testes exatos)

## Objetivo

assinarToken, verificarToken e senhaConfere com Web Crypto, falhando fechado sem segredo/senha configurados.

## Critérios de aceite

- [x] Só crypto.subtle (sem node:crypto)
- [x] verificarToken nunca lança
- [x] Sem APP_PASSWORD/APP_SECRET: nenhum acesso é concedido
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

**Decisão após a rodada 1 (aprovada):** as 4 sugestões opcionais do Revisor entram numa rodada 2 curta, por serem de segurança e baratas:
1. `deBase64Url` recusa base64url não canônico (`paraBase64Url(bytes) !== texto` → inválido) + teste.
2. Teste de adulteração troca um caractere do **meio** da assinatura.
3. `senhaConfere`: `APP_PASSWORD` só com espaços conta como não configurada (`!esperada?.trim()`) + teste.
4. `assinarToken` lança `Error("expiraEm inválido")` se `expiraEm` não for inteiro positivo (`Number.isSafeInteger` e > 0) + teste.

Pode rodar em paralelo com T002 e T003.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** assinarToken, verificarToken e senhaConfere com Web Crypto (crypto.subtle, HMAC-SHA256 e SHA-256), sem node:crypto. verificarToken nunca lança (try/catch, valida formato, base64url e expiração, usa crypto.subtle.verify). Sem segredo/senha: assinarToken lança "APP_SECRET não configurado", verificarToken e senhaConfere retornam false. TDD: teste falhou (módulo inexistente) e depois passou.
- **Arquivos:** src/lib/auth/token.ts, src/lib/auth/token.test.ts
- **Commits:** 09efee6 T004: adiciona token HMAC de sessão e verificação de senha
- **Saída de lint / typecheck / testes:**

```
npx vitest run src/lib/auth -> 1 arquivo, 9 testes passando
npm run lint      -> eslint . (sem erros)
npm run typecheck -> tsc --noEmit (sem erros)
npm test          -> Test Files 5 passed (5); Tests 31 passed (31)
```

### Rodada 2

- **Resumo:** as 4 sugestões do Revisor. (1) `deBase64Url` recusa base64url não canônico (`paraBase64Url(bytes) !== texto`); (2) teste de adulteração troca um caractere do meio da assinatura; (3) `senhaConfere` trata `APP_PASSWORD` só com espaços como não configurada (`!esperada?.trim()`); (4) `assinarToken` lança `Error("expiraEm inválido")` se `expiraEm` não for inteiro seguro positivo. Testes novos de (1), (3) e (4) falharam antes da correção (3 falhas, 9 passando) e passaram depois; o do item 2 já passava, pois só fortalece o teste.
- **Arquivos:** src/lib/auth/token.ts, src/lib/auth/token.test.ts
- **Commits:** 0f071f8 T004: endurece token (base64url canônico, expiraEm válido, senha só com espaços)
- **Saída de lint / typecheck / testes:**

```
npx vitest run src/lib/auth -> 1 arquivo, 12 testes passando
npm run lint      -> eslint . (sem erros)
npm run typecheck -> tsc --noEmit (sem erros)
npm test          -> Test Files 5 passed (5); Tests 34 passed (34)
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado
- **Verificação (rodada pelo Revisor):** `npx vitest run src/lib/auth` → 9/9 passando; `npm run lint` sem erros; `npm run typecheck` sem erros; `npm test` → 5 arquivos, 31 testes passando. Commit revisado: 09efee6 (`src/lib/auth/token.ts`, `src/lib/auth/token.test.ts`).
- **Conformidade:** interfaces idênticas ao plano (Task T004); só `crypto.subtle` (sem `node:crypto`); funções puras recebendo segredo e "agora" (spec §8, ADR-003); todos os testes do Passo 1 presentes; mensagens em pt-BR.
- **Foco de revisão item 4 (falhar fechado):** confirmado. `APP_SECRET` ausente/vazio → `assinarToken` rejeita e `verificarToken` retorna `false`; `APP_PASSWORD` ausente/vazia → `senhaConfere` retorna `false` para qualquer senha, inclusive vazia. `verificarToken` está todo dentro de `try/catch`; NaN, frações, zeros à esquerda e expiração adulterada são recusados.
- **Apontamentos bloqueantes:** nenhum.
- **Sugestões opcionais (não bloqueiam):**
  - [ ] `src/lib/auth/token.ts:22` — `deBase64Url` aceita base64url não canônico: os 2 bits finais do 43º caractere são ignorados, então 3 variações do último caractere de um token válido também são aceitas (verificado: para o token do teste, `x`, `y` e `z` no lugar de `w`). Não permite forjar nem estender sessão (exige token válido), mas o token fica maleável. — Recusar se `paraBase64Url(bytes) !== texto` ou exigir comprimento 43.
  - [ ] `src/lib/auth/token.test.ts:18` — "recusa assinatura adulterada" só passa porque o último caractere atual (`w`) muda para `A`, que altera bits significativos; trocar por um caractere que só altere os bits ignorados faria o teste falhar. — Adulterar um caractere do meio da assinatura (ou o primeiro).
  - [ ] `src/lib/auth/token.ts:84` — `APP_PASSWORD` só com espaços (`" "`) é tratada como configurada e aceita `" "` como senha. Pela letra do plano não é "vazia"; se a intenção for falhar fechado também nesse caso, usar `!esperada?.trim()`. Decisão do Líder.
  - [ ] `src/lib/auth/token.ts:41` — `assinarToken` aceita `expiraEm` não inteiro (`NaN`, `1.5`) e gera um token que nunca valida (falha fechado, sem risco). — Opcional: lançar se `!Number.isSafeInteger(expiraEm)`, para o erro aparecer no T006 em vez de um login que "não pega".

---

- **Rodada:** 2
- **Veredito:** aprovado
- **Verificação (rodada pelo Revisor):** `npx vitest run src/lib/auth` → 12/12 passando; `npm run lint` sem erros; `npm run typecheck` sem erros; `npm test` → 5 arquivos, 34 testes passando. Diff completo revisado dos commits `T004:` em `src/lib/auth/`: 09efee6 e 0f071f8. Sem `node:crypto` em `src/`.
- **Os 4 itens da decisão do Líder:**
  1. Conferido. `deBase64Url` (`token.ts:32`) recusa quando `paraBase64Url(bytes) !== texto`; tokens legítimos continuam válidos, porque `assinarToken` usa o mesmo codificador. O teste novo passa os 64 caracteres pela última posição e exige exatamente 1 aceito, o que cobre as 3 variações maleáveis da rodada 1.
  2. Conferido. O teste troca o caractere de índice 23 (o 19º da assinatura, que não é o último) por `A`/`B`, sempre mudando bits significativos.
  3. Conferido. `senhaConfere` usa `!esperada?.trim()` (`token.ts:86`); o teste cobre `" "` e `"   "`. A comparação continua sem trim (senha `" abc "` configurada exige `" abc "`), como deve ser.
  4. Conferido. `assinarToken` lança `"expiraEm inválido"` para valor não inteiro seguro ou `<= 0` (`token.ts:43`); o teste cobre `NaN`, `1.5`, `0`, `-1`, `Infinity` e `MAX_SAFE_INTEGER + 1`. A checagem do segredo vem antes, então a mensagem "APP_SECRET não configurado" continua com prioridade.
- **Conformidade:** interfaces iguais às do plano (Task T004). A regra de `trim` em `senhaConfere` é mais restrita que "vazia/ausente", conforme a decisão do Líder. Todos os testes do Passo 1 estão presentes; o de adulteração foi fortalecido, e não apenas trocado. Mensagens em pt-BR. Nada além do que foi decidido (YAGNI).
- **Foco de revisão, item 4 (falhar fechado):** continua confirmado. Sem `APP_SECRET`, nenhum token é emitido ou aceito; sem `APP_PASSWORD`, ou com ela vazia ou só com espaços, nenhuma senha confere; `verificarToken` continua todo dentro de `try/catch`.
- **Apontamentos bloqueantes:** nenhum.
- **Sugestões opcionais (não bloqueiam):**
  - [ ] `src/lib/auth/token.ts:42` — `APP_SECRET` só com espaços (`" "`) ainda é aceito como segredo, o que não segue a regra adotada para `APP_PASSWORD` no item 3. O segredo continua sendo HMAC e não é adivinhável só por ser fraco, mas o caso é o mesmo de configuração errada. — Se o Líder quiser simetria, usar `!segredo?.trim()` em `assinarToken` e em `verificarToken`, com teste. Decisão do Líder; dá para resolver em T006 junto com a leitura do ambiente.
  - [ ] `src/lib/auth/token.test.ts:20` — o comentário `2 + 1 + 20 // depois de "2000."` não bate com a conta (`"2000."` tem 5 caracteres). O índice 23 cai dentro da assinatura, então o teste está correto. — Escrever `"2000.".length + 18`, ou corrigir o comentário.

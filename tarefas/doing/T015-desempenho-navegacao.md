# T015 — Desempenho na navegação

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T010 (branch empilhado sobre `t010-banco`; rebase no `main` após o merge do PR #3)
- **Branch:** `t015-desempenho`
- **Referência:** `docs/design/sistema-visual.md` (Movimento, Layout), ADR-010, ADR-016

## Objetivo

Eliminar a sensação de ~1s de travamento ao navegar entre telas no Preview/produção: resposta visual imediata no clique e menos latência no servidor.

## Critérios de aceite

- [ ] `loading.tsx` em `src/app/(app)/` (Gerar), `src/app/(app)/procedimentos/`, `src/app/(app)/procedimentos/[id]/` e `src/app/(app)/profissionais/`, com esqueletos fiéis ao layout final de cada tela (mesmas dimensões e grade, para não pular ao trocar), cor `--muted`/`--campo-suave`, brilho suave (shimmer) desligado com `prefers-reduced-motion`, `aria-busy="true"` e texto `sr-only` "Carregando…"
- [ ] Esqueletos não causam overflow em 360px e acompanham a escala de telas grandes (rem)
- [ ] Driver HTTP do Neon (`PrismaNeonHttp` ou o equivalente da 7.10.1 — confira na doc/README instalado) no lugar do WebSocket **se** nenhuma operação dos serviços usar transação interativa; se alguma usar, documente e mantenha WebSocket
- [ ] Medição antes/depois contra o branch `development` (script fora do repo): tempo da 1ª consulta (conexão fria) e das seguintes, para `listarCompletos` + `profissionais.listar` em paralelo, com WebSocket e com HTTP; tabela na Implementação
- [ ] `export const preferredRegion` **não** é necessário (região das funções já está em São Paulo nas configurações da Vercel) — não adicione
- [ ] Nenhuma dependência nova (salvo se o adapter HTTP exigir algo já transitivo; registre)
- [ ] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando

## Notas do Líder

- Consultas já estão em paralelo (`Promise.all` na Gerar); uma consulta por tela nas demais.
- Região das funções: usuário configurou São Paulo na Vercel (2026-10-24). Região do banco criado pela Vercel ainda não confirmada.
- Carregar o skill `frontend-design:frontend-design`; o sistema visual prevalece. Conferência visual é do usuário.
- Commits `T015: ...`. Push e PR são do Líder.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```

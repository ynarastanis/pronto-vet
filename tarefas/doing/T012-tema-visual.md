# T012 — Tema visual e componentes base

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T006 (executar antes de T007, T008 e T009)
- **Referência:** `docs/design/sistema-visual.md`, ADR-013
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T012*

## Objetivo

Aplicar o sistema visual verde (tokens claro/escuro, Onest + Literata, raios, utilitários de movimento com reduced-motion) e criar `CabecalhoPagina`, `EstadoVazio` e `Ficha`; reestilizar barra, `/entrar` e páginas de erro.

## Critérios de aceite

- [ ] Tokens e fontes exatamente como em `docs/design/sistema-visual.md`; Geist removida
- [ ] Modo escuro automático pelo sistema
- [ ] Pílula do link ativo desliza; Copiar/varredura disponível via `Ficha copiado`
- [ ] Todas as animações desligadas/reduzidas com `prefers-reduced-motion`
- [ ] Foco visível em todos os controles; sem rolagem horizontal em 360px
- [ ] Nenhuma dependência nova
- [ ] `npm run build` passando
- [ ] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- Carregar o skill `frontend-design:frontend-design`; as escolhas de `docs/design/sistema-visual.md` prevalecem sobre ideias novas.
- O Líder fará conferência visual no navegador do app após a implementação.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [ ] `arquivo:linha` — …

# T012 — Tema visual e componentes base

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T006 (executar antes de T007, T008 e T009)
- **Referência:** `docs/design/sistema-visual.md`, ADR-013
- **Plano:** `docs/superpowers/plans/2026-10-24-pronto-vet.md` → *Task T012*

## Objetivo

Aplicar o sistema visual verde (tokens claro/escuro, Onest + Literata, raios, utilitários de movimento com reduced-motion) e criar `CabecalhoPagina`, `EstadoVazio` e `Ficha`; reestilizar barra, `/entrar` e páginas de erro.

## Critérios de aceite

- [x] Tokens e fontes exatamente como em `docs/design/sistema-visual.md`; Geist removida
- [x] Modo escuro automático pelo sistema
- [x] Pílula do link ativo desliza; Copiar/varredura disponível via `Ficha copiado`
- [x] Todas as animações desligadas/reduzidas com `prefers-reduced-motion`
- [ ] Foco visível em todos os controles; sem rolagem horizontal em 360px
- [x] Nenhuma dependência nova
- [x] `npm run build` passando
- [x] `npm run lint`, `npm run typecheck` e `npm test` passando

## Notas do Líder

- Carregar o skill `frontend-design:frontend-design`; as escolhas de `docs/design/sistema-visual.md` prevalecem sobre ideias novas.
- O Líder fará conferência visual no navegador do app após a implementação.

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:** tokens claro/escuro (hex do sistema visual) mapeados nas variáveis do shadcn em `globals.css`, raios 8/12/14, Onest (400/500/600) e Literata (400) via `next/font` (Geist removida), `ThemeProvider` do `next-themes` (class, system, sem botão). Utilitários `.entrar-fade`, `.realce-linha`, `.trocar-texto`, `.varredura-copiado`, `.pilula-ativa`, `.texto-documento` e bloco `prefers-reduced-motion`. Componentes `CabecalhoPagina`, `EstadoVazio`, `Ficha` (faixa 6px; `copiado` dispara a varredura). Barra de 56px com marca "■ Pronto Vet", pílula que desliza (posicionada por JS, transição CSS) e "Sair" discreto; `template.tsx` em `(app)` dá o fade de 160ms e a largura de 1120px. `/entrar`, erro, erro global e 404 reestilizados. Controles shadcn: anel de foco 2px com offset, altura 40px no celular. `/` provisória mantém `await exigirSessao()` na primeira linha.
- **Arquivos:** `src/app/globals.css`, `src/app/layout.tsx`, `src/app/(app)/page.tsx`, `src/app/(app)/template.tsx`, `src/app/entrar/page.tsx`, `src/app/error.tsx`, `src/app/global-error.tsx`, `src/app/not-found.tsx`, `src/components/tema.tsx`, `cabecalho-pagina.tsx`, `estado-vazio.tsx`, `ficha.tsx`, `barra-navegacao.tsx`, `entrar/formulario-entrar.tsx`, `ui/{button,input,select,textarea}.tsx`.
- **Commits:** ver `git log --grep T012`.
- **Saída de lint / typecheck / testes:**

```
npm run lint       -> sem erros
npm run typecheck  -> sem erros
npm test           -> Test Files 7 passed (7); Tests 55 passed (55)
npm run build      -> Compiled successfully; rotas: ƒ /, ○ /_not-found, ○ /entrar
next dev (porta 3000, FONTE_DADOS=memoria): GET /entrar 200; GET / sem cookie 307 -> /entrar;
GET / com sessão 200 (h1 "Gerar", aria-current na barra); GET /nada 404
```

Não verificado visualmente (sem navegador nesta etapa): aparência em 1280/375px, claro/escuro, deslize da pílula, ausência de rolagem horizontal em 360px e contraste real. Conferência fica com o Líder.

## Revisão

<!-- preenchido pelo Revisor (Opus, sessão limpa) -->

- **Rodada:** 1
- **Veredito:** aprovado | alterações solicitadas
- **Apontamentos:**
  - [ ] `arquivo:linha` — …

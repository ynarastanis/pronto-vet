# T012 — Tema visual e componentes base

- **Status:** em revisão
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

**Conferência visual do Líder (rodada 2):** 360px escuro — Gerar 16–66px, Procedimentos 68–175, Profissionais 177–270, Sair (ícone) 304–344; sem rolagem horizontal; nada cortado. ok.

**Decisões da rodada 1 (para a rodada 2):**
1. Bloqueante: aplicar a correção da barra proposta pelo Revisor (marca oculta abaixo de `sm`, Sair só com ícone `LogOut` + `aria-label` abaixo de `sm`, links `px-2 text-[13px] sm:px-2.5 sm:text-sm`, `gap-2 sm:gap-3`).
2. Remover `overflow-x: hidden` do `body` (ou trocar por `clip` só se houver motivo documentado) — estouro deve aparecer, não ser escondido.
3. Pílula: recalcular após `document.fonts.ready` e observar o tamanho de cada link.
4. Completar os utilitários de movimento que faltam na seção "Movimento": saída de 120ms do crossfade (`.trocar-texto`), check do Copiar (escala 0.9→1), erro de formulário (fade + altura), item de lista entrando/saindo (fade + altura). Todos sob `prefers-reduced-motion`.
5. Offset do anel de foco dentro de `Ficha` usa a cor da superfície (`--card`).

- Carregar o skill `frontend-design:frontend-design`; as escolhas de `docs/design/sistema-visual.md` prevalecem sobre ideias novas.
- O Líder fará conferência visual no navegador do app após a implementação.

**Conferência visual do Líder (navegador do app, rodada 1):**
- ok: `/entrar` claro e escuro (ficha com faixa verde, botão verde-campo; no escuro botão menta); `/` com barra, pílula no link ativo; Onest carregada; sem rolagem horizontal em 375px; console sem erros.
- problema: em 375px o último link aparece **cortado** ("Profissiona") ao lado de "Sair" — parece quebrado, mesmo rolando. Precisa caber ou indicar rolagem de forma clara (ex.: Sair só com ícone + rótulo acessível no celular, espaçamentos menores).
- não verificado: deslize da pílula entre páginas (as outras rotas ainda não existem).

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
- **Veredito:** alterações solicitadas
- **Verificado pelo Revisor:** `npm run lint` ok; `npm run typecheck` ok; `npm test` 55/55; `npm run build` ok (ƒ /, ○ /entrar, ○ /_not-found); `curl /entrar` 200, `curl /` sem cookie 307 → `/entrar`. Tokens: todos os hex claro/escuro conferem com a tabela (inclusive `--muted` `#EAF1ED`/`#183029`, `--ring` = campo, `--input` = fio). Contraste (WCAG): `--tinta-suave` sobre `--fundo` 5,02:1 (claro) / 7,17:1 (escuro); sobre `--folha` 5,42:1 / 6,49:1; sobre `--muted` 4,73:1 / 5,64:1; texto do botão primário 7,90:1 (branco sobre `#0E5C4D`) / 9,65:1 (`#0C1A16` sobre `#5FD3A4`); link ativo (`--primary` sobre `--accent`) 6,79:1 / 6,73:1 — tudo AA. Fontes: Onest 400/500/600 e Literata 400 via `next/font`, Geist sem ocorrências. `prefers-reduced-motion`: regra global com `!important` em `*, ::before, ::after` cobre `tw-animate-css` (mantém `animationend`, então o Radix ainda desmonta), a pílula (vence o `style.transition` inline) e a varredura. Segurança: `Tema` (client) e `(app)/template.tsx` não leem dados nem mexem em sessão; `(app)/layout.tsx` e `(app)/page.tsx` mantêm `await exigirSessao()` na primeira linha, fora de `try/catch` (ADR-012 intacta). APIs de `CabecalhoPagina`, `EstadoVazio` e `Ficha` batem com o plano.
- **Apontamentos bloqueantes:**
  - [ ] `src/components/barra-navegacao.tsx:59-100` — em 360/375px os links não cabem: medido no navegador do app, conteúdo da lista 281px contra 243px visíveis em 360px (≈258px em 375px), daí "Profissiona" cortado; e o critério "sem rolagem horizontal em 360px" continua desmarcado. — Abaixo de `sm`: (1) esconder a marca "■" (linha 61-67: `hidden sm:flex`; "Gerar" já leva a `/`); (2) "Sair" só com ícone `LogOut` do `lucide-react` (já instalado) em botão `size-10`, com `aria-label="Sair"`, e rótulo visível a partir de `sm` (`<span className="hidden sm:inline">Sair</span>`); (3) links com `px-2 text-[13px] sm:px-2.5 sm:text-sm` (13px está na escala); (4) `gap-2 sm:gap-3` no `<nav>`. Simulei exatamente isso no navegador em 360px: conteúdo 253px em 280px disponíveis (margem de 27px), sem corte. Manter a marca com o resto da proposta deixa só 3px de folga — não recomendo. Depois, o Líder confere em 360 e 375px, claro e escuro, e marca o critério.
- **Sugestões (não bloqueantes):**
  - [ ] `src/components/barra-navegacao.tsx:50` — o `ResizeObserver` observa só a lista (`flex-1`), cuja largura não muda quando a Onest substitui o fallback (`display: swap`) ou quando o peso 500 do link ativo muda a largura do link; a pílula pode ficar com a largura antiga até a próxima navegação. — Observar também cada link (`raiz.querySelectorAll("a").forEach(a => observador.observe(a))`) ou chamar `document.fonts.ready.then(posicionar)`.
  - [ ] `src/app/globals.css:140` — `overflow-x: hidden` no `body` esconde estouros em vez de evitá-los (foi o que mascarou o corte na barra para a checagem "sem rolagem horizontal"). — Remover, ou trocar por `overflow-x: clip`, e conferir 360px sem ele.
  - [ ] `src/app/globals.css:201` — a seção "Movimento" pede crossfade (saída 120ms + entrada 200ms/4px); `.trocar-texto` só faz a entrada. Também não há utilitários para o check do Copiar (escala 0.9→1), para erros de formulário (fade + altura) e para entrada/saída de itens de lista. — Aceitável deixar para T007–T009 (podem usar `animate-in fade-in` do `tw-animate-css`), mas registrar no plano para não virar uma ideia diferente em cada tela.
  - [ ] `src/components/ui/badge.tsx:7` — o selo ainda usa o foco antigo do shadcn (`ring-[3px] ring-ring/50`), diferente do anel 2px + offset 2px dos demais. Só importa se T008 usar um Badge clicável; nesse caso, alinhar ao `button.tsx`.
  - [ ] `src/components/ui/{button,input,select,textarea}.tsx` — `ring-offset-background` dentro de uma `Ficha`/superfície `bg-card` faz o offset aparecer em outra cor (`#F3F7F5` sobre branco; `#0C1A16` sobre `#12241F`). Pequeno; dá para resolver com `ring-offset-card` no contexto da ficha ou deixar como está.
  - [ ] `src/app/not-found.tsx:8` — o título agora é "Página não encontrada" (sem ponto), mas o Passo 2 da T008 espera ver "Página não encontrada.". — Ajustar o texto do plano da T008 para o título atual (preferível) ou repor o ponto.
  - [ ] `src/app/global-error.tsx:8` — sem `Tema` e sem as variáveis das fontes, a página fica sempre clara e em `system-ui`. Aceitável para erro global; se quiser, aplicar `onest.variable` no `<html>`.
  - [ ] Para T009: `--copiado` (`#2FA676`) sobre branco dá 3,07:1 — serve como preenchimento da faixa (não texto), mas não deve ser usado como cor de texto do rótulo "Copiado".

### Rodada 2

- **Barra (decisão 1):** abaixo de `sm` a marca fica oculta (`hidden sm:flex`), "Sair" vira só o ícone `LogOut` em botão `min-w-10` com `aria-label="Sair"` (rótulo visível a partir de `sm`), links `px-2 text-[13px] sm:px-2.5 sm:text-sm`, `<nav>` com `gap-2 sm:gap-3`. Pelas medidas do Revisor (253px de conteúdo em 280px disponíveis a 360px) cabe sem corte; não conferi visualmente.
- **`overflow-x` (2):** removido do `body`; estouro agora aparece em vez de ficar escondido.
- **Pílula (3):** além da lista, o `ResizeObserver` observa cada link e `document.fonts.ready` dispara novo `posicionar()`.
- **Movimento (4):** `globals.css` ganhou `.trocar-texto-saida` (120ms), `.check-copiado` (escala 0.9→1), `.erro-campo` (fade + altura via grid 0fr→1fr), `.item-lista` / `.item-lista-saida` (fade + altura; conteúdo em um único filho direto). Cobertos pela regra global de `prefers-reduced-motion`.
- **Foco na Ficha (5):** `Ficha` recebe a classe `ficha` e `.ficha :focus-visible { --tw-ring-offset-color: var(--card) }`.
- **Commits:** ver `git log --grep T012`.
- **Saída:** `npm run lint` e `npm run typecheck` sem erros; `npm test` 7 arquivos, 55 testes passando; `npm run build` compilou (ƒ /, ○ /_not-found, ○ /entrar).
- **Não verificado visualmente:** barra a 360/375px, deslize da pílula, utilitários de movimento (ainda sem uso nas telas), offset de foco na Ficha. O critério "sem rolagem horizontal em 360px" fica com o Líder.

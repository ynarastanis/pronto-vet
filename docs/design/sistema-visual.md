# Pronto Vet — Sistema visual

Referência obrigatória para toda tarefa de UI (T012, T007, T008, T009). Implementadores carregam também o skill `frontend-design:frontend-design`, mas **as escolhas abaixo prevalecem** — o objetivo é um app coeso, não cada tela com uma ideia nova.

## Assunto, público, tarefa principal

- **Assunto:** prontuário cirúrgico veterinário. O vocabulário visual vem do centro cirúrgico: o verde-azulado dos campos e aventais, a ficha de papel do prontuário, a precisão de instrumental.
- **Público:** cirurgiões e anestesistas de uma clínica, entre um procedimento e outro, no computador da clínica (às vezes no celular).
- **Tarefa principal:** escolher procedimento + profissionais + peso e copiar dois textos. Tudo o mais é cadastro de apoio.

## Cor

Verde **cirúrgico** (verde-azulado dos campos operatórios), não o esmeralda padrão do Tailwind. Superfícies planas com fio de borda; sombra só em camadas que flutuam (popover, dialog, toast).

| Token | Claro | Escuro | Uso |
|---|---|---|---|
| `--campo` (primary) | `#0E5C4D` | `#5FD3A4` | ações principais, faixa das fichas, link ativo, foco |
| `--campo-suave` (accent) | `#E3F1EB` | `#173A31` | hover, seleção, fundo do link ativo |
| `--fundo` (background) | `#F3F7F5` | `#0C1A16` | fundo da aplicação |
| `--folha` (card/popover) | `#FFFFFF` | `#12241F` | fichas, formulários, menus |
| `--tinta` (foreground) | `#14231E` | `#E4EEE9` | texto |
| `--tinta-suave` (muted-fg) | `#5B6E67` | `#93A9A0` | texto secundário, placeholders |
| `--fio` (border/input) | `#D5E2DB` | `#24403A` | bordas e divisórias |
| `--copiado` | `#2FA676` | `#4CC995` | confirmação de cópia |
| `--erro` (destructive) | `#B23B35` | `#F07A70` | erros e exclusão |

- Mapear para as variáveis do shadcn em `src/app/globals.css` (`--primary`, `--accent`, `--background`, `--card`, `--popover`, `--foreground`, `--muted-foreground`, `--border`, `--input`, `--ring` = campo, `--destructive`). `--muted` = `#EAF1ED` / `#183029`.
- Modo escuro: automático pelo sistema (`next-themes`, `attribute="class"`, `defaultTheme="system"`, sem botão de troca).
- Contraste mínimo AA em texto (verificar `--tinta-suave` sobre `--fundo` e `--folha`).

## Tipografia

- **Interface:** `Onest` (Google Fonts via `next/font`), pesos 400/500/600. Substitui a Geist do scaffold.
- **Texto do prontuário (prévia nas fichas):** `Literata` 400, `font-size` 15px, `line-height` 1.65, largura máxima ~72 caracteres. É o único lugar com serifa: a prévia deve ler como um documento, não como interface.
- Escala (px): 13 · 14 (base da UI) · 16 · 20 · 26. Títulos de página 26/600 com `letter-spacing: -0.01em`; títulos de seção 16/600.
- Sem caixa-alta em rótulos de interface (os rótulos em maiúsculas que aparecem **dentro** do texto gerado são conteúdo e ficam como estão). Sem sobretítulos acima de títulos. Sem acentuar uma palavra isolada de um título.

## Escala em telas grandes

Pedido do usuário (2026-10-24): em notebook e monitores o app ficava pequeno; com zoom de 150% ficava bom. Em vez de exigir zoom, a **escala global cresce com a largura da tela** a partir de 1024px:

```css
html { font-size: 100%; }                         /* < 1024px: celular e tablet inalterados */
@media (min-width: 1024px) {
  html { font-size: clamp(16px, 1.778px + 1.389vw, 24px); }
}
/* 1024px → 16px (100%) · 1280px → ~19.6px (122%) · 1366px → ~20.8px (130%) · 1536px → ~23.1px (144%) · ≥1600px → 24px (150%) */
```

- Funciona porque tipografia, espaçamentos e raios são em `rem`. **Valores em `px` não escalam**: tamanhos de texto, larguras máximas, alturas fixas, faixas e ícones devem ser expressos em `rem` (16px = 1rem na base). Exceções que ficam em `px`: bordas de 1px, anéis de foco, deslocamentos de animação.
- A largura máxima do conteúdo passa de 1120px para `70rem`, crescendo junto.
- Breakpoints de mídia continuam em pixels de viewport (media queries em `rem` usam o tamanho padrão do navegador, não o `html`), então a troca de layout não muda.
- Não usar a propriedade CSS `zoom`: desalinha popovers e combobox posicionados por coordenadas.

## Layout

Conteúdo alinhado à esquerda; largura máxima 1120px; gutter 16px no celular, 24px no desktop.

**Barra superior** (fina, 56px, fundo `--folha`, fio inferior):
```
[■ Pronto Vet]   Gerar   Procedimentos   Profissionais                  Sair
                 ▔▔▔▔▔ (pílula verde-suave sob o link ativo, desliza entre links)
```
O "■" é um pequeno quadrado verde-campo com cantos de 3px — a mesma faixa das fichas, em miniatura. Sem logotipo ilustrado.

**Gerar:** escolhas numa **linha própria** no topo (superfície única), fichas abaixo. (Revisado em 2026-10-24 a pedido do usuário: o painel lateral ao lado das fichas ficava apertado.)
```
┌─ Escolhas ────────────────────────────────────────────────────────────────────────────────────┐
│ Procedimento [busca ▾]        Cirurgião [digite…]        Anestesista [digite…]     Peso [   ] │
│                               (Ana) (Bruno) (Carla)      (Dr. Lima) (Dra. Reis)               │
└───────────────────────────────────────────────────────────────────────────────────────────────┘
┌▌Descrição cirúrgica ──────────── [🔒] [Copiar] ┐  ┌▌Descrição anestésica ─────────── [🔒] [Copiar] ┐
│▌ PROCEDIMENTO CIRÚRGICO: ...                    │  │▌ CIRURGIÃO: ...                                 │
│▌ (Literata, documento)                          │  │▌ Peso do paciente: 4,2 kg                       │
└─────────────────────────────────────────────────┘  └─────────────────────────────────────────────────┘
```
- Escolhas: ≥ 1024px em 4 colunas (`minmax(0,2fr) minmax(0,1.5fr) minmax(0,1.5fr) minmax(0,1fr)`); 640–1023px em 2 colunas; < 640px em 1 coluna. Não é sticky.
- Fichas: lado a lado a partir de 1024px; empilhadas abaixo disso.

**Seleção de profissionais (typeahead):** Cirurgião e Anestesista são campos de texto com sugestões enquanto digita (lista filtrada pelo papel, sem diferenciar maiúsculas nem acentos, navegável por teclado, `role="combobox"`). Escolher uma sugestão fixa o profissional; o campo mostra o nome com um botão `X` para limpar. Abaixo do campo, **pills dos últimos profissionais escolhidos** daquele papel (até 4, mais recente primeiro, guardados em `localStorage` como lista de ids; ids que não existem mais são ignorados). Tocar numa pill seleciona o profissional; a pill do selecionado fica marcada (`--campo-suave`, borda `--campo`, `aria-pressed`). Ao abrir a tela, o mais recente vem pré-selecionado (comportamento anterior mantido).

**Ficha** (o elemento memorável do app): fundo `--folha`, fio `--fio`, raio 14px, e uma **faixa vertical de 6px em `--campo` na borda esquerda** — o campo cirúrgico sobre a folha. Cabeçalho da ficha: título 16/600 em `--tinta` + botão Copiar à direita. Corpo: texto em Literata com `white-space: pre-wrap`.

**Listas de cadastro** (Procedimentos, Profissionais): linhas em uma única superfície `--folha` com divisórias de 1px, não um cartão por item. Raio da superfície 12px; controles e campos 8px; selos (Badge) totalmente arredondados. Hierarquia de raios: fichas 14 > superfícies 12 > controles 8.

**Formulários:** rótulo acima do campo, 14/500; ajuda e erro abaixo, 13px. Textareas de procedimento usam Literata (o usuário está escrevendo o próprio texto do prontuário), com altura mínima de 8 linhas e crescimento automático (`field-sizing: content` com fallback de `min-h`).

## Movimento

Duração base 180ms; entradas 240ms; curva `cubic-bezier(0.2, 0, 0, 1)`. Utilitários em `globals.css`. **Tudo** desligado ou reduzido a fade simples em `@media (prefers-reduced-motion: reduce)`.

Movimento que responde a ação (o centro do pedido de "transições suaves"):
1. **Copiar (momento principal):** ao copiar, um preenchimento `--copiado` varre a faixa esquerda da ficha de cima para baixo (≈420ms) e o botão troca o ícone por um check com escala 0.9→1 e o rótulo "Copiado"; volta ao normal após 2s.
2. **Trocar de procedimento:** o texto da ficha faz crossfade (saída 120ms, entrada 200ms com deslocamento de 4px). Mudar profissional ou peso **não** anima o texto inteiro — só a linha alterada recebe um realce `--campo-suave` que esmaece em 600ms.
3. **Navegação:** a pílula do link ativo desliza para o novo link (transform, 220ms). Conteúdo da página entra com fade de 160ms (sem slide).
4. **Dialog, popover, select:** animações do shadcn (`tw-animate-css`), mantidas.
5. **Erros de formulário:** mensagem entra com fade + altura (sem tremer o campo).
6. **Lista:** item adicionado entra com fade + expansão de altura; item excluído sai com fade + colapso.

Sem animação automática na carga das páginas além do fade de 160ms. Sem hover que levanta cartões. Hover de linha de lista = fundo `--campo-suave`.

## Ícones

- Biblioteca: `lucide-react` (já instalada). Traço 1.75, tamanho 16px em botões e links, 18px em títulos de ficha, 32px em estados vazios (dentro de um círculo `--campo-suave`).
- Ícone acompanha o texto, não o substitui — exceto onde o espaço exige (Sair no celular, ações por linha no celular), sempre com `aria-label`. Ícones decorativos têm `aria-hidden`.
- Cor: herda o texto (`currentColor`); em `--campo` só no link ativo e na ação primária.
- Mapa:

| Onde | Ícone |
|---|---|
| Link Gerar | `ClipboardList` |
| Link Procedimentos | `IconeMascara` (próprio) |
| Link Profissionais | `Users` |
| Sair | `LogOut` |
| Campo Procedimento / combobox | `IconeMascara` + `ChevronsUpDown` |
| Campo Cirurgião | `UserRound` |
| Campo Anestesista | `Syringe` |
| Campo Peso | `Weight` |
| Busca | `Search` |
| Novo / Adicionar | `Plus` |
| Editar | `Pencil` |
| Salvar | `Save` (ou `Check` em salvamento inline) |
| Excluir | `Trash2` |
| Copiar / Copiado | `Copy` / `Check` |
| Ficha cirúrgica | `IconeMascara` |
| Ficha anestésica | `Syringe` |
| Selo "sem descrição anestésica" | `CircleAlert` |
| Estado vazio de procedimentos | `FileText` |
| Estado vazio de profissionais | `Users` |
| Página não encontrada / erro | `SearchX` / `TriangleAlert` |
| Login | `KeyRound` no campo Senha |

**Ícone de procedimento:** `src/components/icone-mascara.tsx` — máscara cirúrgica desenhada no estilo lucide (viewBox 24, traço 1.75, `currentColor`, cantos arredondados), substitui a tesoura (que não comunicava "procedimento"; a lucide não tem máscara cirúrgica). Corpo com 2 pregas horizontais e alças laterais.

## Edição livre do texto gerado (cadeado)

Cada ficha da tela Gerar tem um **cadeado** no cabeçalho, ao lado de Copiar.

- **Fechado (padrão):** o texto é gerado automaticamente pelas escolhas; não editável.
- **Aberto:** o corpo da ficha vira uma área de texto (Literata, mesma aparência do documento, com fundo `--campo-suave` sutil e anel de foco) iniciada com o texto atual. O usuário edita livremente; **Copiar copia o texto editado**. Mudanças nas escolhas (procedimento, profissionais, peso) **não sobrescrevem** a edição — **logo abaixo do título da ficha** (no cabeçalho) aparece a nota "Edição livre. Feche o cadeado para voltar ao texto gerado." (13px, ícone `PencilLine`, cor `--edicao` se passar AA sobre `--edicao-suave`, senão `--tinta` com ícone azul).
- **Fechar de novo:** descarta a edição e volta ao texto gerado, com o crossfade de troca de texto. Se o texto foi alterado, pede confirmação ("Descartar edição?" / "O texto volta a ser gerado pelas escolhas." / Cancelar · Descartar).
- Trocar de **procedimento** com a ficha aberta: mantém aberta e mantém a edição (o usuário decide fechar).
- A edição **nunca é salva** (vive só no estado da tela; nada de paciente persiste — spec §2).
- Cada ficha tem seu próprio cadeado.
- Rótulos acessíveis: "Editar texto livremente" (fechado) / "Bloquear e voltar ao texto gerado" (aberto); `aria-pressed`.

**Animação do cadeado** (o segundo momento de movimento do app, depois do Copiar): ícone SVG próprio (`src/components/icone-cadeado.tsx`) com corpo e haste separados. Abrir: a haste sobe 1px e gira −25° em torno do pino esquerdo (1px, não 3px: com 3px o arco sai do viewBox e é cortado) (220ms, curva padrão), com leve "clique" de escala do corpo 1 → 0.92 → 1 (160ms). Fechar: movimento inverso. O ícone mostra o cadeado **aberto enquanto a ficha está em edição** e fechado fora dela — o desenho sempre corresponde ao estado. **Modo de edição em azul** (revisado em 2026-10-24 a pedido do usuário; substitui a faixa listrada): a ficha inteira troca para tons de azul — tokens `--edicao` (faixa e anel: claro `#2F6DB0`, escuro `#7FB0EA`), `--edicao-suave` (fundo da ficha e da área de texto: claro `#EEF4FB`, escuro `#132338`), `--edicao-fio` (borda: claro `#B7CDEA`, escuro `#2A4466`). A troca de cor é uma transição de 220ms de `background-color`/`border-color`. O cadeado aberto usa `--edicao`. Texto em `--tinta` continua com contraste AA sobre `--edicao-suave` (verificar). Transição entre texto e área de texto: crossfade 160ms. Tudo reduzido a troca instantânea com `prefers-reduced-motion`.

## Componentes compartilhados (criados na T012)

- `CabecalhoPagina({ titulo, descricao?, acao? })` — título 26/600, descrição opcional em `--tinta-suave`, ação à direita.
- `EstadoVazio({ titulo, descricao, acao? })` — usado em listas e na tela Gerar; texto direto, convida a agir.
- `Ficha({ titulo, acao?, children })` — superfície com a faixa verde; expõe `data-copiado` para a animação da faixa.
- Utilitários CSS: `.entrar-fade`, `.realce-linha`, `.varredura-copiado`, `.pilula-ativa`.

## Texto da interface

- Tom direto, verbos simples, frases em caixa normal. Botões dizem o que fazem: "Salvar procedimento", "Adicionar profissional", "Copiar".
- Uma ação mantém o mesmo nome no fluxo: botão "Salvar procedimento" → toast "Procedimento salvo.".
- Estados vazios convidam a agir e dizem como; erros dizem o que aconteceu e como corrigir, sem pedir desculpas.
- Sem "→" em botões, sem `·` separando metadados, sem travessão decorativo.

## Qualidade mínima

Responsivo até 360px sem rolagem horizontal; foco visível (anel 2px `--campo` com offset 2px); áreas de toque ≥ 40px no celular; `prefers-reduced-motion` respeitado; textos em pt-BR.

## Revisão do plano contra o pedido

- Primeiro rascunho tinha um cabeçalho com gradiente verde e cartões com sombra para cada procedimento — é o kit SaaS padrão. Trocado por superfícies planas com fio e uma única marca forte (a faixa de campo cirúrgico nas fichas).
- Primeiro rascunho usava monoespaçada na prévia do texto — "mono para dados" é um vício comum e o texto é um documento clínico. Trocado por Literata.
- Verde: em vez de esmeralda vivo sobre fundo escuro (outro padrão comum), verde-azulado cirúrgico sobre fundo levemente esverdeado, que vem do assunto.

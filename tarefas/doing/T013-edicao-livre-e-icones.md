# T013 — Edição livre com cadeado e ícones no app

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T009, T012
- **Referência:** `docs/design/sistema-visual.md` › "Edição livre do texto gerado (cadeado)" e "Ícones"; spec §2 e §7

## Objetivo

Permitir editar livremente o texto de cada ficha da tela Gerar antes de copiar, com um cadeado animado que abre/fecha a edição; e aplicar ícones (`lucide-react`) em todo o app conforme o mapa do sistema visual.

## Critérios de aceite

- [x] Cada ficha tem cadeado próprio; comportamento exatamente como em "Edição livre do texto gerado (cadeado)": fechado = gerado; aberto = área de texto editável iniciada com o texto atual; Copiar copia o texto exibido (editado quando aberto); escolhas não sobrescrevem edição aberta; fechar descarta (com confirmação se alterado) e volta ao gerado
- [x] Nota "Edição livre. Feche o cadeado para voltar ao texto gerado." visível enquanto aberta
- [x] Edição nunca persistida (nem `localStorage`)
- [x] `src/components/icone-cadeado.tsx` com haste animada (sobe e gira) e "clique" do corpo; faixa da ficha listrada enquanto aberta; `prefers-reduced-motion` respeitado
- [x] `aria-pressed` e rótulos acessíveis do cadeado conforme o sistema visual
- [x] Ícones aplicados conforme a tabela "Ícones" em barra, campos, botões, fichas, selos, estados vazios, erro/404 e login; decorativos com `aria-hidden`, só-ícone com `aria-label`
- [x] Lógica de estado da edição em função pura testada (TDD) em `src/lib/edicao-livre.ts`
- [x] Nenhuma dependência nova
- [x] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando

## Notas do Líder

- Função pura sugerida: `type EstadoEdicao = { aberta: boolean; texto: string | null }` com `abrir(estado, textoGerado)`, `editar(estado, texto)`, `precisaConfirmarFechar(estado, textoGerado): boolean` (true se aberta e texto ≠ texto com que abriu… ou ≠ gerado atual — decida e documente), `fechar(estado)`, `textoExibido(estado, textoGerado): string`. Testes cobrindo: copiar usa editado; mudança de escolhas não afeta edição aberta; fechar sem alteração não pede confirmação.
- Confirmação de descarte: reutilize o padrão do `ConfirmarExclusao` (AlertDialog) ou crie um componente equivalente com textos "Descartar edição?" / "O texto volta a ser gerado pelas escolhas." / "Cancelar" / "Descartar".
- O realce de linhas alteradas (`.realce-linha`) só se aplica com o cadeado fechado.
- Carregar o skill `frontend-design:frontend-design`; o sistema visual prevalece.
- Conferência visual é do usuário (AGENTS.md).

---

## Implementação

- **Resumo:** Função pura `src/lib/edicao-livre.ts` (TDD) com estado `{aberta:false} | {aberta:true, texto, abertura}`. Decisão de `precisaConfirmarFechar`: compara o texto editado com o texto gerado **no instante em que o cadeado abriu** (`abertura`), não com o gerado atual, para que mudar as escolhas com a ficha aberta não conte como alteração do usuário; voltar manualmente ao texto de abertura dispensa a confirmação. `fechar()` não recebe argumento. Cada `CartaoTexto` tem cadeado próprio (`aria-pressed`, rótulos do sistema visual), área de texto Literata com fundo `--campo-suave`, nota de edição livre, confirmação "Descartar edição?" (`ConfirmarDescarte`), faixa listrada (`data-edicao`) e crossfade de 160ms; Copiar copia o texto exibido. Edição só em estado React (nada em `localStorage`). `IconeCadeado` com haste (sobe 3px, gira -25°) e clique do corpo, via CSS, reduzido por `prefers-reduced-motion`. Ícones lucide (traço 1.75 global) em barra, campos da tela Gerar, combobox, botões Novo/Buscar/Salvar/Adicionar/Editar/Excluir, fichas, selo, estados vazios (`EstadoVazio` ganhou `icone`, 32px em círculo), erro, erro global, 404 e login.
- **Escopo extra pedido pelo Líder:** Copiar funciona sem HTTPS (celular em http na rede local). Cadeia em `botao-copiar.tsx`: (1) `navigator.clipboard.writeText` se existir e `isSecureContext`; (2) senão ou se falhar, textarea temporária (`readonly`, fixed, opacity 0, 16px, fora da tela, focus/select/setSelectionRange) + `execCommand("copy")`, removida depois com foco devolvido ao botão; (3) se tudo falhar, seleciona o texto e mostra toast de `mensagemFalhaCopia(ehToque)` (pura, TDD, em `src/lib/mensagem-copia.ts`; `(pointer: coarse)` decide). Observação: no caminho 1 que falha de forma assíncrona (Promise rejeitada), o `execCommand` roda depois de um passo assíncrono e pode perder o gesto do usuário; no caso sem contexto seguro (o alvo do pedido) ele roda síncrono. Estado "Copiado" e varredura funcionam em qualquer caminho bem-sucedido.
- **Arquivos:** `src/lib/edicao-livre.ts` e `.test.ts`, `src/lib/mensagem-copia.ts` e `.test.ts`, `src/components/icone-cadeado.tsx`, `src/components/gerar/confirmar-descarte.tsx`, `cartao-texto.tsx`, `formulario-gerar.tsx`, `combobox-procedimento.tsx`, `ficha.tsx`, `botao-copiar.tsx`, `estado-vazio.tsx`, `barra-navegacao.tsx`, `confirmar-exclusao.tsx`, formulários de procedimentos e profissionais, lista/item de profissionais, `entrar/formulario-entrar.tsx`, `app/error.tsx`, `global-error.tsx`, `not-found.tsx`, páginas Gerar e Procedimentos, `globals.css`.
- **Commits:** ver `git log` (`T013: adiciona estado puro da edição livre`, `T013: copia com plano B sem HTTPS...`, `T013: adiciona cadeado animado e edição livre nas fichas`, `T013: aplica ícones...`) e o commit desta seção.
- **Não verificado:** conferência visual e teste em celular (do usuário).
- **Saída de lint / typecheck / testes / build:**

```
npm run lint       -> eslint . (sem avisos nem erros)
npm run typecheck  -> tsc --noEmit (sem erros)
npm test           -> Test Files 11 passed (11); Tests 80 passed (80)
npm run build      -> compilado; rotas /, /entrar, /procedimentos, /procedimentos/[id], /procedimentos/novo, /profissionais, /_not-found
```

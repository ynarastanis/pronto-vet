# T013 — Edição livre com cadeado e ícones no app

- **Status:** implementando
- **Prioridade:** P1
- **Depende de:** T009, T012
- **Referência:** `docs/design/sistema-visual.md` › "Edição livre do texto gerado (cadeado)" e "Ícones"; spec §2 e §7

## Objetivo

Permitir editar livremente o texto de cada ficha da tela Gerar antes de copiar, com um cadeado animado que abre/fecha a edição; e aplicar ícones (`lucide-react`) em todo o app conforme o mapa do sistema visual.

## Critérios de aceite

- [ ] Cada ficha tem cadeado próprio; comportamento exatamente como em "Edição livre do texto gerado (cadeado)": fechado = gerado; aberto = área de texto editável iniciada com o texto atual; Copiar copia o texto exibido (editado quando aberto); escolhas não sobrescrevem edição aberta; fechar descarta (com confirmação se alterado) e volta ao gerado
- [ ] Nota "Edição livre. Feche o cadeado para voltar ao texto gerado." visível enquanto aberta
- [ ] Edição nunca persistida (nem `localStorage`)
- [ ] `src/components/icone-cadeado.tsx` com haste animada (sobe e gira) e "clique" do corpo; faixa da ficha listrada enquanto aberta; `prefers-reduced-motion` respeitado
- [ ] `aria-pressed` e rótulos acessíveis do cadeado conforme o sistema visual
- [ ] Ícones aplicados conforme a tabela "Ícones" em barra, campos, botões, fichas, selos, estados vazios, erro/404 e login; decorativos com `aria-hidden`, só-ícone com `aria-label`
- [ ] Lógica de estado da edição em função pura testada (TDD) em `src/lib/edicao-livre.ts`
- [ ] Nenhuma dependência nova
- [ ] `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passando

## Notas do Líder

- Função pura sugerida: `type EstadoEdicao = { aberta: boolean; texto: string | null }` com `abrir(estado, textoGerado)`, `editar(estado, texto)`, `precisaConfirmarFechar(estado, textoGerado): boolean` (true se aberta e texto ≠ texto com que abriu… ou ≠ gerado atual — decida e documente), `fechar(estado)`, `textoExibido(estado, textoGerado): string`. Testes cobrindo: copiar usa editado; mudança de escolhas não afeta edição aberta; fechar sem alteração não pede confirmação.
- Confirmação de descarte: reutilize o padrão do `ConfirmarExclusao` (AlertDialog) ou crie um componente equivalente com textos "Descartar edição?" / "O texto volta a ser gerado pelas escolhas." / "Cancelar" / "Descartar".
- O realce de linhas alteradas (`.realce-linha`) só se aplica com o cadeado fechado.
- Carregar o skill `frontend-design:frontend-design`; o sistema visual prevalece.
- Conferência visual é do usuário (AGENTS.md).

---

## Implementação

<!-- preenchido pelo Implementador (Sonnet) -->

- **Resumo:**
- **Arquivos:**
- **Commits:**
- **Saída de lint / typecheck / testes:**

```
```

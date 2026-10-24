import { ErroNaoEncontrado, ErroNomeDuplicado } from "../erros";
import type { Procedimento, ProcedimentoCompleto, ServicoProcedimentos } from "../tipos";

export function criarServicoProcedimentos(lista: Procedimento[]): ServicoProcedimentos {
  function nomeEmUso(nome: string, ignorarId?: string): boolean {
    const alvo = nome.trim();
    return lista.some((p) => p.id !== ignorarId && p.nome === alvo);
  }

  function achar(id: string): Procedimento {
    const p = lista.find((x) => x.id === id);
    if (!p) throw new ErroNaoEncontrado();
    return p;
  }

  return {
    async listar(busca = "") {
      const termo = busca.trim().toLowerCase();
      return [...lista]
        .filter((p) => p.nome.toLowerCase().includes(termo))
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
        .map((p) => ({
          id: p.id,
          nome: p.nome,
          temDescricaoAnestesica: p.descricaoAnestesica !== null,
        }));
    },
    async listarCompletos() {
      const completos = lista.filter(
        (p): p is ProcedimentoCompleto => p.descricaoAnestesica !== null,
      );
      return structuredClone(completos.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
    },
    async obter(id) {
      const p = lista.find((x) => x.id === id);
      return p ? structuredClone(p) : null;
    },
    async criar(dados) {
      if (nomeEmUso(dados.nome)) throw new ErroNomeDuplicado();
      const novo: Procedimento = {
        id: crypto.randomUUID(),
        nome: dados.nome.trim(),
        descricaoTecnica: dados.descricaoTecnica,
        prescricao: dados.prescricao,
        descricaoAnestesica: null,
      };
      lista.push(novo);
      return structuredClone(novo);
    },
    async atualizar(id, dados) {
      const existente = achar(id);
      if (nomeEmUso(dados.nome, id)) throw new ErroNomeDuplicado();
      existente.nome = dados.nome.trim();
      existente.descricaoTecnica = dados.descricaoTecnica;
      existente.prescricao = dados.prescricao;
      return structuredClone(existente);
    },
    async excluir(id) {
      const i = lista.findIndex((p) => p.id === id);
      if (i >= 0) lista.splice(i, 1);
    },
    async salvarDescricaoAnestesica(procedimentoId, dados) {
      achar(procedimentoId).descricaoAnestesica = structuredClone(dados);
    },
  };
}

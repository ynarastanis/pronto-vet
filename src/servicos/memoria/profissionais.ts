import { ErroNaoEncontrado } from "../erros";
import type { Profissional, ServicoProfissionais } from "../tipos";

export function criarServicoProfissionais(lista: Profissional[]): ServicoProfissionais {
  return {
    async listar() {
      return structuredClone([...lista].sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")));
    },
    async criar(dados) {
      const novo: Profissional = { id: crypto.randomUUID(), nome: dados.nome, papel: dados.papel };
      lista.push(novo);
      return structuredClone(novo);
    },
    async atualizar(id, dados) {
      const existente = lista.find((p) => p.id === id);
      if (!existente) throw new ErroNaoEncontrado();
      existente.nome = dados.nome;
      existente.papel = dados.papel;
      return structuredClone(existente);
    },
    async excluir(id) {
      const i = lista.findIndex((p) => p.id === id);
      if (i >= 0) lista.splice(i, 1);
    },
  };
}

import { describe, expect, it } from "vitest";
import { ErroNaoEncontrado, ErroNomeDuplicado } from "../erros";
import type { DadosDescricaoAnestesicaForm } from "@/lib/validacao/descricao-anestesica";
import { criarServicosMemoria, type EstadoMemoria } from "./index";

const anestesia: DadosDescricaoAnestesicaForm = {
  asa: "I",
  mpa: "MPA",
  inducao: null,
  manutencao: null,
  bloqueioLocal: null,
  analgesiaTrans: null,
  antibioticoPre: null,
  posImediato: null,
  observacoes: null,
};

function estado(): EstadoMemoria {
  return {
    profissionais: [],
    procedimentos: [
      {
        id: "p1",
        nome: "OHE ELETIVA FELINA",
        descricaoTecnica: "técnica",
        prescricao: "Prescrito: x",
        descricaoAnestesica: anestesia,
      },
      {
        id: "p2",
        nome: "CASTRAÇÃO",
        descricaoTecnica: "técnica 2",
        prescricao: "Prescrito: y",
        descricaoAnestesica: null,
      },
    ],
  };
}

const formProc = { nome: "NOVO", descricaoTecnica: "t", prescricao: "p" };

describe("serviço de profissionais (memória)", () => {
  it("lista profissionais em ordem alfabética pt-BR", async () => {
    const s = criarServicosMemoria(estado());
    for (const nome of ["Bruno", "andré", "Ágata"]) {
      await s.profissionais.criar({ nome, papel: "CIRURGIAO" });
    }
    const nomes = (await s.profissionais.listar()).map((p) => p.nome);
    expect(nomes).toEqual(["Ágata", "andré", "Bruno"]);
  });

  it("cria, atualiza e exclui profissional", async () => {
    const s = criarServicosMemoria(estado());
    const criado = await s.profissionais.criar({ nome: "Ana", papel: "CIRURGIAO" });
    expect(criado.id).toBeTruthy();
    const atualizado = await s.profissionais.atualizar(criado.id, {
      nome: "Ana B",
      papel: "ANESTESISTA",
    });
    expect(atualizado).toEqual({ id: criado.id, nome: "Ana B", papel: "ANESTESISTA" });
    await s.profissionais.excluir(criado.id);
    expect(await s.profissionais.listar()).toEqual([]);
  });

  it("atualizar profissional inexistente lança ErroNaoEncontrado", async () => {
    const s = criarServicosMemoria(estado());
    await expect(
      s.profissionais.atualizar("nao-existe", { nome: "X", papel: "CIRURGIAO" }),
    ).rejects.toBeInstanceOf(ErroNaoEncontrado);
  });

  it("excluir profissional inexistente não lança", async () => {
    const s = criarServicosMemoria(estado());
    await expect(s.profissionais.excluir("nao-existe")).resolves.toBeUndefined();
  });
});

describe("serviço de procedimentos (memória)", () => {
  it("busca procedimentos sem diferenciar maiúsculas", async () => {
    const s = criarServicosMemoria(estado());
    expect((await s.procedimentos.listar("ohe")).map((p) => p.nome)).toEqual([
      "OHE ELETIVA FELINA",
    ]);
    expect((await s.procedimentos.listar("")).map((p) => p.nome)).toEqual([
      "CASTRAÇÃO",
      "OHE ELETIVA FELINA",
    ]);
  });

  it("resumo indica se há descrição anestésica", async () => {
    const s = criarServicosMemoria(estado());
    const lista = await s.procedimentos.listar();
    expect(lista.find((p) => p.id === "p1")?.temDescricaoAnestesica).toBe(true);
    expect(lista.find((p) => p.id === "p2")?.temDescricaoAnestesica).toBe(false);
  });

  it("rejeita nome duplicado ao criar e ao atualizar", async () => {
    const s = criarServicosMemoria(estado());
    await expect(
      s.procedimentos.criar({ ...formProc, nome: "OHE ELETIVA FELINA" }),
    ).rejects.toBeInstanceOf(ErroNomeDuplicado);
    await expect(
      s.procedimentos.criar({ ...formProc, nome: " OHE ELETIVA FELINA " }),
    ).rejects.toBeInstanceOf(ErroNomeDuplicado);
    await expect(
      s.procedimentos.atualizar("p2", { ...formProc, nome: "OHE ELETIVA FELINA" }),
    ).rejects.toBeInstanceOf(ErroNomeDuplicado);
  });

  it("permite atualizar mantendo o próprio nome", async () => {
    const s = criarServicosMemoria(estado());
    const r = await s.procedimentos.atualizar("p1", {
      ...formProc,
      nome: "OHE ELETIVA FELINA",
      descricaoTecnica: "nova",
    });
    expect(r.descricaoTecnica).toBe("nova");
    expect(r.descricaoAnestesica).toEqual(anestesia);
  });

  it("atualizar procedimento inexistente lança ErroNaoEncontrado", async () => {
    const s = criarServicosMemoria(estado());
    await expect(s.procedimentos.atualizar("x", formProc)).rejects.toBeInstanceOf(
      ErroNaoEncontrado,
    );
  });

  it("obter inexistente retorna null", async () => {
    const s = criarServicosMemoria(estado());
    expect(await s.procedimentos.obter("x")).toBeNull();
  });

  it("listarCompletos retorna só procedimentos com descrição anestésica", async () => {
    const s = criarServicosMemoria(estado());
    expect((await s.procedimentos.listarCompletos()).map((p) => p.id)).toEqual(["p1"]);
  });

  it("salvarDescricaoAnestesica cria e depois atualiza", async () => {
    const s = criarServicosMemoria(estado());
    await s.procedimentos.salvarDescricaoAnestesica("p2", { ...anestesia, asa: "II", mpa: "A" });
    expect((await s.procedimentos.obter("p2"))?.descricaoAnestesica?.asa).toBe("II");
    await s.procedimentos.salvarDescricaoAnestesica("p2", { ...anestesia, asa: "III", mpa: null });
    const d = (await s.procedimentos.obter("p2"))?.descricaoAnestesica;
    expect(d?.asa).toBe("III");
    expect(d?.mpa).toBeNull();
  });

  it("salvarDescricaoAnestesica em procedimento inexistente lança ErroNaoEncontrado", async () => {
    const s = criarServicosMemoria(estado());
    await expect(
      s.procedimentos.salvarDescricaoAnestesica("x", anestesia),
    ).rejects.toBeInstanceOf(ErroNaoEncontrado);
  });

  it("excluir procedimento remove a descrição anestésica", async () => {
    const s = criarServicosMemoria(estado());
    await s.procedimentos.excluir("p1");
    expect(await s.procedimentos.obter("p1")).toBeNull();
    expect(await s.procedimentos.listarCompletos()).toEqual([]);
    await expect(s.procedimentos.excluir("p1")).resolves.toBeUndefined();
  });
});

describe("isolamento (memória)", () => {
  it("retornos são cópias isoladas do estado", async () => {
    const s = criarServicosMemoria(estado());
    const antes = await s.procedimentos.obter("p1");
    antes!.nome = "ALTERADO";
    antes!.descricaoAnestesica!.asa = "V";
    const depois = await s.procedimentos.obter("p1");
    expect(depois?.nome).toBe("OHE ELETIVA FELINA");
    expect(depois?.descricaoAnestesica?.asa).toBe("I");
  });

  it("não compartilha referências com o estado de entrada", async () => {
    const e = estado();
    const s = criarServicosMemoria(e);
    e.procedimentos[0].nome = "MUTADO";
    expect((await s.procedimentos.obter("p1"))?.nome).toBe("OHE ELETIVA FELINA");
  });

  it("instâncias são independentes", async () => {
    const a = criarServicosMemoria(estado());
    const b = criarServicosMemoria(estado());
    await a.profissionais.criar({ nome: "Só em A", papel: "CIRURGIAO" });
    expect(await b.profissionais.listar()).toEqual([]);
  });

  it("dados de demonstração têm um procedimento completo e um incompleto", async () => {
    const s = criarServicosMemoria();
    const lista = await s.procedimentos.listar();
    expect(lista.filter((p) => p.temDescricaoAnestesica)).toHaveLength(1);
    expect(lista.filter((p) => !p.temDescricaoAnestesica)).toHaveLength(1);
    const profs = await s.profissionais.listar();
    expect(profs.map((p) => p.papel).sort()).toEqual(["ANESTESISTA", "CIRURGIAO"]);
    const completos = await s.procedimentos.listarCompletos();
    expect(completos[0].nome).toBe("OVARIOHISTECTOMIA (DEMONSTRAÇÃO)");
  });
});

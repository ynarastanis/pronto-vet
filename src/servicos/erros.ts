export class ErroNomeDuplicado extends Error {
  constructor(message = "Já existe um procedimento com este nome.") {
    super(message);
    this.name = "ErroNomeDuplicado";
  }
}

export class ErroNaoEncontrado extends Error {
  constructor(message = "Registro não encontrado.") {
    super(message);
    this.name = "ErroNaoEncontrado";
  }
}

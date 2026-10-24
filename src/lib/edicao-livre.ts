/**
 * Estado da edição livre de uma ficha (cadeado). Vive só na tela: nunca é persistido.
 *
 * `abertura` guarda o texto gerado no instante em que o cadeado abriu. A confirmação
 * de descarte compara o texto editado com ele (e não com o gerado atual): mudar as
 * escolhas com a ficha aberta não conta como alteração do usuário.
 */
export type EstadoEdicao =
  | { aberta: false }
  | { aberta: true; texto: string; abertura: string };

export const estadoInicial: EstadoEdicao = { aberta: false };

export function abrir(estado: EstadoEdicao, textoGerado: string): EstadoEdicao {
  if (estado.aberta) return estado;
  return { aberta: true, texto: textoGerado, abertura: textoGerado };
}

export function editar(estado: EstadoEdicao, texto: string): EstadoEdicao {
  if (!estado.aberta) return estado;
  return { ...estado, texto };
}

export function precisaConfirmarFechar(estado: EstadoEdicao): boolean {
  return estado.aberta && estado.texto !== estado.abertura;
}

export function fechar(): EstadoEdicao {
  return estadoInicial;
}

export function textoExibido(estado: EstadoEdicao, textoGerado: string): string {
  return estado.aberta ? estado.texto : textoGerado;
}

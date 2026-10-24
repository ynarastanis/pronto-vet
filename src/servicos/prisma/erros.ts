import { ErroNaoEncontrado, ErroNomeDuplicado } from "../erros";

type ErroComCodigo = { code: string; meta?: unknown };

function temCodigo(erro: unknown): erro is ErroComCodigo {
  return (
    typeof erro === "object" &&
    erro !== null &&
    typeof (erro as { code?: unknown }).code === "string"
  );
}

function comoLista(valor: unknown): string[] {
  if (typeof valor === "string") return [valor];
  if (Array.isArray(valor)) return valor.filter((v): v is string => typeof v === "string");
  return [];
}

/** Campos/constraint citados no P2002, tanto no formato clássico quanto no do driver adapter. */
function alvosDoP2002(meta: unknown): string[] {
  if (typeof meta !== "object" || meta === null) return [];
  const m = meta as {
    target?: unknown;
    driverAdapterError?: { cause?: { constraint?: { fields?: unknown; index?: unknown } } };
  };
  const restricao = m.driverAdapterError?.cause?.constraint;
  return [
    ...comoLista(m.target),
    ...comoLista(restricao?.fields),
    ...comoLista(restricao?.index),
  ];
}

/**
 * Traduz erros conhecidos do Prisma para erros de domínio (checagem pela forma do objeto, sem
 * `instanceof` de classes do Prisma). Qualquer outro erro volta intacto.
 * - P2002 (único violado) só vira `ErroNomeDuplicado` se o alvo for o `nome`.
 * - P2025 (registro não encontrado) e P2003 (chave estrangeira, ex.: procedimento excluído no
 *   meio de um upsert) viram `ErroNaoEncontrado`.
 */
export function traduzirErroPrisma(erro: unknown): unknown {
  if (!temCodigo(erro)) return erro;
  if (erro.code === "P2002") {
    return alvosDoP2002(erro.meta).some((alvo) => alvo.includes("nome"))
      ? new ErroNomeDuplicado()
      : erro;
  }
  if (erro.code === "P2025" || erro.code === "P2003") return new ErroNaoEncontrado();
  return erro;
}

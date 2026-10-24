export const NOME_COOKIE = "sessao";
export const DURACAO_SESSAO_MS = 30 * 24 * 60 * 60 * 1000;

const codificador = new TextEncoder();

async function importarChave(segredo: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    codificador.encode(segredo),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function paraBase64Url(bytes: Uint8Array): string {
  let binario = "";
  for (const byte of bytes) binario += String.fromCharCode(byte);
  return btoa(binario).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function deBase64Url(texto: string): Uint8Array<ArrayBuffer> | null {
  if (!/^[A-Za-z0-9_-]+$/.test(texto)) return null;
  try {
    const base64 = texto.replace(/-/g, "+").replace(/_/g, "/");
    const preenchido = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binario = atob(preenchido);
    const bytes = new Uint8Array(binario.length);
    for (let i = 0; i < binario.length; i++) bytes[i] = binario.charCodeAt(i);
    // Recusa base64url não canônico (bits finais ignorados pelo atob).
    return paraBase64Url(bytes) === texto ? bytes : null;
  } catch {
    return null;
  }
}

/** Token no formato "<expiraEm>.<base64url(HMAC-SHA256(segredo, expiraEm))>". */
export async function assinarToken(
  segredo: string | undefined,
  expiraEm: number,
): Promise<string> {
  if (!segredo?.trim()) throw new Error("APP_SECRET não configurado");
  if (!Number.isSafeInteger(expiraEm) || expiraEm <= 0) throw new Error("expiraEm inválido");
  const chave = await importarChave(segredo);
  const assinatura = await crypto.subtle.sign(
    "HMAC",
    chave,
    codificador.encode(String(expiraEm)),
  );
  return `${expiraEm}.${paraBase64Url(new Uint8Array(assinatura))}`;
}

/** Nunca lança: qualquer falha ou entrada inválida resulta em false. */
export async function verificarToken(
  token: string | undefined,
  segredo: string | undefined,
  agora: number,
): Promise<boolean> {
  try {
    if (!token || !segredo?.trim()) return false;
    const partes = token.split(".");
    if (partes.length !== 2) return false;
    const [textoExpiracao, textoAssinatura] = partes;
    if (!/^\d+$/.test(textoExpiracao)) return false;
    const expiraEm = Number(textoExpiracao);
    if (!Number.isSafeInteger(expiraEm) || agora >= expiraEm) return false;
    const assinatura = deBase64Url(textoAssinatura);
    if (!assinatura) return false;
    const chave = await importarChave(segredo);
    return await crypto.subtle.verify(
      "HMAC",
      chave,
      assinatura,
      codificador.encode(textoExpiracao),
    );
  } catch {
    return false;
  }
}

/** Compara o SHA-256 das duas senhas em tempo constante. Esperada vazia, só com espaços ou ausente: false. */
export async function senhaConfere(
  digitada: string,
  esperada: string | undefined,
): Promise<boolean> {
  if (!esperada?.trim()) return false;
  const [a, b] = await Promise.all([
    crypto.subtle.digest("SHA-256", codificador.encode(digitada)),
    crypto.subtle.digest("SHA-256", codificador.encode(esperada)),
  ]);
  const va = new Uint8Array(a);
  const vb = new Uint8Array(b);
  let diferenca = 0;
  for (let i = 0; i < va.length; i++) diferenca |= va[i] ^ vb[i];
  return diferenca === 0;
}

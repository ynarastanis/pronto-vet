import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { NOME_COOKIE, verificarToken } from "@/lib/auth/token";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(NOME_COOKIE)?.value;
  const valido = await verificarToken(token, process.env.APP_SECRET, Date.now());
  const emEntrar = request.nextUrl.pathname === "/entrar";

  if (!valido && !emEntrar) {
    return NextResponse.redirect(new URL("/entrar", request.url));
  }
  if (valido && emEntrar) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

// "[.]" em vez de "\." porque o path-to-regexp do Next descarta a barra invertida.
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon[.]ico|.*[.].*).*)"],
};

import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { exigirSessao } from "@/lib/auth/sessao";

// Página provisória: será substituída pela tela Gerar (T009).
export default async function Home() {
  await exigirSessao();
  return <CabecalhoPagina titulo="Gerar" />;
}

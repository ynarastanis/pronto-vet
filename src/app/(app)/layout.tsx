import { BarraNavegacao } from "@/components/barra-navegacao";
import { exigirSessao } from "@/lib/auth/sessao";

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  await exigirSessao();
  return (
    <>
      <BarraNavegacao />
      {children}
    </>
  );
}

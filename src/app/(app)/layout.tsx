import { BarraNavegacao } from "@/components/barra-navegacao";
import { rotuloAmbiente } from "@/lib/ambiente";
import { exigirSessao } from "@/lib/auth/sessao";

export default async function LayoutApp({ children }: { children: React.ReactNode }) {
  await exigirSessao();
  return (
    <>
      <BarraNavegacao ambiente={rotuloAmbiente(process.env.VERCEL_ENV)} />
      {children}
    </>
  );
}

import Link from "next/link";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { EstadoVazio } from "@/components/estado-vazio";
import { FormularioGerar } from "@/components/gerar/formulario-gerar";
import { buttonVariants } from "@/components/ui/button";
import { exigirSessao } from "@/lib/auth/sessao";
import { servicos } from "@/servicos";

export default async function Home() {
  await exigirSessao();
  const [procedimentos, profissionais] = await Promise.all([
    servicos().procedimentos.listarCompletos(),
    servicos().profissionais.listar(),
  ]);

  return (
    <>
      <CabecalhoPagina
        titulo="Gerar"
        descricao="Escolha o procedimento e os profissionais para montar os dois textos do prontuário."
      />
      {procedimentos.length === 0 ? (
        <EstadoVazio
          titulo="Nenhum procedimento completo."
          descricao="Cadastre um procedimento com descrição anestésica."
          acao={
            <Link href="/procedimentos" className={buttonVariants()}>
              Ir para procedimentos
            </Link>
          }
        />
      ) : (
        <FormularioGerar
          procedimentos={procedimentos}
          cirurgioes={profissionais.filter((p) => p.papel === "CIRURGIAO")}
          anestesistas={profissionais.filter((p) => p.papel === "ANESTESISTA")}
        />
      )}
    </>
  );
}

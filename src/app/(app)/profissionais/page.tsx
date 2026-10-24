import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { FormularioProfissional } from "@/components/profissionais/formulario-profissional";
import { ListaProfissionais } from "@/components/profissionais/lista-profissionais";
import { exigirSessao } from "@/lib/auth/sessao";
import { servicos } from "@/servicos";

export default async function PaginaProfissionais() {
  await exigirSessao();
  const profissionais = await servicos().profissionais.listar();
  return (
    <>
      <CabecalhoPagina titulo="Profissionais" />
      <FormularioProfissional />
      <ListaProfissionais profissionais={profissionais} />
    </>
  );
}

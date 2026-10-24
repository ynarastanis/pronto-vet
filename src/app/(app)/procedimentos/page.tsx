import { CircleAlert, FileText, Plus, Search } from "lucide-react";
import Link from "next/link";
import { CabecalhoPagina } from "@/components/cabecalho-pagina";
import { EstadoVazio } from "@/components/estado-vazio";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { exigirSessao } from "@/lib/auth/sessao";
import { servicos } from "@/servicos";

export default async function PaginaProcedimentos({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  await exigirSessao();
  const { q } = await searchParams;
  const busca = (Array.isArray(q) ? q[0] : q)?.trim() ?? "";
  const procedimentos = await servicos().procedimentos.listar(busca || undefined);

  return (
    <div className="entrar-fade">
      <CabecalhoPagina
        titulo="Procedimentos"
        acao={
          <Link href="/procedimentos/novo" className={buttonVariants()}>
            <Plus aria-hidden />
            Novo procedimento
          </Link>
        }
      />
      <form role="search" className="mb-4 flex max-w-md gap-2">
        <Input
          name="q"
          type="search"
          defaultValue={busca}
          placeholder="Buscar por nome"
          aria-label="Buscar procedimento por nome"
          autoComplete="off"
        />
        <Button type="submit" variant="outline">
          <Search aria-hidden />
          Buscar
        </Button>
      </form>
      {procedimentos.length === 0 ? (
        busca ? (
          <EstadoVazio
            icone={<Search />}
            titulo="Nenhum procedimento encontrado."
            descricao="Confira a grafia ou busque por outra parte do nome."
            acao={
              <Link href="/procedimentos" className={buttonVariants({ variant: "outline" })}>
                Limpar busca
              </Link>
            }
          />
        ) : (
          <EstadoVazio
            icone={<FileText />}
            titulo="Nenhum procedimento cadastrado."
            descricao="Cadastre o primeiro procedimento para gerar as descrições do prontuário."
            acao={
              <Link href="/procedimentos/novo" className={buttonVariants()}>
                <Plus aria-hidden />
                Novo procedimento
              </Link>
            }
          />
        )
      ) : (
        <ul className="divide-y overflow-hidden rounded-xl border bg-card">
          {procedimentos.map((p) => (
            <li key={p.id}>
              <Link
                href={`/procedimentos/${p.id}`}
                className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-3 transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"
              >
                <span className="min-w-0 font-medium break-words">{p.nome}</span>
                {!p.temDescricaoAnestesica && (
                  <Badge variant="outline">
                    <CircleAlert aria-hidden />
                    sem descrição anestésica
                  </Badge>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

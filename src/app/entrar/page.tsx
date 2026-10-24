import { FormularioEntrar } from "@/components/entrar/formulario-entrar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PaginaEntrar() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Pronto Vet</CardTitle>
        </CardHeader>
        <CardContent>
          <FormularioEntrar />
        </CardContent>
      </Card>
    </main>
  );
}

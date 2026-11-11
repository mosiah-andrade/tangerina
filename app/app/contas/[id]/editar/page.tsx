import { EditarContaBancaria } from "@/components/editar-conta-bancaria";

export default async function EditarContaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EditarContaBancaria contaId={id} />;
}

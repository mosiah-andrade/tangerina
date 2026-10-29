import Link from "next/link";
import { SeedLoading } from "@/components/seed-loading";

export default function LoadingPreviewPage() {
  return (
    <main className="loading-preview">
      <SeedLoading fullScreen label="Prévia da animação de carregamento" />
      <Link href="/" className="loading-preview__back">Voltar à tela inicial</Link>
    </main>
  );
}

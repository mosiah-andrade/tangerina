import { Suspense } from "react";
import { CentralTransferencias } from "@/components/central-transferencias";
import { SeedLoading } from "@/components/seed-loading";

export default function TransferenciasPage() {
  return (
    <Suspense fallback={<SeedLoading fullScreen label="Abrindo transferências" />}>
      <CentralTransferencias />
    </Suspense>
  );
}

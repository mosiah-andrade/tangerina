import Link from "next/link";
import Image from "next/image";

type AppBrandProps = {
  linked?: boolean;
  compact?: boolean;
};

export function AppBrand({ linked = true, compact = false }: AppBrandProps) {
  const content = (
    <>
      <Image
        src="/favicon.svg"
        alt=""
        width={compact ? 36 : 44}
        height={compact ? 36 : 44}
        className="dashboard-logo"
        unoptimized
      />
      {!compact && <span className="brand-name">Tangerina</span>}
    </>
  );

  if (!linked) {
    return <div className="brand-lockup" aria-label="Tangerina Financeiro">{content}</div>;
  }

  return (
    <Link href="/dashboard" className="brand-lockup" aria-label="Tangerina, início">
      {content}
    </Link>
  );
}

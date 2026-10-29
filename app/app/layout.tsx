import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tangerina Financeiro",
  description: "Organize suas finanças com clareza e tranquilidade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

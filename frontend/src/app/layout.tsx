import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teste para Vaga de Full Stack - Daniel Pellicano",
  description: "Este é um teste desenvolvido pelo Daniel Pellicano, para vaga de DEV Full stack da Newway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}

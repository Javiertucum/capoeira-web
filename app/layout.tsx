import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: 'Agenda Capoeiragem',
  description: 'Encuentra núcleos, grupos y educadores de capoeira en todo el mundo',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="h-full">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

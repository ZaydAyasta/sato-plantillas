import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sato Plantillas — Discord Server Banners",
  description: "Portfolio y comisiones de banners personalizados para comunidades de Discord.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}

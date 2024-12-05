import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dashboard de Departamentos",
  description: "Sistema de gestión de departamentos",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          {children}
        </div>
      </body>
    </html>
  );
}
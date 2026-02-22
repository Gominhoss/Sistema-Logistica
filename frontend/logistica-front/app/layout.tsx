import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Logística Express",
  description: "Sistema de Rastreamento e Gestão de Pacotes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 min-h-screen`}
      >
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
          <nav className="max-w-4xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-xl font-bold text-blue-900 flex items-center gap-2">
              <span className="bg-blue-600 text-white p-1 rounded">📦</span>
              Logística Express
            </Link>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">Rastrear</Link>
              <Link href="/create" className="text-gray-600 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">Cadastrar</Link>
              <Link href="/packages" className="text-gray-600 hover:text-blue-600 font-medium transition-colors border-b-2 border-transparent hover:border-blue-600 pb-1">Todos Pacotes</Link>
            </div>
          </nav>
        </header>
        <div className="py-8">
          {children}
        </div>
      </body>
    </html>
  );
}

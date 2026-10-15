import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Level Up IT — treinador pessoal de carreira",
  description: "Do Suporte N1 a Cloud/AWS: trilha, diagnóstico, labs, projetos e evolução real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <StoreProvider>
          <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
            <Sidebar />
            <main className="p-4 pb-24 lg:p-8 lg:pb-8 max-w-5xl w-full mx-auto">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";

export const metadata: Metadata = {
  title: "Level Up IT — treinador pessoal de carreira",
  description: "Do Suporte N1 a Cloud/AWS: trilha, diagnóstico, labs, projetos e evolução real.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=Manrope:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <StoreProvider>
          <div className="min-h-screen lg:grid lg:grid-cols-[258px_1fr]">
            <Sidebar />
            <div className="min-w-0">
              <Topbar />
              <main className="w-full max-w-[1320px] mx-auto px-4 sm:px-8 py-8 pb-28 lg:pb-16">{children}</main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}

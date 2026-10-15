"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  ["Início", "/"],
  ["Trilha", "/trilha"],
  ["Diagnóstico", "/diagnostico"],
  ["Revisão", "/revisao"],
  ["Incidentes", "/incidentes"],
  ["Labs", "/laboratorios"],
  ["Projetos", "/projetos"],
  ["Plano", "/plano"],
  ["Evolução", "/evolucao"],
  ["Entrevista", "/entrevista"],
  ["Diário", "/diario"],
  ["Tutor", "/tutor"],
  ["Perfil", "/perfil"],
];

export default function Sidebar() {
  const path = usePathname();
  return (
    <>
      <aside className="hidden lg:flex flex-col gap-1 p-4 border-r border-white/10 min-h-screen sticky top-0">
        <Link href="/" className="px-2 py-4">
          <p className="font-bold text-lg">▲ Level Up IT</p>
          <p className="text-xs text-muted">N1 → N2 → Infra → AWS</p>
        </Link>
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} className={`navlink ${path === href ? "navlink-active" : ""}`}>{label}</Link>
        ))}
        <p className="text-[11px] text-muted px-2 mt-6">Local-first. Seus dados ficam neste navegador. Backup em Perfil.</p>
      </aside>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-panel/95 backdrop-blur border-t border-white/10 flex overflow-x-auto p-2 gap-1 z-50" aria-label="Navegação">
        {NAV.map(([label, href]) => (
          <Link key={href} href={href} className={`navlink whitespace-nowrap ${path === href ? "navlink-active" : ""}`}>{label}</Link>
        ))}
      </nav>
    </>
  );
}

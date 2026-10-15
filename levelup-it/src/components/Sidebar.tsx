"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const GROUPS: { caption: string; items: [string, string][] }[] = [
  { caption: "Aprender", items: [["Início", "/"], ["Trilha", "/trilha"], ["Diagnóstico", "/diagnostico"], ["Revisão", "/revisao"]] },
  { caption: "Praticar", items: [["Incidentes", "/incidentes"], ["Labs", "/laboratorios"], ["Terminal", "/terminal"], ["Ferramentas", "/ferramentas"], ["Projetos", "/projetos"], ["Plano", "/plano"]] },
  { caption: "Carreira", items: [["Excelência", "/excelencia"], ["Evolução", "/evolucao"], ["Entrevista", "/entrevista"], ["Diário", "/diario"], ["Tutor", "/tutor"]] },
  { caption: "Conta", items: [["Perfil", "/perfil"]] },
];

const ALL = GROUPS.flatMap((g) => g.items);

export default function Sidebar() {
  const path = usePathname();
  let name = "…", role = "";
  try {
    const { store, ready } = useStore();
    if (ready) { name = store.profile.name || "Estudante"; role = store.profile.role; }
  } catch { /* fora do provider em prerender */ }

  return (
    <>
      <aside className="hidden lg:flex flex-col w-[258px] min-h-screen sticky top-0 px-4 pt-6 pb-4 bg-side" aria-label="Navegação principal">
        <Link href="/" className="flex items-center gap-3 px-2 pb-6">
          <span className="brand-symbol">L<span>▲</span></span>
          <span>
            <strong className="block font-display font-extrabold text-[13px] tracking-[0.07em] text-[#f5fbfb]">LEVEL UP IT</strong>
            <small className="block text-xs text-[#9db3b7]">N1 → N2 → Infra → AWS</small>
          </span>
        </Link>
        <p className="flex items-center gap-2 mx-2 mb-4 text-[#94aaae] font-mono text-[10px] font-bold tracking-[0.11em]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#62c59a]" /> WORKSPACE LOCAL
        </p>
        <nav className="flex-1 overflow-y-auto">
          {GROUPS.map((g) => (
            <div key={g.caption}>
              <p className="nav-caption">{g.caption}</p>
              {g.items.map(([label, href]) => (
                <Link key={href} href={href} className={`navlink ${path === href ? "navlink-active" : ""}`}>{label}</Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="border-t border-white/10 pt-3 mt-3">
          <div className="flex items-center gap-2.5 px-2">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-[#d6ede7] text-[#164a46] font-extrabold border border-[#b5d7d1]">
              {(name[0] || "?").toUpperCase()}
            </span>
            <span className="min-w-0">
              <strong className="block text-[13px] text-[#edf5f4] truncate">{name}</strong>
              <small className="block text-[11px] text-[#9db3b7] truncate">{role}</small>
            </span>
          </div>
          <p className="text-[11px] text-[#839a9f] px-2 mt-3">Dados neste navegador. Backup em Perfil.</p>
        </div>
      </aside>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-side/95 backdrop-blur border-t border-white/10 flex overflow-x-auto p-2 gap-1 z-50" aria-label="Navegação">
        {ALL.map(([label, href]) => (
          <Link key={href} href={href} className={`navlink whitespace-nowrap !py-2 ${path === href ? "navlink-active" : ""}`}>{label}</Link>
        ))}
      </nav>
    </>
  );
}

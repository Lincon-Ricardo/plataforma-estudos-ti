"use client";
import { usePathname } from "next/navigation";

const TITLES: [RegExp, string][] = [
  [/^\/$/, "Dashboard"],
  [/^\/trilha(\/|$)/, "Trilha de aprendizagem"],
  [/^\/diagnostico/, "Diagnóstico inicial"],
  [/^\/revisao/, "Revisão espaçada"],
  [/^\/incidentes/, "Simulador de incidentes"],
  [/^\/laboratorios/, "Laboratórios práticos"],
  [/^\/projetos/, "Projetos de portfólio"],
  [/^\/plano/, "Plano semanal"],
  [/^\/excelencia/, "Modo excelência"],
  [/^\/evolucao/, "Evolução"],
  [/^\/entrevista/, "Simulação de entrevista"],
  [/^\/diario/, "Diário de experiências"],
  [/^\/tutor/, "Tutor"],
  [/^\/perfil/, "Perfil"],
];

export default function Topbar() {
  const path = usePathname();
  const title = TITLES.find(([re]) => re.test(path))?.[1] ?? "Level Up IT";
  return (
    <header className="sticky top-0 z-10 h-16 flex items-center justify-between px-4 sm:px-8 border-b border-line bg-panel/95 backdrop-blur">
      <p className="font-mono text-xs text-muted">
        LEVEL UP IT <span className="mx-2 text-line">/</span> <strong className="text-bodytext">{title}</strong>
      </p>
      <p className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-muted">
        <span className="w-1.5 h-1.5 rounded-full bg-[#62c59a]" /> LOCAL-FIRST
      </p>
    </header>
  );
}

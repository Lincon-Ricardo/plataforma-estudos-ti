"use client";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { MODULES, LESSONS, PLANNED_LESSONS } from "@/lib/seed-tracks";
import { MODULE_MEDIA } from "@/lib/seed-media";
import { moduleProgress, useStore } from "@/lib/store";
import { MODULE_HUE } from "@/components/diagrams";

export default function Trilha() {
  const { store, ready } = useStore();
  if (!ready) return <p className="text-muted">Carregando…</p>;
  return (
    <div className="space-y-5">
      <header><p className="label">Trilha de aprendizagem</p>
        <h1 className="text-2xl font-bold">Módulos em ordem de pré-requisito</h1>
        <p className="text-sm text-muted">Conclusão exige quiz ≥80% — clicar em “concluir” sem demonstrar não conta.</p></header>
      {MODULES.map((m) => {
        const p = moduleProgress(m.id, store.completedLessons);
        const lessons = LESSONS.filter((l) => l.moduleId === m.id);
        const planned = PLANNED_LESSONS.filter((x) => x.moduleId === m.id);
        return (
          <section key={m.id} className="card" style={{ borderTop: `3px solid ${MODULE_HUE[m.id] ?? "#61c3b6"}` }}>
            <div className="flex justify-between items-baseline gap-3">
              <div><h2 className="font-bold">{m.title}</h2>
                <p className="text-sm text-muted">{m.description}</p>
                <p className="text-xs mt-1" style={{ color: MODULE_HUE[m.id] ?? "#61c3b6" }}>Base: {MODULE_MEDIA[m.id]?.framework}</p>
                {!!m.prereqs.length && <p className="text-xs text-muted">Pré-requisitos: {m.prereqs.join(", ")}</p>}</div>
              <span className="text-sm whitespace-nowrap">{p.pct}%</span>
            </div>
            <div className="my-2"><ProgressBar pct={p.pct} /></div>
            <ul className="mt-2 space-y-1">
              {lessons.map((l) => (
                <li key={l.id}>
                  <Link href={`/trilha/${l.id}`} className="navlink justify-between">
                    <span>{store.completedLessons[l.id] ? "✓ " : ""}{l.title}</span>
                    <span className="text-xs text-muted">estudar →</span>
                  </Link>
                </li>
              ))}
            </ul>
            {planned.map((x) => (
              <p key={x.title} className="text-xs text-muted mt-1 border border-dashed border-white/15 rounded-xl px-3 py-2">Em breve (não implementada): {x.title}</p>
            ))}
          </section>
        );
      })}
    </div>
  );
}

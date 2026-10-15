"use client";
import Link from "next/link";
import ProgressBar from "@/components/ProgressBar";
import { MODULES, LESSONS, PLANNED_LESSONS } from "@/lib/seed-tracks";
import { MODULE_MEDIA } from "@/lib/seed-media";
import { moduleProgress, useStore } from "@/lib/store";
import { MODULE_HUE } from "@/components/diagrams";

const STAGES = [
  { label: "N1", modules: ["m1-suporte", "m2-redes"] },
  { label: "N2", modules: ["m3-identidade", "m4-powershell"] },
  { label: "Infra", modules: ["m5-linux", "m6-seguranca", "m8-sql-git"] },
  { label: "Cloud", modules: ["m7-aws", "m9-carreira"] },
];

export default function Trilha() {
  const { store, ready } = useStore();
  if (!ready) return <p className="text-muted">Carregando…</p>;
  return (
    <div className="space-y-5">
      <header><p className="label">Trilha de aprendizagem</p>
        <h1 className="text-2xl font-bold">Sua jornada N1 → Cloud</h1>
        <p className="text-sm text-muted">Conclusão exige quiz ≥80% — clicar em “concluir” sem demonstrar não conta.</p></header>

      <section className="card overflow-x-auto">
        <p className="label">Mapa da jornada</p>
        <div className="flex items-stretch gap-0 min-w-[720px]">
          {STAGES.map((st, si) => (
            <div key={st.label} className="flex-1">
              <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-gold mb-2">{st.label}</p>
              <div className="space-y-2">
                {st.modules.map((mid) => {
                  const m = MODULES.find((x) => x.id === mid)!;
                  const p = moduleProgress(mid, store.completedLessons);
                  const state = p.pct === 100 ? "done" : p.pct > 0 ? "doing" : "todo";
                  return (
                    <Link key={mid} href="#modulo" onClick={(e) => { e.preventDefault(); document.getElementById(`mod-${mid}`)?.scrollIntoView({ behavior: "smooth" }); }}
                      className="block rounded border border-line bg-black/25 px-2.5 py-2 text-left hover:border-accent transition"
                      style={{ borderLeft: `3px solid ${MODULE_HUE[mid]}` }}>
                      <p className="text-[13px] font-bold leading-tight">{state === "done" ? "✓ " : state === "doing" ? "◐ " : "○ "}{m.title.replace(/^M\d+ · /, "")}</p>
                      <p className="font-mono text-[11px] text-muted">{p.done}/{p.total} · {p.pct}%</p>
                    </Link>
                  );
                })}
              </div>
              {si < STAGES.length - 1 && <span className="sr-only">→</span>}
            </div>
          ))}
        </div>
      </section>
      {MODULES.map((m) => {
        const p = moduleProgress(m.id, store.completedLessons);
        const lessons = LESSONS.filter((l) => l.moduleId === m.id);
        const planned = PLANNED_LESSONS.filter((x) => x.moduleId === m.id);
        return (
          <section key={m.id} id={`mod-${m.id}`} className="card scroll-mt-20" style={{ borderTop: `3px solid ${MODULE_HUE[m.id] ?? "#61c3b6"}` }}>
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

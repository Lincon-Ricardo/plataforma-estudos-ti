"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { SKILLS, evidenceDone, readiness, skillDone, type SkillLevel } from "@/lib/seed-excellence";
import { useStore } from "@/lib/store";

const ORDER: SkillLevel[] = ["N1", "N2", "Infra", "Cloud"];
const LEVEL_DESC: Record<SkillLevel, string> = {
  N1: "Base sólida — sem ela, nada acima sustenta",
  N2: "Autonomia técnica com evidência",
  Infra: "Sistemas, identidade e dados",
  Cloud: "AWS com custo sob controle",
};

export default function Excelencia() {
  const { store, ready } = useStore();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try { setRatings(JSON.parse(localStorage.getItem("levelup-it-interview") ?? "{}")); } catch {}
  }, []);

  if (!ready) return <p className="text-muted">Carregando…</p>;
  const r = readiness(store, ratings);

  const copy = async () => {
    const txt = `Level Up IT — prontidão N2: ${r.done}/${r.total} (${r.pct}%)\nFaltando: ${r.missing.map((s) => s.name).join("; ") || "nada — selo N2 conquistado"}`;
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="rounded border border-line bg-panel p-6" style={{ borderTop: "4px solid #e7ac58" }}>
        <p className="label">Modo excelência — padrão de melhor TI</p>
        <h1 className="text-2xl font-extrabold">Prontidão N2: {r.done}/{r.total} ({r.pct}%)</h1>
        <div className="h-2 bg-line/60 rounded-sm overflow-hidden my-3">
          <div className="h-full bg-[#e7ac58] transition-all" style={{ width: `${r.pct}%` }} />
        </div>
        {r.pct === 100
          ? <p className="text-sm font-bold text-accent">★ Selo N2 conquistado com evidência. Próximo: zerar Infra e Cloud.</p>
          : <p className="text-sm text-muted">Faltando: {r.missing.map((s) => s.name).join(" · ")}</p>}
        <button className="btn-ghost mt-3" onClick={copy}>{copied ? "Copiado!" : "Copiar relatório de prontidão"}</button>
      </div>

      {ORDER.map((lv) => (
        <section key={lv} className="card">
          <p className="label">{lv} — {LEVEL_DESC[lv]}</p>
          <div className="space-y-2 mt-1">
            {SKILLS.filter((s) => s.level === lv).map((s) => {
              const ok = skillDone(s, store, ratings);
              return (
                <div key={s.id} className="border-b border-line/60 pb-2">
                  <p className="text-sm font-bold">{ok ? "✓ " : "○ "}{s.name}</p>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {s.evidence.map((e) => {
                      const d = evidenceDone(e, store, ratings);
                      return (
                        <Link key={e.kind + e.ref} href={e.href}
                          className="text-xs rounded-full border px-2.5 py-1 transition"
                          style={d ? { borderColor: "#61c3b6", color: "#61c3b6" } : { borderColor: "#30434b", color: "#a0b2b7" }}>
                          {d ? "✓ " : ""}{e.label} →
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

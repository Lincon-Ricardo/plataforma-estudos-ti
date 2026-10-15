"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { AREAS, DIAGNOSTIC } from "@/lib/seed-diagnostic";
import { useStore } from "@/lib/store";

export default function Diagnostico() {
  const { store, recordAttempt, markDiagnosticDone } = useStore();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const areas = useMemo(() => {
    const out: Record<string, { total: number; correct: number; pct: number }> = {};
    for (const a of AREAS) {
      const qs = DIAGNOSTIC.filter((q) => q.area === a);
      const correct = qs.filter((q) => answers[q.id] === q.answer).length;
      out[a] = { total: qs.length, correct, pct: Math.round((correct / qs.length) * 100) };
    }
    return out;
  }, [answers]);

  const finish = () => {
    if (Object.keys(answers).length < DIAGNOSTIC.length) return;
    for (const a of AREAS) {
      const qs = DIAGNOSTIC.filter((q) => q.area === a);
      const correct = qs.filter((q) => answers[q.id] === q.answer).length;
      recordAttempt({ lessonId: `diagnostico:${a}`, score: Math.round((correct / qs.length) * 100), total: qs.length, correct, kind: "diagnostic" });
    }
    try {
      markDiagnosticDone();
    } catch {}
    setDone(true);
  };

  const gaps = AREAS.filter((a) => areas[a].pct < 70);
  const strong = AREAS.filter((a) => areas[a].pct >= 70);

  return (
    <div className="space-y-5">
      <header><p className="label">Diagnóstico inicial (11 áreas · 22 questões)</p>
        <h1 className="text-2xl font-bold">Descubra seu nível real</h1>
        <p className="text-sm text-muted">Nenhuma área é classificada por 1 resposta: cada área tem 2 questões (teoria + prática).</p></header>

      {DIAGNOSTIC.map((q, i) => (
        <section key={q.id} className="card">
          <p className="label">{q.area} · questão {i + 1}</p>
          <p className="font-semibold mb-1">{q.prompt}</p>
          {q.options.map((op, oi) => (
            <label key={oi} className="quiz-opt text-sm">
              <input type="radio" name={q.id} className="mr-2 accent-emerald-400"
                checked={answers[q.id] === oi} onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))} />{op}
            </label>
          ))}
          {done && <p className="text-sm text-muted mt-1">Gabarito: <strong>{q.options[q.answer]}</strong>. {q.explanation}</p>}
        </section>
      ))}

      {!done ? (
        <button className="btn-primary" disabled={Object.keys(answers).length < DIAGNOSTIC.length} onClick={finish}>
          {Object.keys(answers).length < DIAGNOSTIC.length ? `Responder tudo para gerar diagnóstico (${Object.keys(answers).length}/${DIAGNOSTIC.length})` : "Gerar meu diagnóstico"}
        </button>
      ) : (
        <section className="card border-emerald-400/30 space-y-2">
          <h2 className="font-bold text-lg">Seu diagnóstico</h2>
          <p className="text-sm"><strong>Demonstrado (≥70%):</strong> {strong.length ? strong.map((a) => `${a} ${areas[a].pct}%`).join(" · ") : "nenhuma área ainda — comece pela trilha M1/M2."}</p>
          <p className="text-sm"><strong>Lacunas (&lt;70% — prioritárias):</strong> {gaps.length ? gaps.map((a) => `${a} ${areas[a].pct}%`).join(" · ") : "nenhuma. Avance para labs e projetos."}</p>
          <p className="text-sm"><strong>Sequência recomendada:</strong> M1 suporte → M2 redes → M4 PowerShell → M3 identidade → M6 segurança → M5 Linux → M7 AWS → M8 SQL/Git → M9 carreira.</p>
          <p className="text-sm"><strong>30/60/90 dias:</strong> ver metas geradas no <Link href="/" className="underline">dashboard</Link>.</p>
          <p className="text-sm text-muted">Refazer depois compara tentativas em Evolução. Último resultado: {store.diagnosticDoneAt ? "registrado" : "esta sessão"}.</p>
          <button className="btn-ghost" onClick={() => setDone(false)}>Refazer diagnóstico</button>
        </section>
      )}
    </div>
  );
}

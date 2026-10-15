"use client";
import { useEffect, useState } from "react";
import { INTERVIEW } from "@/lib/seed-interview";

const KEY = "levelup-it-interview";

export default function Entrevista() {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<string | null>(null);

  useEffect(() => {
    try { setRatings(JSON.parse(localStorage.getItem(KEY) ?? "{}")); } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(ratings)); } catch {}
  }, [ratings]);

  const done = Object.keys(ratings).length;
  const avg = done ? (Object.values(ratings).reduce((a, b) => a + b, 0) / done).toFixed(1) : "—";

  return (
    <div className="space-y-5">
      <header><p className="label">Simulação de entrevista N2 (M9)</p>
        <h1 className="text-2xl font-bold">Responda em voz alta, depois compare</h1>
        <p className="text-sm text-muted">Respondidas: {done}/{INTERVIEW.length} · média autoavaliada: {avg}/5. Seja honesto na nota: 1 = travei, 5 = responderia contratado.</p></header>
      {INTERVIEW.map((q, i) => (
        <section key={q.id} className="card">
          <p className="label">{q.area} · pergunta {i + 1}</p>
          <p className="font-semibold">{q.question}</p>
          <button className="underline text-emerald-300 text-sm mt-1" onClick={() => setOpen((o) => (o === q.id ? null : q.id))}>
            {open === q.id ? "Ocultar pontos esperados" : "Respondi — ver pontos esperados"}
          </button>
          {open === q.id && (
            <div className="mt-2 text-sm">
              <ul className="list-disc ml-5">{q.expected.map((e) => <li key={e}>{e}</li>)}</ul>
              <p className="text-muted mt-1">Dica: {q.tip}</p>
            </div>
          )}
          <div className="flex gap-1 mt-2" role="group" aria-label={`Nota para ${q.id}`}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRatings((r) => ({ ...r, [q.id]: n }))}
                className={`w-9 h-9 rounded-xl border text-sm ${ratings[q.id] === n ? "bg-emerald-500/25 border-emerald-400" : "border-white/15"}`}
                aria-pressed={ratings[q.id] === n}>{n}</button>
            ))}
          </div>
        </section>
      ))}
      {done > 0 && (
        <button className="btn-ghost" onClick={() => { setRatings({}); try { localStorage.removeItem(KEY); } catch {} }}>
          Zerar autoavaliação
        </button>
      )}
    </div>
  );
}

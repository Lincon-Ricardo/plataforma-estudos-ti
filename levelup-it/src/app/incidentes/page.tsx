"use client";
import { useState } from "react";
import { INCIDENTS } from "@/lib/seed-practice";
import { useStore } from "@/lib/store";

export default function Incidentes() {
  const { store, markIncident } = useStore();
  const [open, setOpen] = useState<string | null>(INCIDENTS[0].id);
  const [hyp, setHyp] = useState<Record<string, string>>({});
  const [diag, setDiag] = useState<Record<string, string>>({});

  return (
    <div className="space-y-5">
      <header><p className="label">Simulador de incidentes (Etapa 5)</p>
        <h1 className="text-2xl font-bold">Investigue antes de ver a solução</h1>
        <p className="text-sm text-muted">Tudo aqui é <strong>simulação</strong>: nenhum comando é executado no seu computador. Escolha a hipótese, leia a evidência, escreva o diagnóstico e só então compare.</p></header>
      {INCIDENTS.map((inc) => {
        const done = store.incidentDone[inc.id];
        const chosen = hyp[inc.id];
        return (
          <section key={inc.id} className="card">
            <button className="w-full text-left" onClick={() => setOpen((o) => (o === inc.id ? null : inc.id))}>
              <p className="font-bold">{done ? "✓ " : ""}{inc.title}</p>
              <p className="text-sm text-muted">{inc.context}</p>
            </button>
            {open === inc.id && (
              <div className="mt-3 space-y-3 text-sm">
                <div><p className="label">Sintomas</p><ul className="list-disc ml-5">{inc.symptoms.map((s) => <li key={s}>{s}</li>)}</ul></div>
                <p><span className="label">Info inicial: </span>{inc.initialInfo}</p>
                <p><span className="label">Ferramentas: </span>{inc.tools.join(" · ")}</p>
                <div><p className="label">1 · Qual hipótese você investiga primeiro?</p>
                  {inc.hypotheses.map((h) => (
                    <label key={h.id} className="quiz-opt"><input type="radio" name={inc.id} className="mr-2 accent-emerald-400"
                      checked={chosen === h.id} onChange={() => setHyp((x) => ({ ...x, [inc.id]: h.id }))} />{h.label}</label>
                  ))}
                  {chosen && <p className="text-muted mt-1">{inc.hypotheses.find((h) => h.id === chosen)?.evidenceIfChosen}</p>}
                </div>
                <div><p className="label">2 · Seu diagnóstico (antes de revelar)</p>
                  <textarea className="input h-20" value={diag[inc.id] ?? ""} onChange={(e) => setDiag((x) => ({ ...x, [inc.id]: e.target.value }))} placeholder="Causa provável + evidência + validação…" /></div>
                <details><summary className="cursor-pointer text-emerald-300">3 · Revelar solução e explicação</summary>
                  <p className="mt-1"><strong>Solução:</strong> {inc.solution}</p>
                  <p className="mt-1 text-muted">{inc.techExplanation}</p></details>
                <button className="btn-ghost" disabled={!chosen || !(diag[inc.id] ?? "").trim()} onClick={() => {
                  const h = inc.hypotheses.find((x) => x.id === chosen)!;
                  markIncident(inc.id, h.correct ? "hipótese correta" : "hipótese incorreta — releia a evidência");
                }}>{done ? `Concluído (${done.score}) — registrar de novo` : "Registrar investigação"}</button>
                {!chosen || !(diag[inc.id] ?? "").trim() ? <p className="text-xs text-muted">Escolha a hipótese e escreva o diagnóstico para registrar.</p> : null}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

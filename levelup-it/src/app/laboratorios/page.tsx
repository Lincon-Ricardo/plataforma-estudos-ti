"use client";
import { LABS } from "@/lib/seed-practice";
import { useStore } from "@/lib/store";

export default function Labs() {
  const { store, markLab } = useStore();
  return (
    <div className="space-y-5">
      <header><p className="label">Laboratórios práticos (Etapa 5)</p>
        <h1 className="text-2xl font-bold">Mão no terminal — com segurança</h1>
        <p className="text-sm text-muted">Comandos marcados são para executar <strong>você</strong> no seu ambiente (ou VM isolada). O app nunca executa nada sozinho.</p></header>
      {LABS.map((lab) => (
        <section key={lab.id} className="card">
          <h2 className="font-bold">{store.labDone[lab.id] ? "✓ " : ""}{lab.title}</h2>
          {lab.destructive && <p className="text-xs text-amber-300 mt-1">⚠ Ambiente isolado obrigatório (VM/lab). Nunca na produção.</p>}
          <p className="text-sm text-muted">Pré-requisitos: {lab.prereqs.join(", ")} · Objetivo: {lab.objective}</p>
          <ol className="list-decimal ml-5 mt-2 space-y-2 text-sm">
            {lab.steps.map((s, i) => (
              <li key={i}><p>{s.action}</p>
                {s.command && <code className="block bg-black/40 rounded-lg px-2 py-1 mt-1 text-emerald-200 text-xs break-all">{s.command}</code>}
                <p className="text-muted">Esperado: {s.expected} · Verifique: {s.verify}</p></li>
            ))}
          </ol>
          <p className="text-sm mt-2"><span className="label">Problemas comuns: </span>{lab.pitfalls.join(" · ")}</p>
          <p className="text-sm"><span className="label">Revisão: </span>{lab.review.join(" · ")}</p>
          <p className="text-sm"><span className="label">Conclusão: </span>{lab.doneCriteria}</p>
          <button className="btn-ghost mt-3" onClick={() => markLab(lab.id)}>{store.labDone[lab.id] ? "Concluído — marcar de novo" : "Marcar como concluído"}</button>
        </section>
      ))}
    </div>
  );
}

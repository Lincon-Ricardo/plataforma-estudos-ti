"use client";
import { useState } from "react";
import { PROJECTS } from "@/lib/seed-practice";
import { useStore } from "@/lib/store";

export default function Projetos() {
  const { store, setProject } = useStore();
  const [notes, setNotes] = useState<Record<string, string>>({});
  return (
    <div className="space-y-5">
      <header><p className="label">Projetos de portfólio (Etapa 6)</p>
        <h1 className="text-2xl font-bold">Prova, não promessa</h1>
        <p className="text-sm text-muted">Cada projeto tem requisitos, testes e critério de qualidade. Concluídos viram portfólio.</p></header>
      {PROJECTS.map((p) => {
        const st = store.projects.find((x) => x.id === p.id);
        return (
          <section key={p.id} className="card">
            <h2 className="font-bold">{st?.status === "done" ? "✓ " : ""}{p.title}</h2>
            <p className="text-sm text-muted">{p.description}</p>
            <div className="grid sm:grid-cols-2 gap-3 mt-2 text-sm">
              <div><p className="label">Requisitos</p><ul className="list-disc ml-4">{p.requirements.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <div><p className="label">Etapas</p><ul className="list-disc ml-4">{p.steps.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <div><p className="label">Testes</p><ul className="list-disc ml-4">{p.tests.map((r) => <li key={r}>{r}</li>)}</ul></div>
              <div><p className="label">Qualidade</p><ul className="list-disc ml-4">{p.quality.map((r) => <li key={r}>{r}</li>)}</ul></div>
            </div>
            <textarea className="input h-16 mt-2" placeholder="Link do repo + notas…" value={notes[p.id] ?? st?.notes ?? ""} onChange={(e) => setNotes((n) => ({ ...n, [p.id]: e.target.value }))} />
            <div className="flex gap-2 mt-2">
              <button className="btn-ghost" onClick={() => setProject(p.id, "doing", notes[p.id] ?? st?.notes ?? "")}>Em andamento</button>
              <button className="btn-primary" onClick={() => setProject(p.id, "done", notes[p.id] ?? st?.notes ?? "")}>Concluir</button>
            </div>
          </section>
        );
      })}
    </div>
  );
}

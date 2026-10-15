"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";

const FIELDS = ["title", "category", "symptoms", "tests", "results", "cause", "solution", "learned", "different"] as const;

export default function Diario() {
  const { store, addDiary } = useStore();
  const [f, setF] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState("");
  return (
    <div className="space-y-5">
      <header><p className="label">Diário de experiências (§14 — privado, local)</p>
        <h1 className="text-2xl font-bold">Do trabalho para o estudo</h1>
        <p className="text-sm text-amber-200/90">⚠ Não armazene senhas, dados pessoais de terceiros, informações confidenciais da empresa, IPs/endereços internos sensíveis ou dados protegidos. Anonimize sempre.</p></header>
      <section className="card space-y-2">
        {FIELDS.map((k) => (
          <div key={k}><p className="label">{k === "title" ? "Título" : k === "different" ? "O que faria diferente" : k}</p>
            {k === "title" || k === "category" || k === "cause" ? (
              <input className="input" value={f[k] ?? ""} onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))} />
            ) : (
              <textarea className="input h-16" value={f[k] ?? ""} onChange={(e) => setF((x) => ({ ...x, [k]: e.target.value }))} />
            )}</div>
        ))}
        <button className="btn-primary" onClick={() => {
          if (!(f.title ?? "").trim() || !(f.symptoms ?? "").trim()) { setMsg("Título e sintomas são obrigatórios."); return; }
          const low = Object.values(f).join(" ").toLowerCase();
          if (/(senha|password|cpf|rg\b|cartão|token)/.test(low)) { setMsg("Possível dado sensível detectado — remova senhas/documentos antes de salvar."); return; }
          addDiary({ title: f.title, category: f.category || "geral", symptoms: f.symptoms, tests: f.tests || "", results: f.results || "", cause: f.cause || "", solution: f.solution || "", learned: f.learned || "", different: f.different || "" });
          setF({}); setMsg("Registro salvo localmente.");
        }}>Salvar registro</button>
        {msg && <p className="text-sm" role="status">{msg}</p>}
      </section>
      {store.diary.map((d) => (
        <section key={d.id} className="card"><p className="font-bold">{d.title} <span className="text-xs text-muted">({d.category} · {new Date(d.at).toLocaleDateString("pt-BR")})</span></p>
          <p className="text-sm text-muted">Sintomas: {d.symptoms} · Causa: {d.cause} · Solução: {d.solution} · Aprendi: {d.learned}</p></section>
      ))}
    </div>
  );
}

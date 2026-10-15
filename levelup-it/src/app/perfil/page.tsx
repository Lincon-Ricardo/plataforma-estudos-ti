"use client";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

const DAYS = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

export default function Perfil() {
  const { store, ready, saveProfile, exportJson, importJson, resetAll } = useStore();
  const [form, setForm] = useState(store.profile);
  useEffect(() => { if (ready) setForm(store.profile); }, [ready]);
  const [msg, setMsg] = useState("");
  const [imp, setImp] = useState("");

  if (!ready) return <p className="text-muted">Carregando…</p>;
  const p = { ...store.profile, ...form };

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-5">
      <header><p className="label">Perfil pessoal (editável)</p>
        <h1 className="text-2xl font-bold">Quem é você hoje</h1>
        <p className="text-sm text-muted">Nada aqui presume domínio: o nível real vem do diagnóstico + quizzes.</p></header>

      <section className="card space-y-3">
        <div><p className="label">Nome</p><input className="input" value={p.name} onChange={(e) => set("name", e.target.value)} /></div>
        <div><p className="label">Papel atual</p><input className="input" value={p.role} onChange={(e) => set("role", e.target.value)} /></div>
        <div><p className="label">Curso</p><input className="input" value={p.course} onChange={(e) => set("course", e.target.value)} /></div>
        <div><p className="label">Objetivo profissional</p><input className="input" value={p.goal} onChange={(e) => set("goal", e.target.value)} /></div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div><p className="label">Minutos por dia</p><input className="input" type="number" min={10} max={300} value={p.dailyMinutes} onChange={(e) => set("dailyMinutes", Math.max(10, Math.min(300, Number(e.target.value) || 10)))} /></div>
          <div><p className="label">Data-alvo da meta</p><input className="input" type="date" value={p.targetDate} onChange={(e) => set("targetDate", e.target.value)} /></div>
        </div>
        <div><p className="label">Dias de estudo</p>
          <div className="flex gap-2 flex-wrap">{DAYS.map((d) => (
            <button key={d} type="button" onClick={() => set("studyDays", p.studyDays.includes(d) ? p.studyDays.filter((x) => x !== d) : [...p.studyDays, d])}
              className={`px-3 py-1 rounded-xl border text-sm ${p.studyDays.includes(d) ? "bg-emerald-500/20 border-emerald-400" : "border-white/15"}`}>{d}</button>))}</div></div>
        <div><p className="label">Áreas prioritárias (vírgula)</p><input className="input" value={p.priorities.join(", ")} onChange={(e) => set("priorities", e.target.value.split(",").map((s) => s.trim()).filter(Boolean))} /></div>
        <div><p className="label">Inglês técnico</p><input className="input" value={p.englishNote} onChange={(e) => set("englishNote", e.target.value)} /></div>
        <button className="btn-primary" onClick={() => {
          if (!p.name.trim()) { setMsg("Nome é obrigatório."); return; }
          if (!p.studyDays.length) { setMsg("Escolha ao menos 1 dia de estudo."); return; }
          saveProfile({ ...p, name: p.name.trim() }); setMsg("Perfil salvo.");
        }}>Salvar perfil</button>
        {msg && <p className="text-sm text-emerald-300" role="status">{msg}</p>}
      </section>

      <section className="card space-y-3">
        <h2 className="font-bold">Backup dos dados (local-first)</h2>
        <p className="text-sm text-muted">Tudo fica no localStorage deste navegador. Exporte o JSON e guarde no Git/Drive. Importar substitui os dados atuais.</p>
        <div className="flex gap-2 flex-wrap">
          <button className="btn-ghost" onClick={async () => { try { await navigator.clipboard.writeText(exportJson()); setMsg("JSON copiado. Cole num arquivo backup-levelup.json."); } catch { setMsg("Copie manualmente: " + exportJson().slice(0, 80) + "…"); } }}>Copiar backup JSON</button>
          <button className="btn-ghost" onClick={() => { if (confirm("Apagar TODO o progresso local?")) { resetAll(); setMsg("Dados locais apagados."); } }}>Apagar tudo</button>
        </div>
        <div><p className="label">Importar backup (cole o JSON)</p>
          <textarea className="input h-24" value={imp} onChange={(e) => setImp(e.target.value)} placeholder='{"version":1,…}' />
          <button className="btn-ghost mt-2" onClick={() => setMsg(importJson(imp) ? "Backup importado." : "JSON inválido — nada foi alterado.")}>Importar</button></div>
      </section>
    </div>
  );
}

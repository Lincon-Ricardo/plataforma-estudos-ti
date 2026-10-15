"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import { MODULES, LESSONS, PLANNED_LESSONS } from "@/lib/seed-tracks";
import { PROJECTS } from "@/lib/seed-practice";
import { areaScores, dueReviews, lessonById, moduleProgress, useStore, weakAreas } from "@/lib/store";
import { goals30_60_90, recommend } from "@/lib/recommend";

function weekKey(d = new Date()) {
  const d2 = new Date(d); d2.setHours(0, 0, 0, 0);
  const day = (d2.getDay() + 6) % 7; d2.setDate(d2.getDate() - day);
  return d2.toISOString().slice(0, 10);
}

export default function Dashboard() {
  const { store, ready, logSession } = useStore();
  const [minutes, setMinutes] = useState("25");
  const [msg, setMsg] = useState("");

  const rec = useMemo(() => recommend(store), [store]);
  const recLesson = rec ? lessonById(rec.lessonId) : null;
  const due = dueReviews(store.reviews);
  const weak = weakAreas(store.attempts);
  const scores = areaScores(store.attempts);
  const goals = goals30_60_90(store);

  const weekMinutes = store.sessions
    .filter((s) => s.at.slice(0, 10) >= weekKey())
    .reduce((a, s) => a + s.minutes, 0);
  const planned = store.profile.dailyMinutes * store.profile.studyDays.length;
  const lastAttempts = [...store.attempts].slice(-5).reverse();
  const doingProjects = store.projects.filter((p) => p.status === "doing");
  const totalLessons = LESSONS.filter((l) => l.status === "ready").length;
  const doneLessons = Object.keys(store.completedLessons).length;

  if (!ready) return <p className="text-muted">Carregando seu progresso local…</p>;

  return (
    <div className="space-y-5">
      <header>
        <p className="label">Dashboard pessoal</p>
        <h1 className="text-2xl font-bold">Olá, {store.profile.name} — objetivo: {store.profile.goal}</h1>
        <p className="text-sm text-muted">Trilha N1 → N2 → Infra → AWS · {doneLessons}/{totalLessons} aulas concluídas · {store.diagnosticDoneAt ? "diagnóstico feito" : "diagnóstico pendente"}</p>
      </header>

      <section className="card border-emerald-400/30">
        <p className="label">Atividade recomendada (baseada no seu progresso real)</p>
        {recLesson ? (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
            <div>
              <h2 className="font-bold text-lg">{recLesson.title}</h2>
              <p className="text-sm text-muted">{rec!.reason}</p>
            </div>
            <Link href={`/trilha/${recLesson.id}`} className="btn-primary text-center">Continuar aprendendo</Link>
          </div>
        ) : (
          <p className="text-sm">Nada pendente. Faça o <Link href="/diagnostico" className="underline">diagnóstico</Link> para gerar recomendações.</p>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        <section className="card">
          <h2 className="font-bold mb-2">Tempo de estudo (semana)</h2>
          <p className="text-sm text-muted">Planejado: {planned} min · Realizado: {weekMinutes} min</p>
          <div className="my-2"><ProgressBar pct={planned ? Math.round((weekMinutes / planned) * 100) : 0} /></div>
          <div className="flex gap-2 mt-3">
            <input className="input w-24" value={minutes} onChange={(e) => setMinutes(e.target.value)} inputMode="numeric" aria-label="Minutos estudados" />
            <button className="btn-ghost" onClick={() => {
              const m = parseInt(minutes, 10);
              if (!m || m <= 0 || m > 600) { setMsg("Informe 1–600 minutos."); return; }
              logSession(m, "estudo"); setMsg(`Registrados ${m} min. Bom trabalho.`); setMinutes("25");
            }}>Registrar sessão</button>
          </div>
          {msg && <p className="text-sm text-emerald-300 mt-2" role="status">{msg}</p>}
        </section>

        <section className="card">
          <h2 className="font-bold mb-2">Revisões e dificuldades</h2>
          <p className="text-sm">Revisões vencidas: <strong>{due.length}</strong> {due.length ? `(${due.map((d) => lessonById(d.lessonId)?.title ?? d.lessonId).join("; ")})` : "— nada pendente."}</p>
          <p className="text-sm mt-1">Dificuldades (nota &lt;70%): <strong>{weak.length ? weak.join("; ") : "nenhuma detectada ainda"}</strong></p>
          <p className="text-sm mt-1">Revisão espaçada: 1 → 3 → 7 → 14 → 30 dias, conforme acertos.</p>
        </section>
      </div>

      <section className="card">
        <h2 className="font-bold mb-3">Progresso por módulo (real, não fictício)</h2>
        <div className="space-y-3">
          {MODULES.map((m) => {
            const p = moduleProgress(m.id, store.completedLessons);
            return (
              <div key={m.id}>
                <div className="flex justify-between text-sm"><span>{m.title}</span><span>{p.done}/{p.total} · {p.pct}%</span></div>
                <ProgressBar pct={p.pct} />
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted mt-2">{PLANNED_LESSONS.length ? `Aulas planejadas (ainda não implementadas, sem botão falso): ${PLANNED_LESSONS.map((p) => p.title).join(" · ")}` : "Todas as aulas planejadas estão implementadas."}</p>
      </section>

      <div className="grid md:grid-cols-2 gap-5">
        <section className="card">
          <h2 className="font-bold mb-2">Últimos exercícios</h2>
          {lastAttempts.length ? lastAttempts.map((a) => (
            <p key={a.id} className="text-sm border-b border-white/5 py-1">{a.kind === "diagnostic" ? `Diagnóstico ${a.lessonId.replace("diagnostico:", "")}` : lessonById(a.lessonId)?.title ?? a.lessonId} — <strong>{a.score}%</strong> ({a.correct}/{a.total})</p>
          )) : <p className="text-sm text-muted">Nenhum exercício registrado. Comece pelo diagnóstico.</p>}
        </section>
        <section className="card">
          <h2 className="font-bold mb-2">Projetos em andamento</h2>
          {doingProjects.length ? doingProjects.map((p) => {
            const def = PROJECTS.find((x) => x.id === p.id);
            return <p key={p.id} className="text-sm border-b border-white/5 py-1">{def?.title ?? p.id}</p>;
          }) : <p className="text-sm text-muted">Nenhum projeto em andamento. Veja <Link href="/projetos" className="underline">Projetos</Link>.</p>}
        </section>
      </div>

      <section className="card">
        <h2 className="font-bold mb-2">Próximas metas (geradas do diagnóstico)</h2>
        <div className="grid md:grid-cols-3 gap-3 text-sm">
          <div><p className="label">30 dias</p><ul className="list-disc ml-4">{goals.d30.map((g) => <li key={g}>{g}</li>)}</ul></div>
          <div><p className="label">60 dias</p><ul className="list-disc ml-4">{goals.d60.map((g) => <li key={g}>{g}</li>)}</ul></div>
          <div><p className="label">90 dias</p><ul className="list-disc ml-4">{goals.d90.map((g) => <li key={g}>{g}</li>)}</ul></div>
        </div>
        {!!Object.keys(scores).length && (
          <p className="text-xs text-muted mt-2">Notas por área: {Object.entries(scores).map(([k, v]) => `${k} ${v}%`).join(" · ")}</p>
        )}
      </section>
    </div>
  );
}

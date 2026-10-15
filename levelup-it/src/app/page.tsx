"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import ProgressBar from "@/components/ProgressBar";
import { MODULES, LESSONS } from "@/lib/seed-tracks";
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
  const doneCount = store.projects.filter((p) => p.status === "done").length;
  const totalLessons = LESSONS.filter((l) => l.status === "ready").length;
  const doneLessons = Object.keys(store.completedLessons).length;

  if (!ready) return <p className="text-muted">Carregando seu progresso local…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-5 flex-wrap">
        <div>
          <p className="label">Dashboard pessoal</p>
          <h1 className="text-[28px] leading-tight font-extrabold">Olá, {store.profile.name}</h1>
          <p className="text-sm text-muted mt-1">Objetivo: {store.profile.goal} · {doneLessons}/{totalLessons} aulas · {store.diagnosticDoneAt ? "diagnóstico feito" : "diagnóstico pendente"}</p>
        </div>
        <div className="flex gap-6 font-mono text-xs">
          <span className="text-muted">AULAS <strong className="block text-xl text-gold font-display">{doneLessons}/{totalLessons}</strong></span>
          <span className="text-muted">SEMANA <strong className="block text-xl text-gold font-display">{weekMinutes}′</strong></span>
          <span className="text-muted">PROJETOS <strong className="block text-xl text-gold font-display">{doneCount}</strong></span>
        </div>
      </div>

      <section className="continue-strip">
        <div>
          <p className="label">Sua missão de hoje</p>
          {recLesson ? (
            <>
              <h2 className="text-xl font-extrabold">{recLesson.title}</h2>
              <p className="text-sm text-muted mt-1">{rec!.reason}</p>
            </>
          ) : (
            <p className="text-sm">Faça o <Link href="/diagnostico" className="underline text-accent">diagnóstico</Link> para gerar recomendações.</p>
          )}
        </div>
        {recLesson && <Link href={`/trilha/${recLesson.id}`} className="btn-primary whitespace-nowrap">Continuar aprendendo →</Link>}
      </section>

      <div className="grid md:grid-cols-3 gap-4">
        <section className="card">
          <p className="label">Tempo de estudo — semana</p>
          <p className="font-display font-extrabold text-2xl">{weekMinutes}<span className="text-sm text-muted font-sans font-normal"> / {planned} min</span></p>
          <div className="my-2"><ProgressBar pct={planned ? Math.round((weekMinutes / planned) * 100) : 0} /></div>
          <div className="flex gap-2 mt-3">
            <input className="input !w-20" value={minutes} onChange={(e) => setMinutes(e.target.value)} inputMode="numeric" aria-label="Minutos estudados" />
            <button className="btn-ghost !py-2" onClick={() => {
              const m = parseInt(minutes, 10);
              if (!m || m <= 0 || m > 600) { setMsg("Informe 1–600 minutos."); return; }
              logSession(m, "estudo"); setMsg(`Registrados ${m} min. Bom trabalho.`); setMinutes("25");
            }}>Registrar</button>
          </div>
          {msg && <p className="text-sm text-accent mt-2" role="status">{msg}</p>}
        </section>

        <section className="card">
          <p className="label">Revisões e dificuldades</p>
          <p className="font-display font-extrabold text-2xl">{due.length}<span className="text-sm text-muted font-sans font-normal"> vencidas</span></p>
          <p className="text-[13px] mt-1 text-muted">{due.length ? due.map((d) => lessonById(d.lessonId)?.title ?? d.lessonId).join("; ") : "Nada pendente."}</p>
          <p className="text-[13px] mt-2">Dificuldades (&lt;70%): <strong>{weak.length ? weak.join("; ") : "nenhuma detectada"}</strong></p>
        </section>

        <section className="card">
          <p className="label">Próximas metas</p>
          <ul className="text-[13px] space-y-1.5">
            {goals.d30.slice(0, 3).map((g) => <li key={g} className="flex gap-2"><span className="text-accent">▸</span>{g}</li>)}
          </ul>
          <Link href="/plano" className="text-[13px] text-accent underline mt-2 inline-block">Ver plano 30/60/90 →</Link>
        </section>
      </div>

      <section className="card">
        <p className="label">Progresso por módulo — real, não fictício</p>
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3 mt-2">
          {MODULES.map((m) => {
            const p = moduleProgress(m.id, store.completedLessons);
            return (
              <div key={m.id}>
                <div className="flex justify-between text-[13px] mb-1"><span className="truncate">{m.title}</span><span className="font-mono text-muted">{p.done}/{p.total} · {p.pct}%</span></div>
                <ProgressBar pct={p.pct} />
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <section className="card">
          <p className="label">Últimos exercícios</p>
          {lastAttempts.length ? lastAttempts.map((a) => (
            <p key={a.id} className="text-[13px] border-b border-line/60 py-1.5">{a.kind === "diagnostic" ? `Diagnóstico ${a.lessonId.replace("diagnostico:", "")}` : lessonById(a.lessonId)?.title ?? a.lessonId} — <strong className={a.score >= 80 ? "text-accent" : "text-gold"}>{a.score}%</strong> <span className="text-muted">({a.correct}/{a.total})</span></p>
          )) : <p className="text-sm text-muted">Nenhum exercício registrado. Comece pelo diagnóstico.</p>}
        </section>
        <section className="card">
          <p className="label">Projetos em andamento</p>
          {doingProjects.length ? doingProjects.map((p) => {
            const def = PROJECTS.find((x) => x.id === p.id);
            return <p key={p.id} className="text-[13px] border-b border-line/60 py-1.5">{def?.title ?? p.id}</p>;
          }) : <p className="text-sm text-muted">Nenhum projeto em andamento. Veja <Link href="/projetos" className="underline text-accent">Projetos</Link>.</p>}
          {!!Object.keys(scores).length && (
            <p className="text-xs text-muted mt-3">Notas por área: {Object.entries(scores).map(([k, v]) => `${k} ${v}%`).join(" · ")}</p>
          )}
        </section>
      </div>
    </div>
  );
}

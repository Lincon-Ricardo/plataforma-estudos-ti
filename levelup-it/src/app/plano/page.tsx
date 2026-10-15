"use client";
import Link from "next/link";
import { LESSONS } from "@/lib/seed-tracks";
import { buildWeek } from "@/lib/plan";
import { lessonById, useStore } from "@/lib/store";
import { recommend } from "@/lib/recommend";

export default function Plano() {
  const { store, ready } = useStore();
  if (!ready) return <p className="text-muted">Carregando…</p>;

  const pending = LESSONS.filter((l) => l.status === "ready" && !store.completedLessons[l.id])
    .map((l) => ({ id: l.id, minutes: lessonById(l.id)?.minutes ?? 30 }));
  const { week, queue } = buildWeek(store.profile.studyDays, store.profile.dailyMinutes, pending);
  const rec = recommend(store);
  const weekMin = week.reduce((a, d) => a + d.total, 0);

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <p className="label">Plano semanal — cabe na sua rotina</p>
        <h1 className="text-2xl font-extrabold">{store.profile.dailyMinutes} min · {store.profile.studyDays.join(", ") || "configure os dias no Perfil"}</h1>
        <p className="text-sm text-muted mt-1">{weekMin} min planejados · {queue.length} na fila · perdeu um dia? a fila recalcula sozinha.</p>
      </div>

      {rec && (
        <section className="continue-strip">
          <div><p className="label">Prioridade de hoje</p>
            <h2 className="font-extrabold">{lessonById(rec.lessonId)?.title}</h2>
            <p className="text-sm text-muted">{rec.reason} · ~{lessonById(rec.lessonId)?.minutes ?? 30} min</p></div>
          <Link href={`/trilha/${rec.lessonId}`} className="btn-primary whitespace-nowrap">Estudar agora</Link>
        </section>
      )}

      {!week.length && !queue.length && <section className="card"><p className="text-sm">Tudo concluído. Use revisões e projetos.</p></section>}
      {!store.profile.studyDays.length && (
        <section className="card"><p className="text-sm">Configure dias e minutos no <Link href="/perfil" className="underline text-accent">Perfil</Link> para gerar o plano.</p></section>
      )}

      {week.map((d) => (
        <section key={d.day} className="card">
          <div className="flex justify-between items-baseline mb-2">
            <h2 className="font-display font-extrabold capitalize">{d.day}</h2>
            <span className="font-mono text-xs text-muted">{d.total} min</span>
          </div>
          <div className="space-y-1.5">
            {d.items.map((it) => (
              <Link key={it.lessonId} href={`/trilha/${it.lessonId}`} className="navlink justify-between border border-line">
                <span>{lessonById(it.lessonId)?.title} <span className="font-mono text-[11px] text-muted">· {lessonById(it.lessonId)?.level}</span></span>
                <span className="font-mono text-xs text-muted">~{it.minutes} min →</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      {!!queue.length && (
        <section className="card">
          <p className="label">Fila da próxima semana ({queue.length})</p>
          {queue.map((q) => <p key={q.id} className="text-sm text-muted border-b border-line/60 py-1">{lessonById(q.id)?.title} · ~{q.minutes} min</p>)}
        </section>
      )}
    </div>
  );
}

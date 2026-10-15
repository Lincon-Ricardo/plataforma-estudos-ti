"use client";
import Link from "next/link";
import { LESSONS } from "@/lib/seed-tracks";
import { lessonById, useStore } from "@/lib/store";

export default function Revisao() {
  const { store, ready } = useStore();
  if (!ready) return <p className="text-muted">Carregando…</p>;
  const now = Date.now();
  const due = store.reviews.filter((r) => new Date(r.nextDue).getTime() <= now)
    .sort((a, b) => +new Date(a.nextDue) - +new Date(b.nextDue));
  const upcoming = store.reviews.filter((r) => new Date(r.nextDue).getTime() > now)
    .sort((a, b) => +new Date(a.nextDue) - +new Date(b.nextDue));

  const daysOver = (iso: string) => Math.max(0, Math.floor((now - new Date(iso).getTime()) / 864e5));

  return (
    <div className="space-y-5">
      <header><p className="label">Revisão espaçada (1 → 3 → 7 → 14 → 30 dias)</p>
        <h1 className="text-2xl font-bold">O que revisar hoje</h1>
        <p className="text-sm text-muted">Acerto ≥80% avança o intervalo; abaixo disso, volta para 1 dia. Refaça o quiz na aula para reagendar.</p></header>

      <section className="card border-amber-300/30">
        <h2 className="font-bold">Vencidas ({due.length})</h2>
        {due.length ? due.map((r) => (
          <div key={r.lessonId} className="flex items-center justify-between gap-2 border-b border-white/5 py-2">
            <p className="text-sm">{lessonById(r.lessonId)?.title ?? r.lessonId} <span className="text-muted">(há {daysOver(r.nextDue)}d · última nota {r.lastScore}%)</span></p>
            <Link href={`/trilha/${r.lessonId}`} className="btn-primary whitespace-nowrap">Revisar agora</Link>
          </div>
        )) : <p className="text-sm text-muted">Nada vencido. Bom ritmo.</p>}
      </section>

      <section className="card">
        <h2 className="font-bold">Agendadas ({upcoming.length})</h2>
        {upcoming.length ? upcoming.map((r) => (
          <p key={r.lessonId} className="text-sm border-b border-white/5 py-1">
            {lessonById(r.lessonId)?.title ?? r.lessonId} — {new Date(r.nextDue).toLocaleDateString("pt-BR")} (intervalo {r.intervalDays}d)
          </p>
        )) : <p className="text-sm text-muted">Complete quizzes para agendar revisões. {LESSONS.filter((l) => l.status === "ready").length} aulas disponíveis.</p>}
      </section>
    </div>
  );
}

"use client";
import { LESSONS, MODULES } from "@/lib/seed-tracks";
import { useStore } from "@/lib/store";
import { recommend } from "@/lib/recommend";

export default function Plano() {
  const { store } = useStore();
  const rec = recommend(store);
  const perDay = store.profile.dailyMinutes;
  const days = store.profile.studyDays;
  // Plano semanal real: divide próximas aulas pendentes pelos dias configurados
  const pending = LESSONS.filter((l) => l.status === "ready" && !store.completedLessons[l.id]);
  const perSession = pending.slice(0, Math.max(1, days.length));
  return (
    <div className="space-y-5">
      <header><p className="label">Plano semanal (Etapa 4/§12)</p>
        <h1 className="text-2xl font-bold">{perDay} min · {days.join(", ") || "configure os dias no Perfil"}</h1>
        <p className="text-sm text-muted">Se perder um dia, o plano reorganiza: a fila abaixo é recalculada do seu progresso real — sem acúmulo impossível.</p></header>
      <section className="card">
        <h2 className="font-bold mb-2">Esta semana</h2>
        {days.length ? perSession.map((l, i) => {
          const m = MODULES.find((x) => x.id === l.moduleId);
          return <p key={l.id} className="text-sm border-b border-white/5 py-1"><strong>{days[i % days.length]}:</strong> {l.title} <span className="text-muted">({m?.title})</span></p>;
        }) : <p className="text-sm">Configure dias e minutos no Perfil.</p>}
        {rec && <p className="text-sm mt-2">Prioridade de hoje: <strong>{LESSONS.find((l) => l.id === rec.lessonId)?.title}</strong> — {rec.reason}</p>}
      </section>
      <section className="card">
        <h2 className="font-bold mb-1">Fila completa (pendentes)</h2>
        {pending.length ? pending.map((l) => <p key={l.id} className="text-sm text-muted border-b border-white/5 py-1">{l.title}</p>) : <p className="text-sm">Tudo concluído. Use revisões e projetos.</p>}
      </section>
    </div>
  );
}

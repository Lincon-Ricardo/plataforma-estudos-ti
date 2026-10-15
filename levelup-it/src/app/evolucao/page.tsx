"use client";
import { useMemo, useState } from "react";
import { LESSONS } from "@/lib/seed-tracks";
import { areaScores, lessonById, useStore } from "@/lib/store";

export default function Evolucao() {
  const { store } = useStore();
  const scores = areaScores(store.attempts);
  const report = useMemo(() => {
    const last7 = store.attempts.filter((a) => Date.now() - new Date(a.at).getTime() < 7 * 864e5);
    const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0);
    const byKind = (k: string) => last7.filter((a) => a.kind === k).map((a) => a.score);
    const repeatErrors = store.attempts.filter((a) => a.kind === "lesson" && a.score < 80).map((a) => lessonById(a.lessonId)?.title ?? a.lessonId);
    return { learned: last7.filter((a) => a.score >= 80).length, avgLesson: avg(byKind("lesson")), repeatErrors: [...new Set(repeatErrors)].slice(0, 5) };
  }, [store.attempts]);

  const totalMin = store.sessions.reduce((a, s) => a + s.minutes, 0);
  const [copied, setCopied] = useState(false);
  const copyReport = async () => {
    const txt = `Level Up IT — relatório semanal\nAulas: ${Object.keys(store.completedLessons).length}/${LESSONS.filter((l) => l.status === "ready").length} · Projetos: ${store.projects.filter((p) => p.status === "done").length} · Minutos: ${totalMin}\nA melhorar: ${report.repeatErrors.join("; ") || "—"}\nNotas: ${Object.entries(scores).map(([k, v]) => `${k} ${v}%`).join(" · ") || "diagnóstico pendente"}`;
    try { await navigator.clipboard.writeText(txt); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch { setCopied(false); }
  };
  return (
    <div className="space-y-5">
      <header><p className="label">Evolução (Etapa 6/§13)</p>
        <h1 className="text-2xl font-bold">Relatório semanal real</h1>
        <p className="text-sm text-muted">Métrica principal: capacidade demonstrada (notas, labs, projetos) — não XP.</p></header>
      <section className="card text-sm space-y-1">
        <p><strong>O que aprendi (7d):</strong> {report.learned} aprovações · média em aulas {report.avgLesson}% · {Object.keys(store.completedLessons).length}/{LESSONS.filter((l) => l.status === "ready").length} aulas · {store.projects.filter((p) => p.status === "done").length} projetos · {totalMin} min totais.</p>
        <p><strong>A melhorar:</strong> {report.repeatErrors.length ? report.repeatErrors.join("; ") : "nada com nota <80% — avance."}</p>
        <p><strong>Dificuldades que se repetem:</strong> {report.repeatErrors.length ? report.repeatErrors.join("; ") : "—"}</p>
        <p><strong>Notas por área:</strong> {Object.keys(scores).length ? Object.entries(scores).map(([k, v]) => `${k} ${v}%`).join(" · ") : "faça o diagnóstico."}</p>
        <p><strong>Próxima semana:</strong> zerar revisões vencidas, avançar a fila do Plano e registrar 1 incidente no Diário.</p>
        <button className="btn-ghost mt-2" onClick={copyReport}>{copied ? "Relatório copiado!" : "Copiar relatório semanal"}</button>
      </section>
      <section className="card">
        <h2 className="font-bold mb-2">Histórico de tentativas</h2>
        {store.attempts.length ? [...store.attempts].reverse().slice(0, 30).map((a) => (
          <p key={a.id} className="text-sm border-b border-white/5 py-1">{new Date(a.at).toLocaleString("pt-BR")} — {a.kind === "diagnostic" ? a.lessonId : lessonById(a.lessonId)?.title} — <strong>{a.score}%</strong></p>
        )) : <p className="text-sm text-muted">Sem tentativas ainda.</p>}
      </section>
    </div>
  );
}

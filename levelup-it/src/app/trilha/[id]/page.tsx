"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { lessonById, useStore } from "@/lib/store";
import { LESSONS } from "@/lib/seed-tracks";

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const lesson = lessonById(id);
  const { store, recordAttempt, completeLesson, scheduleReview } = useStore();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<string>("");
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});

  const done = !!store.completedLessons[id];

  const grade = () => {
    if (!lesson) return;
    if (Object.keys(answers).length < lesson.quiz.length) { setResult("Responda todas as questões antes de verificar."); return; }
    let correct = 0;
    lesson.quiz.forEach((q) => { if (answers[q.id] === q.answer) correct++; });
    const score = Math.round((correct / lesson.quiz.length) * 100);
    recordAttempt({ lessonId: lesson.id, score, total: lesson.quiz.length, correct, kind: "lesson" });
    scheduleReview(lesson.id, score);
    setRevealed(true);
    if (score >= 80) { completeLesson(lesson.id); setResult(`Aprovado: ${score}% (${correct}/${lesson.quiz.length}). Aula concluída e revisão agendada.`); }
    else setResult(`Nota ${score}% — abaixo de 80%. Revise o resumo e tente de novo; revisão agendada para amanhã.`);
  };

  const next = useMemo(() => {
    if (!lesson) return null;
    const mod = LESSONS.filter((l) => l.moduleId === lesson.moduleId && l.status === "ready");
    const i = mod.findIndex((l) => l.id === lesson.id);
    return mod[i + 1] ?? null;
  }, [lesson]);

  if (!lesson) return <div className="space-y-3"><p>Aula não encontrada.</p><Link href="/trilha" className="btn-ghost inline-block">Voltar à trilha</Link></div>;

  return (
    <article className="space-y-5">
      <p className="label">Aula · {done ? "concluída ✓" : "em andamento"}</p>
      <h1 className="text-2xl font-bold">{lesson.title}</h1>

      <section className="card"><p className="label">1 · Objetivo</p><p>{lesson.objective}</p></section>

      <section className="card"><p className="label">2 · Explicação progressiva</p>
        {lesson.explanation.map((p, i) => <p key={i} className="mb-2 text-[15px] leading-relaxed">{p}</p>)}
      </section>

      <section className="card"><p className="label">3 · Exemplo prático</p><p>{lesson.example}</p></section>

      <section className="card"><p className="label">4 · Demonstração passo a passo</p>
        <ol className="list-decimal ml-5 space-y-1">{lesson.demo.map((d, i) => <li key={i}>{d}</li>)}</ol></section>

      <section className="card"><p className="label">5 · Exercício guiado (recuperação ativa)</p>
        <p>{lesson.guided.task}</p>
        <details className="mt-2"><summary className="cursor-pointer text-emerald-300">Ver dicas (tente antes)</summary>
          <ul className="list-disc ml-5 text-sm text-muted">{lesson.guided.hints.map((h, i) => <li key={i}>{h}</li>)}</ul></details>
      </section>

      <section className="card"><p className="label">6 · Exercício independente</p><p>{lesson.independent}</p></section>

      <section className="card"><p className="label">7 · Verificação (resposta só após tentar)</p>
        {lesson.quiz.map((q, qi) => (
          <div key={q.id} className="mb-4">
            <p className="font-semibold">{qi + 1}. {q.prompt}</p>
            {q.options.map((op, oi) => (
              <label key={oi} className="quiz-opt text-sm">
                <input type="radio" name={q.id} className="mr-2 accent-emerald-400"
                  checked={answers[q.id] === oi} onChange={() => setAnswers((a) => ({ ...a, [q.id]: oi }))} />{op}
              </label>
            ))}
            {revealed && (
              <div className="text-sm mt-1">
                <button className="underline text-emerald-300" onClick={() => setShowAnswer((s) => ({ ...s, [q.id]: !s[q.id] }))}>
                  {showAnswer[q.id] ? "Ocultar explicação" : "Ver por que"}
                </button>
                {showAnswer[q.id] && <p className="text-muted mt-1">Resposta: <strong>{q.options[q.answer]}</strong>. {q.explanation}</p>}
              </div>
            )}
          </div>
        ))}
        <button className="btn-primary" onClick={grade}>Verificar (exige todas respondidas)</button>
        {result && <p className="mt-2 text-sm" role="status">{result}</p>}
      </section>

      <section className="card"><p className="label">8 · Resumo essencial</p>
        <ul className="list-disc ml-5">{lesson.summary.map((s, i) => <li key={i}>{s}</li>)}</ul></section>

      <section className="card"><p className="label">9 · Critério de conclusão</p><p className="text-sm">{lesson.completionNote}</p></section>

      <section className="card"><p className="label">10 · Próxima atividade</p>
        {next ? <Link href={`/trilha/${next.id}`} className="btn-ghost inline-block">Próxima: {next.title}</Link>
          : <Link href="/" className="btn-ghost inline-block">Voltar ao dashboard</Link>}
      </section>
    </article>
  );
}

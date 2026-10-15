"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { lessonById, useStore } from "@/lib/store";
import { LESSONS } from "@/lib/seed-tracks";
import { MODULE_MEDIA } from "@/lib/seed-media";
import { LessonVisual, MODULE_HUE } from "@/components/diagrams";

function VideoEmbed({ yt, title, channel }: { yt: string; title: string; channel: string }) {
  return (
    <div>
      <div className="aspect-video w-full overflow-hidden rounded border border-line bg-black">
        <iframe className="w-full h-full" src={`https://www.youtube-nocookie.com/embed/${yt}`}
          title={title} loading="lazy" allowFullScreen
          allow="accelerometer; encrypted-media; picture-in-picture" />
      </div>
      <p className="text-xs text-muted mt-1">{title} · {channel} · apoio externo (YouTube)</p>
    </div>
  );
}

export default function LessonPage() {
  const { id } = useParams<{ id: string }>();
  const lesson = lessonById(id);
  const { store, recordAttempt, completeLesson, scheduleReview } = useStore();

  const [checks, setChecks] = useState<boolean[]>([]);
  const [qi, setQi] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState("");
  const [showWhy, setShowWhy] = useState(false);

  const done = !!store.completedLessons[id];
  const hue = lesson ? MODULE_HUE[lesson.moduleId] ?? "#61c3b6" : "#61c3b6";
  const media = lesson ? MODULE_MEDIA[lesson.moduleId] : undefined;

  const [feynman, setFeynman] = useState("");
  useEffect(() => {
    try { setFeynman(localStorage.getItem(`levelup-it-feynman-${id}`) ?? ""); } catch {}
  }, [id]);
  const saveFeynman = (v: string) => {
    setFeynman(v);
    try { localStorage.setItem(`levelup-it-feynman-${id}`, v); } catch {}
  };

  const next = useMemo(() => {
    if (!lesson) return null;
    const mod = LESSONS.filter((l) => l.moduleId === lesson.moduleId && l.status === "ready");
    return mod[mod.findIndex((l) => l.id === lesson.id) + 1] ?? null;
  }, [lesson]);

  if (!lesson) return <div className="space-y-3"><p>Aula não encontrada.</p><Link href="/trilha" className="btn-ghost inline-block">Voltar à trilha</Link></div>;

  const q = lesson.quiz[qi];
  const checkedCount = checks.filter(Boolean).length;

  const answer = (opt: number) => {
    if (answers[q.id] !== undefined) return;
    setAnswers((a) => ({ ...a, [q.id]: opt }));
  };

  const advance = () => {
    setShowWhy(false);
    if (qi + 1 < lesson.quiz.length) setQi(qi + 1);
    else {
      let correct = 0;
      lesson.quiz.forEach((x) => { if (answers[x.id] === x.answer) correct++; });
      const score = Math.round((correct / lesson.quiz.length) * 100);
      recordAttempt({ lessonId: lesson.id, score, total: lesson.quiz.length, correct, kind: "lesson" });
      scheduleReview(lesson.id, score);
      setFinished(true);
      if (score >= 80) { completeLesson(lesson.id); setResult(`Aprovado: ${score}% (${correct}/${lesson.quiz.length}). Aula concluída e revisão agendada.`); }
      else setResult(`Nota ${score}% — abaixo de 80%. Revise o resumo e refaça; revisão reagendada para amanhã.`);
    }
  };

  const retry = () => { setAnswers({}); setQi(0); setFinished(false); setResult(""); setShowWhy(false); };

  return (
    <article className="space-y-4 max-w-3xl">
      <div className="rounded border border-line bg-panel p-6" style={{ borderTop: `4px solid ${hue}` }}>
        <p className="label">{done ? "Aula concluída ✓" : "Aula"} · {lesson.quiz.length} verificações · {lesson.demo.length} passos práticos</p>
        <h1 className="text-2xl font-extrabold">{lesson.title}</h1>
        <p className="text-sm text-muted mt-2"><strong className="text-bodytext">Objetivo:</strong> {lesson.objective}</p>
      </div>

      <LessonVisual id={lesson.id} moduleId={lesson.moduleId} />

      {!!(media && (media.videos.length || media.framework)) && (
        <section className="card" style={{ borderTop: `3px solid ${hue}` }}>
          <p className="label">Aprenda de outro jeito — ver antes de ler</p>
          <p className="text-[13px] text-muted mb-3">Base curricular: <strong className="text-bodytext">{media.framework}</strong></p>
          {media.videos.length > 0 && (
            <div className="grid gap-4">
              {media.videos.map((v) => <VideoEmbed key={v.yt} {...v} />)}
            </div>
          )}
          <p className="text-[13px] mt-3">Documentação oficial:</p>
          <ul className="text-sm mt-1 space-y-1">
            {media.docs.map((d) => (
              <li key={d.url + d.label}><a href={d.url} target="_blank" rel="noreferrer" className="underline" style={{ color: hue }}>{d.label} ↗</a></li>
            ))}
          </ul>
        </section>
      )}

      <section className="card">
        <p className="label">O essencial</p>
        <p className="text-[15px] leading-relaxed">{lesson.explanation[0]}</p>
        {lesson.explanation.length > 1 && (
          <details className="mt-2">
            <summary className="cursor-pointer text-sm font-semibold" style={{ color: hue }}>Aprofundar ({lesson.explanation.length - 1} {lesson.explanation.length - 1 === 1 ? "ponto" : "pontos"})</summary>
            {lesson.explanation.slice(1).map((p, i) => <p key={i} className="mt-2 text-[15px] leading-relaxed text-muted">{p}</p>)}
          </details>
        )}
      </section>

      <section className="rounded border border-line border-l-4 bg-panel p-5 shadow-panel" style={{ borderLeftColor: hue }}>
        <p className="label">Exemplo prático</p>
        <p className="text-[15px]">{lesson.example}</p>
      </section>

      <section className="card">
        <p className="label">Demonstração — marque ao executar ({checkedCount}/{lesson.demo.length})</p>
        <div className="space-y-1.5">
          {lesson.demo.map((d, i) => (
            <label key={i} className={`quiz-opt !my-1.5 ${checks[i] ? "opacity-60" : ""}`}>
              <input type="checkbox" className="accent-[#61c3b6] w-4 h-4" checked={!!checks[i]}
                onChange={() => setChecks((c) => { const n = [...c]; n[i] = !n[i]; return n; })} />
              <span className={checks[i] ? "line-through" : ""}>{d}</span>
            </label>
          ))}
        </div>
      </section>

      {!!lesson.commands?.length && (
        <section className="card">
          <p className="label">Referência de comandos (leia a saída esperada)</p>
          <div className="space-y-2">
            {lesson.commands.map((c) => (
              <div key={c.cmd}>
                <code className="block bg-black/40 rounded px-2 py-1.5 text-[13px] break-all" style={{ color: hue }}>{c.cmd}</code>
                <p className="text-[13px] text-muted mt-0.5">→ {c.out}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        {!!lesson.terms?.length && (
          <section className="card">
            <p className="label">Inglês técnico (EN → PT)</p>
            <dl className="text-sm space-y-1.5">
              {lesson.terms.map((t) => (
                <div key={t.en}><dt className="font-mono text-[13px] font-bold" style={{ color: hue }}>{t.en}</dt><dd className="text-muted text-[13px]">{t.pt}</dd></div>
              ))}
            </dl>
          </section>
        )}
        {!!lesson.pitfalls?.length && (
          <section className="card" style={{ borderTop: "3px solid #f19999" }}>
            <p className="label !text-[#f19999]">Armadilhas comuns</p>
            <ul className="text-sm space-y-1.5">
              {lesson.pitfalls.map((p) => <li key={p} className="flex gap-2"><span>✗</span>{p}</li>)}
            </ul>
          </section>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <section className="card">
          <p className="label">Exercício guiado</p>
          <p className="text-sm">{lesson.guided.task}</p>
          <details className="mt-2"><summary className="cursor-pointer text-sm font-semibold" style={{ color: hue }}>Ver dicas (tente antes)</summary>
            <ul className="list-disc ml-5 text-sm text-muted mt-1">{lesson.guided.hints.map((h) => <li key={h}>{h}</li>)}</ul></details>
        </section>
        <section className="card">
          <p className="label">Desafio independente</p>
          <p className="text-sm">{lesson.independent}</p>
        </section>
      </div>

      <section className="card">
        <p className="label">Técnica Feynman — explique com suas palavras</p>
        <p className="text-[13px] text-muted mb-2">Se você não consegue explicar simples, ainda não dominou. Escreva abaixo (salvo neste navegador, privado).</p>
        <textarea className="input h-20" value={feynman} onChange={(e) => saveFeynman(e.target.value)}
          placeholder="Ex.: gateway é... porque..." />
        <p className="text-xs text-muted mt-1">{feynman.trim().length >= 50 ? "✓ Explicação registrada. Releia em voz alta." : "Mínimo sugerido: 50 caracteres."}</p>
      </section>

      <section className="card" style={{ borderTop: `3px solid ${hue}` }}>
        <p className="label">Verificação {qi + 1} de {lesson.quiz.length}</p>
        {!finished ? (
          <div>
            <div className="h-1.5 bg-line/60 rounded-sm overflow-hidden mb-3">
              <div className="h-full transition-all" style={{ width: `${((qi) / lesson.quiz.length) * 100}%`, background: hue }} />
            </div>
            <p className="font-bold">{q.prompt}</p>
            {q.options.map((op, oi) => {
              const picked = answers[q.id];
              const locked = picked !== undefined;
              const isRight = oi === q.answer;
              return (
                <button key={oi} disabled={locked} onClick={() => answer(oi)}
                  className="quiz-opt w-full text-left text-sm"
                  style={locked && isRight ? { borderColor: hue, background: "#213c3c" } : locked && picked === oi ? { borderColor: "#f19999" } : undefined}>
                  {op} {locked && isRight && "✓"} {locked && !isRight && picked === oi && "✗"}
                </button>
              );
            })}
            {answers[q.id] !== undefined && (
              <div className="text-sm mt-2">
                <p className={answers[q.id] === q.answer ? "text-accent font-semibold" : "text-[#f19999] font-semibold"}>
                  {answers[q.id] === q.answer ? "Certa!" : "Não foi dessa vez."}
                </p>
                <button className="underline text-sm mt-1" style={{ color: hue }} onClick={() => setShowWhy((s) => !s)}>
                  {showWhy ? "Ocultar porquê" : "Por quê?"}
                </button>
                {showWhy && <p className="text-muted mt-1">{q.explanation}</p>}
                <div><button className="btn-primary mt-3" onClick={advance}>{qi + 1 < lesson.quiz.length ? "Próxima →" : "Ver resultado"}</button></div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-sm font-semibold" role="status">{result}</p>
            <p className="text-xs text-muted mt-1">{lesson.completionNote}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              <button className="btn-ghost" onClick={retry}>Refazer quiz</button>
              {next ? <Link href={`/trilha/${next.id}`} className="btn-primary">Próxima: {next.title}</Link>
                : <Link href="/" className="btn-ghost">Voltar ao dashboard</Link>}
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <p className="label">Resumo essencial</p>
        <div className="flex flex-wrap gap-2">
          {lesson.summary.map((s) => (
            <span key={s} className="text-[13px] rounded-full border border-line bg-black/25 px-3 py-1.5">{s}</span>
          ))}
        </div>
      </section>
    </article>
  );
}

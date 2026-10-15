import { NextResponse } from "next/server";

const SYSTEM = `Você é o tutor pessoal de um técnico de suporte N1 (ADS) na trilha N1→N2→Infra→AWS.
Regras: explique simples e depois aprofunde; use exemplos de TI; faça perguntas antes de dar a solução;
nunca invente comandos/serviços (diga quando não souber e aponte a doc oficial);
marque [LOCAL] vs [NUVEM/LICENÇA]; nunca peça nem aceite senhas/dados sensíveis.`;

export async function POST(req: Request) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) {
    return NextResponse.json(
      { offline: true, message: "IA não configurada (sem OPENAI_API_KEY). Use o modo offline da página." },
      { status: 501 }
    );
  }
  let question = "";
  try {
    const body = await req.json();
    question = String(body.question ?? "").slice(0, 2000);
  } catch {
    return NextResponse.json({ error: "Pergunta inválida." }, { status: 400 });
  }
  if (!question.trim()) return NextResponse.json({ error: "Pergunta vazia." }, { status: 400 });

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: ctrl.signal,
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        max_tokens: 600,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: question },
        ],
      }),
    });
    if (!r.ok) return NextResponse.json({ error: `Provedor retornou ${r.status}. Verifique chave/cota.` }, { status: 502 });
    const data = await r.json();
    const answer = data.choices?.[0]?.message?.content?.trim() || "Sem resposta do provedor.";
    return NextResponse.json({ answer, model: process.env.OPENAI_MODEL || "gpt-4o-mini" });
  } catch {
    return NextResponse.json({ error: "Falha ao contatar o provedor (timeout/rede)." }, { status: 504 });
  } finally {
    clearTimeout(timer);
  }
}

"use client";
import { useState } from "react";

const OFFLINE = [
  { q: "Explique o que é gateway padrão.", a: "É o roteador que o host usa quando o destino está fora da sub-rede local. O quadro vai ao MAC do gateway; o pacote mantém o IP final." },
  { q: "Diferença entre timeout e connection refused?", a: "Timeout = sem resposta (rota, filtro silencioso, serviço fora, retorno). Refused = chegou ao destino, mas a porta não aceita." },
  { q: "APIPA 169.254.x.x?", a: "Cliente não obteve DHCP. Verifique VLAN/porta, relay, escopo e serviço — não apenas renove o lease." },
];

export default function Tutor() {
  const [sim, setSim] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [ai, setAi] = useState<string>("");
  const [err, setErr] = useState<string>("");

  const ask = async () => {
    if (!q.trim() || loading) return;
    setLoading(true); setErr(""); setAi("");
    try {
      const r = await fetch("/api/tutor", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: q }),
      });
      const data = await r.json().catch(() => ({}));
      if (r.status === 501 || r.status === 404) setErr((data.message as string) || "IA indisponível neste ambiente (deploy estático sem servidor). Use o modo offline — ele cobre o essencial. Custos da IA em .env.example.");
      else if (!r.ok) setErr(data.error || "Erro desconhecido.");
      else setAi(data.answer);
    } catch {
      setErr("Rede local falhou. Tente de novo ou use o modo offline.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="space-y-5">
      <header><p className="label">Tutor (Etapa 7 — IA opcional)</p>
        <h1 className="text-2xl font-bold">Estude aqui; IA só se você ativar</h1>
        <p className="text-sm text-muted">O app funciona 100% sem API paga. A integração com IA (ex.: OpenAI) é opcional, via variável de ambiente no servidor — veja <code>.env.example</code> com custos. Sem chave, use o modo offline abaixo.</p></header>
      <section className="card">
        <h2 className="font-bold">Perguntar à IA (opcional, com custo)</h2>
        <p className="text-sm text-muted">Requer <code>OPENAI_API_KEY</code> no servidor. Sem chave, o botão informa e indica o modo offline — nada quebra.</p>
        <textarea className="input h-20 mt-2" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ex.: por que meu Test-NetConnection dá False se o ping passa?" />
        <button className="btn-primary mt-2" disabled={loading || !q.trim()} onClick={ask}>{loading ? "Perguntando…" : "Perguntar à IA"}</button>
        {err && <p className="text-sm text-amber-200 mt-2" role="status">{err}</p>}
        {ai && <p className="text-sm mt-2 whitespace-pre-wrap">{ai}</p>}
      </section>
      <section className="card">
        <h2 className="font-bold">Modo offline (Socrático)</h2>
        <p className="text-sm text-muted">Escolha uma pergunta, tente responder em voz alta e só então revele.</p>
        {OFFLINE.map((o, i) => (
          <div key={i} className="border-t border-white/5 py-2">
            <p className="text-sm font-semibold">{o.q}</p>
            <button className="underline text-emerald-300 text-sm" onClick={() => setSim(sim === o.q ? null : o.q)}>{sim === o.q ? "Ocultar" : "Tentei — revelar linha de raciocínio"}</button>
            {sim === o.q && <p className="text-sm text-muted mt-1">{o.a}</p>}
          </div>
        ))}
      </section>
      <section className="card">
        <h2 className="font-bold">Simulação de entrevista N2</h2>
        <p className="text-sm">“O financeiro não abre pelo nome, mas a internet funciona. O que você faz?”</p>
        <details className="text-sm mt-1"><summary className="cursor-pointer text-emerald-300">Ver resposta esperada N2</summary>
          <p className="text-muted mt-1">Escopo (só esse sistema?) → Resolve-DnsName e comparar com registro autorizado → Test-NetConnection IP:443 → comparar outra origem → escalar com hora/evidência → retestar com o usuário.</p></details>
      </section>
    </div>
  );
}

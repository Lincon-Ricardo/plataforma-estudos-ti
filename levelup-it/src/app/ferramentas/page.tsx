"use client";
import { useState } from "react";
import { calcSubnet } from "@/lib/subnet";

export default function Ferramentas() {
  const [ip, setIp] = useState("192.168.10.70");
  const [prefix, setPrefix] = useState("26");
  const [ran, setRan] = useState(false);

  const res = calcSubnet(ip, Number(prefix));

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <p className="label">Ferramentas interativas</p>
        <h1 className="text-2xl font-extrabold">Calculadora de sub-redes didática</h1>
        <p className="text-sm text-muted mt-1">Não mostra só o resultado: ensina o passo a passo. Pratique e confira.</p>
      </div>

      <section className="card">
        <div className="flex gap-2 flex-wrap items-end">
          <div><p className="label">IP</p><input className="input !w-44" value={ip} onChange={(e) => { setIp(e.target.value); setRan(true); }} inputMode="numeric" /></div>
          <div><p className="label">Prefixo</p>
            <div className="flex items-center gap-1">
              <span className="text-muted">/</span>
              <input className="input !w-20" value={prefix} onChange={(e) => { setPrefix(e.target.value); setRan(true); }} inputMode="numeric" />
            </div>
          </div>
        </div>

        {"error" in res ? (
          <p className="text-sm text-[#f19999] mt-3" role="alert">{ran ? res.error : "Digite IP e prefixo."}</p>
        ) : (
          <div className="mt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {[["Rede", res.network], ["Broadcast", res.broadcast], ["Máscara", res.mask], ["Hosts úteis", String(res.usableHosts)]].map(([k, v]) => (
                <div key={k} className="rounded border border-line bg-black/25 p-3">
                  <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{k}</p>
                  <p className="font-mono font-bold text-accent break-all">{v}</p>
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-2 mt-3 text-[13px]">
              <p><span className="text-muted">Faixa útil:</span> <strong className="font-mono">{res.firstHost} – {res.lastHost}</strong></p>
              <p><span className="text-muted">Wildcard:</span> <strong className="font-mono">{res.wildcard}</strong></p>
              <p className="sm:col-span-2"><span className="text-muted">IP binário:</span> <code className="break-all">{res.ipBinary}</code></p>
              <p className="sm:col-span-2"><span className="text-muted">Máscara binária:</span> <code className="break-all">{res.maskBinary}</code></p>
            </div>
            <div className="mt-3 rounded border-l-4 border-l-accent bg-black/25 p-4">
              <p className="label">Passo a passo (tente antes de ler)</p>
              <ol className="text-sm space-y-1">{res.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
            </div>
          </div>
        )}
      </section>

      <section className="card">
        <p className="label">Desafios relâmpago</p>
        <div className="flex flex-wrap gap-2">
          {[["10.20.30.150", "27"], ["172.16.5.77", "28"], ["192.168.1.130", "26"], ["10.0.0.5", "8"]].map(([a, b]) => (
            <button key={a + b} className="btn-ghost !py-1.5 text-[13px]" onClick={() => { setIp(a); setPrefix(b); setRan(true); }}>
              {a}/{b}
            </button>
          ))}
        </div>
        <p className="text-xs text-muted mt-2">Clique, calcule de cabeça e confira o passo a passo.</p>
      </section>
    </div>
  );
}

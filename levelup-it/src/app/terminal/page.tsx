"use client";
import { useState } from "react";

interface Line { text: string; kind: "cmd" | "out" | "err" | "sys"; }

function simulate(raw: string): Line[] {
  const cmd = raw.trim().replace(/\s+/g, " ");
  const low = cmd.toLowerCase();
  const echo: Line[] = [{ text: `> ${cmd}`, kind: "cmd" }];
  if (!low) return [];
  if (low === "help") return [...echo, { text: "Comandos: ipconfig [/all] · ping <host> · tracert <host> · nslookup <nome> · Test-NetConnection <host> -Port <porta> · Get-NetIPConfiguration · Get-NetRoute · cls", kind: "sys" }];
  if (low === "cls" || low === "clear") return [];
  if (/^ipconfig(\s+\/all)?$/.test(low)) {
    const base = ["Windows IP Configuration", "", "Ethernet adapter Ethernet:", "   IPv4 Address. . . . . . . . . . . : 192.168.1.25", "   Subnet Mask . . . . . . . . . . . : 255.255.255.0", "   Default Gateway . . . . . . . . . : 192.168.1.1"];
    if (low.endsWith("/all")) base.push("   DHCP Server . . . . . . . . . . . : 192.168.1.1", "   DNS Servers . . . . . . . . . . . : 192.168.1.1", "   Lease Obtained. . . . . . . . . . : hoje 08:02");
    return [...echo, ...base.map((text) => ({ text, kind: "out" as const })), { text: "Dica: 169.254.x.x = sem DHCP. Confira gateway e DNS.", kind: "sys" }];
  }
  const ping = low.match(/^ping\s+(\S+)$/);
  if (ping) return [...echo,
    { text: `Pinging ${ping[1]} [93.184.216.34] with 32 bytes of data:`, kind: "out" },
    { text: "Reply: bytes=32 time=11ms TTL=117 (×4)", kind: "out" },
    { text: "Sent = 4, Received = 4, Lost = 0", kind: "out" },
    { text: "Ping prova ICMP — não testa porta de serviço.", kind: "sys" }];
  const tr = low.match(/^tracert\s+(\S+)$/);
  if (tr) return [...echo, { text: `Rota até ${tr[1]}:`, kind: "out" }, { text: "  1  1ms  192.168.1.1", kind: "out" }, { text: "  2  10ms  10.0.0.1", kind: "out" }, { text: `  3  18ms  ${tr[1]}`, kind: "out" }, { text: "Asteriscos (*) = salto sem resposta ICMP, não prova falha total.", kind: "sys" }];
  const ns = low.match(/^(nslookup|resolve-dnsname)\s+(\S+)$/);
  if (ns) return [...echo, { text: "Server: 192.168.1.1", kind: "out" }, { text: `Name: ${ns[2]}  Address: 10.40.8.25`, kind: "out" }, { text: "Compare com o IP autorizado antes de concluir.", kind: "sys" }];
  const tnc = low.match(/^(test-netconnection|tnc)\s+(\S+)\s+-port\s+(\d+)$/);
  if (tnc) return [...echo, { text: `ComputerName: ${tnc[2]}  RemotePort: ${tnc[3]}`, kind: "out" }, { text: "TcpTestSucceeded : True", kind: "out" }, { text: "Teste TCP direto na porta — camada do serviço.", kind: "sys" }];
  if (low === "get-netipconfiguration") return [...echo, { text: "Ethernet: 192.168.1.25 /24 · GW 192.168.1.1 · DNS 192.168.1.1", kind: "out" }];
  if (low === "get-netroute") return [...echo, { text: "0.0.0.0/0 → 192.168.1.1 (padrão) · 192.168.1.0/24 → on-link", kind: "out" }];
  return [...echo, { text: "Comando não reconhecido neste simulador. Digite help.", kind: "err" }];
}

const SEED: Line[] = [
  { text: "Terminal didático v1 — SIMULAÇÃO, nada executa no seu PC.", kind: "sys" },
  { text: "Digite help para ver os comandos.", kind: "sys" },
];

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>(SEED);
  const [value, setValue] = useState("");

  const run = () => {
    const cmd = value.trim().toLowerCase();
    if (!cmd) return;
    if (cmd === "cls" || cmd === "clear") { setLines(SEED); setValue(""); return; }
    setLines((l) => [...l, ...simulate(value)].slice(-120));
    setValue("");
  };

  return (
    <div className="space-y-4 max-w-3xl">
      <div>
        <p className="label">Laboratório seguro</p>
        <h1 className="text-2xl font-extrabold">Terminal didático</h1>
        <p className="text-sm text-muted mt-1">Respostas simuladas para treinar leitura de saída. <strong className="text-gold">Nenhum comando toca seu sistema.</strong></p>
      </div>
      <section className="rounded border border-line bg-black/60 shadow-panel overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line bg-panel">
          <span className="w-3 h-3 rounded-full bg-[#f19999]" /><span className="w-3 h-3 rounded-full bg-[#e7ac58]" /><span className="w-3 h-3 rounded-full bg-[#7fd6a4]" />
          <span className="ml-2 font-mono text-xs text-muted">CMD · simulação</span>
        </div>
        <div className="h-80 overflow-y-auto p-3 font-mono text-[13px] leading-relaxed" aria-live="polite">
          {lines.map((l, i) => (
            <p key={i} className={l.kind === "cmd" ? "text-bodytext font-bold" : l.kind === "err" ? "text-[#f19999]" : l.kind === "sys" ? "text-gold" : "text-accent"}>{l.text}</p>
          ))}
        </div>
        <form className="flex border-t border-line" onSubmit={(e) => { e.preventDefault(); run(); }}>
          <span className="px-3 py-2.5 font-mono text-sm text-accent">C:\lab&gt;</span>
          <input className="flex-1 bg-transparent outline-none font-mono text-sm px-1 py-2.5" value={value}
            onChange={(e) => setValue(e.target.value)} placeholder="help, ipconfig, ping 8.8.8.8…" aria-label="Comando simulado" autoComplete="off" />
          <button className="px-4 font-mono text-sm text-accent hover:text-white" type="submit">⏎</button>
        </form>
      </section>
      <section className="card">
        <p className="label">Missão de treino</p>
        <p className="text-sm">Descubra sem olhar a resposta: o IP é <code>169.254.20.12</code>. Quais 3 comandos contam a história completa? <details className="mt-1"><summary className="cursor-pointer text-accent text-sm font-semibold">Ver resposta</summary><p className="text-sm text-muted mt-1">ipconfig /all (APIPA, sem DHCP) → ping gateway (L2 OK?) → nslookup/Test-NetConnection (nome e porta). Cada saída prova uma camada.</p></details></p>
      </section>
    </div>
  );
}

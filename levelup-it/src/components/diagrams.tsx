"use client";

export const MODULE_HUE: Record<string, string> = {
  "m1-suporte": "#61c3b6",
  "m2-redes": "#6aa9ff",
  "m3-identidade": "#b79bff",
  "m4-powershell": "#e7ac58",
  "m5-linux": "#7fd6a4",
  "m6-seguranca": "#f19999",
  "m7-aws": "#f2b56b",
  "m8-sql-git": "#7cd6d6",
  "m9-carreira": "#d3e07c",
};

function Box({ children, hue }: { children: React.ReactNode; hue: string }) {
  return (
    <div className="rounded border border-line bg-black/25 px-3 py-2 text-center min-w-[92px]" style={{ borderTop: `3px solid ${hue}` }}>
      <div className="text-[13px] font-display font-bold leading-snug">{children}</div>
    </div>
  );
}

function Arrow() {
  return <span className="text-muted font-bold px-0.5" aria-hidden>→</span>;
}

export function Chain({ nodes, hue }: { nodes: string[]; hue: string }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1" role="img" aria-label={nodes.join(" → ")}>
      {nodes.map((n, i) => (
        <span key={n} className="flex items-center gap-1 shrink-0">
          {i > 0 && <Arrow />}
          <Box hue={hue}>{n}</Box>
        </span>
      ))}
    </div>
  );
}

export function FlowSteps({ steps, hue }: { steps: string[]; hue: string }) {
  return (
    <ol className="space-y-0">
      {steps.map((s, i) => (
        <li key={s} className="flex gap-3">
          <span className="flex flex-col items-center">
            <span className="grid place-items-center w-7 h-7 rounded-full font-mono text-xs font-bold shrink-0" style={{ background: `${hue}22`, border: `1px solid ${hue}`, color: hue }}>{i + 1}</span>
            {i < steps.length - 1 && <span className="w-px flex-1 bg-line" />}
          </span>
          <p className="text-sm pb-4 pt-1">{s}</p>
        </li>
      ))}
    </ol>
  );
}

export function LayerStack({ layers, hue }: { layers: { t: string; d: string }[]; hue: string }) {
  return (
    <div className="space-y-1.5" role="img" aria-label={"Camadas: " + layers.map((l) => l.t).join(", ")}>
      {layers.map((l, i) => (
        <div key={l.t} className="rounded border border-line bg-black/25 px-3 py-2" style={{ marginLeft: `${i * 10}px`, borderLeft: `3px solid ${hue}` }}>
          <p className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: hue }}>{l.t}</p>
          <p className="text-[13px] text-muted">{l.d}</p>
        </div>
      ))}
    </div>
  );
}

export function Bars({ items, hue }: { items: { label: string; pct: number; note?: string }[]; hue: string }) {
  return (
    <div className="space-y-2">
      {items.map((b) => (
        <div key={b.label}>
          <div className="flex justify-between text-[13px] mb-1"><span>{b.label}</span><span className="font-mono text-muted">{b.pct}%</span></div>
          <div className="h-2 bg-line/60 rounded-sm overflow-hidden"><div className="h-full rounded-sm" style={{ width: `${b.pct}%`, background: hue }} /></div>
          {b.note && <p className="text-xs text-muted mt-0.5">{b.note}</p>}
        </div>
      ))}
    </div>
  );
}

// Mapa: cada aula ganha um visual próprio (SVG/CSS, sem dependências)
const VISUALS: Record<string, JSX.Element> = {
  "m1-troubleshooting": <FlowSteps hue="#61c3b6" steps={["Escopo: 1 usuário ou vários?", "Fatos: mensagem, hora, mudanças", "3 hipóteses ordenadas", "1 teste por hipótese", "Correção autorizada", "Validar com o usuário"]} />,
  "m1-eventos": <Chain hue="#61c3b6" nodes={["Task Manager", "Serviços", "Eventos", "Causa"]} />,
  "m2-ipv4": <Chain hue="#6aa9ff" nodes={["IP + máscara", "Mesma rede? → direto", "Outra rede? → gateway"]} />,
  "m2-dns-portas": <LayerStack hue="#6aa9ff" layers={[{ t: "Nome (DNS)", d: "Resolve-DnsName → IP" }, { t: "Alcance (ICMP)", d: "ping → responde?" }, { t: "Serviço (TCP)", d: "Test-NetConnection -Port → abre?" }, { t: "App (HTTP/TLS)", d: "navegador / curl → responde?" }]} />,
  "m2-wireshark": <Chain hue="#6aa9ff" nodes={["DNS responde?", "SYN →", "← SYN-ACK?", "HTTP"]} />,
  "m3-ad": <Chain hue="#b79bff" nodes={["Usuário", "Grupos", "Share + NTFS", "GPO"]} />,
  "m3-gpo": <LayerStack hue="#b79bff" layers={[{ t: "OU (vence)", d: "mais próxima, salvo enforced" }, { t: "Domínio", d: "herdada" }, { t: "Site", d: "herdada" }, { t: "Local", d: "base" }]} />,
  "m3-intune": <Chain hue="#b79bff" nodes={["Enrollment", "Compliance", "Acesso Condicional"]} />,
  "m4-base": <Chain hue="#e7ac58" nodes={["Get-*", "| Where", "| Select"]} />,
  "m4-inventario": <FlowSteps hue="#e7ac58" steps={["param()", "Try/Catch por coleta", "Export-Csv", "git commit"]} />,
  "m5-linux": <Chain hue="#7fd6a4" nodes={["ls -l", "dono:grupo", "rwx", "serviço", "log"]} />,
  "m5-webssh": <Chain hue="#7fd6a4" nodes={["ssh-keygen", "authorized_keys 600", "teste chave", "restringir"]} />,
  "m5-backup": <Bars hue="#7fd6a4" items={[{ label: "Cópia 1 — servidor", pct: 100 }, { label: "Cópia 2 — outra mídia", pct: 100 }, { label: "Cópia 3 — externa", pct: 100, note: "3-2-1 + restore testado" }]} />,
  "m6-mfa": <LayerStack hue="#f19999" layers={[{ t: "Menor privilégio", d: "só o necessário + prazo" }, { t: "MFA", d: "senha vazada não basta" }, { t: "Sem segredo em texto", d: "cofre, nunca script/ticket" }]} />,
  "m7-zero": <Chain hue="#f2b56b" nodes={["Região", "VPC /16", "Sub-redes", "SG mínimo"]} />,
  "m7-ec2": <Bars hue="#f2b56b" items={[{ label: "EC2 ligada", pct: 55, note: "hora acumulada" }, { label: "EBS + snapshots", pct: 25 }, { label: "Transferência + IP", pct: 20 }]} />,
  "m7-rds-s3": <FlowSteps hue="#f2b56b" steps={["Standard 30d", "→ IA 60d", "→ expirar", "RDS: snapshot + restore testado"]} />,
  "m8-sql": <Chain hue="#7cd6d6" nodes={["FROM + WHERE", "JOIN pela chave", "GROUP BY + COUNT"]} />,
  "m8-git": <Chain hue="#7cd6d6" nodes={["init/add/commit", "log/diff", "push/pull"]} />,
  "m9-n2": <FlowSteps hue="#d3e07c" steps={["Situação + impacto", "Hipóteses e testes", "Ação com evidência", "Resultado + aprendizado"]} />,
};

export function LessonVisual({ id, moduleId }: { id: string; moduleId: string }) {
  const hue = MODULE_HUE[moduleId] ?? "#61c3b6";
  const v = VISUALS[id];
  if (!v) return null;
  return (
    <div className="rounded border border-line bg-panel p-4" style={{ borderTop: `3px solid ${hue}` }}>
      <p className="label">Mapa visual da aula</p>
      {v}
    </div>
  );
}

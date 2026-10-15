import { areaScores, type useStore } from "./store";

export type SkillLevel = "N1" | "N2" | "Infra" | "Cloud";
export type EvidenceKind = "lesson" | "lab" | "incident" | "project" | "diagnostic" | "interview";

export interface Evidence { kind: EvidenceKind; ref: string; label: string; href: string; }
export interface Skill { id: string; level: SkillLevel; name: string; evidence: Evidence[]; }

type Store = ReturnType<typeof useStore>["store"];

const L = (ref: string, label: string): Evidence => ({ kind: "lesson", ref, label, href: `/trilha/${ref}` });
const LAB = (ref: string, label: string): Evidence => ({ kind: "lab", ref, label, href: "/laboratorios" });
const INC = (ref: string, label: string): Evidence => ({ kind: "incident", ref, label, href: "/incidentes" });
const P = (ref: string, label: string): Evidence => ({ kind: "project", ref, label, href: "/projetos" });
const D = (ref: string): Evidence => ({ kind: "diagnostic", ref, label: `Diagnóstico ${ref} ≥70%`, href: "/diagnostico" });
const IV = (ref: string, label: string): Evidence => ({ kind: "interview", ref, label, href: "/entrevista" });

export const SKILLS: Skill[] = [
  { id: "s-trouble", level: "N1", name: "Troubleshooting metódico", evidence: [L("m1-troubleshooting", "Aula metodologia")] },
  { id: "s-windows", level: "N1", name: "Windows: eventos e serviços", evidence: [L("m1-eventos", "Aula Eventos/Serviços")] },
  { id: "s-ipv4", level: "N1", name: "IPv4, máscara e gateway", evidence: [L("m2-ipv4", "Aula IPv4"), LAB("lab-subnet", "Lab subnetting")] },
  { id: "s-dns", level: "N1", name: "DNS, portas e diagnóstico", evidence: [L("m2-dns-portas", "Aula DNS/portas"), LAB("lab-dns", "Lab DNS")] },
  { id: "s-psbase", level: "N1", name: "PowerShell seguro (leitura)", evidence: [L("m4-base", "Aula PowerShell")] },
  { id: "s-secbase", level: "N1", name: "Privilégio mínimo e MFA", evidence: [L("m6-mfa", "Aula segurança")] },
  { id: "s-wireshark", level: "N2", name: "Ler tráfego e handshake", evidence: [L("m2-wireshark", "Aula Wireshark"), LAB("lab-wireshark", "Lab trace")] },
  { id: "s-ad", level: "N2", name: "AD: usuários, grupos e acesso", evidence: [L("m3-ad", "Aula AD"), INC("inc-pasta-acesso", "Incidente pasta")] },
  { id: "s-gpo", level: "N2", name: "GPO: escopo e resultado", evidence: [L("m3-gpo", "Aula GPO"), LAB("lab-gpo-rsop", "Lab gpresult")] },
  { id: "s-rede-n2", level: "N2", name: "Incidentes de rede (3 provas)", evidence: [INC("inc-sem-internet", "Sem internet"), INC("inc-dns-interno", "DNS interno"), INC("inc-porta-443", "Porta 443")] },
  { id: "s-sistema-n2", level: "N2", name: "Serviço parado e lentidão", evidence: [INC("inc-servico-parado", "Spooler"), INC("inc-lentidao", "Lentidão")] },
  { id: "s-comunica", level: "N2", name: "Comunicar como N2 (nota ≥3)", evidence: [IV("iv-gestor", "Explicar p/ gestor"), IV("iv-star", "STAR")] },
  { id: "s-linux", level: "Infra", name: "Linux base e logs", evidence: [L("m5-linux", "Aula Linux"), LAB("lab-linux-logs", "Lab logs")] },
  { id: "s-webssh", level: "Infra", name: "Web + SSH com chaves", evidence: [L("m5-webssh", "Aula SSH"), LAB("lab-linux-ssh", "Lab nginx/SSH")] },
  { id: "s-backup", level: "Infra", name: "Backup com restore testado", evidence: [L("m5-backup", "Aula backup")] },
  { id: "s-script", level: "Infra", name: "Script de inventário + projeto", evidence: [L("m4-inventario", "Aula script"), P("p2-inventario", "Projeto inventário")] },
  { id: "s-sql", level: "Infra", name: "SQL para suporte", evidence: [L("m8-sql", "Aula SQL"), D("SQL e bancos de dados")] },
  { id: "s-identidade", level: "Infra", name: "Identidade e MFA na prática", evidence: [L("m3-intune", "Aula Intune"), INC("inc-auth-mfa", "Incidente MFA")] },
  { id: "s-awsbase", level: "Cloud", name: "Cloud base sem gastar", evidence: [L("m7-zero", "Aula AWS zero"), LAB("lab-aws-orcamento", "Lab orçamento")] },
  { id: "s-ec2", level: "Cloud", name: "EC2 + VPC planejados", evidence: [L("m7-ec2", "Aula EC2/VPC")] },
  { id: "s-dados", level: "Cloud", name: "S3 + RDS: durabilidade e custo", evidence: [L("m7-rds-s3", "Aula RDS/S3")] },
  { id: "s-nuvem", level: "Cloud", name: "Acesso e custo em nuvem", evidence: [INC("inc-vpn-nuvem", "VPN"), INC("inc-aws-custo", "Budget")] },
];

export function evidenceDone(e: Evidence, store: Store, ratings: Record<string, number>): boolean {
  switch (e.kind) {
    case "lesson": return !!store.completedLessons[e.ref];
    case "lab": return !!store.labDone[e.ref];
    case "incident": return !!store.incidentDone[e.ref];
    case "project": return store.projects.some((p) => p.id === e.ref && p.status === "done");
    case "diagnostic": return (areaScores(store.attempts)[e.ref] ?? 0) >= 70;
    case "interview": return (ratings[e.ref] ?? 0) >= 3;
  }
}

export function skillDone(s: Skill, store: Store, ratings: Record<string, number>): boolean {
  return s.evidence.every((e) => evidenceDone(e, store, ratings));
}

export function readiness(store: Store, ratings: Record<string, number>): { total: number; done: number; pct: number; missing: Skill[] } {
  const core = SKILLS.filter((s) => s.level === "N1" || s.level === "N2");
  const ok = core.filter((s) => skillDone(s, store, ratings));
  return { total: core.length, done: ok.length, pct: Math.round((ok.length / core.length) * 100), missing: core.filter((s) => !skillDone(s, store, ratings)) };
}

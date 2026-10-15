import { MODULES, LESSONS } from "./seed-tracks";
import { areaScores, dueReviews, lessonById } from "./store";
import type { StoreShape } from "./types";

export interface Recommendation { lessonId: string; reason: string; }

// Regra real (não lista fixa): revisões vencidas > lacunas do diagnóstico >
// próxima aula não concluída na ordem de pré-requisitos.
const AREA_TO_MODULE: Record<string, string> = {
  "Windows e troubleshooting": "m1-suporte",
  "Redes": "m2-redes",
  "TCP/IP, DNS, DHCP e portas": "m2-redes",
  "PowerShell": "m4-powershell",
  "Active Directory e usuários": "m3-identidade",
  "Microsoft 365": "m3-identidade",
  "Linux": "m5-linux",
  "Segurança": "m6-seguranca",
  "SQL e bancos de dados": "m8-sql-git",
  "Cloud e AWS": "m7-aws",
  "Git, programação e automação": "m8-sql-git",
};

export function recommend(store: StoreShape): Recommendation | null {
  const due = dueReviews(store.reviews);
  if (due.length) {
    const l = lessonById(due[0].lessonId);
    if (l && !store.completedLessons[l.id])
      return { lessonId: l.id, reason: `Revisão espaçada vencida (intervalo ${due[0].intervalDays}d, nota ${due[0].lastScore}).` };
    if (l) return { lessonId: l.id, reason: `Revisão de reforço vencida (nota anterior ${due[0].lastScore}).` };
  }
  const scores = areaScores(store.attempts);
  const weakest = Object.entries(scores).sort((a, b) => a[1] - b[1])[0];
  if (weakest && weakest[1] < 70) {
    const mod = AREA_TO_MODULE[weakest[0]];
    const cand = LESSONS.find((l) => l.moduleId === mod && l.status === "ready" && !store.completedLessons[l.id]);
    if (cand) return { lessonId: cand.id, reason: `Lacuna no diagnóstico: ${weakest[0]} (${weakest[1]}%).` };
  }
  for (const m of [...MODULES].sort((a, b) => a.order - b.order)) {
    const cand = LESSONS.find((l) => l.moduleId === m.id && l.status === "ready" && !store.completedLessons[l.id]);
    if (cand) {
      const missing = m.prereqs.filter((p) => {
        const pls = LESSONS.filter((l) => l.moduleId === p && l.status === "ready");
        return pls.length && !pls.every((l) => store.completedLessons[l.id]);
      });
      if (missing.length) continue;
      return { lessonId: cand.id, reason: `Próxima na trilha ${m.title}.` };
    }
  }
  // tudo concluído → reforço da menor nota
  const all = store.attempts.filter((a) => a.kind === "lesson").sort((a, b) => a.score - b.score)[0];
  if (all) return { lessonId: all.lessonId, reason: `Reforço: menor nota registrada (${all.score}%).` };
  return null;
}

export function goals30_60_90(store: StoreShape): { d30: string[]; d60: string[]; d90: string[] } {
  const scores = areaScores(store.attempts);
  const weak = Object.entries(scores).filter(([, v]) => v < 70).map(([k]) => k);
  const base = weak.length ? weak : ["Redes", "PowerShell"];
  return {
    d30: [`Elevar ${base[0]} a ≥70% (aula + lab + revisão 1/3/7d)`, "Concluir M1 e M2 com quiz ≥80%", "Registrar 2 incidentes reais anonimizados no Diário"],
    d60: [`Elevar ${base[1] ?? "Active Directory e usuários"} a ≥70%`, "Concluir M3+M4 e 2 projetos de portfólio", "Zerar revisões vencidas semanalmente"],
    d90: ["Simular entrevista N2 + currículo com resultados", "Concluir M5+M6 e base AWS com orçamento", "Portfólio com 4 projetos documentados"],
  };
}

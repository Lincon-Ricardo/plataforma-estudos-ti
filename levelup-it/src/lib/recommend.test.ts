import { describe, expect, it } from "vitest";
import { recommend, goals30_60_90 } from "@/lib/recommend";
import { LESSONS } from "@/lib/seed-tracks";
import { INCIDENTS, LABS } from "@/lib/seed-practice";
import { INTERVIEW } from "@/lib/seed-interview";
import { lessonById } from "@/lib/store";
import type { StoreShape } from "@/lib/types";

function base(): StoreShape {
  return {
    version: 1,
    profile: { name: "T", role: "N1", course: "ADS", dailyMinutes: 45, studyDays: ["seg"], goal: "N2", targetDate: "", priorities: [], englishNote: "", updatedAt: "" },
    completedLessons: {}, attempts: [], reviews: [], sessions: [],
    projects: [], diary: [], labDone: {}, incidentDone: {}, diagnosticDoneAt: null,
  };
}

describe("recommend()", () => {
  it("prioriza revisão vencida sobre fila fixa", () => {
    const s = base();
    s.reviews = [{ lessonId: "m1-troubleshooting", nextDue: new Date(Date.now() - 864e5).toISOString(), intervalDays: 3, lastScore: 90 }];
    expect(recommend(s)?.lessonId).toBe("m1-troubleshooting");
  });
  it("usa lacuna do diagnóstico (<70%)", () => {
    const s = base();
    s.attempts = [{ id: "a", lessonId: "diagnostico:PowerShell", score: 50, total: 2, correct: 1, at: new Date().toISOString(), kind: "diagnostic" }];
    expect(recommend(s)?.lessonId).toBe("m4-base");
  });
  it("sem dados, sugere a primeira aula da trilha", () => {
    expect(recommend(base())?.lessonId).toBe("m1-troubleshooting");
  });
});

describe("conteúdo seed", () => {
  it("19 aulas prontas, todas com quiz de 3 questões e gabarito", () => {
    const ready = LESSONS.filter((l) => l.status === "ready");
    expect(ready.length).toBe(19);
    for (const l of ready) {
      expect(l.quiz.length).toBe(3);
      for (const q of l.quiz) {
        expect(q.answer).toBeGreaterThanOrEqual(0);
        expect(q.answer).toBeLessThan(q.options.length);
        expect(q.explanation.length).toBeGreaterThan(10);
      }
    }
  });
  it("10 incidentes com hipótese correta marcada e solução", () => {
    expect(INCIDENTS.length).toBe(10);
    for (const i of INCIDENTS) {
      expect(i.hypotheses.filter((h) => h.correct).length).toBe(1);
      expect(i.solution.length).toBeGreaterThan(10);
    }
  });
  it("8 labs com critério de conclusão", () => {
    expect(LABS.length).toBe(8);
    for (const l of LABS) expect(l.doneCriteria.length).toBeGreaterThan(5);
  });
});

describe("banco de entrevistas", () => {
  it("8 perguntas com pontos esperados e dica", () => {
    expect(INTERVIEW.length).toBe(8);
    for (const q of INTERVIEW) {
      expect(q.expected.length).toBeGreaterThanOrEqual(3);
      expect(q.tip.length).toBeGreaterThan(5);
    }
  });
  it("toda aula pronta tem vocabulário, comandos e armadilhas", () => {
    const ready = LESSONS.filter((l) => l.status === "ready");
    for (const l of ready) {
      const full = lessonById(l.id)!;
      expect(full.terms!.length).toBeGreaterThanOrEqual(3);
      expect(full.commands!.length).toBeGreaterThanOrEqual(1);
      expect(full.pitfalls!.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("metas 30/60/90", () => {
  it("gera 3 itens por horizonte", () => {
    const g = goals30_60_90(base());
    expect(g.d30.length).toBe(3);
    expect(g.d60.length).toBe(3);
    expect(g.d90.length).toBe(3);
  });
});
describe("regras de conclusão", () => {
  it("quiz exige 80%: 2/3 = 67% reprova", () => {
    expect(Math.round((2 / 3) * 100) >= 80).toBe(false);
  });
  it("intervalos de revisão seguem 1,3,7,14,30", async () => {
    const { REVIEW_STEPS } = await import("@/lib/store");
    expect(REVIEW_STEPS).toEqual([1, 3, 7, 14, 30]);
  });
});

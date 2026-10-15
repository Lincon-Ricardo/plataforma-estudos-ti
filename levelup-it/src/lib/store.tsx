"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Attempt, Lesson, ReviewItem, StoreShape, UserProfile } from "./types";
import { LESSONS } from "./seed-tracks";
import { ENRICH } from "./seed-enrich";
import { MYTHS } from "./seed-deep";

const KEY = "levelup-it-v1";
export const REVIEW_STEPS = [1, 3, 7, 14, 30];

const DEFAULT_PROFILE: UserProfile = {
  name: "Lincon",
  role: "Suporte técnico N1",
  course: "Análise e Desenvolvimento de Sistemas (ADS)",
  dailyMinutes: 45,
  studyDays: ["seg", "ter", "qua", "qui", "sex"],
  goal: "Analista de Suporte N2 → Infraestrutura → Cloud/AWS",
  targetDate: "",
  priorities: ["Redes", "PowerShell", "Active Directory"],
  englishNote: "Lê documentação em inglês com dificuldade em termos complexos",
  updatedAt: new Date().toISOString(),
};

function defaultStore(): StoreShape {
  return {
    version: 1, profile: DEFAULT_PROFILE, completedLessons: {}, attempts: [],
    reviews: [], sessions: [], projects: [], diary: [], labDone: {},
    incidentDone: {}, diagnosticDoneAt: null,
  };
}

function load(): StoreShape {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return defaultStore();
    const parsed = { ...defaultStore(), ...JSON.parse(raw) };
    if (parsed.version !== 1) return defaultStore();
    return parsed;
  } catch { return defaultStore(); }
}

interface Ctx {
  store: StoreShape;
  ready: boolean;
  saveProfile(p: UserProfile): void;
  recordAttempt(a: Omit<Attempt, "id" | "at">): Attempt;
  completeLesson(lessonId: string): void;
  logSession(minutes: number, label: string): void;
  scheduleReview(lessonId: string, score: number): void;
  markLab(id: string): void;
  markIncident(id: string, score: string): void;
  markDiagnosticDone(): void;
  setProject(id: string, status: "doing" | "done", notes: string): void;
  addDiary(e: Omit<import("./types").DiaryEntry, "id" | "at">): void;
  exportJson(): string;
  importJson(json: string): boolean;
  resetAll(): void;
}

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<StoreShape>(defaultStore);
  const [ready, setReady] = useState(false);

  useEffect(() => { setStore(load()); setReady(true); }, []);
  useEffect(() => { if (ready) { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch {} } }, [store, ready]);

  const recordAttempt: Ctx["recordAttempt"] = useCallback((a) => {
    const attempt: Attempt = { ...a, id: Math.random().toString(36).slice(2), at: new Date().toISOString() };
    setStore((s) => ({ ...s, attempts: [...s.attempts, attempt] }));
    return attempt;
  }, []);

  const scheduleReview: Ctx["scheduleReview"] = useCallback((lessonId, score) => {
    setStore((s) => {
      const prev = s.reviews.find((r) => r.lessonId === lessonId);
      let interval = 1;
      if (score >= 80) {
        const idx = prev ? REVIEW_STEPS.indexOf(prev.intervalDays) : -1;
        interval = REVIEW_STEPS[Math.min(idx + 1, REVIEW_STEPS.length - 1)];
      } else interval = 1;
      const nextDue = new Date(Date.now() + interval * 864e5).toISOString();
      const rest = s.reviews.filter((r) => r.lessonId !== lessonId);
      return { ...s, reviews: [...rest, { lessonId, nextDue, intervalDays: interval, lastScore: score }] };
    });
  }, []);

  const completeLesson: Ctx["completeLesson"] = useCallback((lessonId) => {
    setStore((s) => ({ ...s, completedLessons: { ...s.completedLessons, [lessonId]: new Date().toISOString() } }));
  }, []);

  const ctx: Ctx = useMemo(() => ({
    store, ready,
    saveProfile: (p) => setStore((s) => ({ ...s, profile: { ...p, updatedAt: new Date().toISOString() } })),
    recordAttempt, completeLesson, scheduleReview,
    logSession: (minutes, label) => setStore((s) => ({ ...s, sessions: [...s.sessions, { id: Math.random().toString(36).slice(2), minutes, label, at: new Date().toISOString() }] })),
    markLab: (id) => setStore((s) => ({ ...s, labDone: { ...s.labDone, [id]: new Date().toISOString() } })),
    markDiagnosticDone: () => setStore((s) => ({ ...s, diagnosticDoneAt: new Date().toISOString() })),
    markIncident: (id, score) => setStore((s) => ({ ...s, incidentDone: { ...s.incidentDone, [id]: { score, at: new Date().toISOString() } } })),
    setProject: (id, status, notes) => setStore((s) => {
      const rest = s.projects.filter((p) => p.id !== id);
      return { ...s, projects: [...rest, { id, status, notes, updatedAt: new Date().toISOString() }] };
    }),
    addDiary: (e) => setStore((s) => ({ ...s, diary: [...s.diary, { ...e, id: Math.random().toString(36).slice(2), at: new Date().toISOString() }] })),
    exportJson: () => JSON.stringify(store, null, 2),
    importJson: (json) => { try { const p = JSON.parse(json); if (p.version !== 1 || !p.profile) return false; setStore(p); return true; } catch { return false; } },
    resetAll: () => setStore(defaultStore()),
  }), [store, ready, recordAttempt, completeLesson, scheduleReview]);

  return <StoreCtx.Provider value={ctx}>{children}</StoreCtx.Provider>;
}

export function useStore(): Ctx {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore fora do provider");
  return c;
}

export function lessonById(id: string): Lesson | undefined {
  const l = LESSONS.find((x) => x.id === id);
  if (!l) return undefined;
  return { ...l, ...(ENRICH[id] ?? {}), myth: MYTHS[id] };
}

export function moduleProgress(moduleId: string, completed: Record<string, string>): { total: number; done: number; pct: number } {
  const ls = LESSONS.filter((l) => l.moduleId === moduleId && l.status === "ready");
  const done = ls.filter((l) => completed[l.id]).length;
  return { total: ls.length, done, pct: ls.length ? Math.round((done / ls.length) * 100) : 0 };
}

export function areaScores(attempts: Attempt[]): Record<string, number> {
  // último score por área de diagnóstico
  const out: Record<string, number> = {};
  for (const a of attempts.filter((x) => x.kind === "diagnostic")) {
    const area = a.lessonId.replace("diagnostico:", "");
    out[area] = a.score;
  }
  return out;
}

export function weakAreas(attempts: Attempt[]): string[] {
  const scores = areaScores(attempts);
  const lessonScores: Record<string, number[]> = {};
  for (const a of attempts.filter((x) => x.kind === "lesson")) {
    const l = lessonById(a.lessonId);
    if (!l) continue;
    const area = l.moduleId;
    lessonScores[area] = [...(lessonScores[area] ?? []), a.score];
  }
  const weak = new Set<string>();
  for (const [k, v] of Object.entries(scores)) if (v < 70) weak.add(k);
  for (const [k, v] of Object.entries(lessonScores)) {
    const avg = v.reduce((x, y) => x + y, 0) / v.length;
    if (avg < 70) weak.add(k);
  }
  return [...weak];
}

export function dueReviews(reviews: ReviewItem[]): ReviewItem[] {
  const now = Date.now();
  return reviews.filter((r) => new Date(r.nextDue).getTime() <= now).sort((a, b) => +new Date(a.nextDue) - +new Date(b.nextDue));
}

// Level Up IT — tipos centrais (local-first, prontos p/ Supabase depois).
export type LessonStatus = "ready" | "planned";

export interface QuizOption { label: string; }
export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  objective: string;
  explanation: string[];
  example: string;
  demo: string[];
  guided: { task: string; hints: string[] };
  independent: string;
  quiz: QuizQuestion[];
  summary: string[];
  completionNote: string;
  status: LessonStatus;
}

export interface CareerModule {
  id: string;
  title: string;
  description: string;
  prereqs: string[];
  order: number;
}

export interface DiagnosticQuestion extends QuizQuestion { area: string; }

export interface Attempt {
  id: string;
  lessonId: string; // ou 'diagnostico:<area>' p/ diagnóstico
  score: number; // 0-100
  total: number;
  correct: number;
  at: string; // ISO
  kind: "lesson" | "diagnostic";
}

export interface ReviewItem {
  lessonId: string;
  nextDue: string; // ISO date
  intervalDays: number;
  lastScore: number;
}

export interface Incident {
  id: string;
  title: string;
  context: string;
  symptoms: string[];
  initialInfo: string;
  tools: string[];
  hypotheses: { id: string; label: string; correct: boolean; evidenceIfChosen: string }[];
  solution: string;
  techExplanation: string;
}

export interface Lab {
  id: string;
  title: string;
  prereqs: string[];
  objective: string;
  steps: { action: string; command?: string; expected: string; verify: string }[];
  pitfalls: string[];
  review: string[];
  doneCriteria: string;
  destructive: boolean;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  requirements: string[];
  steps: string[];
  tests: string[];
  quality: string[];
}

export interface ProjectState { id: string; status: "doing" | "done"; notes: string; updatedAt: string; }

export interface DiaryEntry {
  id: string;
  title: string;
  category: string;
  symptoms: string;
  tests: string;
  results: string;
  cause: string;
  solution: string;
  learned: string;
  different: string;
  at: string;
}

export interface UserProfile {
  name: string;
  role: string;
  course: string;
  dailyMinutes: number;
  studyDays: string[];
  goal: string;
  targetDate: string;
  priorities: string[];
  englishNote: string;
  updatedAt: string;
}

export interface StudySession { id: string; minutes: number; at: string; label: string; }

export interface StoreShape {
  version: 1;
  profile: UserProfile;
  completedLessons: Record<string, string>; // lessonId -> ISO
  attempts: Attempt[];
  reviews: ReviewItem[];
  sessions: StudySession[];
  projects: ProjectState[];
  diary: DiaryEntry[];
  labDone: Record<string, string>;
  incidentDone: Record<string, { score: string; at: string }>;
  diagnosticDoneAt: string | null;
}

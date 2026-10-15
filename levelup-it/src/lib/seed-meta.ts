// Metadados pedagógicos por aula (nível + duração estimada realista).
export interface LessonMeta { level: "base" | "intermediário"; minutes: number; }

export const LESSON_META: Record<string, LessonMeta> = {
  "m1-troubleshooting": { level: "base", minutes: 25 },
  "m1-eventos": { level: "base", minutes: 25 },
  "m2-ipv4": { level: "base", minutes: 30 },
  "m2-dns-portas": { level: "base", minutes: 30 },
  "m2-wireshark": { level: "intermediário", minutes: 35 },
  "m3-ad": { level: "base", minutes: 30 },
  "m3-gpo": { level: "intermediário", minutes: 35 },
  "m3-intune": { level: "intermediário", minutes: 30 },
  "m4-base": { level: "base", minutes: 30 },
  "m4-inventario": { level: "intermediário", minutes: 40 },
  "m5-linux": { level: "base", minutes: 30 },
  "m5-webssh": { level: "intermediário", minutes: 35 },
  "m5-backup": { level: "intermediário", minutes: 30 },
  "m6-mfa": { level: "base", minutes: 25 },
  "m7-zero": { level: "base", minutes: 25 },
  "m7-ec2": { level: "intermediário", minutes: 30 },
  "m7-rds-s3": { level: "intermediário", minutes: 30 },
  "m8-sql": { level: "base", minutes: 35 },
  "m8-git": { level: "base", minutes: 30 },
  "m9-n2": { level: "base", minutes: 25 },
};

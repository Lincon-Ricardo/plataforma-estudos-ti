// Base curricular: frameworks de referência + vídeos e docs verificados.
// Vídeos: IDs do YouTube confirmados via pesquisa (out/2026). Se algum sair do ar,
// o app continua 100% funcional — o vídeo é apoio, nunca requisito.

export interface MediaDoc { label: string; url: string; }
export interface MediaVideo { yt: string; title: string; channel: string; }
export interface ModuleMedia { framework: string; videos: MediaVideo[]; docs: MediaDoc[]; }

export const MODULE_MEDIA: Record<string, ModuleMedia> = {
  "m1-suporte": {
    framework: "CompTIA A+ (Core 1: hardware, SO, troubleshooting) · ITIL: incidente × requisição",
    videos: [],
    docs: [
      { label: "CompTIA A+ — objetivos oficiais", url: "https://www.comptia.org" },
      { label: "Microsoft Learn — Windows Server", url: "https://learn.microsoft.com/windows-server/" },
    ],
  },
  "m2-redes": {
    framework: "CompTIA Network+ (N10-009) · Cisco CCNA 200-301: endereçamento, DNS/DHCP, diagnóstico",
    videos: [
      { yt: "UHRPtNZ_Rz4", title: "Subnetting — Neso Academy", channel: "Neso Academy" },
      { yt: "hqPrahVn5E4", title: "DNS Explained: How DNS Works", channel: "YouTube" },
    ],
    docs: [
      { label: "CompTIA Network+ — objetivos oficiais", url: "https://www.comptia.org" },
      { label: "Wireshark — documentação oficial", url: "https://www.wireshark.org/docs/" },
    ],
  },
  "m3-identidade": {
    framework: "Microsoft Learn: AD DS + Entra ID · SC-300 (identidade e acesso)",
    videos: [{ yt: "i9I5poSokow", title: "What is Active Directory? Overview", channel: "YouTube" }],
    docs: [
      { label: "Microsoft Learn — PowerShell/Windows", url: "https://learn.microsoft.com" },
      { label: "Microsoft Learn — Windows Server", url: "https://learn.microsoft.com/windows-server/" },
    ],
  },
  "m4-powershell": {
    framework: "Microsoft Learn: automatizar com PowerShell (inclui curso do criador da linguagem)",
    videos: [{ yt: "UVUd9_k9C6A", title: "PowerShell Jump Start (Jeffrey Snover, criador do PowerShell)", channel: "Microsoft" }],
    docs: [{ label: "Microsoft Learn — documentação PowerShell", url: "https://learn.microsoft.com/powershell/" }],
  },
  "m5-linux": {
    framework: "Linux Foundation (LFS101) · CompTIA Linux+ (XK0): terminal, permissões, serviços",
    videos: [{ yt: "16d2lHc0Pe8", title: "Linux Command Line for Beginners", channel: "Keep On Coding" }],
    docs: [
      { label: "Kernel.org — documentação", url: "https://www.kernel.org/doc/html/latest/" },
      { label: "freeCodeCamp — cursos gratuitos", url: "https://www.freecodecamp.org" },
    ],
  },
  "m6-seguranca": {
    framework: "CompTIA Security+ (SY0-701) · Microsoft SC-900 (conceitos de segurança)",
    videos: [],
    docs: [
      { label: "CompTIA Security+ — objetivos oficiais", url: "https://www.comptia.org" },
      { label: "Microsoft Learn — segurança", url: "https://learn.microsoft.com" },
    ],
  },
  "m7-aws": {
    framework: "AWS Skill Builder · CLF-C02 (Cloud Practitioner): regiões, IAM, EC2, S3, VPC, custo",
    videos: [{ yt: "sMIxdOfZiLo", title: "AWS VPC Tutorial for Beginners", channel: "YouTube" }],
    docs: [
      { label: "AWS Docs — documentação oficial", url: "https://docs.aws.amazon.com" },
      { label: "AWS Skill Builder — treinamento", url: "https://training.aws.amazon.com" },
    ],
  },
  "m8-sql-git": {
    framework: "freeCodeCamp: SQL + bancos relacionais · GitHub Skills (versionamento)",
    videos: [{ yt: "HXV3zeQKqGY", title: "SQL Full Course for Beginners (Mike Dane)", channel: "freeCodeCamp" }],
    docs: [{ label: "freeCodeCamp — currículo gratuito", url: "https://www.freecodecamp.org" }],
  },
  "m9-carreira": {
    framework: "Prática deliberada (Ericsson) · STAR para entrevistas comportamentais",
    videos: [],
    docs: [{ label: "GitHub Skills — pratique versionamento", url: "https://skills.github.com" }],
  },
};

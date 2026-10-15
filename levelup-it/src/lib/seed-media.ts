// Base curricular: frameworks + vídeos (PT-BR primeiro) e docs verificados.
// Vídeos: IDs do YouTube confirmados via pesquisa. Se algum sair do ar,
// o app continua 100% funcional — vídeo é apoio, nunca requisito.

export interface MediaDoc { label: string; url: string; lang: "PT-BR" | "EN"; }
export interface MediaVideo { yt: string; title: string; channel: string; lang: "PT-BR" | "EN"; }
export interface ModuleMedia { framework: string; videos: MediaVideo[]; docs: MediaDoc[]; }

export const MODULE_MEDIA: Record<string, ModuleMedia> = {
  "m1-suporte": {
    framework: "CompTIA A+ (Core 1: hardware, SO, troubleshooting) · ITIL: incidente × requisição",
    videos: [],
    docs: [
      { label: "Microsoft Learn em português — Windows Server", url: "https://learn.microsoft.com/pt-br/windows-server/", lang: "PT-BR" },
      { label: "CompTIA A+ — objetivos oficiais", url: "https://www.comptia.org", lang: "EN" },
    ],
  },
  "m2-redes": {
    framework: "CompTIA Network+ (N10-009) · Cisco CCNA 200-301: endereçamento, DNS/DHCP, diagnóstico",
    videos: [
      { yt: "h5JsGKLVLtg", title: "Cálculo de sub-rede na prática (Packet Tracer)", channel: "Hardware Redes Brasil", lang: "PT-BR" },
      { yt: "BBZkBVJJR-c", title: "Interação HTTP no Wireshark", channel: "LB Tecnologia", lang: "PT-BR" },
      { yt: "UHRPtNZ_Rz4", title: "Subnetting — Neso Academy", channel: "Neso Academy", lang: "EN" },
      { yt: "hqPrahVn5E4", title: "DNS Explained: How DNS Works", channel: "YouTube", lang: "EN" },
    ],
    docs: [
      { label: "Como o DNS funciona — quadrinho animado em PT-BR", url: "https://howdns.works/pt/video", lang: "PT-BR" },
      { label: "CompTIA Network+ — objetivos oficiais", url: "https://www.comptia.org", lang: "EN" },
      { label: "Wireshark — documentação oficial", url: "https://www.wireshark.org/docs/", lang: "EN" },
    ],
  },
  "m3-identidade": {
    framework: "Microsoft Learn: AD DS + Entra ID · SC-300 (identidade e acesso)",
    videos: [{ yt: "i9I5poSokow", title: "What is Active Directory? Overview", channel: "YouTube", lang: "EN" }],
    docs: [
      { label: "Active Directory — Wikipédia em português", url: "https://pt.wikipedia.org/wiki/Active_Directory", lang: "PT-BR" },
      { label: "O que é Active Directory? (Paessler, em PT-BR)", url: "https://www.paessler.com/br/it-explained/active-directory", lang: "PT-BR" },
      { label: "Microsoft Learn — Windows Server", url: "https://learn.microsoft.com/pt-br/windows-server/", lang: "PT-BR" },
    ],
  },
  "m4-powershell": {
    framework: "Microsoft Learn: automatizar com PowerShell (inclui curso do criador da linguagem)",
    videos: [{ yt: "UVUd9_k9C6A", title: "PowerShell Jump Start (Jeffrey Snover, criador do PowerShell)", channel: "Microsoft", lang: "EN" }],
    docs: [
      { label: "PowerShell para iniciantes — série em português (MS Learn)", url: "https://learn.microsoft.com/pt-br/shows/mvp-windows-and-devices-for-it/powershell-beginners", lang: "PT-BR" },
      { label: "Introdução ao PowerShell — PT-BR (MS Learn)", url: "https://learn.microsoft.com/pt-br/powershell/scripting/learn/ps101/01-getting-started", lang: "PT-BR" },
      { label: "PowerShell docs (EN)", url: "https://learn.microsoft.com/powershell/", lang: "EN" },
    ],
  },
  "m5-linux": {
    framework: "Linux Foundation (LFS101) · CompTIA Linux+ (XK0): terminal, permissões, serviços",
    videos: [
      { yt: "ikfas1hfcI4", title: "Curso Completo de Linux — terminal Ubuntu", channel: "YouTube", lang: "PT-BR" },
      { yt: "16d2lHc0Pe8", title: "Linux Command Line for Beginners", channel: "Keep On Coding", lang: "EN" },
    ],
    docs: [
      { label: "Kernel.org — documentação", url: "https://www.kernel.org/doc/html/latest/", lang: "EN" },
      { label: "freeCodeCamp — cursos gratuitos", url: "https://www.freecodecamp.org", lang: "EN" },
    ],
  },
  "m6-seguranca": {
    framework: "CompTIA Security+ (SY0-701) · Microsoft SC-900 (conceitos de segurança)",
    videos: [],
    docs: [
      { label: "Microsoft Learn em português — segurança", url: "https://learn.microsoft.com/pt-br/", lang: "PT-BR" },
      { label: "CompTIA Security+ — objetivos oficiais", url: "https://www.comptia.org", lang: "EN" },
    ],
  },
  "m7-aws": {
    framework: "AWS Skill Builder · CLF-C02 (Cloud Practitioner): regiões, IAM, EC2, S3, VPC, custo",
    videos: [
      { yt: "bff9Sx9URkY", title: "AWS para Iniciantes — jornada na nuvem (DIO)", channel: "DIO", lang: "PT-BR" },
      { yt: "sMIxdOfZiLo", title: "AWS VPC Tutorial for Beginners", channel: "YouTube", lang: "EN" },
    ],
    docs: [
      { label: "AWS Docs em português", url: "https://docs.aws.amazon.com/pt_br/", lang: "PT-BR" },
      { label: "AWS Docs (EN)", url: "https://docs.aws.amazon.com", lang: "EN" },
      { label: "AWS Skill Builder — treinamento", url: "https://training.aws.amazon.com", lang: "EN" },
    ],
  },
  "m8-sql-git": {
    framework: "freeCodeCamp: SQL + bancos relacionais · GitHub Skills (versionamento)",
    videos: [
      { yt: "G7bMwefn8RQ", title: "Curso SQL Completo [Iniciantes] + desafios", channel: "Dev Aprender", lang: "PT-BR" },
      { yt: "HXV3zeQKqGY", title: "SQL Full Course for Beginners (Mike Dane)", channel: "freeCodeCamp", lang: "EN" },
    ],
    docs: [{ label: "freeCodeCamp — currículo gratuito", url: "https://www.freecodecamp.org", lang: "EN" }],
  },
  "m9-carreira": {
    framework: "Prática deliberada (Ericsson) · STAR para entrevistas comportamentais",
    videos: [],
    docs: [{ label: "GitHub Skills — pratique versionamento", url: "https://skills.github.com", lang: "EN" }],
  },
};

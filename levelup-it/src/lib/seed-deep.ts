// Aprofundamento: mito × verdade + pontes aula → prática.
export interface Myth { myth: string; truth: string; }
export interface LessonLinks { labs: string[]; incidents: string[]; pages: { href: string; label: string }[]; }

export const MYTHS: Record<string, Myth> = {
  "m1-troubleshooting": { myth: "Bom técnico é o que resolve mais rápido.", truth: "Rapidez sem evidência gera retrabalho. O N2 prova a causa e valida com o usuário." },
  "m1-eventos": { myth: "Reiniciar resolve tudo.", truth: "Reiniciar sem ler o log apaga a evidência; a causa volta no próximo boot." },
  "m2-ipv4": { myth: "IPs parecidos estão na mesma rede.", truth: "Só o prefixo/máscara define a rede. 192.168.1.70/26 e .130/26 são redes distintas." },
  "m2-dns-portas": { myth: "Ping OK significa rede OK.", truth: "Ping testa ICMP. A aplicação usa TCP/porta + TLS/HTTP — teste cada camada." },
  "m2-wireshark": { myth: "O Wireshark mostra a causa do problema.", truth: "Ele mostra pacotes. A causa é a sua conclusão correlacionando DNS, handshake e app." },
  "m3-ad": { myth: "Acesso negado é senha errada.", truth: "Autenticação ≠ autorização. Confira grupo, share, NTFS e GPO." },
  "m3-gpo": { myth: "GPO nova aplica na hora para todos.", truth: "Há intervalo de refresh; reboot/logoff ou gpupdate (com cautela) antecipam." },
  "m3-intune": { myth: "MDM serve para espionar o funcionário.", truth: "Gerencia controles corporativos e conformidade; entenda o escopo antes de julgar." },
  "m4-base": { myth: "PowerShell é só o cmd azul.", truth: "Ele trafega objetos no pipeline — filtrar por propriedade, não por texto." },
  "m4-inventario": { myth: "Script pronto da internet é confiável.", truth: "Leia linha a linha, teste com -WhatIf e versione antes de usar." },
  "m5-linux": { myth: "Linux não dá erro nem tem malware.", truth: "Dá — e o log (journalctl) e as permissões contam a história." },
  "m5-webssh": { myth: "Com chave SSH não preciso de mais cuidado.", truth: "Chave privada vazada é acesso total: passphrase + permissão 600 + origem restrita." },
  "m5-backup": { myth: "Copiar para outro HD já é backup.", truth: "Sem 3-2-1, retenção, checksum e restore testado, é só uma cópia." },
  "m6-mfa": { myth: "Com MFA estou 100% seguro.", truth: "O risco cai drasticamente, mas phishing e SIM swap existem — prefira app autenticador." },
  "m7-zero": { myth: "Nuvem é só alugar um servidor.", truth: "Identidade, rede, custo e operação mudam completamente o jogo." },
  "m7-ec2": { myth: "Desligar a VM zera a conta.", truth: "Stop zera CPU; EBS, snapshots e IP elástico continuam cobrando." },
  "m7-rds-s3": { myth: "Na nuvem o backup é automático.", truth: "O automático retém dias; snapshot, lifecycle e teste de restore são seu trabalho." },
  "m8-sql": { myth: "SELECT * é inofensivo.", truth: "Em tabela grande trava banco e rede. Selecione colunas e filtre no banco." },
  "m8-git": { myth: "Git é um backup na nuvem.", truth: "É histórico versionado: sem remoto, disciplina e .gitignore, não protege nada." },
  "m9-n2": { myth: "Certificado garante a vaga.", truth: "O que decide é artefato reproduzível + raciocínio em voz alta na entrevista." },
};

export const LINKS: Record<string, LessonLinks> = {
  "m1-troubleshooting": { labs: [], incidents: ["inc-sem-internet"], pages: [] },
  "m1-eventos": { labs: [], incidents: ["inc-servico-parado", "inc-lentidao"], pages: [] },
  "m2-ipv4": { labs: ["lab-subnet"], incidents: [], pages: [{ href: "/ferramentas", label: "Calculadora de sub-redes" }] },
  "m2-dns-portas": { labs: ["lab-dns"], incidents: ["inc-dns-interno", "inc-porta-443"], pages: [] },
  "m2-wireshark": { labs: ["lab-wireshark"], incidents: [], pages: [] },
  "m3-ad": { labs: [], incidents: ["inc-pasta-acesso"], pages: [] },
  "m3-gpo": { labs: ["lab-gpo-rsop"], incidents: [], pages: [] },
  "m3-intune": { labs: [], incidents: ["inc-auth-mfa"], pages: [] },
  "m4-base": { labs: [], incidents: [], pages: [{ href: "/terminal", label: "Terminal didático" }] },
  "m4-inventario": { labs: ["lab-ps-inventario"], incidents: [], pages: [] },
  "m5-linux": { labs: ["lab-linux-logs"], incidents: [], pages: [] },
  "m5-webssh": { labs: ["lab-linux-ssh"], incidents: [], pages: [] },
  "m5-backup": { labs: [], incidents: [], pages: [] },
  "m6-mfa": { labs: [], incidents: ["inc-auth-mfa"], pages: [] },
  "m7-zero": { labs: ["lab-aws-orcamento"], incidents: [], pages: [] },
  "m7-ec2": { labs: [], incidents: ["inc-aws-custo"], pages: [] },
  "m7-rds-s3": { labs: [], incidents: ["inc-aws-custo"], pages: [] },
  "m8-sql": { labs: [], incidents: [], pages: [] },
  "m8-git": { labs: [], incidents: [], pages: [] },
  "m9-n2": { labs: [], incidents: [], pages: [{ href: "/entrevista", label: "Simulação de entrevista" }] },
};

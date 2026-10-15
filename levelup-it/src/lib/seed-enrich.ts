import type { Lesson } from "./types";

type Enrich = Pick<Lesson, "terms" | "commands" | "pitfalls">;

export const ENRICH: Record<string, Enrich> = {
  "m1-troubleshooting": {
    terms: [
      { en: "troubleshooting", pt: "solução metódica de problemas (não chute)" },
      { en: "incident × request", pt: "incidente = algo quebrou; requisição = pedido padrão" },
      { en: "workaround", pt: "contorno paliativo até a correção definitiva" },
      { en: "SLA", pt: "acordo de prazo/qualidade do atendimento" },
    ],
    commands: [
      { cmd: "eventvwr", out: "Abre o Visualizador de Eventos (leitura)." },
      { cmd: "services.msc", out: "Lista serviços, status e tipo de inicialização." },
      { cmd: "perfmon /rel", out: "Monitor de Confiabilidade: linha do tempo de falhas." },
    ],
    pitfalls: ["Pular a definição de escopo e tratar caso isolado como geral.", "Aplicar 2+ mudanças de uma vez (impossível saber o que resolveu).", "Fechar o chamado sem repetir o teste com o usuário."],
  },
  "m1-eventos": {
    terms: [
      { en: "Event Viewer", pt: "Visualizador de Eventos do Windows" },
      { en: "Event ID", pt: "código do evento — pesquise com Origem + ID" },
      { en: "startup impact", pt: "impacto do programa na inicialização (Task Manager)" },
      { en: "crash", pt: "falha/travamento com encerramento" },
    ],
    commands: [
      { cmd: "eventvwr", out: "Logs do Windows → Sistema/Aplicativo; filtre por hora." },
      { cmd: "services.msc", out: "Status e inicialização de cada serviço." },
      { cmd: "Get-WinEvent -LogName System -MaxEvents 20", out: "Últimos 20 eventos do log Sistema no PowerShell." },
    ],
    pitfalls: ["Desabilitar serviço sem checar dependências.", "Tratar Warning como causa sem correlacionar hora.", "Ler log de adaptador/serviço errado (interface desconectada)."],
  },
  "m2-ipv4": {
    terms: [
      { en: "subnet mask", pt: "máscara que separa rede de host" },
      { en: "gateway", pt: "porta de saída para outras redes" },
      { en: "broadcast", pt: "endereço que fala com todos da sub-rede" },
      { en: "lease", pt: "concessão temporária de IP via DHCP" },
    ],
    commands: [
      { cmd: "ipconfig /all", out: "IPv4, máscara, gateway, DNS, servidor DHCP, lease." },
      { cmd: "Get-NetIPConfiguration", out: "Mesmo retrato, por interface, no PowerShell." },
      { cmd: "route print", out: "Tabela de rotas IPv4 do computador." },
    ],
    pitfalls: ["Comparar IPs sem olhar a máscara/prefixo.", "Achar que .0 é host válido ou que .1 é sempre o gateway.", "Ver APIPA e só renovar o lease sem investigar."],
  },
  "m2-dns-portas": {
    terms: [
      { en: "timeout", pt: "sem resposta no prazo — causa aberta" },
      { en: "connection refused", pt: "chegou, mas a porta recusou" },
      { en: "FQDN", pt: "nome completo (host + domínio)" },
      { en: "TTL", pt: "tempo de vida do registro em cache" },
    ],
    commands: [
      { cmd: "Resolve-DnsName portal.interno.local", out: "Nome, tipo de registro, IP, TTL e servidor que respondeu." },
      { cmd: "Test-NetConnection portal -Port 443", out: "TcpTestSucceeded True/False + resolução." },
      { cmd: "nslookup portal.interno.local", out: "Servidor consultado + endereço resolvido." },
    ],
    pitfalls: ["Usar ping como prova de porta aberta.", "Limpar cache DNS antes de anotar a resposta original.", "Ler 'refused' e 'timeout' como a mesma coisa."],
  },
  "m2-wireshark": {
    terms: [
      { en: "capture", pt: "gravação de pacotes da interface" },
      { en: "display filter", pt: "filtro do que é exibido (não apaga nada)" },
      { en: "handshake", pt: "aperto de mão SYN/SYN-ACK/ACK" },
      { en: "retransmission", pt: "reenvio por falta de confirmação" },
    ],
    commands: [
      { cmd: "capture filter: host 192.168.1.25", out: "Grava só tráfego desse host (menos disco/ruído)." },
      { cmd: "display: tcp.port==443", out: "Mostra só a porta HTTPS na análise." },
      { cmd: "display: dns", out: "Só queries e responses DNS." },
    ],
    pitfalls: ["Capturar rede corporativa/produção sem autorização.", "Guardar trace com senha/token em texto claro.", "Concluir app com bug vendo só retransmissão (é transporte)."],
  },
  "m3-ad": {
    terms: [
      { en: "OU (Organizational Unit)", pt: "pasta administrativa que organiza usuários e recebe GPO" },
      { en: "GPO", pt: "política aplicada a site/domínio/OU" },
      { en: "share × NTFS", pt: "permissão de rede × permissão do disco (vence a menor)" },
      { en: "inheritance", pt: "herança de permissões/políticas" },
    ],
    commands: [
      { cmd: "whoami /groups", out: "Grupos do usuário atual (base do acesso)." },
      { cmd: "gpresult /r", out: "GPOs aplicadas e negadas + motivo." },
      { cmd: "net user <login> /domain", out: "Dados da conta no domínio." },
    ],
    pitfalls: ["Dar 'Everyone Full' para testar.", "Olhar só NTFS e esquecer o compartilhamento.", "Mudar grupo e não aguardar replicação/logoff."],
  },
  "m3-gpo": {
    terms: [
      { en: "link", pt: "vínculo da GPO a site/domínio/OU" },
      { en: "enforced", pt: "imposta: vence bloqueio de herança" },
      { en: "filtering", pt: "filtro de segurança/WMI: quem recebe" },
      { en: "RSoP", pt: "conjunto resultante de políticas (o que valeu)" },
    ],
    commands: [
      { cmd: "gpresult /r", out: "Aplicadas × negadas com motivo." },
      { cmd: "gpresult /h relatorio.html", out: "Relatório navegável do resultado." },
      { cmd: "gpupdate /force", out: "Força atualização — evite em produção sem necessidade." },
    ],
    pitfalls: ["Rodar gpupdate /force em horário crítico.", "Editar GPO sem backup, aprovação e janela.", "Esquecer filtro de segurança e culpar a rede."],
  },
  "m3-intune": {
    terms: [
      { en: "enrollment", pt: "registro do dispositivo no gerenciamento" },
      { en: "compliance", pt: "conformidade com as regras exigidas" },
      { en: "conditional access", pt: "acesso condicional: só entra se conforme" },
      { en: "tenant", pt: "locatário: sua organização na nuvem" },
    ],
    commands: [
      { cmd: "dsregcmd /status", out: "Estado de junção Entra/MDM do dispositivo." },
      { cmd: "whoami /upn", out: "UPN da conta (confere identidade usada)." },
    ],
    pitfalls: ["Registrar dispositivo real da empresa no trial.", "Abandonar o trial ativo (vira exposição/cobrança).", "Confundir portal pessoal com portal corporativo."],
  },
  "m4-base": {
    terms: [
      { en: "cmdlet", pt: "comando PowerShell verbo-substantivo (Get-, Test-)" },
      { en: "pipeline (|)", pt: "encadeia objetos entre comandos" },
      { en: "object", pt: "dado com propriedades (não texto solto)" },
      { en: "-WhatIf", pt: "simula a ação sem executar" },
    ],
    commands: [
      { cmd: "Get-Help Get-Service -Examples", out: "Exemplos reais de uso do cmdlet." },
      { cmd: "Get-Service | Where {$_.Status -eq 'Running'}", out: "Só serviços em execução (leitura)." },
      { cmd: "Get-Process | Sort CPU -Desc | Select -First 5 Name, CPU", out: "Top 5 por CPU." },
    ],
    pitfalls: ["Rodar Set-/Remove-/Stop- sem -WhatIf e sem autorização.", "Tratar saída como texto e quebrar com formatação regional.", "Copiar script da internet sem ler cada linha."],
  },
  "m4-inventario": {
    terms: [
      { en: "parameter", pt: "parâmetro de entrada do script (param())" },
      { en: "Try/Catch", pt: "tenta e trata o erro sem abortar" },
      { en: "CSV", pt: "planilha texto com vírgulas/ponto-vírgula" },
      { en: "execution policy", pt: "política que regula scripts" },
    ],
    commands: [
      { cmd: "Get-ExecutionPolicy -List", out: "Política por escopo (entenda antes de mudar)." },
      { cmd: "... | Export-Csv inv.csv -NoTypeInformation", out: "CSV limpo, pronto para Excel." },
      { cmd: "git add inv.ps1; git commit -m 'inventario: ...'", out: "Versão registrada com motivo." },
    ],
    pitfalls: ["Senha/credencial dentro do .ps1.", "Um item com erro abortar a coleta inteira.", "Mudar ExecutionPolicy sem entender o escopo."],
  },
  "m5-linux": {
    terms: [
      { en: "permission (rwx)", pt: "leitura, escrita, execução" },
      { en: "owner:group", pt: "dono e grupo do arquivo" },
      { en: "man <cmd>", pt: "manual do comando" },
      { en: "sudo", pt: "executa como superusuário (com cautela)" },
    ],
    commands: [
      { cmd: "ls -l /var/www", out: "Dono, grupo e modo de cada arquivo." },
      { cmd: "systemctl status sshd --no-pager", out: "Ativo? há erro? desde quando?" },
      { cmd: "journalctl -u sshd --since '1 hour ago' | tail", out: "Evidência recente do serviço." },
    ],
    pitfalls: ["chmod 777 'para funcionar'.", "sudo em comando copiado sem entender.", "rm -rf com caminho errado ou variável vazia."],
  },
  "m5-webssh": {
    terms: [
      { en: "key pair", pt: "par de chaves pública + privada" },
      { en: "passphrase", pt: "frase de proteção da chave privada" },
      { en: "fingerprint", pt: "impressão digital para conferir o servidor" },
      { en: "authorized_keys", pt: "arquivo com as chaves permitidas (600)" },
    ],
    commands: [
      { cmd: "ssh-keygen -t ed25519", out: "Gera o par (proteja a privada + passphrase)." },
      { cmd: "ssh-copy-id user@vm", out: "Instala sua pública na VM." },
      { cmd: "ss -tlnp | grep :22", out: "Confirma o SSH em escuta." },
    ],
    pitfalls: [".ssh com permissão aberta (sshd ignora a chave).", "Desativar senha antes de provar que a chave funciona.", "Expor a porta 22 para a internet."],
  },
  "m5-backup": {
    terms: [
      { en: "snapshot", pt: "foto pontual dos dados" },
      { en: "retention", pt: "retenção: quanto tempo guardar" },
      { en: "checksum", pt: "assinatura que prova integridade" },
      { en: "restore", pt: "recuperação a partir do backup" },
    ],
    commands: [
      { cmd: "tar -czf site-$(date +%F).tar.gz /var/www", out: "Arquivo versionado por data." },
      { cmd: "rsync -av --dry-run origem/ destino/", out: "Mostra o que copiaria (-n = sem executar)." },
      { cmd: "sha256sum backup.tar.gz", out: "Assinatura para conferir no restore." },
    ],
    pitfalls: ["Backup nunca testado (promessa, não proteção).", "--delete sem dry-run espelhando apagamento errado.", "Guardar a única cópia no mesmo disco."],
  },
  "m6-mfa": {
    terms: [
      { en: "least privilege", pt: "menor privilégio: só o necessário" },
      { en: "MFA / 2FA", pt: "múltiplos fatores de autenticação" },
      { en: "phishing", pt: "golpe que rouba credencial/confiança" },
      { en: "audit", pt: "auditoria: quem fez o quê e quando" },
    ],
    commands: [
      { cmd: "whoami /groups", out: "Seus grupos/privilégios atuais." },
      { cmd: "net accounts", out: "Política local de senha/bloqueio." },
    ],
    pitfalls: ["Senha em ticket, script, print ou planilha.", "Conta admin para uso diário.", "Adiar update crítico 'para depois'."],
  },
  "m7-zero": {
    terms: [
      { en: "region", pt: "região: área geográfica da nuvem" },
      { en: "AZ", pt: "zona de disponibilidade: datacenter isolado" },
      { en: "IAM", pt: "identidade e permissões" },
      { en: "free tier", pt: "cota gratuita com limites" },
    ],
    commands: [
      { cmd: "aws --version", out: "Confere CLI instalada (sem credencial, sem custo)." },
    ],
    pitfalls: ["Usar usuário root no dia a dia (crie IAM + MFA).", "Criar recurso antes do Budget/alarme.", "Abrir SG para 0.0.0.0/0 'para testar'."],
  },
  "m7-ec2": {
    terms: [
      { en: "on-demand", pt: "pague por hora ligada" },
      { en: "EBS", pt: "disco em bloco (cobra provisionado)" },
      { en: "security group", pt: "firewall virtual da instância" },
      { en: "tag", pt: "etiqueta para dono/custo" },
    ],
    commands: [
      { cmd: "aws sts get-caller-identity", out: "Mostra quem é a credencial (leitura; exige login configurado)." },
    ],
    pitfalls: ["Esquecer a VM ligada e pagar o mês todo.", "IP elástico ocioso e snapshots sem tag.", "SG com 22/3389 aberto ao mundo."],
  },
  "m7-rds-s3": {
    terms: [
      { en: "bucket", pt: "contêiner de objetos no S3" },
      { en: "lifecycle", pt: "regras de mover/expirar por idade" },
      { en: "versioning", pt: "versionamento contra sobrescrita" },
      { en: "RPO / RTO", pt: "quanto perder / quanto demorar a voltar" },
    ],
    commands: [
      { cmd: "aws s3 ls", out: "Lista buckets (leitura; exige login configurado)." },
    ],
    pitfalls: ["Bucket público com dado sensível.", "Versões acumulando sem lifecycle.", "Restore nunca testado em instância separada."],
  },
  "m8-sql": {
    terms: [
      { en: "query", pt: "consulta ao banco" },
      { en: "JOIN", pt: "junção de tabelas pela chave" },
      { en: "GROUP BY", pt: "agrupamento para agregar" },
      { en: "primary key", pt: "chave primária: identidade da linha" },
    ],
    commands: [
      { cmd: "SELECT status, COUNT(*) FROM chamados GROUP BY status;", out: "Uma linha por status com o total." },
      { cmd: "SELECT ... WHERE status='aberto' AND data >= '2026-10-01';", out: "Só o recorte pedido (filtre no banco)." },
    ],
    pitfalls: ["UPDATE/DELETE sem WHERE.", "SELECT * em tabela gigante travando o banco.", "JOIN sem condição (produto cartesiano)."],
  },
  "m8-git": {
    terms: [
      { en: "commit", pt: "registro com mensagem no histórico" },
      { en: "staging area", pt: "palco do próximo commit (git add)" },
      { en: "remote", pt: "repositório remoto (origin)" },
      { en: "clone", pt: "copiar um repo com histórico" },
    ],
    commands: [
      { cmd: "git status", out: "Modificados, staged e não rastreados." },
      { cmd: "git log --oneline -10", out: "Histórico curto dos últimos commits." },
      { cmd: "git diff", out: "O que mudou e ainda não foi staged." },
    ],
    pitfalls: ["Senha/token commitado (rotacione, histórico não esquece).", "Commit gigante 'update' sem mensagem útil.", "push --force em branch compartilhada."],
  },
  "m9-n2": {
    terms: [
      { en: "STAR", pt: "Situação, Tarefa, Ação, Resultado" },
      { en: "portfolio", pt: "portfólio: provas do que você entrega" },
      { en: "behavioral", pt: "pergunta comportamental (como você age)" },
      { en: "hands-on", pt: "teste prático na entrevista" },
    ],
    commands: [
      { cmd: "git log --oneline -10", out: "Histórico legível do seu projeto." },
      { cmd: "git status", out: "Higiene: nada sensível pendente?" },
    ],
    pitfalls: ["Adjetivos sem resultado mensurável.", "Blefar no técnico (diga como investigaria).", "Portfólio sem README de como testar."],
  },
};

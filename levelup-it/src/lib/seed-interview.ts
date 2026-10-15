export interface InterviewQ {
  id: string;
  area: string;
  question: string;
  expected: string[];
  tip: string;
}

export const INTERVIEW: InterviewQ[] = [
  { id: "iv-dns", area: "Redes/DNS", question: "A intranet abre pelo IP, mas não pelo nome. A internet funciona. Por onde você começa?", expected: ["Delimitar escopo: só esse sistema/usuário?", "Resolve-DnsName e comparar com o registro autorizado (resposta, TTL, servidor)", "Testar TCP na porta do serviço contra o IP", "Escalar com hora + evidência; retestar com o usuário após correção"], tip: "Fale em voz alta a camada de cada teste." },
  { id: "iv-porta", area: "Transporte", question: "O ping ao servidor passa, mas a aplicação na 443 não abre. O que isso prova?", expected: ["Ping prova ICMP, não a porta — testar Test-NetConnection -Port 443", "Timeout ≠ refused: listar hipóteses (serviço, filtro, rota, retorno)", "Comparar outra origem + correlacionar logs no horário", "Mudança mínima, aprovada, com rollback"], tip: "Nunca conclua firewall só pelo timeout." },
  { id: "iv-apipa", area: "DHCP", question: "Um PC está com IP 169.254.x.x e os colegas funcionam. Diagnóstico?", expected: ["APIPA = sem DHCP; escopo isolado ao cliente/porta", "Comparar VLAN da porta, cabo e colega funcional", "Relay/escopo/serviço com a equipe de redes", "Renovar lease só após corrigir a causa"], tip: "Sintoma → segmento → serviço, nessa ordem." },
  { id: "iv-acesso", area: "AD/Permissões", question: "Usuária nova recebe 'acesso negado' na pasta do setor. Colegas acessam. E agora?", expected: ["Confirmar grupos dela vs colega", "Share + NTFS (mais restritiva vence) + herança", "GPO de mapeamento e replicação", "Solicitar inclusão com aprovação do dono do dado"], tip: "Negue 'Everyone Full' e proponha o pedido correto." },
  { id: "iv-lento", area: "Windows", question: "PC leva 15 minutos para liberar após login. O usuário pede formatação. O que você faz?", expected: ["Medir: qual recurso satura + inicialização + saúde do disco", "Agir no autorizado antes de medida extrema", "Backup verificado antes de qualquer reinstalação", "Validar tempo de boot com o usuário"], tip: "Sem número, é opinião — mostre o gargalo." },
  { id: "iv-vpn", area: "Acesso remoto", question: "VPN conectada, mas a intranet não abre nem por IP. Hipótese?", expected: ["Túnel UP não prova rota/DNS/autorização", "Get-NetRoute: existe rota ao prefixo corporativo?", "DNS durante a VPN + perfil split/full tunnel", "Comparar colega funcional; escalar com rotas anexadas"], tip: "Teste cada camada do acrônimo VPN separada." },
  { id: "iv-gestor", area: "Comunicação", question: "Explique para um gestor leigo por que dois setores não se enxergam na rede.", expected: ["Analogia simples (salas separadas por segurança)", "Sem jargão: o que foi feito e o que falta", "Prazo + próximo passo + impacto", "Oferecer resumo escrito"], tip: "Gestor quer impacto e prazo, não sigla." },
  { id: "iv-star", area: "Comportamental", question: "Conte um incidente difícil que você resolveu (STAR).", expected: ["Situação e impacto em 2 frases", "Sua tarefa e hipóteses ordenadas", "Ação + evidência que a sustentou", "Resultado mensurável + o que faria diferente"], tip: "Termine sempre com o aprendizado." },
];

const STORAGE_KEY = 'estudo_ti_platform_v1';

const tracks = [
  ['Fundamentos de TI', 'Hardware, sistemas operacionais, arquivos, usuários e troubleshooting.', 'base'],
  ['Suporte N1', 'Atendimento, tickets, Windows, conectividade e documentação.', 'support'],
  ['Redes', 'TCP/IP, IPv4, serviços, switching, roteamento e diagnóstico.', 'network'],
  ['Suporte N2', 'Incidentes avançados, logs, serviços e escalonamento.', 'support'],
  ['Windows Server', 'Active Directory, DNS, DHCP, GPO e compartilhamentos.', 'windows'],
  ['PowerShell', 'Cmdlets, objetos, pipeline, funções e automação.', 'powershell'],
  ['Microsoft 365 + Entra ID', 'Identidade, MFA, dispositivos e políticas.', 'cloud'],
  ['Linux', 'Terminal, filesystem, permissões, serviços, rede e logs.', 'linux'],
  ['SQL', 'Consultas, tabelas, relacionamentos e investigação de dados.', 'data'],
  ['Segurança', 'Autenticação, hardening, incidentes e análise de logs.', 'security'],
  ['Azure / Cloud', 'Máquinas virtuais, redes, storage, identidade e custos.', 'cloud'],
  ['DevOps / Automação', 'Git, containers, CI/CD, infraestrutura e monitoramento.', 'devops']
].map(([title, description, category], index) => ({ id: `track-${index + 1}`, title, description, category, active: index === 2 }));

const modules = [
  { id: 'fundamentos', title: 'Fundamentos de Redes', group: 'Base', goal: 'Explicar como dispositivos trocam dados em uma rede local e entre redes.', concept: 'Uma rede conecta dispositivos por meios físicos ou sem fio e define regras para endereçar, transportar e entregar dados. LAN descreve o escopo local; WAN conecta redes em distâncias maiores. Internet é uma rede global de redes, não sinônimo de Wi-Fi.', example: 'O computador 192.168.10.25/24 acessa 10.20.4.18. Como os prefixos são diferentes, ele envia o quadro ao MAC do gateway 192.168.10.1; o pacote IP continua endereçado ao servidor.', command: 'ipconfig /all', interpret: 'Confira endereço, máscara, gateway, DNS e servidor DHCP. Um endereço 169.254.x.x sugere que a configuração DHCP não foi obtida, mas é preciso investigar o motivo.', practice: 'Desenhe o caminho PC → switch → gateway → servidor e marque em qual salto mudam os endereços MAC.', check: 'Para um destino fora da sub-rede local, o computador entrega o primeiro quadro ao MAC do destino final ou ao MAC do gateway?' },
  { id: 'osi', title: 'Modelo OSI e TCP/IP', group: 'Base', goal: 'Usar camadas para delimitar hipóteses sem tratar o modelo como checklist mecânico.', concept: 'OSI separa funções em sete camadas. A pilha TCP/IP agrupa essas funções em aplicação, transporte, Internet e acesso à rede. Os modelos ajudam a descrever responsabilidades e a localizar evidências.', example: 'Uma consulta DNS falha antes de abrir uma sessão com o servidor web. Verifique resolução de nomes antes de investigar TLS ou código da aplicação.', command: 'Test-NetConnection app.interno.local -Port 443', interpret: 'O resultado testa a sessão TCP para uma porta. Ele não prova que HTTP, certificado ou login da aplicação estejam funcionando.', practice: 'Classifique uma falha de cabo, uma rota ausente, uma porta fechada e um nome que não resolve.', check: 'Se a porta 443 abre, isso garante que o certificado TLS e a aplicação estão corretos?' },
  { id: 'ipv4', title: 'IPv4', group: 'Endereçamento', goal: 'Ler endereços IPv4, reconhecer intervalos privados e identificar configurações incoerentes.', concept: 'IPv4 possui 32 bits representados em quatro octetos. A máscara/prefixo separa os bits da rede dos bits de host. Os intervalos privados são 10/8, 172.16/12 e 192.168/16.', example: '192.168.10.70 é um endereço privado. Sem a máscara não é possível concluir qual é sua rede nem se outro endereço está no mesmo segmento.', command: 'Get-NetIPConfiguration', interpret: 'Compare o IPv4, o prefixo, o gateway e os servidores DNS com o plano esperado para aquela interface e VLAN.', practice: 'Identifique se 10.4.1.20, 172.20.4.8 e 192.168.1.4 são endereços privados.', check: 'Um endereço 192.168.x.x é globalmente roteável na Internet sem tradução ou túnel?' },
  { id: 'subnetting', title: 'Máscaras e Subnetting', group: 'Endereçamento', goal: 'Calcular rede, broadcast e faixa de hosts de sub-redes IPv4.', concept: 'O prefixo CIDR informa quantos bits identificam a rede. Para prefixos até /30, o total tradicional de endereços de host é 2 elevado aos bits restantes, menos rede e broadcast.', example: '192.168.10.70/26 usa máscara 255.255.255.192. O bloco tem 64 endereços; .70 está na rede .64/26, broadcast .127 e hosts .65 a .126.', command: 'Use o Simulador de Subnetting na navegação lateral.', interpret: 'A fronteira de sub-rede determina se o host envia diretamente ao destino ou usa o gateway. Um erro de máscara causa decisões locais incorretas.', practice: 'Divida 192.168.20.0/24 em quatro sub-redes iguais; confira o resultado no simulador.', check: 'Qual é o broadcast da rede 10.20.30.128/27?' },
  { id: 'cidr-vlsm', title: 'CIDR e VLSM', group: 'Endereçamento', goal: 'Planejar sub-redes de tamanhos diferentes sem desperdiçar endereços.', concept: 'CIDR expressa prefixos sem depender de classes antigas. VLSM permite aplicar prefixos diferentes em uma mesma alocação, desde que os blocos não se sobreponham e respeitem alinhamento.', example: 'Uma equipe precisa de 50 hosts e outra de 12. Um /26 oferece 62 hosts tradicionais; um /28 oferece 14. Alocam-se os maiores blocos primeiro para facilitar o planejamento.', command: 'Get-NetRoute', interpret: 'A tabela de rotas usa prefixos CIDR. A rota mais específica que combina com o destino normalmente vence (longest-prefix match).', practice: 'Planeje blocos para 50, 20 e 10 hosts a partir de 10.30.0.0/24.', check: 'Qual deve ser alocado primeiro: o bloco para 50 hosts ou para 10 hosts?' },
  { id: 'tcp-udp', title: 'TCP, UDP e Portas', group: 'Transporte', goal: 'Distinguir conectividade IP de conectividade de serviço e interpretar falhas TCP.', concept: 'TCP oferece sessão, sequência e retransmissão. UDP envia datagramas sem a mesma garantia de entrega. Portas identificam processos de origem/destino; IP identifica interfaces e redes.', example: 'Ping responde ao ICMP, mas isso não testa a porta 443. Test-NetConnection server -Port 443 verifica uma conexão TCP com aquela porta.', command: 'Test-NetConnection servidor -Port 443', interpret: 'False indica que a tentativa TCP não se estabeleceu; possíveis causas incluem serviço parado, filtro, rota ou retorno. True não valida a camada HTTP.', practice: 'Compare timeout, connection refused e reset. Liste uma hipótese e um próximo teste para cada sinal.', check: 'Ping bem-sucedido prova que o serviço HTTPS está ouvindo?' },
  { id: 'dns', title: 'DNS', group: 'Serviços', goal: 'Investigar resolução de nomes e separar DNS de roteamento e disponibilidade de aplicação.', concept: 'DNS associa nomes a registros como A, AAAA, CNAME e MX. O cliente consulta um resolvedor; cache e servidores autoritativos participam do processo conforme o nome e o TTL.', example: 'Se https://portal.interno abre pelo IP mas não pelo hostname, compare a resposta de Resolve-DnsName com o IP esperado antes de limpar cache ou alterar DNS.', command: 'Resolve-DnsName portal.interno.local', interpret: 'Verifique se houve resposta, o tipo de registro, o endereço retornado e qual servidor respondeu. Um endereço resolvido pode ainda estar inacessível.', practice: 'No Laboratório de Incidentes, investigue o caso em que a Internet funciona e o sistema interno falha pelo nome.', check: 'Que evidência diferencia um erro de resolução DNS de uma porta TCP bloqueada?' },
  { id: 'dhcp', title: 'DHCP', group: 'Serviços', goal: 'Entender concessões DHCP e investigar clientes com configuração automática inválida.', concept: 'O fluxo DORA significa Discover, Offer, Request e Acknowledge. A concessão pode incluir endereço, máscara, gateway, DNS, duração e outras opções.', example: 'Um host com 169.254.20.12 não recebeu configuração IPv4 utilizável do DHCP. Verifique VLAN, relay/IP helper, escopo, serviço e disponibilidade do servidor.', command: 'ipconfig /all', interpret: 'Compare DHCP Server, Lease Obtained, Lease Expires, IPv4, gateway e DNS. Renovar a concessão sem diagnosticar pode só repetir a falha.', practice: 'Desenhe as quatro mensagens DORA e identifique qual lado envia cada uma.', check: 'Quais duas etapas são iniciadas pelo cliente no fluxo DORA?' },
  { id: 'arp-mac', title: 'ARP e MAC', group: 'Enlace', goal: 'Explicar como um host descobre o endereço de enlace do próximo salto IPv4.', concept: 'Em uma LAN IPv4, ARP resolve um IPv4 local para um MAC. Para destinos remotos, o host normalmente consulta o MAC do gateway, não o MAC do servidor remoto.', example: 'O PC precisa acessar 8.8.8.8; primeiro verifica sua tabela de rotas, escolhe o gateway e resolve o MAC do gateway na LAN.', command: 'arp -a', interpret: 'Entradas dinâmicas associam IP/MAC por interface. Uma entrada ausente pode ser normal até haver tráfego; conflito ou MAC inesperado exige contexto.', practice: 'Compare a entrada ARP do gateway antes e depois de executar ping ao gateway.', check: 'Para chegar a um IP remoto, qual endereço IP é normalmente resolvido por ARP na rede local?' },
  { id: 'switching', title: 'Switching', group: 'Enlace', goal: 'Interpretar aprendizagem de MAC, portas de acesso e domínios de broadcast.', concept: 'Um switch de camada 2 aprende MAC de origem por porta e VLAN. Encaminha quadros conhecidos pela porta associada; quadros broadcast são propagados dentro do domínio de broadcast correspondente.', example: 'Se dois hosts da mesma VLAN não trocam quadros, verifique link, VLAN da porta, aprendizagem MAC, erros físicos e políticas antes de culpar roteamento.', command: 'arp -a', interpret: 'A tabela ARP do host ajuda a observar vizinhos IPv4; a tabela MAC do switch é obtida na infraestrutura e não é substituída por ARP.', practice: 'Desenhe duas VLANs no mesmo switch e mostre por que hosts em VLANs distintas precisam de roteamento.', check: 'Um switch de camada 2 encaminha com base no IP de destino ou no MAC do quadro?' },
  { id: 'vlan', title: 'VLAN', group: 'Segmentação', goal: 'Entender segmentação lógica e o que precisa existir para tráfego entre VLANs.', concept: 'VLANs separam domínios de camada 2 em uma infraestrutura compartilhada. Portas access carregam uma VLAN; trunks transportam múltiplas VLANs com marcação conforme configuração.', example: 'Um computador na VLAN 20 não alcança diretamente um servidor na VLAN 40; precisa de gateway L3, rota e política permitindo o fluxo.', command: 'Get-NetIPConfiguration', interpret: 'O cliente não revela sozinho a VLAN do switch, mas endereço/gateway inesperados podem ajudar a detectar associação ao segmento errado.', practice: 'No caso em que apenas um grupo de usuários falha, compare segmento, gateway e política com um grupo funcional.', check: 'Qual equipamento ou função encaminha tráfego entre VLANs?' },
  { id: 'gateway-routing', title: 'Gateway e Routing', group: 'Roteamento', goal: 'Determinar o próximo salto e entender a decisão local de roteamento.', concept: 'O host compara destino e prefixo local. Se não forem da mesma rede, consulta a rota padrão ou uma rota mais específica e encaminha o pacote ao próximo salto.', example: 'Com 192.168.1.25/24, o destino 192.168.1.80 é local; 10.20.4.18 usa o gateway configurado.', command: 'route print', interpret: 'Confirme interface, métrica, prefixo e gateway. Uma rota válida até o destino ainda depende de rota de retorno e política.', practice: 'Explique a rota escolhida para 10.10.2.8 considerando uma rota padrão e uma rota específica /24.', check: 'Se uma rota /24 e uma rota /16 combinam com o destino, qual é normalmente escolhida?' },
  { id: 'routing-table', title: 'Routing Table', group: 'Roteamento', goal: 'Ler prefixos, próximos saltos e métricas em uma tabela de rotas.', concept: 'Roteadores e sistemas operacionais selecionam rotas com base no prefixo mais específico; entre caminhos equivalentes podem existir métricas, políticas e protocolos diferentes.', example: 'A rota 0.0.0.0/0 é o caminho padrão IPv4. Uma rota 10.20.4.0/24 é mais específica e deve ser selecionada para aquele destino se estiver ativa.', command: 'Get-NetRoute | Sort-Object -Property DestinationPrefix', interpret: 'Observe DestinationPrefix, NextHop, InterfaceIndex, RouteMetric e estado. Não conclua a rota apenas pela ordem visual da listagem.', practice: 'Compare uma rota padrão com uma rota específica e indique qual atende 10.20.4.18.', check: 'O que representa 0.0.0.0/0 na tabela IPv4?' },
  { id: 'http-https', title: 'HTTP e HTTPS', group: 'Aplicação', goal: 'Separar transporte, protocolo HTTP, resposta do servidor e comportamento do cliente.', concept: 'HTTP define requisições e respostas de aplicação. HTTPS transporta HTTP sobre TLS. Códigos 2xx, 3xx, 4xx e 5xx descrevem classes de resposta; não identificam sozinhos a causa raiz.', example: 'HTTP 503 indica indisponibilidade temporária do serviço ou incapacidade de atender naquele momento; pode ser aplicação, proxy ou balanceador.', command: 'curl -I https://example.com', interpret: 'Analise status e cabeçalhos retornados. Um curl bem-sucedido não confirma autenticação, conteúdo ou funcionamento da jornada completa do usuário.', practice: 'Diferencie erro de nome, falha TCP e resposta HTTP 500.', check: 'Um HTTP 500 indica falha de rede ou uma resposta gerada pela camada de aplicação?' },
  { id: 'tls', title: 'TLS e Certificados', group: 'Segurança', goal: 'Reconhecer o papel de TLS, confiança, nome e validade do certificado.', concept: 'TLS negocia parâmetros criptográficos e autentica o servidor por certificado conforme a cadeia de confiança do cliente. Criptografia não corrige erro de DNS, rota ou serviço.', example: 'Se a porta 443 abre mas o navegador acusa certificado, investigue nome do certificado, validade, cadeia intermediária, relógio do sistema e inspeção TLS corporativa.', command: 'curl -Iv https://portal.empresa.local', interpret: 'Use a saída para separar conexão TCP, negociação TLS e resposta HTTP. Evite desativar validação de certificado como solução.', practice: 'Escreva quais evidências você registraria antes de escalar falha de certificado.', check: 'Qual campo do certificado deve corresponder ao hostname acessado?' },
  { id: 'firewall', title: 'Firewall', group: 'Segurança', goal: 'Investigar regras por origem, destino, protocolo, porta e direção.', concept: 'Firewalls aplicam políticas de tráfego. Um teste TCP falho não revela automaticamente se o bloqueio é local, intermediário, destino ou retorno; logs e comparação controlada são evidências importantes.', example: 'Um segmento não alcança app:443, mas outro alcança. Compare origem, rota, política e logs da regra que deveria permitir aquele fluxo.', command: 'Test-NetConnection app -Port 443', interpret: 'TcpTestSucceeded True confirma uma conexão TCP no momento do teste. False requer investigação de serviço, política, rota e simetria.', practice: 'Descreva um pedido de liberação contendo origem, destino, porta, protocolo, justificativa e prazo.', check: 'Por que “liberar a Internet” não é uma descrição suficiente de mudança de firewall?' },
  { id: 'vpn', title: 'VPN', group: 'Acesso remoto', goal: 'Investigar túnel, autenticação, DNS e rotas após conexão VPN.', concept: 'VPN cria um túnel autenticado. Split tunnel e full tunnel encaminham conjuntos distintos de tráfego; rotas, DNS, postura do dispositivo e autorização afetam o acesso ao recurso.', example: 'VPN aparece conectada, mas intranet não abre. Confirme rota ao prefixo, servidor DNS usado e teste TCP no destino; não trate estado do túnel como prova de conectividade ponta a ponta.', command: 'Get-NetRoute', interpret: 'Confirme se existe rota para a rede corporativa e qual interface/gateway foi selecionado.', practice: 'Compare resolução DNS antes e durante a VPN para um nome interno.', check: 'VPN conectada garante que o usuário tem permissão para o sistema?' },
  { id: 'wifi', title: 'Wi-Fi', group: 'Acesso remoto', goal: 'Separar associação sem fio de configuração IP e acesso ao serviço.', concept: 'O cliente associa-se a um ponto de acesso e autentica; o tráfego depois atravessa VLAN, DHCP, gateway e políticas. Interferência, roaming, canal, sinal e capacidade podem degradar desempenho.', example: 'Wi-Fi conectado, IP 169.254.x.x: investigue DHCP/VLAN além do rádio. IP válido e gateway alcançável, mas lentidão: compare sinal, perda, latência, banda e usuários.', command: 'netsh wlan show interfaces', interpret: 'Observe SSID, estado, rádio, canal e sinal. Um sinal alto não prova que DNS ou serviço remoto estão saudáveis.', practice: 'Compare um cliente afetado e um funcional no mesmo local e no mesmo SSID.', check: 'O estado “conectado ao Wi-Fi” prova que o DHCP forneceu um endereço válido?' },
  { id: 'diagnostico', title: 'Ferramentas de Diagnóstico', group: 'Operação', goal: 'Escolher ferramentas de acordo com a hipótese e registrar evidências reproduzíveis.', concept: 'Cada teste observa uma parte do caminho: configuração local, resolução, ICMP, rota, sessão TCP ou aplicação. Use o teste menos invasivo que diferencia hipóteses concorrentes.', example: 'Para app por nome indisponível: obtenha IP, consulte DNS, teste TCP/porta, compare usuário/rede e examine logs autorizados.', command: 'ipconfig /all; Resolve-DnsName host; Test-NetConnection host -Port 443', interpret: 'Execute separadamente e preserve hora, origem, destino e saída. Um comando composto pode dificultar identificar em que etapa ocorreu a falha.', practice: 'Monte uma sequência de 4 testes e escreva que hipótese cada um confirma ou descarta.', check: 'Qual teste verifica especificamente uma porta TCP de destino?' },
  { id: 'troubleshooting', title: 'Troubleshooting Profissional', group: 'Operação', goal: 'Conduzir incidente do sintoma à validação e documentar conclusão sem saltos lógicos.', concept: 'Defina impacto e escopo, colete fatos, formule hipóteses, selecione testes discriminantes, aplique correção autorizada, valide com o usuário e registre evidências.', example: '“Não funciona” vira: usuário e equipamento afetados, destino, horário, mensagem exata, mudanças recentes, outros usuários afetados e testes reproduzíveis.', command: 'Use o Laboratório de Incidentes para coletar evidências por etapas.', interpret: 'Conclusão deve explicar qual evidência sustenta a causa e quais hipóteses foram descartadas. Correlação não é prova suficiente.', practice: 'Documente um incidente com sintoma, impacto, testes, resultados, causa, ação e validação.', check: 'Depois de aplicar uma correção, qual evidência encerra o chamado com qualidade?' },
  { id: 'labs-n1', title: 'Laboratórios N1', group: 'Prática', goal: 'Executar triagem segura de chamados comuns e saber quando escalar.', concept: 'N1 valida escopo, configuração básica e sintomas conhecidos; registra evidências e escala com contexto quando exige acesso ou conhecimento especializado.', example: 'Um usuário sem Internet: verifique se é isolado, interface, IP/gateway/DNS, alcance do gateway e resolução; evite resetar equipamento sem autorização.', command: 'Get-NetIPConfiguration', interpret: 'Compare os dados com um equipamento funcional no mesmo segmento e com documentação da rede.', practice: 'Resolva os casos iniciais no Laboratório de Incidentes e registre seus testes.', check: 'O que deve constar no escalonamento para evitar repetir a triagem?' },
  { id: 'labs-n2', title: 'Laboratórios N2', group: 'Prática', goal: 'Analisar falhas entre segmentos, políticas, rotas e serviços com evidências correlacionadas.', concept: 'N2 correlaciona cliente, rede, servidor e logs; identifica o ponto provável e coordena mudança com a equipe responsável, seguindo janela e aprovação.', example: 'Uma VLAN alcança DNS e gateway, mas falha em app:443. Compare rotas, política entre zonas, serviço de destino e retorno; preserve timestamp para correlacionar logs.', command: 'Test-NetConnection app.interno -Port 443', interpret: 'Associe o resultado a uma matriz de testes por origem/destino. Evite concluir bloqueio sem log ou comparação que discrimine causas.', practice: 'Use o caso “porta bloqueada” e justifique cada hipótese antes de selecionar a causa.', check: 'Que evidência adicional separa serviço parado de bloqueio silencioso?' },
  { id: 'projeto-final', title: 'Projeto Final: Empresa Virtual', group: 'Projeto', goal: 'Produzir diagnóstico documentado de um incidente corporativo usando evidências e validação.', concept: 'Um relatório útil permite que outra pessoa entenda impacto, ambiente, sequência de testes, resultados, causa provável, ação, validação e risco residual.', example: 'TechCorp: estação 192.168.20.44 resolve portal para IP antigo; outros hosts recebem IP correto. Investigue cache, resolvedor e escopo sem alterar registros sem autorização.', command: 'Use o modelo de incidente no Laboratório e salve o relatório.', interpret: 'Uma solução só é considerada concluída após repetir o teste e confirmar a recuperação com o solicitante.', practice: 'Escolha um caso, colete evidências, proponha uma ação e gere a documentação.', check: 'Quais campos do relatório permitem reproduzir o diagnóstico?' }
];

const lessonEnrichment = {
  fundamentos: { mechanism: 'A comunicação usa encapsulamento: aplicação produz dados, transporte identifica processos, IP identifica origem/destino lógico e enlace entrega o quadro ao próximo salto. Cada roteador remove o quadro recebido e cria outro para o enlace seguinte; o pacote IP segue pela rota.', investigation: ['Defina o destino exato e se o problema afeta um usuário ou vários.', 'Compare endereço e prefixo do cliente com o destino.', 'Se o destino for remoto, valide gateway e rota antes de testar a aplicação.'], pitfall: 'Wi-Fi conectado só confirma associação ao ponto de acesso. Não confirma concessão DHCP, rota, DNS ou acesso ao serviço.', exercise: 'Um PC 192.168.10.25/24 acessa 192.168.10.80 e depois 10.20.4.18. Em qual tentativa ele precisa do gateway?', solution: '192.168.10.80 pertence à mesma rede /24, então a entrega é local. 10.20.4.18 pertence a outra rede e usa o gateway. Em ambos os casos, descubra primeiro a sub-rede; olhar apenas o endereço é insuficiente.', document: 'Registre origem, destino, máscara, gateway, interface utilizada, escopo do impacto e resultado de cada teste.' },
  osi: { mechanism: 'Cada camada oferece um serviço à camada superior e usa o serviço da camada inferior. No diagnóstico, uma evidência em camada inferior reduz algumas hipóteses, mas não valida automaticamente as camadas acima.', investigation: ['Confirme link/interface e associação de rede.', 'Verifique IP e rota até o destino.', 'Teste transporte na porta requerida.', 'Valide protocolo de aplicação, TLS e autenticação separadamente.'], pitfall: 'Tratar OSI como sequência rígida ou concluir que “rede está boa” porque o ping responde. ICMP não verifica TCP, TLS nem a aplicação.', exercise: 'O host resolve o nome e abre TCP/443, mas o navegador mostra erro de certificado. Qual parte do caminho está comprovada e qual deve ser investigada?', solution: 'DNS e estabelecimento TCP funcionaram naquele instante. Investigue negociação TLS, nome SAN, validade, cadeia de confiança e relógio; não reabra diagnóstico de cabo sem nova evidência.', document: 'Associe cada teste à camada observada e anote o que ele não permite concluir.' },
  ipv4: { mechanism: 'O prefixo é uma máscara de bits: os bits 1 identificam a rede e os bits 0 deixam espaço para endereços dentro do bloco. O encaminhamento depende dessa comparação binária, não das classes históricas A/B/C.', investigation: ['Colete IP e prefixo da interface ativa, não de adaptador desconectado.', 'Compare a rede calculada com o gateway e com o destino.', 'Verifique duplicidade, APIPA, endereço estático fora do plano e interface VPN.'], pitfall: 'Dois endereços que começam com 192.168 não necessariamente estão na mesma sub-rede; máscara/prefixo também é necessário.', exercise: 'Compare 192.168.1.70/26 e 192.168.1.130/26. Estão no mesmo segmento?', solution: 'Não. Blocos /26 no último octeto têm tamanho 64. .70 pertence a .64–.127 e .130 a .128–.191; o tráfego entre eles precisa de roteamento.', document: 'Anote IP/prefixo, máscara, interface, origem da configuração (DHCP/estática) e segmento esperado.' },
  subnetting: { mechanism: 'Para obter blocos iguais, empreste bits da parte de host. O número de sub-redes possíveis cresce como 2 elevado aos bits emprestados; o tamanho de bloco é 2 elevado aos bits de host restantes.', investigation: ['Converta a máscara para o octeto interessante.', 'Calcule incremento: 256 menos o valor desse octeto da máscara.', 'Encontre o múltiplo de incremento que contém o IP.', 'Derive broadcast e limites; confira que os blocos não se sobrepõem.'], pitfall: 'Confundir endereço de rede com primeiro host ou somar o tamanho do bloco ao endereço do host. Comece pela rede alinhada.', exercise: 'Calcule rede, primeiro/último host e broadcast de 172.16.5.77/28.', solution: 'Um /28 tem 16 endereços; os blocos do último octeto avançam de 16 em 16. .77 cai no bloco .64–.79: rede .64, hosts .65–.78, broadcast .79. Há 14 hosts tradicionais.', document: 'Registre prefixo original, bits emprestados, máscara, incremento, rede, broadcast e faixa útil.' },
  'cidr-vlsm': { mechanism: 'VLSM aloca blocos com prefixos diferentes no mesmo espaço agregado. O alinhamento é obrigatório: cada rede deve começar em múltiplo do tamanho do próprio bloco.', investigation: ['Liste necessidades de hosts e reservas por segmento.', 'Some rede e broadcast aos hosts pedidos para obter o bloco necessário.', 'Arredonde para a potência de dois mais próxima e escolha o prefixo.', 'Alinhe, aloque maiores blocos primeiro e valide sobreposição.'], pitfall: 'Dimensionar só pelo número de estações e esquecer gateway, impressoras, crescimento e endereços reservados.', exercise: 'Planeje para 50 hosts e 12 hosts dentro de 10.30.0.0/24.', solution: '50 hosts exigem /26 (62 hosts tradicionais), alocado primeiro em 10.30.0.0/26. 12 hosts exigem /28 (14 hosts) e podem usar 10.30.0.64/28. Confirme requisitos de expansão antes de aprovar.', document: 'Mantenha tabela de segmento, quantidade atual, capacidade, prefixo, rede, gateway, broadcast e responsável.' },
  'tcp-udp': { mechanism: 'Uma sessão TCP é identificada pelo par de endpoints e portas e passa por estados. UDP não estabelece sessão equivalente; aplicações podem implementar seus próprios controles. Uma porta aberta é apenas uma parte da disponibilidade do serviço.', investigation: ['Confirme hostname/IP e destino exato.', 'Teste a porta TCP esperada a partir da mesma origem afetada.', 'Compare com uma origem funcional e registre horário.', 'Correlacione serviço e logs se a sessão falhar ou se a aplicação responder erro.'], pitfall: 'Usar ping como prova de porta aberta. ICMP e TCP são protocolos diferentes e políticas podem tratar cada um de forma independente.', exercise: 'O ping responde e Test-NetConnection na porta 443 retorna False. O que está comprovado?', solution: 'Há resposta ICMP do alvo e a tentativa TCP/443 não se estabeleceu. Ainda pode ser serviço parado, filtro, rota específica ou retorno; verifique logs e compare de outra origem.', document: 'Anote protocolo, IP/porta, origem, destino, horário, resultado (timeout/refused/success) e ponto de comparação.' },
  dns: { mechanism: 'O stub resolver consulta um resolvedor configurado. O resolvedor pode responder do cache, consultar outros servidores e devolver registros com TTL. A aplicação pode consultar outro nome ou usar cache próprio.', investigation: ['Consulte o FQDN e registre servidor consultado e resposta.', 'Compare o IP com uma fonte autorizada para aquele ambiente.', 'Teste o IP/porta separadamente para separar resolução de transporte.', 'Compare outra estação e examine sufixos/cache somente após preservar a evidência.'], pitfall: 'Limpar cache ou trocar DNS antes de registrar a resposta original; isso destrói uma pista útil e pode mascarar a causa.', exercise: 'Resolve-DnsName retorna 10.40.8.90; a referência publicada é 10.40.8.25. O que fazer antes de alterar o registro?', solution: 'Confirme o escopo, consulte o resolvedor autorizado, compare hosts afetados e preserve horário/TTL/resposta. Acione o responsável pelo DNS/aplicação para correção aprovada; não edite registro por conta própria.', document: 'Registre FQDN, tipo de registro, resposta, TTL, servidor consultado, horário e valor esperado com sua fonte.' },
  dhcp: { mechanism: 'DHCPv4 começa com mensagens broadcast porque o cliente ainda pode não possuir IP utilizável. Relay encaminha solicitações entre sub-redes. O servidor escolhe um escopo e oferece opções conforme política.', investigation: ['Verifique interface, VLAN e endereço obtido.', 'Confira DHCP Server, lease e opções em ipconfig /all.', 'Compare outro cliente na mesma VLAN.', 'Se não houver oferta, verifique relay, escopo, exclusões, disponibilidade e logs.'], pitfall: 'Renovar lease em loop sem validar camada 2/VLAN ou servidor. O cliente pode repetir a mesma solicitação no segmento errado.', exercise: 'O cliente envia Discover, mas nenhuma Offer chega. Cite três pontos distintos a verificar.', solution: 'Verifique VLAN/porta e caminho broadcast local; relay/IP helper e roteamento até o servidor; escopo/serviço/logs do servidor. Capture o ponto da mensagem para distinguir onde desaparece.', document: 'Anote MAC/interface, VLAN confirmada, horário, lease anterior, sequência DORA observada, servidor e scope.' },
  'arp-mac': { mechanism: 'ARP Request é broadcast no domínio local; a resposta normalmente é unicast. O cache evita consultas repetidas. Para tráfego remoto, a resolução é do próximo salto local, em geral o gateway.', investigation: ['Identifique qual próximo salto a tabela de rotas escolheu.', 'Consulte arp -a na interface correta.', 'Gere tráfego controlado ao vizinho e consulte novamente.', 'Compare MAC aprendido com a fonte autorizada da infraestrutura.'], pitfall: 'Concluir que ARP ausente significa falha sem gerar tráfego ou ignorar VLAN/interface. O cache pode simplesmente ter expirado.', exercise: 'Um host acessa 8.8.8.8. Qual IP deve aparecer como vizinho ARP: 8.8.8.8 ou o gateway?', solution: 'Em uma rota padrão, o host resolve o endereço IP do gateway na LAN. O quadro vai ao MAC do gateway e o pacote IP continua destinado a 8.8.8.8.', document: 'Registre interface, IP consultado, MAC observado, tipo/idade da entrada e VLAN/ponto de rede.' },
  switching: { mechanism: 'A tabela CAM associa VLAN + MAC de origem à porta onde o quadro foi recebido. Destinos desconhecidos podem ser inundados dentro da VLAN; broadcasts também não cruzam roteadores sem função específica.', investigation: ['Confirme link, velocidade/duplex e contadores de erro.', 'Confirme VLAN access ou configuração trunk nas duas pontas.', 'Verifique aprendizado MAC e eventuais flaps.', 'Teste outro ponto na mesma VLAN e compare.'], pitfall: 'Usar ARP do computador como substituto da tabela MAC do switch: são tabelas diferentes e respondem perguntas distintas.', exercise: 'Dois hosts estão conectados ao mesmo switch, mas em VLANs diferentes. Por que o switch não encaminha diretamente entre eles?', solution: 'Cada VLAN é um domínio L2 isolado. A comunicação exige roteamento L3 e política entre as VLANs; compartilhar chassi físico não remove a segmentação.', document: 'Registre porta física, VLAN, MAC, horário, contadores, configuração esperada e caminho testado.' },
  vlan: { mechanism: 'A tag 802.1Q identifica VLAN em trunk. Em access, o dispositivo final normalmente envia quadros sem tag e o switch os associa à VLAN da porta. Trunks precisam permitir a VLAN em todo o caminho.', investigation: ['Confirme VLAN esperada com inventário e escopo do chamado.', 'Compare porta access, VLAN permitida no trunk e VLAN nativa conforme padrão local.', 'Verifique gateway/SVI e rota inter-VLAN.', 'Correlacione ACL/firewall depois de provar o encaminhamento L3.'], pitfall: 'Alterar VLAN como tentativa sem autorização pode interromper outros usuários e mascarar uma falha de DHCP ou política.', exercise: 'A porta mostra VLAN 30, mas o setor deveria estar na VLAN 20; a estação recebe APIPA. Qual cadeia de evidências sustenta a hipótese?', solution: 'Porta fora da VLAN esperada, DHCP ausente e escopo correto na VLAN 20 sustentam associação incorreta. Confirme configuração e impacto com a equipe de rede antes de solicitar mudança.', document: 'Inclua porta/switch, VLAN observada e esperada, MAC do host, DHCP/lease, impacto e aprovação da alteração.' },
  'gateway-routing': { mechanism: 'O host realiza lookup local: seleciona rota pelo prefixo mais específico e encaminha diretamente se a rede for on-link; caso contrário usa next hop. A rota de retorno do destino também é necessária.', investigation: ['Calcule a sub-rede local com o prefixo correto.', 'Consulte rotas e interface de saída.', 'Teste gateway e próximo salto sem confundir ICMP com serviço.', 'Compare rota de ida e retorno com equipe responsável.'], pitfall: 'Achar que todo tráfego remoto usa necessariamente o gateway padrão; pode existir rota mais específica ou VPN.', exercise: 'Há rota 10.10.0.0/16 via A e rota 10.10.2.0/24 via B. Para 10.10.2.8, qual rota vence?', solution: 'A rota /24 é mais específica que /16 e normalmente vence, desde que esteja ativa e aplicável à interface/política selecionada.', document: 'Registre destino consultado, rota selecionada, interface, next hop, métrica e evidência do retorno.' },
  'routing-table': { mechanism: 'A tabela pode conter rotas conectadas, estáticas e aprendidas dinamicamente. Longest-prefix match seleciona o prefixo mais específico; distância administrativa e métrica influenciam quais rotas entram ou vencem conforme o sistema.', investigation: ['Identifique tabela e família IPv4/IPv6.', 'Procure todas as rotas que cobrem o destino.', 'Compare especificidade, next hop, interface, estado e métrica.', 'Valide encaminhamento e retorno com traceroute/logs adequados.'], pitfall: 'Interpretar a rota padrão como sempre escolhida ou comparar apenas métricas de prefixos diferentes.', exercise: 'A tabela tem 0.0.0.0/0, 10.0.0.0/8 e 10.20.4.0/24. Qual rota cobre 10.20.4.18?', solution: '10.20.4.0/24 é o prefixo mais específico que cobre 10.20.4.18; a seleção ainda depende de estar instalada e ativa.', document: 'Salve destino, rota/prefixo selecionado, next hop, interface, métrica e momento da coleta.' },
  'http-https': { mechanism: 'HTTP define método, URL, cabeçalhos, corpo e código de resposta. Um proxy ou balanceador pode responder em nome do servidor. HTTPS adiciona negociação TLS antes da troca HTTP.', investigation: ['Confirme hostname e resolução.', 'Teste conexão e porta.', 'Inspecione TLS e status HTTP separadamente.', 'Compare endpoint, caminho, método, autenticação e horário com logs do serviço.'], pitfall: 'Tratar 4xx/5xx como “erro de rede”. Se há status HTTP, algum componente respondeu; identifique qual e examine contexto/correlation ID.', exercise: 'curl retorna HTTP 503. Qual evidência adicional ajuda a distinguir proxy de aplicação?', solution: 'Registre cabeçalhos e identificadores da resposta, compare endpoint direto autorizado e correlacione logs de proxy, balanceador e aplicação no mesmo horário.', document: 'Anote método, URL sem segredos, status, cabeçalhos relevantes, correlation ID, horário e usuário/escopo.' },
  tls: { mechanism: 'O cliente negocia versão e parâmetros TLS, valida certificado e nome e então troca dados cifrados. Cadeia, SAN, validade e relógio são verificações separadas; inspeção TLS corporativa pode apresentar outro certificado.', investigation: ['Confirme hostname e hora do sistema.', 'Verifique TCP/443 e identifique certificado apresentado.', 'Valide SAN, validade, cadeia e emissor confiável.', 'Compare cliente funcional e logs do proxy/inspeção, sem desabilitar validação.'], pitfall: 'Sugerir ignorar aviso de certificado ou instalar certificado sem validar origem e cadeia com a equipe de segurança.', exercise: 'A conexão TCP funciona e o certificado é válido, mas o hostname não consta no SAN. Qual falha explica o alerta?', solution: 'Mismatch de identidade: o certificado não autentica o hostname acessado. Corrija DNS/URL ou emita certificado apropriado após validar o endpoint.', document: 'Registre hostname, emissor, SAN, validade, cadeia, relógio, cliente e erro TLS sem incluir material privado.' },
  firewall: { mechanism: 'Uma regra avalia fluxo conforme zona, origem, destino, protocolo, porta, direção, estado da sessão e ordem/política. Logs permitem distinguir deny explícito de ausência de resposta, mas devem ser correlacionados no horário correto.', investigation: ['Descreva 5-tupla e sentido: origem, porta origem, destino, porta destino, protocolo.', 'Compare um fluxo permitido e o afetado controlando outras variáveis.', 'Correlacione logs no firewall e serviço pelo timestamp.', 'Solicite mudança mínima, aprovada, com prazo e plano de validação.'], pitfall: 'Pedir “liberação geral” ou concluir firewall só porque o teste expira. Serviço parado e rota incorreta podem produzir sintomas semelhantes.', exercise: 'Uma VLAN funciona e outra falha; o log registra deny para a origem afetada na regra esperada. Qual ação é apropriada?', solution: 'Preserve o log e solicite revisão da política com origem/destino/porta, justificativa e aprovação. Não crie bypass amplo; valide somente após mudança autorizada.', document: 'Registre 5-tupla, regra/ação/log, horário, origem de comparação, aprovação, janela e teste pós-mudança.' },
  vpn: { mechanism: 'O cliente autentica e estabelece o túnel; rotas definem quais redes atravessam a VPN. DNS pode ser dividido por domínio. Autenticação, postura do dispositivo e autorização da aplicação são controles distintos.', investigation: ['Confirme estado do túnel e identidade sem coletar segredo.', 'Verifique rotas do destino e interface de saída.', 'Consulte DNS interno e compare com a política de split/full tunnel.', 'Teste porta autorizada e valide autorização na aplicação.'], pitfall: 'Interpretar “VPN conectada” como prova de que rota, DNS, postura e permissões estão corretos.', exercise: 'VPN conecta, nome interno não resolve, mas o IP do serviço abre na porta correta. Qual eixo investigar?', solution: 'DNS dividido/configuração de resolvedor é a hipótese principal. Compare servidor e sufixos DNS antes/depois do túnel e valide política; não mexa no serviço que já foi alcançado por IP.', document: 'Anote perfil VPN, estado, prefixo/rota, resolvedor, nome/IP, horário e resultado sem registrar token ou credencial.' },
  wifi: { mechanism: 'Associação e autenticação 802.11 permitem ingressar no rádio; depois o tráfego é mapeado a uma rede/VLAN e precisa de DHCP e serviços IP. Sinal, interferência, retransmissões e roaming afetam desempenho de formas diferentes.', investigation: ['Compare SSID, banda, sinal e canal com um cliente funcional no mesmo local.', 'Verifique associação/autenticação e perfil corporativo.', 'Depois valide VLAN, DHCP, gateway, DNS e serviço.', 'Registre perda/latência em períodos comparáveis.'], pitfall: 'Trocar canal ou esquecer rede antes de definir se o sintoma é rádio, autenticação, DHCP ou aplicação.', exercise: 'Sinal alto, IP correto e gateway responde; chamadas de voz têm perda intermitente apenas em uma sala. Que evidência coletar?', solution: 'Compare perda/retransmissões, canal/banda, roaming, ocupação e métricas de rádio na sala, correlacionando horário. IP/gateway válidos deslocam a hipótese, mas não eliminam congestionamento sem fio.', document: 'Registre local, SSID/BSSID quando autorizado, banda, sinal, canal, horário, cliente de comparação e métricas.' },
  diagnostico: { mechanism: 'Cada ferramenta observa um limite diferente: configuração local, resolução, ICMP, caminho, conexão TCP ou protocolo de aplicação. Um bom teste é escolhido porque diferencia hipóteses e tem resultado interpretável.', investigation: ['Escreva sintoma, escopo e destino antes de executar.', 'Escolha teste para a hipótese mais provável e preveja possíveis saídas.', 'Execute um teste por vez e preserve stdout, horário e contexto.', 'Atualize hipótese após cada evidência; pare quando causa/ação forem sustentadas.'], pitfall: 'Executar vários comandos sem pergunta definida ou colar saída sem indicar origem, destino e horário.', exercise: 'Monte a sequência mínima para falha por nome de uma aplicação HTTPS, sem assumir inicialmente que DNS é a causa.', solution: 'Confirme escopo; consulte configuração e DNS; compare IP esperado; teste TCP/443; se abre, examine TLS/HTTP. A sequência pode variar conforme evidência inicial, mas cada teste precisa ter uma pergunta explícita.', document: 'Use timestamp, host/origem, destino, comando, saída, hipótese afetada e próximo passo.' },
  troubleshooting: { mechanism: 'Triagem profissional reduz incerteza sem ampliar impacto: define prioridade, coleta fatos, compara casos, testa hipóteses, controla mudanças e valida restauração com quem reportou.', investigation: ['Registre impacto, urgência, escopo e horário de início.', 'Faça perguntas reproduzíveis e confira mudanças recentes.', 'Formule hipóteses ordenadas e testes que as diferenciem.', 'Aplique ação autorizada, valide o sintoma e monitore recorrência.'], pitfall: 'Confundir correlação com causa, aplicar várias mudanças de uma vez ou encerrar após “parece que voltou”.', exercise: 'Escreva uma atualização de escalonamento em quatro linhas: impacto, evidência, hipótese e solicitação objetiva.', solution: 'Uma boa atualização identifica usuários/serviço afetados, testes com horário e resultado, causa provável sustentada e pedido específico para a equipe seguinte. Evite “rede está ruim”.', document: 'Ticket final: impacto, sintoma, escopo, testes/resultados, causa confirmada ou provável, mudança/aprovação, validação, responsável e risco residual.' },
  'labs-n1': { mechanism: 'A triagem N1 busca restaurar serviço por procedimentos autorizados e reunir dados que permitam escalonamento sem repetir perguntas ou testes.', investigation: ['Confirme identidade, ativo, localização e impacto.', 'Determine isolado versus múltiplos usuários.', 'Valide interface, IP, gateway, DNS e teste relevante.', 'Execute procedimento conhecido apenas se autorizado; escale o restante com evidência.'], pitfall: 'Reiniciar, redefinir senha, renovar DHCP ou alterar configuração antes de entender escopo e registrar estado inicial.', exercise: 'Um chamado diz “sem Internet”; dois colegas no mesmo ponto funcionam. Quais fatos pediria antes de escalar?', solution: 'Usuário/equipamento/local, horário, SSID/VLAN ou porta, IPv4/gateway/DNS, mensagem exata, alcance do gateway e teste a um destino autorizado. Compare o colega funcional sem acessar dados privados.', document: 'Inclua ticket, prioridade, contato, ativo, perguntas, testes, consentimento/ações, resultado e grupo de escalonamento.' },
  'labs-n2': { mechanism: 'N2 correlaciona evidência de cliente, rede, política e servidor. O objetivo é localizar a fronteira de falha e coordenar a equipe que pode agir naquele componente.', investigation: ['Compare mesma origem/destino em segmentos diferentes.', 'Correlacione logs com timestamp sincronizado.', 'Verifique rota de ida e retorno, ACL e serviço.', 'Planeje mudança mínima com aprovação, janela, rollback e validação.'], pitfall: 'Interpretar timeout isolado como confirmação de firewall ou alterar equipamento sem plano de retorno.', exercise: 'TCP/443 falha apenas na VLAN 40 e o log mostra deny correspondente. Que dados faltam para mudança segura?', solution: 'Origem/sub-rede e destino/porta precisos, regra e motivo do deny, fluxo esperado, aprovação do dono, janela, escopo mínimo, expiração quando aplicável e teste/rollback.', document: 'Preserve logs correlacionados, matriz de testes por origem, regra afetada, aprovação, execução, rollback e confirmação do solicitante.' },
  'projeto-final': { mechanism: 'Um relatório técnico transforma uma investigação em conhecimento repetível e auditável, separando fatos observados de hipóteses e ações propostas.', investigation: ['Escolha incidente e defina limite do ambiente fictício.', 'Colete evidências sem dados sensíveis.', 'Construa linha do tempo e valide a causa com testes.', 'Apresente ação, risco, rollback e validação final.'], pitfall: 'Escrever retrospectivamente como se a hipótese inicial fosse fato ou omitir resultado de testes que não confirmaram a suspeita.', exercise: 'Entregue um relatório que outra pessoa consiga reproduzir sem conversar com você.', solution: 'Inclua ticket, escopo, ativo, horário, sintoma, linha do tempo, comando/teste e saída, fatos versus hipótese, causa, ação aprovada, validação e pendências.', document: 'O entregável é um relatório sem credenciais ou dados pessoais reais, com evidências sintéticas, conclusão e limitações explícitas.' }
};

modules.forEach((module) => Object.assign(module, lessonEnrichment[module.id]));

const checkpointAnswers = {
  fundamentos: 'Ao MAC do gateway padrão. O host encapsula o pacote IP destinado à rede remota em um quadro local endereçado ao próximo salto.',
  osi: 'Não. TCP/443 estabelecido confirma transporte até aquela porta. Ainda é preciso validar negociação TLS, certificado, protocolo HTTP e comportamento da aplicação.',
  ipv4: 'Não. 192.168.0.0/16 é um bloco privado; para alcançar a Internet normalmente é necessário NAT, proxy ou túnel conforme a arquitetura.',
  subnetting: '10.20.30.150/27 está no bloco .128 a .159. O broadcast é 10.20.30.159; os hosts tradicionais vão de .129 a .158.',
  'cidr-vlsm': 'O bloco para 50 hosts deve ser alocado primeiro: blocos maiores têm menos opções de alinhamento e podem fragmentar o espaço se deixados para depois.',
  'tcp-udp': 'Não. Ping testa ICMP. HTTPS usa TCP/443 e depois TLS/HTTP; teste a porta e valide a aplicação separadamente.',
  dns: 'Compare a resposta e o servidor consultado para o nome; depois teste TCP na porta esperada contra o IP correto. DNS errado e porta bloqueada geram evidências diferentes.',
  dhcp: 'Discover e Request são iniciadas pelo cliente. Offer e Acknowledge são enviadas pelo servidor DHCP.',
  'arp-mac': 'O IP do gateway (next hop). O quadro local é entregue ao MAC do gateway; o pacote mantém o IP remoto como destino.',
  switching: 'Pelo MAC de destino do quadro, dentro do contexto da VLAN, não pelo endereço IP de camada 3.',
  vlan: 'Uma função de camada 3, como roteador ou switch L3 com interfaces/gateways das VLANs, além das rotas e políticas necessárias.',
  'gateway-routing': 'A rota /24, por ser o prefixo mais específico que combina com 10.10.2.8, desde que esteja ativa e aplicável.',
  'routing-table': 'É a rota padrão IPv4: combina com qualquer destino que não tenha uma rota mais específica selecionada.',
  'http-https': 'É uma resposta da camada de aplicação (HTTP) recebida de algum componente, que pode ser servidor, proxy ou balanceador; não prova falha física de rede.',
  tls: 'O hostname acessado precisa constar como nome válido no SAN do certificado (ou corresponder aos nomes cobertos segundo as regras aplicáveis).',
  firewall: 'Porque falta delimitar origem, destino, protocolo, porta, sentido, justificativa e escopo; uma regra ampla aumenta risco e não é testável de forma precisa.',
  vpn: 'Não. O túnel indica que a VPN foi estabelecida; rota, DNS, postura e autorização da aplicação ainda podem impedir o acesso.',
  wifi: 'Não. Associação ao rádio não comprova que DHCP entregou IP, gateway e DNS válidos nem que o destino está acessível.',
  diagnostico: 'Test-NetConnection -ComputerName <destino> -Port <porta> testa uma conexão TCP específica; interprete junto com rota, serviço e política.',
  troubleshooting: 'Repita o teste que reproduzia o sintoma e confirme recuperação com o solicitante; registre resultado e monitore se o risco de recorrência foi tratado.',
  'labs-n1': 'Inclua sintoma, impacto/escopo, ativo e usuário, horário, configuração coletada, testes e saídas, ações realizadas e o que ainda precisa ser investigado.',
  'labs-n2': 'Logs de firewall/servidor correlacionados no horário e origem, teste a partir de outra rede, estado do listener e verificação da rota de retorno ajudam a separar bloqueio silencioso de serviço parado.',
  'projeto-final': 'Ticket/escopo, ambiente e origem, timestamp, sequência de comandos e saídas, hipótese/cause, mudança aprovada, validação e pendências permitem reproduzir o diagnóstico.'
};

modules.forEach((module) => { module.checkAnswer = checkpointAnswers[module.id]; });

const diagnosticQuestions = [
  { id: 'next-hop', area: 'redes', areaLabel: 'Fundamentos de rede', level: 'Fundamentos', prompt: 'Um computador precisa enviar dados para um servidor em outra sub-rede. A qual endereço MAC ele entrega o primeiro quadro?', options: ['Ao MAC do servidor remoto', 'Ao MAC do gateway padrão', 'Ao MAC do servidor DNS', 'A um MAC broadcast da Internet'], answer: 1, explanation: 'O host entrega o quadro local ao MAC do próximo salto, normalmente o gateway. O pacote IP continua com o endereço do servidor como destino.' },
  { id: 'switch-learning', area: 'redes', areaLabel: 'Fundamentos de rede', level: 'Intermediário', prompt: 'Com base em que informação um switch de camada 2 aprende por qual porta encaminhar um MAC?', options: ['No MAC de origem do quadro recebido e na VLAN', 'No endereço DNS do computador', 'Na porta TCP de destino', 'No gateway padrão do host'], answer: 0, explanation: 'O switch aprende MAC de origem por porta e VLAN; depois usa a tabela CAM para encaminhar quadros conhecidos.' },
  { id: 'subnet', area: 'enderecamento', areaLabel: 'Endereçamento IP', level: 'Fundamentos', prompt: 'Qual é a rede que contém o endereço 192.168.10.70/26?', options: ['192.168.10.0/26', '192.168.10.32/26', '192.168.10.64/26', '192.168.10.128/26'], answer: 2, explanation: 'Um /26 tem blocos de 64 endereços no último octeto. O .70 está entre .64 e .127.' },
  { id: 'apipa', area: 'enderecamento', areaLabel: 'Endereçamento IP', level: 'Intermediário', prompt: 'Uma estação exibe IPv4 169.254.20.12 e não possui gateway. O que esse dado permite concluir?', options: ['O servidor DNS está obrigatoriamente fora do ar', 'A estação não obteve configuração IPv4 utilizável por DHCP; a causa ainda precisa ser investigada', 'A VLAN está certamente correta', 'A Internet está funcionando por NAT'], answer: 1, explanation: '169.254/16 é APIPA. É evidência de ausência de concessão IPv4 utilizável, não identifica sozinho se a causa é VLAN, relay, escopo ou serviço DHCP.' },
  { id: 'dns-result', area: 'servicos', areaLabel: 'DNS e serviços', level: 'Fundamentos', prompt: 'O nome do sistema resolve para um IP diferente do endereço publicado pela equipe responsável. Qual próximo passo é mais adequado?', options: ['Solicitar liberação geral de firewall', 'Registrar resposta, servidor DNS e horário; confirmar o valor esperado antes de solicitar correção', 'Reiniciar todos os equipamentos de rede', 'Concluir imediatamente que o servidor está desligado'], answer: 1, explanation: 'Preserve a resposta observada e confirme a referência autorizada. DNS incorreto pode levar o teste de porta ao destino errado.' },
  { id: 'icmp-tcp', area: 'servicos', areaLabel: 'DNS e serviços', level: 'Intermediário', prompt: 'O ping responde, mas o site HTTPS não abre. O que o ping ainda não confirmou?', options: ['Que há resposta ICMP do destino', 'Que TCP/443, TLS e a aplicação web estão funcionando', 'Que o host enviou pacotes ICMP', 'Que existe algum caminho IP até o respondente'], answer: 1, explanation: 'Ping usa ICMP. É necessário testar a porta TCP/443 e depois validar TLS e HTTP separadamente.' },
  { id: 'windows-ip', area: 'windows', areaLabel: 'Ferramentas Windows', level: 'Fundamentos', prompt: 'Qual comando PowerShell mostra a configuração IP, gateway e DNS das interfaces?', options: ['Get-NetIPConfiguration', 'Get-Process', 'Get-Service', 'Format-Table'], answer: 0, explanation: 'Get-NetIPConfiguration apresenta configuração IP por interface. Compare com o segmento esperado e observe interfaces ativas.' },
  { id: 'tcp-test', area: 'windows', areaLabel: 'Ferramentas Windows', level: 'Intermediário', prompt: 'Test-NetConnection servidor -Port 443 retorna TcpTestSucceeded: False. Qual conclusão é tecnicamente segura?', options: ['O firewall é definitivamente a causa', 'A tentativa TCP para aquele destino/porta não se estabeleceu; serviço, rota e política ainda precisam ser diferenciados', 'O DNS está definitivamente incorreto', 'O servidor não tem energia'], answer: 1, explanation: 'O resultado limita a conclusão à tentativa TCP. Compare outra origem, rota, listener e logs para descobrir onde o fluxo falha.' },
  { id: 'scope', area: 'troubleshooting', areaLabel: 'Raciocínio de suporte', level: 'Fundamentos', prompt: 'Uma pessoa relata falha, mas colegas próximos conseguem usar o sistema. Qual ação inicial melhora o diagnóstico?', options: ['Comparar configuração e testes entre o usuário afetado e um caso funcional, registrando escopo', 'Solicitar reinicialização de todos os switches', 'Alterar o firewall para todos os usuários', 'Encerrar o ticket porque o serviço funciona para alguém'], answer: 0, explanation: 'A comparação controlada ajuda a descobrir se a diferença está no cliente, segmento, identidade ou caminho, sem mudanças amplas.' },
  { id: 'evidence', area: 'troubleshooting', areaLabel: 'Raciocínio de suporte', level: 'Avançado', prompt: 'Somente uma VLAN não alcança a aplicação; o log do firewall registra deny para a origem, destino e porta corretos no horário do teste. Qual próximo passo é mais profissional?', options: ['Desativar o firewall temporariamente', 'Documentar o fluxo e a evidência, solicitar revisão/aprovação da regra mínima e planejar validação', 'Trocar o DNS de todos os clientes', 'Concluir sem comunicar o responsável da aplicação'], answer: 1, explanation: 'O log correlacionado é evidência forte de política. A alteração deve ter escopo mínimo, aprovação, janela e plano de validação.' }
];

const diagnosticRecommendations = {
  redes: { title: 'Fundamentos de rede', modules: ['fundamentos', 'osi', 'switching'] },
  enderecamento: { title: 'Endereçamento IP', modules: ['ipv4', 'subnetting', 'cidr-vlsm'] },
  servicos: { title: 'DNS e serviços', modules: ['dns', 'dhcp', 'tcp-udp'] },
  windows: { title: 'Ferramentas Windows', modules: ['diagnostico', 'labs-n1', 'labs-n2'] },
  troubleshooting: { title: 'Raciocínio de suporte', modules: ['troubleshooting', 'labs-n1', 'labs-n2'] }
};

const incidents = [
  { id: 'dns-app', title: 'Sistema interno não abre pelo nome', level: 'N1+', user: 'Marina Costa', device: 'NOTE-042', ip: '192.168.10.42/24', gateway: '192.168.10.1', dns: '192.168.10.5', system: 'portal.intra.local:443', time: '09:14', symptom: 'Internet funciona. O portal interno não abre pelo nome; colegas no mesmo andar acessam.', diagnosis: 'DNS aponta para endereço incorreto', tests: { config: ['IPv4: 192.168.10.42/24', 'Gateway: 192.168.10.1', 'DNS: 192.168.10.5', 'Configuração consistente com o segmento.'], gateway: ['Resposta de 192.168.10.1: tempo=1ms', 'Gateway alcançável.'], dns: ['portal.intra.local -> 10.40.8.90', 'Registro diverge do endereço publicado pelo time da aplicação: 10.40.8.25.'], port: ['Teste TCP 10.40.8.90:443 falhou.', 'Ainda não conclua bloqueio: o destino pode estar incorreto.'], route: ['Rota para 10.40.8.0/24 via 192.168.10.1.', 'Rota presente.'] } },
  { id: 'dhcp-apipa', title: 'Estação recebeu endereço 169.254.x.x', level: 'N1', user: 'Rafael Lima', device: 'DESK-118', ip: '169.254.20.12/16', gateway: 'ausente', dns: 'ausente', system: 'Rede corporativa', time: '10:32', symptom: 'A estação mostra conectividade limitada após mudança de mesa; outros usuários funcionam.', diagnosis: 'Porta do switch associada à VLAN incorreta', tests: { config: ['IPv4 APIPA: 169.254.20.12/16', 'Gateway e DNS ausentes.', 'O cliente não recebeu concessão DHCP.'], gateway: ['Não há gateway configurado para testar.'], dhcp: ['Sem resposta de oferta DHCP no segmento.', 'O escopo corporativo está ativo para a VLAN de usuários.'], vlan: ['Porta identificada na VLAN 30 (impressoras).', 'O equipamento deveria estar na VLAN 20 (usuários).'] } },
  { id: 'tcp-port', title: 'Nome resolve, aplicação expira na porta 443', level: 'N2', user: 'Equipe Financeiro', device: 'FIN-POOL', ip: '192.168.40.0/24', gateway: '192.168.40.1', dns: '192.168.40.5', system: 'financeiro.intra.local:443', time: '14:05', symptom: 'DNS retorna IP esperado e gateway responde. Usuários de outra VLAN acessam normalmente.', diagnosis: 'Regra de firewall entre VLANs não contempla a origem do Financeiro', tests: { dns: ['financeiro.intra.local -> 10.60.2.15', 'Endereço confere com a referência da aplicação.'], gateway: ['Gateway 192.168.40.1 respondeu em 1ms.'], port: ['TCP 10.60.2.15:443: timeout a partir da VLAN 40.', 'Mesmo teste funciona a partir da VLAN 20.'], route: ['Rota presente nos dois segmentos; próximo salto correto.'], firewall: ['Log às 14:05: fluxo origem VLAN 40 -> 10.60.2.15:443 negado pela política FW-APP-017.'] } },
  { id: 'service-down', title: 'Servidor responde, serviço web recusado', level: 'N2', user: 'Central de Operações', device: 'OPS-021', ip: '192.168.5.21/24', gateway: '192.168.5.1', dns: '192.168.5.5', system: 'inventario.intra.local:8443', time: '16:48', symptom: 'Nome resolve, ping responde e a porta 8443 retorna conexão recusada para todos os usuários.', diagnosis: 'Serviço web parou de escutar na porta 8443', tests: { dns: ['inventario.intra.local -> 10.50.1.30', 'Registro esperado.'], gateway: ['Gateway alcançável; usuários de dois segmentos reproduzem o problema.'], port: ['TCP 10.50.1.30:8443: conexão recusada.', 'Destino respondeu, mas não aceitou a sessão.'], service: ['Monitoramento: processo inventario-web parado desde 16:42.', 'Evento de falha de inicialização registrado no servidor.'] } }
];

const initialState = {
  profile: null,
  theme: 'light',
  route: 'dashboard',
  selectedModule: 'fundamentos',
  assessment: { answers: {}, currentIndex: 0, result: null, awarded: false },
  completed: [],
  favorites: [],
  notes: [],
  review: {},
  projects: {},
  lab: { incidentId: 'dns-app', evidence: [], report: '', hypothesis: '' },
  xp: 0,
  streak: 1,
  lastStudyDate: '',
  startedAt: new Date().toISOString()
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...initialState, ...saved, completed: saved.completed || [], favorites: saved.favorites || [], notes: saved.notes || [], review: saved.review || {}, projects: saved.projects || {}, lab: { ...initialState.lab, ...(saved.lab || {}) }, assessment: { ...initialState.assessment, ...(saved.assessment || {}) } };
  } catch (error) {
    console.warn('Não foi possível carregar o perfil local.', error);
    return { ...initialState };
  }
}

const state = loadState();
const root = document.getElementById('platform-root');
const escapeHTML = (value = '') => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const progressPercent = () => Math.round((state.completed.length / modules.length) * 100);
const moduleById = (id) => modules.find((item) => item.id === id) || modules[0];
const selectedIncident = () => incidents.find((item) => item.id === state.lab.incidentId) || incidents[0];

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function icon(name) {
  const paths = {
    grid: '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    book: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"/><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20"/>',
    route: '<circle cx="6" cy="6" r="3"/><circle cx="18" cy="18" r="3"/><path d="M9 6h3a3 3 0 0 1 3 3v6a3 3 0 0 0 3 3"/>',
    terminal: '<path d="m4 17 6-5-6-5"/><path d="M12 19h8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    folder: '<path d="M3 6a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
    note: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M5 21a7 7 0 0 1 14 0"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    arrow: '<path d="M5 12h14m-7-7 7 7-7 7"/>',
    close: '<path d="m18 6-12 12M6 6l12 12"/>',
    bulb: '<path d="M9 18h6m-5 4h4m-2-20a7 7 0 0 0-4 12.7c.6.4 1 1 1 1.8h6c0-.8.4-1.4 1-1.8A7 7 0 0 0 12 2z"/>',
    play: '<path d="m8 5 12 7-12 7z"/>',
    calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>'
  };
  return `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${paths[name] || paths.grid}</svg>`;
}

function navLink(route, label, iconName, section = '') {
  return `<button class="nav-link ${state.route === route ? 'active' : ''}" type="button" data-route="${route}">${icon(iconName)}<span>${label}</span>${section === 'progress' ? `<small>${progressPercent()}%</small>` : ''}</button>`;
}

function shell(content) {
  return `
    <div class="app-shell ${state.sidebarOpen ? 'sidebar-open' : ''}" data-theme="${state.theme}">
      <div class="mobile-scrim" data-action="close-sidebar"></div>
      <aside class="app-sidebar">
        <a class="app-brand" href="#" data-route="dashboard"><span class="brand-symbol">N<span>.</span></span><span><strong>NODE / STUDY</strong><small>TI learning environment</small></span></a>
        <div class="workspace-label">ESPAÇO PESSOAL <span class="online-dot"></span></div>
        <nav class="sidebar-nav" aria-label="Navegação principal">
          <p class="nav-caption">WORKSPACE</p>
          ${navLink('dashboard', 'Dashboard', 'grid')}
          ${navLink('tracks', 'Aprender e trilhas', 'route')}
          ${navLink('course', 'Curso de Redes', 'book')}
          <p class="nav-caption">PRÁTICA</p>
          ${navLink('lab', 'Troubleshooting Lab', 'target')}
          ${navLink('challenge', 'Desafio do dia', 'bulb')}
          ${navLink('subnet', 'Simulador subnetting', 'grid')}
          ${navLink('terminal', 'Terminal Windows', 'terminal')}
          ${navLink('projects', 'Projetos', 'folder')}
          <p class="nav-caption">PESSOAL</p>
          ${navLink('notes', 'Minhas anotações', 'note')}
          ${navLink('favorites', 'Favoritos', 'star')}
          ${navLink('review', 'Revisão espaçada', 'calendar')}
          ${navLink('progress', 'Progresso e skills', 'calendar', 'progress')}
          ${navLink('assessment', 'Avaliação de nível', 'target')}
        </nav>
        <div class="sidebar-bottom">
          <button class="nav-link" data-route="profile" type="button">${icon('user')}<span>Perfil e configurações</span></button>
          <div class="sidebar-user"><span class="avatar">${escapeHTML((state.profile?.name || 'A').slice(0, 1).toUpperCase())}</span><span><strong>${escapeHTML(state.profile?.name || 'Aluno')}</strong><small>Nível ${levelForXp(state.xp)}</small></span><button class="icon-button logout-button" title="Encerrar sessão local" data-action="logout">↗</button></div>
        </div>
      </aside>
      <main class="app-main">
        <header class="app-topbar"><button class="icon-button menu-trigger" aria-label="Abrir menu" data-action="toggle-sidebar">${icon('menu')}</button><div class="breadcrumb"><span>Estudos</span><span>/</span><strong>${escapeHTML(pageTitle())}</strong></div><div class="topbar-tools"><span class="streak-indicator">${icon('calendar')} ${state.streak} dia${state.streak === 1 ? '' : 's'}</span><span class="xp-indicator">✦ ${state.xp} XP</span><button class="icon-button" aria-label="Alternar tema" title="Alternar tema" data-action="theme">${icon(state.theme === 'dark' ? 'sun' : 'sun')}</button><button class="avatar avatar-small" aria-label="Abrir perfil" data-route="profile">${escapeHTML((state.profile?.name || 'A').slice(0, 1).toUpperCase())}</button></div></header>
        <div class="view-container">${content}</div>
      </main>
    </div>`;
}

function pageTitle() {
  const names = { dashboard: 'Dashboard', tracks: 'Trilhas de carreira', course: 'Redes para Suporte N1 → N2', lesson: moduleById(state.selectedModule).title, lab: 'Troubleshooting Lab', challenge: 'Desafio do dia', subnet: 'Simulador de Subnetting', terminal: 'Terminal Simulator', projects: 'Projetos', notes: 'Minhas anotações', favorites: 'Favoritos', review: 'Revisão espaçada', progress: 'Mapa de progresso', profile: 'Perfil e configurações', assessment: 'Avaliação de nível', 'assessment-result': 'Resultado diagnóstico' };
  return names[state.route] || 'Dashboard';
}

function pageHeader(kicker, title, description = '') {
  return `<div class="page-heading"><div><p class="section-kicker">${kicker}</p><h1>${title}</h1>${description ? `<p>${description}</p>` : ''}</div></div>`;
}

function getCurrentModule() {
  return moduleById(state.selectedModule);
}

function dashboardView() {
  const next = modules.find((item) => !state.completed.includes(item.id)) || modules[0];
  const recentNote = state.notes[state.notes.length - 1];
  const diagnosticCard = state.assessment.result ? assessmentDashboardSummary() : `<section class="assessment-entry panel"><div><p class="section-kicker">PONTO DE PARTIDA</p><h2>Ainda não mapeamos seu nível</h2><p>Faça uma avaliação rápida para descobrir em quais assuntos você já tem base e por onde vale começar.</p></div><button class="primary-action" data-action="start-assessment" type="button">Fazer diagnóstico ${icon('arrow')}</button></section>`;
  return `
    ${pageHeader('QUARTA-FEIRA · ROTEIRO DE ESTUDO', `Olá, ${escapeHTML(state.profile?.name?.split(' ')[0] || 'estudante')}.`, 'Seu espaço de prática está pronto. Continue de onde parou ou investigue um incidente.')}
    ${diagnosticCard}
    <section class="continue-strip">
      <div class="continue-copy"><p class="micro-label">CONTINUE DE ONDE PAROU <span class="status-tag">EM ANDAMENTO</span></p><h2>Redes para Suporte N1 → N2</h2><p>${escapeHTML(next.title)} <span class="muted-separator">/</span> ${escapeHTML(next.group)}</p><div class="progress-track"><span style="width:${progressPercent()}%"></span></div><small>${progressPercent()}% da trilha · ${state.completed.length} de ${modules.length} módulos concluídos</small></div>
      <button class="continue-button" data-action="open-module" data-id="${next.id}" type="button">Continuar ${icon('arrow')}</button>
    </section>
    <div class="metric-row"><article class="metric-tile"><span>TRILHA ATIVA</span><strong>01 <small>/ 12</small></strong><p>Redes e suporte</p></article><article class="metric-tile"><span>XP ACUMULADO</span><strong>${state.xp}</strong><p>Nível ${levelForXp(state.xp)} · ${nextLevelLabel(state.xp)}</p></article><article class="metric-tile"><span>SEQUÊNCIA</span><strong>${state.streak} <small>dia${state.streak === 1 ? '' : 's'}</small></strong><p>Ritmo de estudo local</p></article><article class="metric-tile"><span>REVISÕES</span><strong>${Math.max(0, state.completed.length ? 1 : 0)}</strong><p>${state.completed.length ? 'DNS · sugerido para revisar' : 'Conclua uma aula para começar'}</p></article></div>
    <div class="dashboard-columns"><section class="panel learning-panel"><div class="panel-heading"><div><p class="section-kicker">SEU WORKSPACE</p><h2>Trilhas de carreira</h2></div><button class="text-button" data-route="tracks" type="button">Ver todas ${icon('arrow')}</button></div><div class="track-list">${tracks.slice(0, 4).map((track, index) => `<button class="track-row ${track.active ? 'track-active' : ''}" type="button" data-action="open-track" data-id="${track.id}"><span class="track-index">0${index + 1}</span><span class="track-detail"><strong>${escapeHTML(track.title)}</strong><small>${escapeHTML(track.description)}</small></span><span class="track-state ${track.active ? 'state-active' : ''}">${track.active ? `${progressPercent()}%` : 'ROTEIRO'}</span>${icon('arrow')}</button>`).join('')}</div></section>
    <section class="panel focus-panel"><div class="panel-heading"><div><p class="section-kicker">PRÓXIMA AÇÃO</p><h2>Investigue um chamado</h2></div><span class="panel-icon">${icon('target')}</span></div><p>Treine a triagem por evidências. Execute os testes em ordem, formule uma hipótese e registre uma resolução.</p><div class="incident-preview"><span class="priority-dot"></span><div><strong>${escapeHTML(incidents[0].title)}</strong><small>INCIDENTE · ${incidents[0].level} · 8–12 MIN</small></div></div><button class="outline-button full-width" data-route="lab" type="button">Abrir troubleshooting lab ${icon('arrow')}</button></section></div>
    <div class="dashboard-columns second-row"><section class="panel"><div class="panel-heading"><div><p class="section-kicker">HABILIDADES</p><h2>Mapa de skills</h2></div><button class="text-button" data-route="progress" type="button">Detalhes ${icon('arrow')}</button></div>${skillBars()}</section><section class="panel"><div class="panel-heading"><div><p class="section-kicker">PROJETO ATIVO</p><h2>Kit NETCHECK</h2></div><span class="project-status">EM CURSO</span></div><p>Construa um roteiro de coleta de rede no PowerShell e gere um resumo técnico reproduzível.</p><div class="project-mini-progress"><span style="width:${projectProgress('netcheck')}%"></span></div><button class="text-button" data-route="projects" type="button">Abrir projeto ${icon('arrow')}</button>${recentNote ? `<p class="last-note"><strong>Última anotação:</strong> ${escapeHTML(recentNote.text.slice(0, 100))}</p>` : ''}</section></div>`;
}

function skillBars() {
  const skills = [['Redes', Math.min(100, 18 + state.completed.length * 4)], ['Windows', Math.min(100, 12 + state.completed.length * 2)], ['PowerShell', state.completed.includes('powershell') ? 40 : 8], ['Cloud', 0]];
  return `<div class="skill-bars">${skills.map(([label, amount]) => `<div class="skill-line"><span>${label}</span><div class="skill-track"><i style="width:${amount}%"></i></div><strong>${amount}%</strong></div>`).join('')}</div>`;
}

function tracksView() {
  return `${pageHeader('ROADMAP DE CARREIRA', 'Trilhas de TI', 'Do fundamento à infraestrutura. A trilha de Redes está ativa; os outros percursos funcionam como mapa de próximos estudos.')}
    <div class="track-catalog">${tracks.map((track, index) => `<article class="track-card ${track.active ? 'selected' : ''}"><div class="track-card-top"><span class="track-index">${String(index + 1).padStart(2, '0')}</span><span class="track-state ${track.active ? 'state-active' : ''}">${track.active ? 'ATIVA' : 'ROADMAP'}</span></div><h2>${escapeHTML(track.title)}</h2><p>${escapeHTML(track.description)}</p><div class="track-card-bottom"><span>${track.active ? `${modules.length} módulos` : 'Percurso planejado'}</span><button class="icon-button" aria-label="Abrir trilha" data-action="open-track" data-id="${track.id}">${icon('arrow')}</button></div></article>`).join('')}</div>`;
}

function courseView() {
  const groups = [...new Set(modules.map((item) => item.group))];
  return `${pageHeader('TRILHA ATIVA · 23 MÓDULOS', 'Redes para Suporte N1 → N2', 'Aprenda por camadas, valide cada hipótese e registre evidências. A sequência completa está organizada abaixo.')}
    <div class="course-overview panel"><div><p class="section-kicker">OBJETIVO DA TRILHA</p><h2>Diagnosticar conectividade até a aplicação</h2><p>Pré-requisitos: nenhum. Nível: fundamentos a N2. Projeto final: incidente documentado da empresa virtual.</p></div><div class="course-overview-score"><strong>${progressPercent()}%</strong><small>CONCLUÍDO</small></div></div>
    ${groups.map((group) => `<section class="module-group"><div class="group-heading"><h2>${escapeHTML(group)}</h2><span>${modules.filter((item) => item.group === group).length} módulos</span></div><div class="module-list">${modules.filter((item) => item.group === group).map((item, index) => `<button class="module-row ${state.completed.includes(item.id) ? 'is-complete' : ''} ${state.selectedModule === item.id ? 'is-current' : ''}" data-action="open-module" data-id="${item.id}" type="button"><span class="module-index">${state.completed.includes(item.id) ? icon('check') : String(modules.indexOf(item) + 1).padStart(2, '0')}</span><span class="module-row-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.goal)}</small></span><span class="module-level">${index === 0 ? '10 MIN' : '15 MIN'}</span>${icon('arrow')}</button>`).join('')}</div></section>`).join('')}`;
}

function lessonView() {
  const item = getCurrentModule();
  const index = modules.indexOf(item);
  const isComplete = state.completed.includes(item.id);
  const isFavorite = state.favorites.includes(item.id);
  const matchingNote = state.notes.find((note) => note.moduleId === item.id);
  return `${pageHeader(`MÓDULO ${String(index + 1).padStart(2, '0')} · ${escapeHTML(item.group.toUpperCase())}`, escapeHTML(item.title), escapeHTML(item.goal))}
    <div class="lesson-progress-row"><span>AULA ${String(index + 1).padStart(2, '0')} / ${modules.length}</span><div class="progress-track"><span style="width:${Math.round((index + 1) / modules.length * 100)}%"></span></div><strong>${Math.round((index + 1) / modules.length * 100)}%</strong></div>
    <div class="lesson-layout"><article class="panel lesson-article">
      <div class="lesson-meta"><span class="status-tag">${isComplete ? 'CONCLUÍDA' : 'EM ANDAMENTO'}</span><span>APRENDER · INVESTIGAR · APLICAR · DOCUMENTAR</span></div>
      <section><p class="section-kicker">01 · OBJETIVO E PRÉ-REQUISITOS</p><h2>O que você precisa conseguir fazer</h2><p>${escapeHTML(item.goal)}</p><p class="lesson-prerequisite"><strong>Pré-requisitos:</strong> ${escapeHTML(item.prerequisites || (index === 0 ? 'Nenhum. Esta aula começa pelos conceitos essenciais.' : `Compreender ${modules[index - 1].title.toLowerCase()} ou consultar essa aula como referência.`))}</p></section>
      <section><p class="section-kicker">02 · CONCEITO E MECANISMO</p><h2>O que é, por que existe e como funciona</h2><p>${escapeHTML(item.concept)}</p><div class="mechanism-block"><strong>O mecanismo por trás do conceito</strong><p>${escapeHTML(item.mechanism)}</p></div></section>
      <section><p class="section-kicker">03 · DEMONSTRAÇÃO</p><h2>Exemplo de ambiente real</h2><div class="example-block"><span class="example-label">CENÁRIO</span><p>${escapeHTML(item.example)}</p></div><h3 class="subsection-title">Roteiro de investigação</h3><ol class="lesson-steps">${item.investigation.map((step) => `<li>${escapeHTML(step)}</li>`).join('')}</ol></section>
      <section><p class="section-kicker">04 · FERRAMENTA E INTERPRETAÇÃO</p><h2>Execute uma pergunta, não apenas um comando</h2><code class="command-block">PS C:\\&gt; ${escapeHTML(item.command)}</code><p>${escapeHTML(item.interpret)}</p><div class="warning-block"><strong>Erro comum</strong><p>${escapeHTML(item.pitfall)}</p></div></section>
      <section><p class="section-kicker">05 · EXERCÍCIO ATIVO</p><h2>Resolva antes de abrir a resposta</h2><div class="exercise-prompt"><span class="example-label">SUA TAREFA</span><p>${escapeHTML(item.exercise)}</p></div><details class="checkpoint"><summary>${icon('bulb')} Ver solução comentada</summary><p>${escapeHTML(item.solution)}</p></details></section>
      <section><p class="section-kicker">06 · CHECKPOINT</p><h2>Recupere o conceito de memória</h2><details class="checkpoint checkpoint-question"><summary>${icon('bulb')} ${escapeHTML(item.check)}</summary><p>${escapeHTML(item.checkAnswer)}</p></details><p class="checkpoint-instruction">Responda em voz alta ou escreva uma tentativa nas anotações antes de revelar a solução. Depois explique por que as alternativas incorretas não se aplicam.</p></section>
      <section><p class="section-kicker">07 · APLICAÇÃO E DOCUMENTAÇÃO</p><h2>Como isso aparece no trabalho</h2><p>Use o conhecimento para reduzir hipóteses, não para justificar uma mudança prematura. Registre fatos observados separadamente das conclusões:</p><div class="documentation-block"><span>REGISTRO MÍNIMO</span><p>${escapeHTML(item.document)}</p></div><p class="practice-assignment"><strong>Prática da aula:</strong> ${escapeHTML(item.practice)}</p></section>
      <section class="lesson-note-section"><label for="lesson-note">ANOTAÇÃO DESTA AULA</label><textarea id="lesson-note" data-note-module="${item.id}" placeholder="Registre sua tentativa, resultado, dúvidas e evidências importantes...">${escapeHTML(matchingNote?.text || '')}</textarea><button class="outline-button" data-action="save-lesson-note" data-id="${item.id}" type="button">Salvar anotação</button></section>
      <div class="lesson-actions"><button class="outline-button" data-action="favorite-module" data-id="${item.id}" type="button">${icon('star')} ${isFavorite ? 'Remover dos favoritos' : 'Favoritar aula'}</button><button class="primary-action" data-action="complete-module" data-id="${item.id}" type="button">${isComplete ? 'Aula concluída' : 'Marcar como concluída'} ${icon('check')}</button></div>
    </article><aside class="panel lesson-aside"><p class="section-kicker">AO FINAL VOCÊ CONSEGUE</p><ul><li>Explicar o conceito sem decorar uma definição.</li><li>Executar o teste relacionado.</li><li>Interpretar o resultado com limites.</li><li>Aplicar o raciocínio em um incidente.</li></ul><div class="aside-divider"></div><p class="section-kicker">TRILHA DA AULA</p><ol class="lesson-outline"><li>Conceito e mecanismo</li><li>Exemplo e investigação</li><li>Comando e interpretação</li><li>Exercício e checkpoint</li><li>Aplicação e documentação</li></ol><div class="aside-divider"></div><p class="section-kicker">PRÓXIMO MÓDULO</p><strong>${escapeHTML(modules[(index + 1) % modules.length].title)}</strong><button class="text-button" data-action="open-module" data-id="${modules[(index + 1) % modules.length].id}" type="button">Ir para próxima aula ${icon('arrow')}</button><div class="aside-tip"><strong>Prática recomendada</strong><p>Abra o terminal simulado e execute o comando da aula. As saídas são didáticas, não executam comandos reais no Windows.</p><button class="text-button" data-route="terminal" type="button">Abrir terminal ${icon('arrow')}</button></div></aside></div>`;
}

function labView() {
  const incident = selectedIncident();
  const testItems = Object.keys(incident.tests);
  const evidence = state.lab.evidence || [];
  const allEvidence = testItems.every((test) => evidence.includes(test));
  const options = [...new Set([incident.diagnosis, 'Falha de rota entre redes', 'Serviço de destino indisponível', 'Configuração incorreta no cliente', 'Falha de resolução DNS'])];
  return `${pageHeader('INCIDENT RESPONSE · LAB 01', 'Troubleshooting Lab', 'Investigue antes de concluir. Cada teste revela uma evidência parcial; documente hipótese, ação e validação.')}
    <div class="incident-selector panel"><label for="incident-select">INCIDENTE ATIVO</label><select id="incident-select">${incidents.map((item) => `<option value="${item.id}" ${item.id === incident.id ? 'selected' : ''}>${escapeHTML(item.title)} · ${item.level}</option>`).join('')}</select><span class="status-tag">${incident.level}</span></div>
    <div class="lab-layout"><div class="lab-main"><section class="panel ticket-panel"><div class="ticket-header"><span>TICKET #${String(1048 + incidents.indexOf(incident)).padStart(4, '0')}</span><span class="priority-tag">PRIORIDADE MÉDIA</span></div><h2>${escapeHTML(incident.title)}</h2><p>${escapeHTML(incident.symptom)}</p><div class="incident-facts">${[['Usuário', incident.user], ['Computador', incident.device], ['IPv4', incident.ip], ['Gateway', incident.gateway], ['DNS', incident.dns], ['Sistema', incident.system], ['Horário', incident.time]].map(([label, value]) => `<div><small>${label}</small><strong>${escapeHTML(value)}</strong></div>`).join('')}</div></section>
    <section class="panel test-panel"><div class="panel-heading"><div><p class="section-kicker">COLETA DE EVIDÊNCIAS</p><h2>Escolha um teste</h2></div><span>${evidence.length} executados</span></div><div class="test-grid">${testItems.map((test) => `<button class="test-button ${evidence.includes(test) ? 'test-done' : ''}" data-action="run-lab-test" data-test="${test}" type="button"><span>${evidence.includes(test) ? icon('check') : icon('play')}</span><strong>${testLabels(test)}</strong><small>${evidence.includes(test) ? 'EXECUTADO' : 'Executar teste'}</small></button>`).join('')}</div><div class="evidence-list">${evidence.map((test) => `<article class="evidence-item"><span>${icon('check')}</span><div><strong>${testLabels(test)}</strong>${incident.tests[test].map((line) => `<p>${escapeHTML(line)}</p>`).join('')}</div></article>`).join('') || '<p class="empty-state">Nenhum teste executado. Comece pela evidência que melhor diferencia suas hipóteses.</p>'}</div></section>
    <section class="panel diagnosis-panel"><p class="section-kicker">HIPÓTESE E AÇÃO</p><h2>O que explica melhor as evidências?</h2><label for="lab-hypothesis">DIAGNÓSTICO PROVÁVEL</label><select id="lab-hypothesis"><option value="">Selecione uma hipótese</option>${options.map((option) => `<option ${state.lab.hypothesis === option ? 'selected' : ''}>${escapeHTML(option)}</option>`).join('')}</select><label for="lab-report">DOCUMENTAÇÃO DO INCIDENTE</label><textarea id="lab-report" placeholder="Sintoma, impacto, testes e resultados, hipótese, ação recomendada e validação...">${escapeHTML(state.lab.report)}</textarea><button class="primary-action" data-action="submit-lab" type="button">Registrar diagnóstico ${icon('arrow')}</button>${state.lab.result ? `<div class="lab-feedback ${state.lab.result.correct ? 'feedback-correct' : 'feedback-review'}"><strong>${state.lab.result.correct ? 'Diagnóstico coerente com as evidências' : 'Revise a hipótese antes de encerrar'}</strong><p>${escapeHTML(state.lab.result.message)}</p><span>+${state.lab.result.xp} XP</span></div>` : ''}</section></div>
    <aside class="panel lab-guide"><p class="section-kicker">ROTEIRO N1 → N2</p><h2>Investigue em camadas</h2><ol><li>Confirme alcance e impacto.</li><li>Verifique configuração IP local.</li><li>Teste gateway, DNS, rota e porta conforme o sintoma.</li><li>Formule causa apenas com evidência suficiente.</li><li>Proponha correção autorizada e validação.</li></ol><div class="aside-divider"></div><p class="section-kicker">CRITÉRIO DE CONCLUSÃO</p><p>Execute os testes necessários, selecione uma causa compatível e descreva a ação e como confirmaria a recuperação.</p><div class="lab-progress"><span style="width:${Math.min(100, Math.round(evidence.length / testItems.length * 100))}%"></span></div><small>${evidence.length} de ${testItems.length} evidências</small></aside></div>`;
}

function challengeView() {
  const submitted = state.challenge?.date === new Date().toISOString().slice(0, 10);
  return `${pageHeader('CENÁRIO CURTO · RACIOCÍNIO TÉCNICO', 'Desafio do dia', 'Escolha o teste que melhor separa as hipóteses. Não procure o comando mais famoso: procure a próxima evidência útil.')}
    <section class="panel challenge-view"><div class="ticket-header"><span>DESAFIO #${new Date().toISOString().slice(0, 10).replaceAll('-', '')}</span><span class="priority-tag">N1+</span></div><p class="section-kicker">TICKET DE SUPORTE</p><h2>O gateway responde, mas o sistema interno não abre</h2><p>Usuário relata que outros sites abrem normalmente. O sistema corporativo <code>erp.intra.local</code> não abre pelo nome. O incidente afeta apenas este usuário. Você confirmou que o gateway responde.</p><label for="challenge-answer">QUAL É O PRÓXIMO TESTE MAIS ÚTIL?</label><select id="challenge-answer"><option value="">Escolha uma opção</option><option value="dns">Consultar DNS e comparar o endereço retornado com a referência do ERP</option><option value="restart">Reiniciar o computador imediatamente</option><option value="firewall">Solicitar liberação geral no firewall</option><option value="cable">Trocar o cabo de rede</option></select><label for="challenge-reason">POR QUE ESSE TESTE?</label><textarea id="challenge-reason" placeholder="Explique qual hipótese o teste valida e o que faria com cada resultado..."></textarea><button class="primary-action" data-action="submit-challenge" type="button">Enviar raciocínio ${icon('arrow')}</button>${submitted ? `<div class="lab-feedback ${state.challenge.correct ? 'feedback-correct' : 'feedback-review'}"><strong>${state.challenge.correct ? 'Boa sequência de investigação' : 'Reavalie a evidência disponível'}</strong><p>${escapeHTML(state.challenge.message)}</p><span>+${state.challenge.xp} XP</span></div>` : ''}</section><aside class="panel challenge-coach"><p class="section-kicker">PISTA DE RACIOCÍNIO</p><h2>O que já foi validado?</h2><ul><li>A Internet funciona para outros sites.</li><li>O gateway responde.</li><li>O problema é isolado e ocorre ao usar o nome do ERP.</li></ul><p>Um bom próximo teste verifica a camada que ainda está diretamente ligada ao sintoma, sem fazer mudanças amplas.</p><button class="text-button" data-route="lab" type="button">Praticar em um incidente completo ${icon('arrow')}</button></aside>`;
}

function reviewView() {
  const candidates = state.completed.map((id) => moduleById(id));
  const reviewItems = candidates.filter((item) => !state.review[item.id] || state.review[item.id].due <= Date.now());
  const list = reviewItems.length ? reviewItems : candidates.slice(-3);
  return `${pageHeader('RECALL ATIVO · REVISÃO ESPAÇADA', 'Revisões', 'Tente recordar o conceito antes de abrir a aula. Sua resposta define quando o assunto volta à fila.')}
    <div class="review-list">${list.map((item) => `<article class="panel review-card"><div><span class="status-tag">${escapeHTML(item.group)}</span><h2>${escapeHTML(item.title)}</h2><p>${escapeHTML(item.check)}</p></div><div class="review-actions"><button class="review-rating" data-action="review-rate" data-id="${item.id}" data-rating="again" type="button">Tenho dificuldade</button><button class="review-rating" data-action="review-rate" data-id="${item.id}" data-rating="hard" type="button">Rever em breve</button><button class="review-rating rating-easy" data-action="review-rate" data-id="${item.id}" data-rating="easy" type="button">Lembrei</button></div></article>`).join('') || '<div class="panel empty-state">Conclua uma aula para começar sua fila de revisão espaçada.</div>'}</div>`;
}

function testLabels(test) {
  return ({ config: 'IPConfig / configuração', gateway: 'Alcance do gateway', dns: 'Consulta DNS', port: 'Teste da porta TCP', route: 'Tabela de rotas', dhcp: 'Concessão DHCP', vlan: 'Verificar VLAN', firewall: 'Log de firewall', service: 'Estado do serviço' })[test] || test;
}

function subnetView() {
  return `${pageHeader('NETWORK CALCULATOR', 'Simulador de Subnetting', 'Divida uma rede em sub-redes iguais e confira limites, hosts disponíveis e máscara. O cálculo é feito no navegador.')}
    <div class="subnet-layout"><section class="panel subnet-controls"><p class="section-kicker">PARÂMETROS DA REDE</p><label for="subnet-cidr">REDE DE ORIGEM</label><input id="subnet-cidr" value="192.168.10.0/24" autocomplete="off"><label for="subnet-count">QUANTIDADE DE SUB-REDES</label><select id="subnet-count"><option>2</option><option selected>4</option><option>8</option><option>16</option><option>32</option><option>64</option></select><button class="primary-action" data-action="calculate-subnet" type="button">Calcular sub-redes ${icon('arrow')}</button><div class="subnet-error" id="subnet-error" role="status"></div><p class="subnet-hint">Para /31 e /32, a contagem tradicional de hosts não se aplica; use /24 a /30 para este exercício.</p></section><section class="panel subnet-results"><div class="panel-heading"><div><p class="section-kicker">RESULTADO</p><h2 id="subnet-summary">192.168.10.0/24 → 4 blocos /26</h2></div></div><div class="subnet-table-wrap"><table><thead><tr><th>REDE</th><th>PRIMEIRO HOST</th><th>ÚLTIMO HOST</th><th>BROADCAST</th><th>HOSTS</th></tr></thead><tbody id="subnet-table"></tbody></table></div></section></div>`;
}

function terminalView() {
  return `${pageHeader('WINDOWS SANDBOX · RESPOSTAS DIDÁTICAS', 'Terminal Simulator', 'Teste comandos comuns e interprete a saída. Este laboratório não executa comandos no sistema operacional real.')}
    <div class="terminal-layout"><section class="terminal-window"><div class="terminal-titlebar"><div class="terminal-lights"><i></i><i></i><i></i></div><span>Windows PowerShell · LAB-NET-01</span><button data-action="clear-terminal" title="Limpar terminal">CLS</button></div><div class="terminal-screen" id="terminal-screen" aria-live="polite"><p>Windows PowerShell</p><p>Laboratório de redes educacional · saída simulada</p><p>Digite <strong>help</strong> para listar comandos. Exemplos: ipconfig /all, ping 8.8.8.8, nslookup intranet.local</p>${(state.terminalHistory || []).map((line) => `<p>${escapeHTML(line)}</p>`).join('')}</div><form class="terminal-prompt" id="terminal-form"><label for="terminal-command">PS C:\\Lab&gt;</label><input id="terminal-command" autocomplete="off" spellcheck="false" placeholder="Digite um comando" aria-label="Comando do terminal"><button type="submit" aria-label="Executar comando">${icon('arrow')}</button></form></section><aside class="panel terminal-cheatsheet"><p class="section-kicker">COMANDOS DO LAB</p><h2>Comece por uma hipótese</h2><div class="command-shortcuts">${['ipconfig /all', 'ping 8.8.8.8', 'nslookup intranet.local', 'tracert 10.20.4.18', 'Test-NetConnection app -Port 443', 'Get-NetIPConfiguration', 'Get-NetRoute', 'Get-NetTCPConnection -State Established'].map((cmd) => `<button data-action="insert-command" data-command="${escapeHTML(cmd)}" type="button"><code>${escapeHTML(cmd)}</code>${icon('arrow')}</button>`).join('')}</div></aside></div>`;
}

const projects = [
  { id: 'netcheck', title: 'NETCHECK · Kit de diagnóstico', level: 'N1+', description: 'Organize coleta de IP, rota, DNS e conectividade em um roteiro reproduzível de PowerShell.', tasks: ['Listar configuração de rede', 'Validar gateway e rota padrão', 'Consultar DNS do destino', 'Testar porta da aplicação', 'Gerar resumo técnico do incidente'] },
  { id: 'incident-report', title: 'Relatório de incidente TechCorp', level: 'N1', description: 'Documente o diagnóstico completo de um incidente de rede com evidências e validação.', tasks: ['Definir impacto e escopo', 'Registrar dados do equipamento', 'Anexar saída dos testes', 'Explicar causa provável', 'Documentar correção e validação'] },
  { id: 'subnet-plan', title: 'Plano de endereçamento', level: 'N2', description: 'Planeje redes para equipes com tamanhos distintos usando CIDR e VLSM.', tasks: ['Levantar número de hosts', 'Reservar bloco de origem', 'Calcular sub-redes', 'Definir gateways', 'Documentar plano e reservas'] }
];

function projectProgress(id) {
  const tasks = state.projects[id] || [];
  const project = projects.find((item) => item.id === id);
  return project ? Math.round(tasks.length / project.tasks.length * 100) : 0;
}

function projectsView() {
  return `${pageHeader('BUILD · APPLY · DOCUMENT', 'Projetos', 'Transforme os conceitos em entregáveis que demonstram seu raciocínio técnico.')}
    <div class="project-grid">${projects.map((project) => { const done = state.projects[project.id] || []; return `<article class="panel project-card"><div class="project-card-head"><span class="status-tag">${project.level}</span><span>${projectProgress(project.id)}%</span></div><h2>${escapeHTML(project.title)}</h2><p>${escapeHTML(project.description)}</p><div class="project-mini-progress"><span style="width:${projectProgress(project.id)}%"></span></div><div class="project-checklist">${project.tasks.map((task, index) => `<label><input type="checkbox" data-project="${project.id}" data-task="${index}" ${done.includes(index) ? 'checked' : ''}><span>${escapeHTML(task)}</span></label>`).join('')}</div></article>`; }).join('')}</div>`;
}

function notesView(favoritesOnly = false) {
  const notes = favoritesOnly ? state.notes.filter((note) => state.favorites.includes(note.moduleId)) : state.notes;
  const favoriteModules = modules.filter((item) => state.favorites.includes(item.id));
  return `${pageHeader(favoritesOnly ? 'BIBLIOTECA PESSOAL' : 'MEMÓRIA DE ESTUDO', favoritesOnly ? 'Favoritos' : 'Minhas anotações', favoritesOnly ? 'Aulas salvas para voltar rapidamente.' : 'Notas vinculadas às aulas ficam salvas neste navegador.')}${favoritesOnly ? `<div class="module-list">${favoriteModules.map((item) => `<button class="module-row" data-action="open-module" data-id="${item.id}" type="button"><span class="module-index">${icon('star')}</span><span class="module-row-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.goal)}</small></span>${icon('arrow')}</button>`).join('') || '<div class="panel empty-state">Você ainda não favoritou nenhuma aula. Abra uma aula e use “Favoritar”.</div>'}</div>` : `<div class="notes-list">${notes.map((note) => `<article class="panel note-card"><div><span class="status-tag">${escapeHTML(moduleById(note.moduleId).title)}</span><small>${new Date(note.updatedAt).toLocaleDateString('pt-BR')}</small></div><p>${escapeHTML(note.text)}</p><button class="text-button" data-action="open-module" data-id="${note.moduleId}" type="button">Abrir aula ${icon('arrow')}</button></article>`).join('') || '<div class="panel empty-state">Nenhuma anotação salva. Dentro de qualquer aula, escreva suas observações e selecione “Salvar anotação”.</div>'}</div>`}`;
}

function progressView() {
  return `${pageHeader('TEU DESENVOLVIMENTO', 'Progresso e habilidades', 'Progresso salvo localmente neste dispositivo. Marque aulas concluídas após praticar e revisar os checkpoints.')}
    <div class="progress-overview panel"><div><p class="section-kicker">REDES PARA SUPORTE N1 → N2</p><h2>${state.completed.length} de ${modules.length} módulos concluídos</h2><div class="progress-track"><span style="width:${progressPercent()}%"></span></div></div><strong>${progressPercent()}%</strong></div><div class="progress-skill-panel panel"><div class="panel-heading"><div><p class="section-kicker">MAPA DE SKILLS</p><h2>Capacidade percebida</h2></div></div>${skillBars()}<p class="subnet-hint">Indicadores de aprendizado inicial, não uma certificação de competência. Use os projetos e laboratórios para validar habilidades.</p></div><div class="module-list">${modules.map((item) => `<button class="module-row ${state.completed.includes(item.id) ? 'is-complete' : ''}" data-action="open-module" data-id="${item.id}" type="button"><span class="module-index">${state.completed.includes(item.id) ? icon('check') : '○'}</span><span class="module-row-copy"><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.group)}</small></span><span class="module-level">${state.completed.includes(item.id) ? 'CONCLUÍDO' : 'PENDENTE'}</span>${icon('arrow')}</button>`).join('')}</div>`;
}

function profileView() {
  return `${pageHeader('CONFIGURAÇÕES PESSOAIS', 'Perfil e preferências', 'As informações e o progresso deste MVP ficam armazenados localmente no navegador.')}
    <section class="panel profile-panel"><div class="profile-identity"><span class="avatar profile-avatar">${escapeHTML((state.profile?.name || 'A').slice(0, 1).toUpperCase())}</span><div><p class="section-kicker">ALUNO</p><h2>${escapeHTML(state.profile?.name || 'Aluno')}</h2><p>Nível ${levelForXp(state.xp)} · ${state.xp} XP · ${state.completed.length} módulos concluídos</p></div></div><form id="profile-form"><label for="profile-name">NOME DE EXIBIÇÃO</label><input id="profile-name" name="name" value="${escapeHTML(state.profile?.name || '')}" required minlength="2" maxlength="50"><button class="primary-action" type="submit">Salvar perfil ${icon('check')}</button></form><div class="storage-notice"><strong>Privacidade e armazenamento</strong><p>Este protótipo usa localStorage. Não há conta protegida, sincronização entre dispositivos ou banco de dados remoto. Não armazene dados sensíveis de empresa ou usuários reais.</p></div><button class="outline-button" data-action="logout" type="button">Encerrar sessão local</button></section>`;
}

function assessmentView() {
  const index = Math.min(state.assessment.currentIndex, diagnosticQuestions.length - 1);
  const question = diagnosticQuestions[index];
  const progress = Math.round((index + 1) / diagnosticQuestions.length * 100);
  const selected = state.assessment.answers[question.id];
  return `${pageHeader('PONTO DE PARTIDA · 8–10 MIN', 'Avaliação diagnóstica', 'Um retrato inicial do que você já conhece. Não é prova de certificação: use o resultado para escolher o próximo estudo.')}
    <section class="assessment-shell panel"><div class="assessment-topline"><span class="status-tag">${escapeHTML(question.areaLabel)}</span><span>${escapeHTML(question.level)}</span></div><div class="assessment-progress"><span style="width:${progress}%"></span></div><div class="assessment-counter">QUESTÃO ${String(index + 1).padStart(2, '0')} <span>/ ${diagnosticQuestions.length}</span></div><fieldset class="assessment-question"><legend>${escapeHTML(question.prompt)}</legend><div class="assessment-options">${question.options.map((option, optionIndex) => `<label class="assessment-option ${selected === optionIndex ? 'selected' : ''}"><input type="radio" name="assessment-answer" value="${optionIndex}" ${selected === optionIndex ? 'checked' : ''}><span class="option-marker">${String.fromCharCode(65 + optionIndex)}</span><span>${escapeHTML(option)}</span></label>`).join('')}</div></fieldset><div class="assessment-controls"><button class="outline-button" data-action="assessment-previous" type="button" ${index === 0 ? 'disabled' : ''}>Voltar</button><span class="assessment-save-state">Suas respostas são salvas neste navegador.</span>${index === diagnosticQuestions.length - 1 ? `<button class="primary-action" data-action="assessment-finish" type="button" ${selected === undefined ? 'disabled' : ''}>Ver meu resultado ${icon('arrow')}</button>` : `<button class="primary-action" data-action="assessment-next" type="button" ${selected === undefined ? 'disabled' : ''}>Próxima questão ${icon('arrow')}</button>`}</div></section>
    <div class="assessment-footnote">Responda sem pesquisar para obter um retrato mais útil. Errar é informação para recomendar o melhor ponto de partida.</div>`;
}

function buildAssessmentResult() {
  const areas = Object.keys(diagnosticRecommendations).map((area) => {
    const questions = diagnosticQuestions.filter((question) => question.area === area);
    const correct = questions.filter((question) => Number(state.assessment.answers[question.id]) === question.answer).length;
    return { id: area, title: diagnosticRecommendations[area].title, correct, total: questions.length, percent: Math.round(correct / questions.length * 100) };
  });
  const correct = diagnosticQuestions.filter((question) => Number(state.assessment.answers[question.id]) === question.answer).length;
  const percent = Math.round(correct / diagnosticQuestions.length * 100);
  const level = percent >= 80 ? 'N1+ · boa base técnica' : percent >= 60 ? 'N1 · base em desenvolvimento' : percent >= 40 ? 'Fundamentos · pronto para avançar' : 'Fundamentos · vamos construir a base';
  return { correct, total: diagnosticQuestions.length, percent, level, areas, completedAt: new Date().toISOString(), responses: diagnosticQuestions.map((question) => ({ id: question.id, selected: state.assessment.answers[question.id], answer: question.answer, explanation: question.explanation })) };
}

function assessmentResultView() {
  const result = state.assessment.result;
  if (!result) return assessmentView();
  const weakest = [...result.areas].sort((first, second) => first.percent - second.percent).slice(0, 3);
  const missed = result.responses.filter((response) => response.selected !== response.answer);
  return `${pageHeader('SEU MAPA DE CONHECIMENTO · DIAGNÓSTICO INICIAL', 'Resultado da avaliação', 'Este resultado orienta seus próximos estudos; não é certificação nem medida fixa da sua capacidade.')}
    <section class="assessment-result-hero panel"><div><p class="section-kicker">PONTO DE PARTIDA SUGERIDO</p><h2>${escapeHTML(result.level)}</h2><p>Você acertou ${result.correct} de ${result.total} questões. Use as áreas abaixo como hipótese de estudo e valide as habilidades em aulas e laboratórios.</p></div><strong>${result.percent}%</strong></section>
    <section class="panel assessment-area-panel"><div class="panel-heading"><div><p class="section-kicker">RESULTADO POR ÁREA</p><h2>Onde aprofundar primeiro</h2></div></div><div class="assessment-area-grid">${result.areas.map((area) => `<article class="assessment-area"><div><strong>${escapeHTML(area.title)}</strong><span>${area.correct}/${area.total}</span></div><div class="progress-track"><span style="width:${area.percent}%"></span></div><small>${area.percent === 100 ? 'Base demonstrada neste teste' : area.percent > 0 ? 'Conhecimento parcial; pratique mais' : 'Recomendado começar por esta base'}</small></article>`).join('')}</div></section>
    <section class="panel assessment-recommendations"><div class="panel-heading"><div><p class="section-kicker">PLANO DE ESTUDO SUGERIDO</p><h2>Comece por estas aulas</h2></div></div><div class="assessment-module-list">${weakest.flatMap((area) => diagnosticRecommendations[area.id].modules.slice(0, 2).map((moduleId) => ({ area, module: moduleById(moduleId) }))).filter(({ module }) => !state.completed.includes(module.id)).slice(0, 5).map(({ area, module }) => `<button class="assessment-module-row" data-action="open-module" data-id="${module.id}" type="button"><span><small>${escapeHTML(area.title)} · ${area.percent}%</small><strong>${escapeHTML(module.title)}</strong><em>${escapeHTML(module.goal)}</em></span>${icon('arrow')}</button>`).join('') || '<p class="empty-state">Você já concluiu os módulos recomendados. Explore a trilha ou avance para os laboratórios N2.</p>'}</div></section>
    ${missed.length ? `<details class="panel assessment-review"><summary>Revisar ${missed.length} ${missed.length === 1 ? 'questão' : 'questões'} para aprender com o diagnóstico</summary>${missed.map((response) => { const question = diagnosticQuestions.find((item) => item.id === response.id); return `<article><strong>${escapeHTML(question.prompt)}</strong><p><span>Sua resposta:</span> ${escapeHTML(question.options[response.selected] || 'Sem resposta')}</p><p><span>Resposta recomendada:</span> ${escapeHTML(question.options[response.answer])}</p><p>${escapeHTML(response.explanation)}</p></article>`; }).join('')}</details>` : ''}
    <div class="assessment-result-actions"><button class="outline-button" data-action="start-assessment" type="button">Refazer avaliação</button><button class="primary-action" data-action="assessment-dashboard" type="button">Ir para meu dashboard ${icon('arrow')}</button></div>`;
}

function assessmentDashboardSummary() {
  const result = state.assessment.result;
  const weakest = [...result.areas].sort((first, second) => first.percent - second.percent)[0];
  return `<section class="assessment-summary panel"><div><p class="section-kicker">SEU DIAGNÓSTICO INICIAL</p><h2>${escapeHTML(result.level)}</h2><p>${result.correct}/${result.total} respostas certas · recomendação de estudo: <strong>${escapeHTML(weakest.title)}</strong></p><div class="progress-track"><span style="width:${result.percent}%"></span></div></div><div class="assessment-summary-actions"><button class="text-button" data-route="assessment-result" type="button">Ver análise ${icon('arrow')}</button><button class="text-button" data-action="start-assessment" type="button">Refazer teste</button></div></section>`;
}

function renderView() {
  const views = { dashboard: dashboardView, tracks: tracksView, course: courseView, lesson: lessonView, lab: labView, challenge: challengeView, subnet: subnetView, terminal: terminalView, projects: projectsView, notes: () => notesView(false), favorites: () => notesView(true), review: reviewView, progress: progressView, profile: profileView, assessment: () => state.assessment.result ? assessmentResultView() : assessmentView(), 'assessment-result': assessmentResultView };
  return (views[state.route] || dashboardView)();
}

function render() {
  document.documentElement.dataset.theme = state.theme;
  if (!state.profile) {
    root.innerHTML = `<main class="login-screen"><div class="login-side"><div class="login-logo">N<span>.</span></div><p class="section-kicker">NODE / STUDY · LOCAL LAB</p><h1>Seu ambiente de estudos em TI.</h1><p>Aprenda, investigue, pratique e documente. Um espaço pessoal para desenvolver raciocínio técnico com situações de suporte.</p><div class="login-flow"><span>APRENDER</span><i>→</i><span>INVESTIGAR</span><i>→</i><span>DOCUMENTAR</span></div><div class="login-network" aria-hidden="true"><span></span><span></span><span></span><span></span><i></i><i></i></div></div><section class="login-form-side"><form class="login-form" id="login-form"><p class="section-kicker">ACESSO AO WORKSPACE</p><h2>Entrar no laboratório</h2><p>Crie seu perfil local para salvar o progresso neste navegador.</p><label for="login-name">Como quer ser chamado?</label><input id="login-name" name="name" placeholder="Seu nome" autocomplete="name" required minlength="2" maxlength="50"><button class="primary-action" type="submit">Entrar no meu espaço ${icon('arrow')}</button><small>Perfil local de estudo. Esta versão não envia seus dados para um servidor.</small></form></section></main>`;
    return;
  }
  if (!state.assessment.result && state.route !== 'assessment') {
    state.route = 'assessment';
    saveState();
  }
  root.innerHTML = shell(renderView());
}

function levelForXp(xp) {
  return xp >= 1200 ? 'Infra' : xp >= 700 ? 'N2' : xp >= 400 ? 'N1+' : xp >= 200 ? 'N1' : xp >= 80 ? 'Técnico' : xp >= 30 ? 'Fundamentos' : 'Iniciante';
}

function nextLevelLabel(xp) {
  const next = [30, 80, 200, 400, 700, 1200].find((threshold) => xp < threshold);
  return next ? `${next - xp} XP até o próximo nível` : 'Nível máximo do MVP';
}

function navigate(route) {
  state.route = route;
  state.sidebarOpen = false;
  saveState();
  render();
  if (route === 'subnet') calculateSubnets();
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function awardXp(amount) {
  state.xp += amount;
  const today = new Date().toISOString().slice(0, 10);
  if (state.lastStudyDate !== today) {
    state.streak = state.lastStudyDate ? Math.max(1, state.streak + 1) : 1;
    state.lastStudyDate = today;
  }
}

function saveNote(moduleId, text) {
  const cleanText = text.trim();
  const existing = state.notes.find((note) => note.moduleId === moduleId);
  if (!cleanText) {
    state.notes = state.notes.filter((note) => note.moduleId !== moduleId);
  } else if (existing) {
    existing.text = cleanText;
    existing.updatedAt = new Date().toISOString();
  } else {
    state.notes.push({ moduleId, text: cleanText, updatedAt: new Date().toISOString() });
  }
  saveState();
}

function runSimulatedCommand(input) {
  const command = input.trim();
  const normalized = command.toLowerCase().replace(/\s+/g, ' ');
  const output = [`PS C:\\Lab> ${command}`];
  let recognized = true;
  if (!normalized) return [];
  if (normalized === 'help') output.push('Comandos: ipconfig [/all], ping <host>, tracert <host>, nslookup <nome>, arp -a, route print, netstat -ano, curl <url>, hostname, Get-NetIPConfiguration, Get-NetRoute, Get-NetTCPConnection, Resolve-DnsName <nome>, Test-NetConnection <host> -Port <porta>, cls. Saídas simuladas.');
  else if (normalized === 'cls') return ['Histórico do terminal limpo.'];
  else if (normalized === 'hostname') output.push('LAB-NET-01');
  else if (/^ipconfig(?: \/all)?$/.test(normalized)) output.push('Ethernet adapter Ethernet:', '   IPv4 Address. . . . . . . . . . . : 192.168.10.42', '   Subnet Mask . . . . . . . . . . . : 255.255.255.0', '   Default Gateway . . . . . . . . . : 192.168.10.1', '   DNS Servers . . . . . . . . . . . : 192.168.10.5');
  else if (/^ping\s+\S+$/.test(normalized)) { const target = command.split(/\s+/)[1]; output.push(`Reply from ${target}: bytes=32 time=12ms TTL=117`, 'Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)', 'Simulação didática: ping usa ICMP e não testa uma porta TCP.'); }
  else if (/^(nslookup|resolve-dnsname)\s+\S+$/.test(normalized)) { const name = command.split(/\s+/)[1]; output.push('Server:  dns.lab.local', 'Address: 192.168.10.5', '', `Name: ${name}`, 'Address: 10.40.8.25'); }
  else if (/^tracert\s+\S+$/.test(normalized)) output.push('1  192.168.10.1  1ms', '2  10.20.0.1  8ms', '3  10.40.8.25  14ms', 'Trace complete. Rota ilustrativa.');
  else if (normalized === 'arp -a') output.push('Interface: 192.168.10.42', '192.168.10.1    00-15-5d-01-02-03    dynamic');
  else if (normalized === 'route print' || normalized === 'get-netroute') output.push('Network Destination  Netmask          Gateway', '0.0.0.0             0.0.0.0          192.168.10.1', '192.168.10.0        255.255.255.0    On-link');
  else if (/^netstat\s+-ano$/.test(normalized) || /^get-nettcpconnection(?: -state established)?$/.test(normalized)) output.push('TCP 192.168.10.42:51544 10.40.8.25:443 ESTABLISHED', 'Estado Established não garante a saúde da aplicação.');
  else if (normalized === 'get-netipconfiguration') output.push('InterfaceAlias: Ethernet', 'IPv4Address: 192.168.10.42', 'IPv4DefaultGateway: 192.168.10.1', 'DNSServer: 192.168.10.5');
  else if (/^test-netconnection\s+\S+\s+-port\s+\d+$/.test(normalized)) { const [, host, port] = normalized.match(/^test-netconnection\s+(\S+)\s+-port\s+(\d+)$/); output.push(`ComputerName: ${host}`, `RemotePort: ${port}`, 'TcpTestSucceeded: True', 'Resultado ilustrativo; compare com o destino real autorizado.'); }
  else if (/^curl\s+https?:\/\/\S+$/.test(normalized)) output.push('HTTP/1.1 200 OK', 'content-type: text/html', 'Resposta simulada; confirme TLS e conteúdo no cliente real.');
  else recognized = false;
  if (!recognized) output.push('Comando não reconhecido. Digite help para consultar a lista.');
  return output;
}

function calculateSubnets() {
  const field = document.getElementById('subnet-cidr');
  const countField = document.getElementById('subnet-count');
  const table = document.getElementById('subnet-table');
  const error = document.getElementById('subnet-error');
  if (!field || !table || !error) return;
  const match = field.value.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\/(\d{1,2})$/);
  if (!match) { error.textContent = 'Informe a rede no formato IPv4/prefixo, por exemplo 192.168.10.0/24.'; return; }
  const octets = match.slice(1, 5).map(Number);
  const prefix = Number(match[5]);
  if (octets.some((octet) => octet > 255) || prefix < 16 || prefix > 30) { error.textContent = 'Use octetos entre 0 e 255 e um prefixo entre /16 e /30 neste simulador.'; return; }
  const requested = Number(countField.value);
  const extraBits = Math.ceil(Math.log2(requested));
  const newPrefix = prefix + extraBits;
  if (newPrefix > 30) { error.textContent = 'A rede não tem bits suficientes para essa quantidade de sub-redes com hosts utilizáveis.'; return; }
  const ipNumber = (((octets[0] * 256 + octets[1]) * 256 + octets[2]) * 256 + octets[3]);
  const hostBits = 32 - prefix;
  const originalSize = 2 ** hostBits;
  const baseNetwork = Math.floor(ipNumber / originalSize) * originalSize;
  const subnetSize = 2 ** (32 - newPrefix);
  const count = 2 ** extraBits;
  const maskNumber = (0xffffffff << (32 - newPrefix)) >>> 0;
  const mask = [maskNumber >>> 24, (maskNumber >>> 16) & 255, (maskNumber >>> 8) & 255, maskNumber & 255].join('.');
  const ipText = (number) => [Math.floor(number / 16777216) & 255, Math.floor(number / 65536) & 255, Math.floor(number / 256) & 255, number & 255].join('.');
  table.innerHTML = Array.from({ length: count }, (_, index) => {
    const network = baseNetwork + index * subnetSize;
    const broadcast = network + subnetSize - 1;
    return `<tr><td>${ipText(network)}/${newPrefix}</td><td>${ipText(network + 1)}</td><td>${ipText(broadcast - 1)}</td><td>${ipText(broadcast)}</td><td>${subnetSize - 2}</td></tr>`;
  }).join('');
  document.getElementById('subnet-summary').textContent = `${ipText(baseNetwork)}/${prefix} → ${count} blocos /${newPrefix} · máscara ${mask}`;
  error.textContent = '';
}

root.addEventListener('click', (event) => {
  const routeButton = event.target.closest('[data-route]');
  if (routeButton) { navigate(routeButton.dataset.route); return; }
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const { action, id, test, command } = actionButton.dataset;
  if (action === 'toggle-sidebar') { state.sidebarOpen = !state.sidebarOpen; render(); }
  if (action === 'close-sidebar') { state.sidebarOpen = false; render(); }
  if (action === 'theme') { state.theme = state.theme === 'dark' ? 'light' : 'dark'; saveState(); render(); }
  if (action === 'logout') { state.profile = null; state.route = 'dashboard'; saveState(); render(); }
  if (action === 'open-module') { state.selectedModule = id; state.route = 'lesson'; saveState(); render(); }
  if (action === 'open-track') { navigate(id === 'track-3' ? 'course' : 'tracks'); }
  if (action === 'start-assessment') { state.assessment = { answers: {}, currentIndex: 0, result: null, awarded: state.assessment.awarded }; state.route = 'assessment'; saveState(); render(); }
  if (action === 'assessment-previous') { state.assessment.currentIndex = Math.max(0, state.assessment.currentIndex - 1); saveState(); render(); }
  if (action === 'assessment-next') { const current = diagnosticQuestions[state.assessment.currentIndex]; if (state.assessment.answers[current.id] !== undefined) { state.assessment.currentIndex = Math.min(diagnosticQuestions.length - 1, state.assessment.currentIndex + 1); saveState(); render(); } }
  if (action === 'assessment-finish') {
    const answeredAll = diagnosticQuestions.every((question) => state.assessment.answers[question.id] !== undefined);
    if (answeredAll) {
      state.assessment.result = buildAssessmentResult();
      if (!state.assessment.awarded) { awardXp(15); state.assessment.awarded = true; }
      state.route = 'assessment-result'; saveState(); render();
    }
  }
  if (action === 'assessment-dashboard') { state.route = 'dashboard'; saveState(); render(); }
  if (action === 'complete-module' && !state.completed.includes(id)) { state.completed.push(id); awardXp(25); saveState(); render(); }
  if (action === 'submit-challenge') {
    const answer = document.getElementById('challenge-answer')?.value || '';
    const reason = document.getElementById('challenge-reason')?.value.trim() || '';
    const correct = answer === 'dns';
    const today = new Date().toISOString().slice(0, 10);
    const alreadyAwarded = state.challenge?.date === today && state.challenge?.correct;
    const xp = correct && !alreadyAwarded ? 20 : 0;
    if (correct && !alreadyAwarded) awardXp(xp);
    state.challenge = { date: today, correct, xp, message: correct ? (reason.length > 15 ? 'DNS é a hipótese mais forte porque o acesso por nome falha enquanto conectividade geral e gateway foram observados. Compare a resposta DNS com o endereço esperado; se estiver correta, avance para rota e porta TCP.' : 'A escolha do teste está correta. Explique também o que a resposta confirmaria e qual seria o próximo teste se o IP estiver certo.') : 'O escopo e o sintoma apontam primeiro para resolução de nome. Evite ação disruptiva ou regra ampla antes de coletar evidência.' };
    saveState(); render();
  }
  if (action === 'review-rate') {
    const delays = { again: 1, hard: 3, easy: 7 };
    state.review[id] = { rating: actionButton.dataset.rating, due: Date.now() + delays[actionButton.dataset.rating] * 86400000 };
    saveState(); render();
  }
  if (action === 'favorite-module') { state.favorites = state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id]; saveState(); render(); }
  if (action === 'save-lesson-note') { saveNote(id, document.querySelector(`[data-note-module="${id}"]`)?.value || ''); render(); }
  if (action === 'run-lab-test') {
    if (!state.lab.evidence.includes(test)) { state.lab.evidence.push(test); awardXp(5); }
    state.lab.result = null; saveState(); render();
  }
  if (action === 'submit-lab') {
    const incident = selectedIncident();
    const hypothesis = document.getElementById('lab-hypothesis')?.value || '';
    const report = document.getElementById('lab-report')?.value || '';
    const enoughEvidence = state.lab.evidence.length >= 2;
    const correct = hypothesis === incident.diagnosis && enoughEvidence && report.trim().length >= 30;
    const alreadySolved = state.lab.solved?.includes(incident.id);
    state.lab.hypothesis = hypothesis;
    state.lab.report = report;
    state.lab.result = { correct, xp: correct && !alreadySolved ? 40 : 0, message: correct ? 'Sua conclusão coincide com as evidências. A documentação deve incluir origem, destino, horário, testes, resultado, ação autorizada e validação após a correção.' : !enoughEvidence ? 'Colete pelo menos duas evidências antes de fechar o diagnóstico. Selecione testes que diferenciem as hipóteses.' : report.trim().length < 30 ? 'O diagnóstico está selecionado, mas a documentação ainda está curta. Registre sintoma, evidências e como validaria a correção.' : 'A hipótese não é sustentada pelas evidências coletadas. Releia os resultados e procure o teste que identifica a causa.' };
    if (correct && !alreadySolved) { state.lab.solved = [...(state.lab.solved || []), incident.id]; awardXp(40); }
    saveState(); render();
  }
  if (action === 'calculate-subnet') calculateSubnets();
  if (action === 'clear-terminal') { state.terminalHistory = []; saveState(); render(); }
  if (action === 'insert-command') { const input = document.getElementById('terminal-command'); if (input) { input.value = command; input.focus(); } }
});

root.addEventListener('change', (event) => {
  if (event.target.name === 'assessment-answer') {
    const question = diagnosticQuestions[state.assessment.currentIndex];
    state.assessment.answers[question.id] = Number(event.target.value);
    saveState();
    root.querySelectorAll('.assessment-option').forEach((option) => option.classList.remove('selected'));
    event.target.closest('.assessment-option')?.classList.add('selected');
    const nextButton = root.querySelector('[data-action="assessment-next"], [data-action="assessment-finish"]');
    if (nextButton) nextButton.disabled = false;
  }
  if (event.target.id === 'incident-select') { state.lab = { ...initialState.lab, incidentId: event.target.value }; saveState(); render(); }
  if (event.target.id === 'lab-hypothesis') { state.lab.hypothesis = event.target.value; saveState(); }
  if (event.target.matches('[data-project]')) {
    const { project, task } = event.target.dataset;
    const index = Number(task);
    const done = state.projects[project] || [];
    state.projects[project] = event.target.checked ? [...new Set([...done, index])] : done.filter((item) => item !== index);
    if (event.target.checked) awardXp(10);
    saveState(); render();
  }
});

root.addEventListener('submit', (event) => {
  event.preventDefault();
  if (event.target.id === 'login-form') {
    const name = new FormData(event.target).get('name').trim();
    if (name.length >= 2) { state.profile = { name }; state.route = state.assessment.result ? 'dashboard' : 'assessment'; if (!state.assessment.result) state.assessment.currentIndex = 0; awardXp(0); saveState(); render(); }
  }
  if (event.target.id === 'profile-form') {
    state.profile = { ...state.profile, name: new FormData(event.target).get('name').trim() };
    saveState(); render();
  }
  if (event.target.id === 'terminal-form') {
    const input = document.getElementById('terminal-command');
    const history = state.terminalHistory || [];
    state.terminalHistory = [...history, ...runSimulatedCommand(input.value)].slice(-80);
    saveState(); render();
    document.getElementById('terminal-command')?.focus();
  }
});

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && state.sidebarOpen) { state.sidebarOpen = false; render(); }
});

render();
if (state.profile && state.route === 'subnet') calculateSubnets();

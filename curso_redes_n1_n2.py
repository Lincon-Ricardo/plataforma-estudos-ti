from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Preformatted

OUTPUT_PATH = r"c:\Users\Lincon.silva\Desktop\curso\Curso_Completo_de_Redes_Suporte_N1_N2.pdf"

styles = getSampleStyleSheet()

header_style = ParagraphStyle(
    'Header',
    parent=styles['Title'],
    fontName='Helvetica-Bold',
    fontSize=20,
    leading=24,
    textColor=colors.HexColor('#0F172A'),
    spaceAfter=12,
)

section_style = ParagraphStyle(
    'Section',
    parent=styles['Heading2'],
    fontName='Helvetica-Bold',
    fontSize=15,
    leading=18,
    textColor=colors.HexColor('#0B3B5B'),
    spaceBefore=12,
    spaceAfter=8,
)

sub_style = ParagraphStyle(
    'Sub',
    parent=styles['Heading3'],
    fontName='Helvetica-Bold',
    fontSize=11,
    leading=14,
    textColor=colors.HexColor('#14532D'),
    spaceBefore=8,
    spaceAfter=6,
)

body_style = ParagraphStyle(
    'Body',
    parent=styles['BodyText'],
    fontName='Helvetica',
    fontSize=10,
    leading=14,
    spaceAfter=6,
    alignment=1,
    textColor=colors.HexColor('#1F2937'),
)

small_style = ParagraphStyle(
    'Small',
    parent=styles['BodyText'],
    fontName='Helvetica',
    fontSize=9,
    leading=12,
    spaceAfter=4,
    alignment=1,
)

highlight_style = ParagraphStyle(
    'Highlight',
    parent=styles['BodyText'],
    fontName='Helvetica-Bold',
    fontSize=10,
    leading=14,
    backColor=colors.HexColor('#E0F2FE'),
    borderColor=colors.HexColor('#0EA5E9'),
    borderWidth=1,
    borderPadding=8,
    spaceAfter=8,
)

code_style = ParagraphStyle(
    'Code',
    parent=styles['BodyText'],
    fontName='Courier',
    fontSize=9,
    leading=11,
    backColor=colors.HexColor('#F8FAFC'),
    borderColor=colors.HexColor('#CBD5E1'),
    borderWidth=1,
    borderPadding=6,
    spaceAfter=8,
)

story = []


def para(text, style=body_style):
    story.append(Paragraph(text, style))


def code_block(text):
    story.append(Paragraph(text, code_style))


def title_page():
    story.append(Spacer(1, 70))
    story.append(Paragraph("CURSO COMPLETO DE REDES PARA SUPORTE N1/N2", header_style))
    story.append(Paragraph("Do Fundamento ao Troubleshooting Corporativo", styles['Heading1']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("Material profissional de formação em redes e suporte técnico", styles['Heading2']))
    story.append(Spacer(1, 50))
    story.append(Paragraph("Objetivo: transformar conhecimento superficial em diagnóstico profissional.", highlight_style))
    story.append(PageBreak())


def add_toc():
    para("SUMÁRIO", header_style)
    toc = [
        "Como utilizar este curso",
        "Metodologia",
        "Perfil do profissional N1/N2",
        "Módulo 1 — Fundamentos de redes",
        "Módulo 2 — OSI e TCP/IP",
        "Módulo 3 — IPv4",
        "Módulo 4 — Máscaras e subnetting",
        "Módulo 5 — CIDR e VLSM",
        "Módulo 6 — TCP, UDP e portas",
        "Módulo 7 — DNS",
        "Módulo 8 — DHCP",
        "Módulo 9 — MAC e ARP",
        "Módulo 10 — Switching",
        "Módulo 11 — VLAN",
        "Módulo 12 — Gateway e routing",
        "Módulo 13 — Tabela de roteamento",
        "Módulo 14 — HTTP e HTTPS",
        "Módulo 15 — TLS e certificados",
        "Módulo 16 — Firewall",
        "Módulo 17 — VPN",
        "Módulo 18 — Wi-Fi",
        "Módulo 19 — Ferramentas do Windows",
        "Módulo 20 — PowerShell para redes",
        "Módulo 21 — Troubleshooting profissional",
        "Módulo 22 — Troubleshooting por camadas",
        "Módulo 23 — Logs e evidências",
        "Módulo 24 — Documentação de incidentes",
        "Módulo 25 — Casos reais de N1/N2",
        "Módulo 26 — Projeto final",
        "Cheat Sheet",
        "Glossário",
        "Gabarito",
        "Avaliação final",
        "Checklist de competências",
    ]
    for item in toc:
        para(f"• {item}")
    story.append(PageBreak())


def add_course_intro():
    para("COMO UTILIZAR ESTE CURSO", header_style)
    para("Este material foi pensado para estudo em várias semanas, com progressão gradual da compreensão para o diagnóstico. A proposta não é memorizar comandos, mas entender o que cada teste revela, por que ele é importante e como decidir o próximo passo. O aluno deve sair do nível N1, que normalmente se limita a executar instruções, para um nível N2 com raciocínio técnico, análise e documentação.")
    para("A sequência didática procura seguir a lógica: entender → executar → diagnosticar → resolver → documentar.")
    para("Em cada módulo, você encontrará:")
    para("• conceito e explicação; • demonstração; • exemplo real; • laboratório; • exercícios; • desafios; • checkpoint; • revisão.")
    para("Filosofia central: COMANDO ≠ CONHECIMENTO. Conhecimento técnico nasce de entender o problema, formular hipóteses, escolher o teste, interpretar o resultado, validar e documentar.")
    para("Este material é orientado à prática corporativa. Sempre que possível, o texto conecta o conceito a situações reais de suporte: usuário sem Internet, DNS não resolve, DHCP sem endereço, VLAN incorreta, porta bloqueada, VPN sem acesso ao sistema, firewall bloqueando aplicação e falhas de certificação HTTPS.")
    story.append(PageBreak())


def add_methodology():
    para("METODOLOGIA", header_style)
    para("A abordagem é prática e ativa. Cada assunto é trabalhado em quatro dimensões: teoria, demonstração, troubleshooting e documentação.")
    para("Estrutura geral do módulo:")
    code_block("CONCEITO\n↓\nEXPLICAÇÃO\n↓\nCOMO FUNCIONA\n↓\nEXEMPLO REAL\n↓\nDEMONSTRAÇÃO\n↓\nLABORATÓRIO\n↓\nEXERCÍCIO\n↓\nPROBLEMA\n↓\nTROUBLESHOOTING\n↓\nDOCUMENTAÇÃO\n↓\nCHECKPOINT")
    para("A aprendizagem é progressiva e baseada em cenário. O candidato deve evoluir de:")
    para("• Eu sei o que é. • Eu sei usar. • Eu sei diagnosticar. • Eu consigo resolver e explicar.")
    para("Níveis de domínio:")
    para("Nível 1 — Entender: explica o conceito; Nível 2 — Executar: realiza o procedimento; Nível 3 — Diagnosticar: investiga a causa; Nível 4 — Resolver e documentar: corrige, valida e registra o atendimento.")
    para("Antes de laboratórios importantes, o curso usa o princípio: PENSE ANTES DE EXECUTAR.")
    code_block("CENÁRIO\nO que o usuário está relatando?\n\nO QUE SABEMOS\nQuais informações já temos?\n\nO QUE NÃO SABEMOS\nQuais informações faltam?\n\nHIPÓTESES\nQuais causas são prováveis?\n\nPRIMEIRO TESTE\nQual teste elimina mais hipóteses?\n\nPAUSA PARA O ALUNO\nEu executaria ___ porque quero descobrir ___")
    para("Essa lógica é essencial em DNS, DHCP, roteamento, firewall, VPN, HTTP e conectividade em geral.")
    story.append(PageBreak())


def add_profile():
    para("PERFIL DO PROFISSIONAL N1/N2", header_style)
    para("O aluno deste curso já atua em suporte técnico, atende usuários, trabalha com Windows, lida com arquivos, aplicações, impressoras, hardware e sistemas corporativos. Ele conhece superficialmente conceitos como TCP/IP, IPv4, máscara, gateway, DNS, DHCP, HTTP/HTTPS, ping, ipconfig, Test-NetConnection, netstat, nslookup e tracert.")
    para("O objetivo do curso é transformar esse conhecimento básico em uma visão profissional. O aluno passa a entender como cada peça da infraestrutura se relaciona, como diagnosticar problemas reais e como decidir quando escalar para N2, infraestrutura, redes ou segurança.")
    para("O suporte de nível N1 se conecta ao atendimento imediato; o N2 exige raciocínio mais profundo, capacidade de diagnóstico e documentação adequada.")
    para("O material prioriza exemplos reais do ambiente corporativo: notebook sem Internet, compartilhamento de arquivos, servidor interno indisponível, Wi-Fi sem acesso, VPN sem comunicação com sistema, sistema acessível por IP mas não por nome, firewall bloqueando aplicação, DNS interno falhando e VLAN incorreta.")
    story.append(PageBreak())


def add_module_1():
    para("MÓDULO 1 — FUNDAMENTOS DE REDES", header_style)
    para("Uma rede de computadores permite que dispositivos troquem dados, compartilharem recursos e acessarem serviços. Em empresas, a rede costuma incluir computadores, impressoras, switches, roteadores, links de acesso, servidores e segurança.")
    para("Termos básicos:")
    para("• LAN: rede local em um ambiente, como escritório ou prédio. • WAN: rede que conecta locais geograficamente distantes. • Internet: rede pública global. • Intranet: rede interna corporativa. • Extranet: extensão de rede para parceiros ou fornecedores. • Cliente: dispositivo que solicita serviço. • Servidor: dispositivo que disponibiliza serviço. • Protocolo: regra que define como os dados são transmitidos.")
    para("Caminho da comunicação corporativa:")
    code_block("COMPUTADOR\n↓\nSWITCH\n↓\nGATEWAY / ROTEADOR\n↓\nINTERNET\n↓\nSERVIDOR")
    para("Quando um usuário acessa um site, o computador primeiro resolve o nome do domínio em um endereço IP. Depois, envia a requisição para o gateway. O roteador encaminha o pacote até a rede de destino, e o servidor responde. Isso envolve vários protocolos, camadas e equipamentos.")
    para("Como isso aparece no trabalho: um usuário relata que não consegue acessar o sistema financeiro. O suporte deve verificar se o problema está em conexão local, DNS, gateway, roteamento, firewall, serviço ou aplicação.")
    para("Laboratório: Um usuário acessa um site. O que acontece desde o momento em que ele digita o endereço até o carregamento da página? Responda descrevendo a sequência: entrada do endereço, resolução DNS, envio ao gateway, encaminhamento, retorno do servidor e renderização da página.")
    para("Exercício N1: explique a diferença entre LAN e WAN. Exercício N1+: o que acontece quando o usuário entra em um site por nome e não por IP? Exercício N2: suponha que o usuário possa navegar em alguns sites, mas não em outros. Quais hipóteses você considera?")
    para("Checkpoint: Preciso revisar __ / Consigo executar __ / Consigo explicar __ / Consigo diagnosticar __ / Consigo ensinar outra pessoa __")
    story.append(PageBreak())


def add_module_2():
    para("MÓDULO 2 — MODELO OSI E TCP/IP", header_style)
    para("Os modelos OSI e TCP/IP ajudam a organizar o pensamento sobre redes. O modelo OSI tem 7 camadas: Física, Enlace, Rede, Transporte, Sessão, Apresentação e Aplicação. O modelo TCP/IP é mais usado na prática e agrupa em 4 camadas: Aplicação, Transporte, Internet e Acesso à rede.")
    para("Em troubleshooting, cada camada ajuda a localizar o problema. Se o cabo está desconectado, o problema está na camada física. Se o usuário não resolve nomes, é DNS, camada de aplicação. Se a porta TCP não responde, o problema está na camada de transporte ou no serviço.")
    para("Encapsulamento: cada camada adiciona informações ao pacote. Em nível prático, um dado de aplicação é encapsulado em segmentos TCP/UDP, depois em pacotes IP e finalmente em quadros para transmissão pelo meio físico.")
    para("Exemplos:")
    para("• Usuário está sem cabo: camada física. • DNS não resolve: camada de aplicação. • Porta TCP não responde: camada de transporte. • VLAN incorreta: camada de enlace/rede. • Roteamento incorreto: camada de rede.")
    para("Exercício: relacione cada sintoma à camada mais provável. Exercício N2: se o ping funciona para o gateway, mas não para um servidor externo, o problema é físico, de DNS, de roteamento ou de firewall? Explique.")
    para("Checkpoint final do módulo: identifique a camada correta para cada cenário e explique o raciocínio.")
    story.append(PageBreak())


def add_module_3():
    para("MÓDULO 3 — IPv4", header_style)
    para("O IPv4 usa 32 bits, divididos em 4 octetos. Cada octeto varia de 0 a 255. A representação comum é decimal, mas a rede funciona em binário. Cada endereço possui duas partes: rede e host.")
    para("Exemplo: 192.168.10.25/24. O prefixo /24 indica 24 bits de rede e 8 bits de host. Em redes privadas, as faixas mais comuns são: 10.0.0.0/8, 172.16.0.0/12 e 192.168.0.0/16. Essas faixas foram reservadas para uso privado e evitam conflito com endereços públicos usados na Internet.")
    para("Endereços especiais: loopback 127.0.0.1, APIPA 169.254.x.x, broadcast, gateway, IP público, IP privado. O gateway é o ponto de saída da rede local. Quando um computador quer falar com outra rede, ele usa o gateway como próximo hop.")
    para("Endereçamento estático: configurado manualmente. Dinâmico: atribuído por DHCP. Em ambientes corporativos, DHCP é usado para reduzir erros de configuração e facilitar mudanças.")
    para("Exercício de cálculo: em 10.0.0.0/8, quantos endereços existem? Em 192.168.1.0/24, qual é o endereço de rede, broadcast e faixa de hosts? Explique a lógica de bits.")
    para("Checkpoint: a interpretação de IPv4 é parte fundamental para diagnóstico de conectividade. Sem entender rede e host, você não consegue raciocinar isolando falhas de configuração.")
    story.append(PageBreak())


def add_module_4():
    para("MÓDULO 4 — MÁSCARAS E SUBNETTING", header_style)
    para("Máscara define quantos bits pertencem à rede e quantos pertencem ao host. Em redes com /24, a máscara é 255.255.255.0. Em /16: 255.255.0.0. Em /8: 255.0.0.0.")
    para("Sub-netting é dividir uma rede maior em redes menores. Isso ajuda a reduzir broadcast, organizar departamentos e otimizar endereçamento. As perguntas que sempre devem ser feitas ao planejar sub-redes são: quantos hosts cada rede precisa? quantas sub-redes são necessárias? qual máscara atende? e qual faixa livre será usada?")
    para("Exemplo corporativo: empresa com RH (30 PCs), Financeiro (50), TI (20) e Diretoria (10). O professor deve distribuir sub-redes com base na quantidade de hosts, usando VLSM para eficiência.")
    para("Cálculo rápido: /24 = 256 endereços, 254 utilizáveis; /25 = 128, 126 utilizáveis; /26 = 64, 62 utilizáveis; /27 = 32, 30 utilizáveis; /28 = 16, 14 utilizáveis; /29 = 8, 6 utilizáveis; /30 = 4, 2 utilizáveis.")
    para("O aluno deve dominar o cálculo mental e a tabela de blocos no contexto real. Subnetting não é só memorizar; é decidir a melhor divisão para evitar desperdício de endereços e permitir organização da rede.")
    para("Exercícios progressivos: calcular host, rede, broadcast, primeiro e último host. Caso: 172.16.0.0/26, 192.168.10.0/27, 10.10.0.0/29.")
    para("Checkpoint: se a rede for mal dimensionada, problemas de comunicação, DHCP, acesso e broadcast aparecem em várias camadas.")
    story.append(PageBreak())


def add_module_5():
    para("MÓDULO 5 — CIDR E VLSM", header_style)
    para("CIDR (Classless Inter-Domain Routing) permite representar redes por prefixo, como /8, /16, /24, /30. Isso facilita o uso de redes de tamanho variável e o roteamento eficiente. O VLSM (Variable Length Subnet Mask) permite que redes diferentes recebam máscaras diferentes conforme necessidade.")
    para("Em redes corporativas, isso é essencial para alocar endereços de forma eficiente. Exemplo: a rede principal pode ser 10.0.0.0/8, mas uma sub-rede de diretoria pode usar /26, outra de produção /24 e outra de link ponto a ponto /30.")
    para("Pergunta para o aluno: Quando usar /30 em roteamento? Quando usar /24 em uma VLAN? Quando usar /27 para um departamento pequeno? O raciocínio deve ser econômico e organizado.")
    para("Exercício N2: planeje uma rede com 3 VLANs e 2 links de roteamento usando VLSM.")
    para("Checkpoint: o futuro N2 precisa observar a gestão de IP como planejamento estratégico, não apenas configuração.")
    story.append(PageBreak())


def add_module_6():
    para("MÓDULO 6 — TCP, UDP E PORTAS", header_style)
    para("TCP é orientado à conexão, confiável e oferece controle de fluxo, retransmissão e confirmação. Já UDP é mais simples, rápido e usado em aplicações sensíveis a latência, como DNS, VoIP e alguns serviços de streaming.")
    para("No TCP, a conexão é estabelecida com handshake: SYN, SYN-ACK, ACK. O fechamento também envolve etapas. Quando uma porta TCP está fechada, o sistema responde com Connection Refused ou não responde; quando a máquina está indisponível ou a rota falha, a resposta costuma ser timeout. Quando o destino resetou a conexão, o diagnóstico aponta para reset. Essas diferenças são muito importantes.")
    para("TIMEOUT ≠ CONNECTION REFUSED ≠ CONNECTION RESET. Cada um sinaliza um cenário diferente. Timeout geralmente indica que o destino não respondeu ou a comunicação não chegou. Connection refused indica que o host respondeu, mas a porta está fechada ou o serviço não escuta. Connection reset indica que o serviço ou dispositivo recusou a conexão ativamente.")
    para("Portas são identificadores de serviços: 80/443 para HTTP/HTTPS, 53 para DNS, 25 para SMTP, 22 para SSH, 3389 para RDP, 21 para FTP. O suporte técnico precisa entender que uma aplicação pode estar funcionando por IP, mas com porta bloqueada, serviço parado ou política de firewall.")
    para("Exercício: explique a diferença entre tentar acessar um site que responde em 443 e tentar acessar um serviço interno que está em porta 3389. Em cada situação, qual resposta espera?")
    para("Checkpoint: o diagnóstico de portas exige pensar em camadas e serviços, não apenas em ping.")
    story.append(PageBreak())


def add_module_7():
    para("MÓDULO 7 — DNS", header_style)
    para("O DNS resolve nomes em endereços IP. Sem DNS, o usuário teria que memorizar endereços numéricos. O processo pode considerar cache local, servidor DNS, domínio e registros como A, AAAA, CNAME, MX, TXT, NS e PTR.")
    para("A resolução pública pode envolver cliente, cache do sistema, servidor DNS configurado e resposta do servidor remoto. Quando um site funciona por IP, mas não por nome, a causa mais provável é DNS. Se um sistema responde por FQDN e não por hostname, pode haver configuração de domínio local ou search suffix.")
    para("Ferramentas: nslookup e Resolve-DnsName. Comandos permitem verificar se o nome resolve, quais IPs são retornados, qual servidor respondeu e se há falhas de CNAME ou TTL.")
    para("Casos: internet funciona por IP, mas não por nome; sistema interno não resolve; somente um computador apresenta problema de DNS; um site responde por IP e não por domínio; DNS interno aponta para servidor errado.")
    para("Laboratório: usando nslookup, teste um domínio externo e um interno. Compare resultado esperado e interpretação da resposta.")
    para("Exercício N2: um usuário consegue acessar o sistema pelo IP, mas não pelo nome. O que você faria primeiro?")
    story.append(PageBreak())


def add_module_8():
    para("MÓDULO 8 — DHCP", header_style)
    para("DHCP atribui endereços IP dinamicamente aos hosts da rede. O processo DORA é Discover, Offer, Request e Acknowledge. O cliente busca um servidor, recebe uma oferta, solicita o endereço e confirma a concessão. O endereço tem lease, ou prazo de validade, que pode ser renovado automaticamente.")
    para("Em redes corporativas, DHCP é responsável por entregar IP, máscara, gateway, DNS, opção de domínio e outras configurações. Se o host recebe 169.254.x.x, ele está em faixa automática de link-local, indicando que o DHCP não respondeu ou não existe servidor disponível.")
    para("Causas comuns: servidor DHCP desligado, escopo sem endereço livre, VLAN sem passagem do DHCP, uplink com problema, porta no switch ligada na VLAN errada, firewall bloqueando pacotes UDP 67/68, ou falha de excesso.")
    para("Exercício: se um usuário recebe 169.254.52.12 e não existe gateway, qual é a primeira hipótese? O aluno deve pensar em DHCP, VLAN, switch, segmento, servidor, ou infraestrutura de rede.")
    para("Checkpoint: em ambientes corporativos, DHCP falhando quase sempre impacta vários usuários ao mesmo tempo ou apenas um segmento. Nesse diagnóstico, a pergunta correta é: o problema afeta todos ou somente alguns computadores?")
    story.append(PageBreak())


def add_module_9():
    para("MÓDULO 9 — MAC E ARP", header_style)
    para("O endereço MAC identifica a interface de rede no nível de enlace. O ARP transforma um endereço IP em endereço MAC para entrega local. A tabela ARP guarda mapeamentos de IP para MAC. Em redes locais, o host envia broadcast request e o destino responde com o MAC correspondente.")
    para("Mecanismo básico: computador A quer falar com B na mesma rede. A consulta o cache ARP, e se não existir, envia um ARP Request. O dispositivo com o IP desejado responde com o MAC. A partir daí, a comunicação ocorre em nível local. Se a tabela ARP está incorreta, o host pode tentar falar com o endereço errado ou não alcançar o equipamento.")
    para("Em troubleshooting, arp -a mostra mapeamentos. Se um host não resolve o gateway ou outro computador local, o problema pode estar em MAC, VLAN, switch, ARP ou roteamento.")
    para("Laboratório: comparar a tabela ARP de um computador funcionando e de um computador com alcance problemático para identificar inconsistência.")
    story.append(PageBreak())


def add_module_10():
    para("MÓDULO 10 — SWITCHING", header_style)
    para("Switches conectam dispositivos locais e aprendem endereços MAC para encaminhar frames com eficiência. O switch reduz colisões, aumenta a capacidade de comunicação e separa domínios de colisão, embora não isole totalmente redes de broadcast.")
    para("Diferencas: hub repete tudo; switch encaminha por MAC; roteador encaminha por IP e conecta redes diferentes. Em ambientes corporativos, a infraestrutura de switching é a base da conectividade local.")
    para("O switch tem tabela de endereços, aprende a origem dos frames, encaminha para porta correta e faz flooding quando não sabe para onde mandar. Quando há VLAN incorreta, ambiente sem tráfego adequado ou switch com porta defeituosa, a engenharia local do endereço e do tráfego é afetada.")
    para("Exercício N2: em uma rede com um notebook se conectando e não conseguindo navegar, o que você verificaria primeiro: cabo, porta do switch, VLAN, DHCP, gateway ou DNS? Defina a ordem lógica.")
    story.append(PageBreak())


def add_module_11():
    para("MÓDULO 11 — VLAN", header_style)
    para("VLAN divide a rede em segmentos lógicos. Em vez de um único broadcast domain, a organização usa VLANs para separar RH, Financeiro, TI e convidados. O switch configura portas como access e trunk. O trunk usa tagging 802.1Q para transportar múltiplas VLANs entre equipamentos.")
    para("Quando a VLAN está incorreta, usuários podem ficar sem DHCP, sem comunicação com gateway, sem acesso a servidores ou sem alcance local. O problema também pode ocorrer quando a porta é configurada como access em VLAN errada ou quando uma trunk está sem tag ou sem encaminhamento inter-VLAN.")
    para("Aplicação: VLAN 10 RH, VLAN 20 Financeiro, VLAN 30 TI. Se um usuário da RH conectar o notebook em uma porta de Financeiro, ele pode receber IP do outro segmento e não conseguir acessar a aplicação correta.")
    para("Exercício: interpretar cenários de VLAN incorrigida e decidir se a falha é de port, trunk, gateway ou DHCP.")
    story.append(PageBreak())


def add_module_12():
    para("MÓDULO 12 — GATEWAY E ROUTING", header_style)
    para("Gateway é o ponto de saída da rede local. O computador usa o gateway para enviar tráfego para outro segmento ou para a Internet. Routing é o processo de decidir o próximo hop para cada destino. A tabela de roteamento guarda a rota e a interface correspondente.")
    para("Comandos úteis: route print e tracert. O route print mostra rotas conhecidas e o gateway. O tracert mostra o caminho percorrido até o destino, ajudando a identificar falhas de roteamento ou de rede intermediária. A pergunta central é: o pacote chegou até o próximo hop? Se não chegou, talvez o cenário seja gateway incorreto, rota estática inadequada, ACL ou firewall.")
    para("Exercício: um usuário consegue acessar alguns servidores, mas não outros. Qual é a hipótese mais provável: gateway, DNS, firewall ou roteamento? Justifique.")
    story.append(PageBreak())


def add_module_13():
    para("MÓDULO 13 — TABELA DE ROTEAMENTO", header_style)
    para("A tabela de roteamento é a base para decidir o caminho. Ela contém: destination, mask, gateway, interface e metric. Cada rota indica para onde o tráfego deve ir. A rota padrão atende destinos não conhecidos. A rota específica normalmente é preferida por longest prefix match. O roteador escolhe a mais específica para o destino.")
    para("Exemplo: 10.0.0.0/8 via 192.168.1.1 em interface Ethernet; 0.0.0.0/0 via 200.100.50.1. Essa regra indica que o destino específico da rede privada será encaminhado pelo gateway interno, e tudo o mais sai pela rota padrão.")
    para("Exercício: interpretar tabela de roteamento e inferir se o tráfego para 10.10.5.20, 172.16.10.5 e 8.8.8.8 deve sair pela rota local ou pela padrão.")
    story.append(PageBreak())


def add_module_14():
    para("MÓDULO 14 — HTTP E HTTPS", header_style)
    para("HTTP usa porta 80 e HTTPS usa porta 443. A comunicação HTTP é textual e pode ser observada por ferramentas, enquanto HTTPS encapsula o tráfego em TLS. O cliente envia uma requisição com método como GET, POST, PUT ou DELETE; o servidor responde com status code.")
    para("Principais códigos: 200 OK; 301/302 redirecionamento; 400 requisição inválida; 401 não autenticado; 403 proibido; 404 não encontrado; 500 erro interno do servidor; 502 gateway inválido; 503 serviço indisponível; 504 timeout do gateway.")
    para("Diagnóstico: se o site responde 503, o problema é do servidor ou do serviço. Se responde 404, é recurso inexistente. Se responde 403, provàvel permissão ou WAF. Se responde 502/504, pode haver problema de upstream ou firewall.")
    para("Exercício: qual o código mais provável quando um sistema da empresa está em manutenção? Qual código indica que o cliente não está autenticado? Qual código associa-se a porta bloqueada?")
    story.append(PageBreak())


def add_module_15():
    para("MÓDULO 15 — TLS E CERTIFICADOS", header_style)
    para("HTTPS usa TLS para criptografar o tráfego e validar identidade. O certificado contém informações do domínio, emissor, validade e o nome do proprietário. A cadeia de confiança depende de autoridades certificadoras (CA). Se o navegador apresenta erro, pode ser porque o certificado expirou, não corresponde ao hostname, é autoassinado ou a cadeia não é confiável.")
    para("Problemas comuns: host name mismatch, expirado, certificador desconhecido, intermediário ausente, TLS desabilitado, protocolos obsoletos.")
    para("Exemplo: o site abre em um notebook e não em outro. A hipótese é que um dispositivo esteja com relógio incorreto, com certificado raiz não confiável ou com política de segurança diferente.")
    story.append(PageBreak())


def add_module_16():
    para("MÓDULO 16 — FIREWALL", header_style)
    para("Firewall inspeciona e controla tráfego com base em regras. Ele pode bloquear entrada, saída, protocolos e portas. O suporte técnico precisa diferenciar corretamente entre DNS, rota, firewall, porta fechada, serviço parado e aplicação com defeito.")
    para("Firewall não resolve DNS, não reencaminha roteamento e não corrige serviço. Seu papel é permitir ou bloquear fluxos. Uma porta fechada pode ser consequência de firewall, serviço desligado ou host sem processo ouvindo. Rota incorreta também impede o pacote de chegar ao destino.")
    para("O Windows Firewall e firewalls de rede corporativa são elementos centrais. Em um diagnóstico, a ordem correta é verificar funcionamento do serviço, porta, política de firewall e roteamento.")
    para("Exercício: um usuário relata que não consegue acessar um sistema interno pela porta 443. Qual é a ordem provável de investigação?")
    story.append(PageBreak())


def add_module_17():
    para("MÓDULO 17 — VPN", header_style)
    para("VPN cria túneis criptografados para permitir acesso remoto. Ela pode ser split tunnel ou full tunnel. Em ambientes corporativos, a VPN costuma fornecer acesso a recursos internos sem expor toda a rede local para o usuário.")
    para("Problemas comuns: usuário conecta, mas não consegue acessar sistema interno; DNS via VPN não responde; rota da rede interna não é anunciada; autenticação falha; policy conflict; firewall local ou da VPN bloqueia acesso.")
    para("Exercício: usuário conecta na VPN e consegue navegar na Internet, mas não consegue acessar o sistema interno. Quais são as hipóteses principais?")
    story.append(PageBreak())


def add_module_18():
    para("MÓDULO 18 — WI-FI", header_style)
    para("Wi-Fi envolve SSID, 2.4 GHz, 5 GHz, canais, interferência, sinal, autenticação, DHCP e roaming. O suporte precisa diagnosticar se o problema é sinal, canal, energia do AP, VLAN do Wi-Fi, DHCP, gateway ou firewall. Um notebook conectado, mas sem Internet, pode indicar problema de DHCP, gateway ou roteamento.")
    para("Em redes corporativas, a análise inclui qualidade do sinal, número de clientes no canal, interferência, frequência, senha e autenticação.")
    para("Exercício: Wi-Fi conectado, sem Internet. Quais hipóteses você testaria primeiro?")
    story.append(PageBreak())


def add_module_19():
    para("MÓDULO 19 — FERRAMENTAS DO WINDOWS", header_style)
    para("As ferramentas do Windows são essenciais para diagnóstico. ipconfig mostra IP, máscara e gateway. ping verifica conectividade ICMP. tracert identifica rota. pathping combina informações de rotas e latência. nslookup verifica resolução de nome. arp mostra tabela ARP. route exibe rotas. netstat mostra conexões ativas. Test-NetConnection verifica portas e conectividade. curl realiza consulta HTTP/HTTPS no terminal.")
    para("Para cada comando, o profissional deve entender: objetivo, sintaxe, o que espera, o que isso não prova, resultado positivo/negativo e próximo passo. O suporte não deve usar comandos de forma mecânica; ele deve decidir qual comando responde à hipótese investigada.")
    para("Exemplo: ping 8.8.8.8 verifica acesso IP; ping google.com vai incluir resolução DNS; Test-NetConnection -ComputerName google.com -Port 443 verifica TCP e porta 443.")
    para("Tabela de comando e objetivo:")
    table = Table([
        ['Comando', 'Objetivo', 'Quando usar'],
        ['ipconfig', 'Verificar IP, gateway e DNS', 'Notebook com falha de rede'],
        ['ping', 'Testar conectividade ICMP', 'Validação de alcance'],
        ['tracert', 'Identificar rota', 'Roteamento entre redes'],
        ['nslookup', 'Resolver nome', 'Problemas de DNS'],
        ['Test-NetConnection', 'Verificar TCP/porta', 'Porta 80/443/3389'],
        ['netstat', 'Conexões ativas', 'Verificar serviço e porta'],
    ], colWidths=[90, 170, 150])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))
    story.append(table)
    story.append(PageBreak())


def add_module_20():
    para("MÓDULO 20 — POWERSHELL PARA REDES", header_style)
    para("PowerShell é ferramenta central para suporte N2. Comandos importantes: Get-NetIPConfiguration, Get-NetIPAddress, Get-NetRoute, Get-NetAdapter, Get-NetTCPConnection, Resolve-DnsName, Test-NetConnection.")
    para("O projeto NETCHECK deve verificar computador, IP, máscara, gateway, DNS, adaptador, conectividade, resolução DNS, portas, rotas e gerar resumo. Ele deve seguir lógica clara: coletar dados, testar conectividade, testar portas e interpretar resultados. A apresentação deve ser objetiva, formatada e útil para documentação.")
    code_block("$adaptador = Get-NetAdapter | Where-Object {$_.Status -eq 'Up'}\n$ip = Get-NetIPAddress -InterfaceAlias $adaptador.Name\nGet-NetIPConfiguration\nTest-NetConnection -ComputerName google.com -Port 443\nResolve-DnsName google.com")
    para("Esses scripts ajudam o analista a automatizar verificações, reduzir erros e documentar melhor cada atendimento.")
    story.append(PageBreak())


def add_module_21():
    para("MÓDULO 21 — TROUBLESHOOTING PROFISSIONAL", header_style)
    para("A metodologia profissional segue um ciclo: identificar, coletar informações, reproduzir, formular hipóteses, testar, isolar, corrigir, validar e documentar. Nem sempre o primeiro teste é o comando mais famoso; o primeiro teste é o teste que melhor elimina hipóteses.")
    para("Fluxo do troubleshooting:")
    code_block("SINTOMA\n↓\nCOLETA DE INFORMAÇÕES\n↓\nHIPÓTESES\n↓\nTESTE\n↓\nRESULTADO\n↓\nINTERPRETAÇÃO\n↓\nELIMINAÇÃO DE HIPÓTESES\n↓\nNOVO TESTE\n↓\nCAUSA\n↓\nCORREÇÃO\n↓\nVALIDAÇÃO\n↓\nDOCUMENTAÇÃO")
    para("Em ambiente de suporte, a documentação é parte do diagnóstico. O que foi testado, qual foi o resultado, qual hipótese foi descartada, e qual correção foi aplicada devem ser registrados para garantir continuidade e escalonamento.")
    story.append(PageBreak())


def add_module_22():
    para("MÓDULO 22 — TROUBLESHOOTING POR CAMADAS", header_style)
    para("A investigação deve seguir a ordem prática: físico, enlace/MAC/VLAN, IP, gateway, roteamento, TCP/UDP, portas, DNS, firewall, HTTP/HTTPS, aplicação e autenticação. Isso ajuda a evitar saltos lógicos e erros de conclusão.")
    para("Se o usuário não consegue acessar a rede, primeiro verificar cabo, LED do switch, link, IP e gateway. Se o IP está correto e há conectividade com o gateway, investigar roteamento, VLAN, firewall e serviço. Se o servidor responde ao ICMP mas não ao serviço web, o problema pode ser de porta, firewall, aplicativo ou proxy.")
    para("Exercício: descreva a ordem de investigação para: um site não abre, VPN conecta mas sistema interno não abre, notebook conectado Wi-Fi mas sem Internet, e servidor acessível por IP mas não por nome.")
    story.append(PageBreak())


def add_module_23():
    para("MÓDULO 23 — LOGS E EVIDÊNCIAS", header_style)
    para("Coletar evidências é um diferencial de N2. O suporte precisa registrar data e hora, usuário, equipamento, IP, hostname, erro, comando executado, resultado e imagem de tela. Isso permite comparar ambientes, confirmar hipótese e evitar diagnóstico sem base.")
    para("Logs são importantes em DNS, DHCP, firewall, certificados, VPN e aplicações. Quando não há evidência, não se conclui. O correto é testar, observar e registrar.")
    para("Checklist de evidência: o usuário relatou; o equipamento; endereço IP; resultado de ping; resultado de nslookup; porta TCP em teste; impressão da tela; ocorreu antes ou depois da mudança; status do serviço; erro exibido; se o problema foi reproduzido; se houve mudança no ambiente.")
    story.append(PageBreak())


def add_module_24():
    para("MÓDULO 24 — DOCUMENTAÇÃO DE INCIDENTES", header_style)
    para("Um incidente bem documentado é essencial para manutenção, escalonamento e continuidade. O aluno deve registrar: descrição, usuário, equipamento, data/hora, impacto, sintoma, testes realizados, resultados, hipóteses, causa, ação corretiva, validação, evidências e escalonamento.")
    code_block("INCIDENTE\nDESCRIÇÃO\nUSUÁRIO\nEQUIPAMENTO\nDATA/HORA\nIMPACTO\nSINTOMA\nTESTES REALIZADOS\nRESULTADOS\nHIPÓTESES\nCAUSA\nAÇÃO CORRETIVA\nVALIDAÇÃO\nEVIDÊNCIAS\nESCALONAMENTO")
    para("A documentação profissionais não é burocracia; é prova técnica. Ela permite que outro analista resolva o mesmo problema e que a empresa aprimore a infraestrutura.")
    story.append(PageBreak())


def add_module_25():
    para("MÓDULO 25 — CASOS REAIS DE N1/N2", header_style)
    para("A seguir, estão 20 cenários típicos da rotina de suporte técnico. Cada caso deve ser tratado como problema a ser investigado, não como chamada para memorizar comando. O aluno deve usar a sequência: cenário, sintoma, informações disponíveis, hipóteses, primeiro teste, interpretação, próximo teste, correção e documentação.")
    items = [
        "1. Internet completamente indisponível",
        "2. Apenas um site não abre",
        "3. Sistema interno indisponível",
        "4. Ping funciona, aplicação não",
        "5. DNS não resolve",
        "6. IP 169.254.x.x",
        "7. FTP não conecta",
        "8. FTP conecta mas login falha",
        "9. Um computador funciona e outro não",
        "10. VPN conecta mas sistema interno não",
        "11. Porta 443 bloqueada",
        "12. RDP não conecta",
        "13. Wi-Fi conecta sem Internet",
        "14. Sistema funciona por IP mas não por hostname",
        "15. Gateway incorreto",
        "16. Rota incorreta",
        "17. VLAN incorreta",
        "18. Firewall bloqueando conexão",
        "19. HTTP 500",
        "20. HTTP 503",
    ]
    for item in items:
        para(item)
    para("Cada caso deve ser trabalhado por: cenário, sintoma, hipóteses, primeiro teste, interpretação e correção. Esse é o núcleo de desenvolvimento do raciocínio N2.")
    story.append(PageBreak())


def add_module_26():
    para("MÓDULO 26 — PROJETO FINAL: LABORATÓRIO DE TROUBLESHOOTING CORPORATIVO", header_style)
    para("A empresa fictícia terá usuários, computadores, switches, roteador, VLANs, DHCP, DNS, servidor, aplicação web, FTP, firewall, VPN e Wi-Fi. O projeto final exige que o aluno diagnostique 10 incidentes em diferentes camadas.")
    para("Empresa fictícia: RedeCorp Ltda. Usuários: Ana, Bruno, Carla, Diego, Elaine. Locais: sede e filiais. VLAN 10 RH, VLAN 20 Financeiro, VLAN 30 TI, VLAN 40 Wi-Fi, VLAN 50 Guest. Servidores: AD, DNS, DHCP, FTP, Web, Aplicação Financeira. Gateway: 10.0.0.1. Firewall: ACL no perímetro. VPN: acesso remoto.")
    para("Incidentes propostos:")
    incidentes = [
        "1. DHCP: computadores recebem 169.254.x.x.",
        "2. DNS: um setor não resolve nomes.",
        "3. Gateway: notebook acessa IP local, mas não internet.",
        "4. VLAN: usuário da RH recebe IP da Financeiro.",
        "5. Firewall: porta 443 bloqueada para aplicação web.",
        "6. Porta TCP: sistema interno não responde em 3389.",
        "7. HTTP: site da empresa retorna 500.",
        "8. VPN: usuário conecta, mas não acessa o sistema interno.",
        "9. Roteamento: uma filial não alcança rede principal.",
        "10. Aplicação: servidor responde ao ping, mas a aplicação não carrega.",
    ]
    for item in incidentes:
        para(item)
    para("Ao final, o aluno deve produzir um relatório técnico com: descrição, evidências, hipótese, ação, validação e conclusão. Esse relatório será o equivalente prático de um atendimento profissional de nível N2.")
    story.append(PageBreak())


def add_ps_project():
    para("PROJETO DE POWERSHELL: NETCHECK — KIT DE DIAGNÓSTICO DE REDE", header_style)
    para("O projeto NETCHECK deve verificar IP, máscara, gateway, DNS, adaptadores, conectividade, resolução DNS, portas, rotas e gerar resumo. A lógica envolve variáveis, condicionais, funções, tratamento de erros e saída formatada.")
    code_block("function Verificar-IP {\n    $config = Get-NetIPConfiguration\n    $config | Select-Object InterfaceAlias, IPv4Address, IPv4DefaultGateway, DNSServer\n}\n\nfunction Testar-Porta {\n    param($HostName, $Port)\n    Test-NetConnection -ComputerName $HostName -Port $Port\n}\n\n$dados = Verificar-IP\n$dados\nTestar-Porta -HostName 'google.com' -Port 443")
    para("O objetivo é transformar o diagnóstico em um checklist automatizado. Sempre que a rede falha, o suporte pode coletar dados de maneira padronizada e reduzir erros de análise.")
    story.append(PageBreak())


def add_exercises_and_gabarito():
    para("EXERCÍCIOS E GABARITO", header_style)
    para("As questões devem ser respondidas com raciocínio, não apenas com nome de comando. Exemplo: 'O usuário não consegue acessar o sistema financeiro. A internet funciona e outros sites abrem. O sistema é interno e o hostname não responde. Qual sua primeira hipótese?' Deveria ser: DNS ou falha de resolução local. O próximo passo: testar nslookup ou Resolve-DnsName, verificar se o IP do servidor responde e se a aplicação está na porta correta.")
    para("Gabarito orientado ao raciocínio:")
    para("• Resposta correta deve ser acompanhada de por que as outras hipóteses foram descartadas. • O comando a ser usado deve ser justificado. • A interpretação do resultado deve ser parte da resposta. • A solução e a documentação também são importantes.")
    para("Exemplo de análise N1 vs N2: N1: 'O sistema não funciona.' N2: 'O usuário consegue resolver o nome do servidor e alcançar o gateway; o servidor responde ao ICMP, mas a conexão TCP na porta da aplicação não é estabelecida. A próxima investigação é disponibilidade do serviço, firewall ou política de rede.'")
    story.append(PageBreak())


def add_cheat_sheet():
    para("CHEAT SHEET — NETWORK TROUBLESHOOTING", header_style)
    rows = [
        ['Comando', 'Objetivo', 'O que observar', 'Interpretação', 'Próximo passo'],
        ['ipconfig', 'Verificar IP', 'IP, máscara, gateway, DNS', 'Se APIPA ou sem gateway, problema de DHCP/segmento', 'Verificar DHCP e VLAN'],
        ['ping', 'Conectividade', 'Resposta ICMP', 'Sem resposta = bloqueio, falha de rede ou host', 'Testar gateway e servidor'],
        ['tracert', 'Rota', 'Pontos de falha', 'Onde a rota para', 'Investigar roteamento ou firewall'],
        ['pathping', 'Latência', 'Hops e perda', 'Identificar picos', 'Analisar intermediário'],
        ['nslookup', 'DNS', 'Resposta do servidor', 'Sem resposta = DNS ou roteamento', 'Validar servidor DNS'],
        ['Resolve-DnsName', 'DNS em PowerShell', 'Resolução por PowerShell', 'Servidor ou cache', 'Verificar busca local'],
        ['arp -a', 'ARP', 'MAC x IP', 'Sem mapeamento', 'Verificar VLAN e switch'],
        ['route print', 'Rotas', 'Gateway, interface', 'Rota não esperada', 'Corrigir rota estática'],
        ['netstat -ano', 'Conexões ativas', 'LISTEN, ESTABLISHED', 'Sistema sem serviço escutando', 'Validar serviço e firewall'],
        ['Test-NetConnection', 'TCP e porta', 'Result, TcpTestSucceeded', 'Porta fechada ou host indisponível', 'Investigar serviço/firewall'],
        ['curl', 'HTTP/HTTPS', 'Status code', '500/503/403', 'Correlacionar com serviço e certificados'],
        ['Get-NetIPConfiguration', 'Configuração do adaptador', 'IP e DNS', 'Inconsistência', 'Conferir rede'],
    ]
    table = Table(rows, colWidths=[65, 70, 110, 110, 110])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0B3B5B')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 7),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
    ]))
    story.append(table)
    story.append(PageBreak())


def add_glossary():
    para("GLOSSÁRIO", header_style)
    terms = [
        "DNS: sistema de resolução de nomes.\n\nDHCP: serviço que atribui IPs automaticamente.\n\nGateway: saída da rede local.\n\nVLAN: rede lógica segmentada no switch.\n\nCIDR: representação de rede com prefixo.\n\nARP: mapeia IP para MAC.\n\nTCP: protocolo confiável e orientado à conexão.\n\nUDP: protocolo simples e rápido.\n\nFirewall: controle de tráfego em função de regras.\n\nVPN: túnel criptografado para acesso remoto.\n\nHTTP/HTTPS: protocolos para navegação web.\n\nTLS: segurança da camada de transporte.\n\nBroadcast: envio para todos da rede.\n\nLoopback: endereço de retorno local.\n\nAPIPA: faixa automática de link-local."
    ]
    para(terms[0])
    story.append(PageBreak())


def add_final_assessment():
    para("AVALIAÇÃO FINAL", header_style)
    ques = [
        "1. Explique a diferença entre IP privado e público.",
        "2. Qual é o conceito principal de subnetting?",
        "3. Se o ping ao gateway funciona, mas não ao servidor externo, quais hipóteses você considera?",
        "4. O que um código HTTP 503 indica?",
        "5. Como você diagnostica um cliente que recebe 169.254.x.x?",
        "6. Qual teste é mais útil para confirmar DNS funcionando?",
        "7. O que significa um TCP SYN timeout?",
        "8. Quando usar a rota padrão?",
        "9. Qual a diferença entre VLAN e subnet?",
        "10. Como você documentaria um incidente de VPN?",
    ]
    for q in ques:
        para(f"• {q}")
    para("Prova prática: uma máquina está com Wi-Fi conectado, mas sem internet; a outra máquina no mesmo setor funciona. Investigue, formule hipótese, teste, interprete e documente a resposta.")
    story.append(PageBreak())


def add_checklist():
    para("CHECKLIST DE COMPETÊNCIAS", header_style)
    competencies = [
        "Entendo TCP/IP",
        "Entendo IPv4",
        "Sei calcular subnetting",
        "Entendo CIDR",
        "Entendo VLSM",
        "Entendo TCP",
        "Entendo UDP",
        "Entendo portas",
        "Entendo DNS",
        "Entendo DHCP",
        "Entendo ARP",
        "Entendo switching",
        "Entendo VLAN",
        "Entendo routing",
        "Entendo firewall",
        "Entendo VPN",
        "Entendo HTTP/HTTPS",
        "Sei usar ferramentas do Windows",
        "Sei utilizar PowerShell",
        "Sei diagnosticar problemas",
        "Sei documentar incidentes",
    ]
    for item in competencies:
        para(f"• {item} — PRECISO REVISAR __ / CONSIGO EXECUTAR __ / CONSIGO EXPLICAR __ / CONSIGO DIAGNOSTICAR __ / CONSIGO RESOLVER __ / CONSIGO ENSINAR __")
    story.append(PageBreak())


def add_final_page():
    para("Conclusão", header_style)
    para("Este curso foi desenhado para que o aluno desenvolva raciocínio técnico e não apenas conhecimento superficial. O aprendizado verdadeiro acontece quando a pessoa consegue transformar um sintoma em hipótese, mudar a investigação conforme o resultado e registrar a decisão corretamente.")
    para("Se o suporte quer evoluir de N1 para N2, ele precisa aprender a fazer diagnósticos com clareza, domínios de rede e visão de infraestrutura. A prática profissional exige observação, lógica e documentação técnica.")
    para("Rede, segurança, infraestrutura e nuvem possuem um eixo comum: entendimento profundo da comunicação entre dispositivos. Esse curso oferece a base para esse desenvolvimento.")


def build_pdf():
    title_page()
    add_toc()
    add_course_intro()
    add_methodology()
    add_profile()
    add_module_1()
    add_module_2()
    add_module_3()
    add_module_4()
    add_module_5()
    add_module_6()
    add_module_7()
    add_module_8()
    add_module_9()
    add_module_10()
    add_module_11()
    add_module_12()
    add_module_13()
    add_module_14()
    add_module_15()
    add_module_16()
    add_module_17()
    add_module_18()
    add_module_19()
    add_module_20()
    add_module_21()
    add_module_22()
    add_module_23()
    add_module_24()
    add_module_25()
    add_module_26()
    add_ps_project()
    add_exercises_and_gabarito()
    add_cheat_sheet()
    add_glossary()
    add_final_assessment()
    add_checklist()
    add_final_page()

    doc = SimpleDocTemplate(
        OUTPUT_PATH,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36,
    )
    doc.build(story)


if __name__ == '__main__':
    build_pdf()
    print(f"PDF gerado em: {OUTPUT_PATH}")

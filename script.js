const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

for (const button of tabButtons) {
  button.addEventListener('click', () => {
    const target = button.dataset.target;

    tabButtons.forEach((btn) => btn.classList.toggle('active', btn === button));
    tabPanels.forEach((panel) => {
      panel.classList.toggle('active', panel.id === target);
    });
  });
}

const STORAGE_KEY = 'curso_redes_pessoal';
const defaultState = {
  note: '',
  modules: {
    fundamentos: true,
    ipv4: false,
    diagnostico: false,
    firewall: false,
    powershell: false,
    vlan: false,
    dhcp: false,
    ospf: false,
    vpn: false,
    wifi: false
  }
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      ...defaultState,
      ...saved,
      modules: { ...defaultState.modules, ...(saved.modules || {}) }
    };
  } catch (error) {
    console.warn('Não foi possível carregar o progresso salvo.', error);
    return { ...defaultState };
  }
}

const state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function updateProgressVisuals() {
  const progressValue = document.getElementById('progressValue');
  const progressFill = document.getElementById('progressFill');
  const moduleProgressList = document.getElementById('moduleProgressList');

  if (!progressValue || !progressFill || !moduleProgressList) {
    return;
  }

  const allModules = Object.keys(state.modules);
  const completed = allModules.filter((key) => state.modules[key]).length;
  const progress = Math.round((completed / allModules.length) * 100);

  progressValue.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;

  moduleProgressList.innerHTML = allModules.map((key) => {
    const labelMap = {
      fundamentos: 'Fundamentos',
      ipv4: 'IPv4 e subnetting',
      diagnostico: 'Diagnóstico',
      firewall: 'Firewall',
      powershell: 'PowerShell',
      vlan: 'VLAN',
      dhcp: 'DHCP',
      ospf: 'OSPF',
      vpn: 'VPN',
      wifi: 'Wi‑Fi'
    };

    return `
      <button class="module-item ${state.modules[key] ? 'done' : ''}" data-module-toggle="${key}" type="button">
        <span>${labelMap[key]}</span>
        <strong>${state.modules[key] ? '✓' : '—'}</strong>
      </button>
    `;
  }).join('');

  document.querySelectorAll('[data-module-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const key = button.dataset.moduleToggle;
      if (!key) return;
      state.modules[key] = !state.modules[key];
      saveState();
      updateProgressVisuals();
    });
  });
}

const studyNote = document.getElementById('studyNote');
if (studyNote) {
  studyNote.value = state.note;
  studyNote.addEventListener('input', (event) => {
    state.note = event.target.value;
    saveState();
  });
}

const saveNoteButton = document.getElementById('saveNote');
if (saveNoteButton) {
  saveNoteButton.addEventListener('click', () => {
    saveState();
    const value = studyNote ? studyNote.value.trim() : '';
    const statusText = value ? 'Conteúdo salvo com sucesso.' : 'Você ainda não escreveu nenhum aprendizado.';
    saveNoteButton.textContent = statusText;
    setTimeout(() => {
      saveNoteButton.textContent = 'Salvar conteúdo';
    }, 1200);
  });
}

const terminalOutput = document.getElementById('terminal-output');
const terminalForm = document.getElementById('terminal-form');
const terminalInput = document.getElementById('terminal-input');
const terminalStatus = document.getElementById('terminal-status');
const terminalFeedback = document.getElementById('terminal-feedback');

function appendTerminalLine(text, klass = '') {
  if (!terminalOutput) return;
  const line = document.createElement('p');
  line.className = klass;
  line.textContent = text;
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function runCommand(command) {
  const normalized = command.trim().replace(/\s+/g, ' ').toLowerCase();

  if (!normalized) {
    return;
  }

  if (normalized === 'cls' || normalized === 'clear') {
    terminalOutput.innerHTML = '';
    if (terminalStatus) terminalStatus.textContent = 'Terminal limpo';
    if (terminalFeedback) terminalFeedback.textContent = 'O histórico foi limpo; a simulação continua pronta para novos testes.';
    return;
  }

  if (normalized === 'help') {
    appendTerminalLine('Comandos simulados: ipconfig [/all], ping <host>, tracert <host>, nslookup <domínio>, netstat -an, Test-NetConnection <host> -Port <porta>, Get-NetIPConfiguration, Get-NetRoute, Get-NetTCPConnection [-State Established], Resolve-DnsName <domínio>, cls.');
    if (terminalStatus) terminalStatus.textContent = 'Ajuda do simulador';
    if (terminalFeedback) terminalFeedback.textContent = 'As respostas são exemplos didáticos; nenhum comando é executado no Windows real.';
    return;
  }

  const lines = [];
  let isRecognized = true;
  let feedback = 'Resultado didático simulado. Compare a saída com a hipótese que você quer validar.';

  if (/^ipconfig(?: \/all)?$/.test(normalized)) {
    lines.push('Windows IP Configuration', '', 'Ethernet adapter Ethernet:', '   Connection-specific DNS Suffix  . : rede.local', '   IPv4 Address. . . . . . . . . . . : 192.168.1.25', '   Subnet Mask . . . . . . . . . . . : 255.255.255.0', '   Default Gateway . . . . . . . . . : 192.168.1.1');
    if (normalized.endsWith('/all')) lines.push('   DHCP Server . . . . . . . . . . . : 192.168.1.1', '   DNS Servers . . . . . . . . . . . : 192.168.1.1');
    feedback = 'Confira IPv4, máscara, gateway e DNS. Um endereço 169.254.x.x pode indicar falha ao obter configuração DHCP.';
  } else if (/^ping\s+\S+(?:\s+-n\s+\d+)?$/.test(normalized)) {
    const target = normalized.match(/^ping\s+(\S+)/)?.[1] || 'destino';
    const address = target === 'localhost' ? '::1' : target === 'google.com' ? '142.250.72.14' : target === '1.1.1.1' || target === 'cloudflare.com' ? '1.1.1.1' : target === '8.8.8.8' ? '8.8.8.8' : target;
    lines.push(`Pinging ${target} [${address}] with 32 bytes of data:`, `Reply from ${address}: bytes=32 time=12ms TTL=117`, `Reply from ${address}: bytes=32 time=11ms TTL=117`, `Reply from ${address}: bytes=32 time=13ms TTL=117`, `Reply from ${address}: bytes=32 time=12ms TTL=117`, '', 'Ping statistics: Sent = 4, Received = 4, Lost = 0 (0% loss)');
    feedback = 'O ping simulado confirma resposta ICMP no cenário. Isso não garante que uma aplicação ou porta específica esteja acessível.';
  } else if (/^tracert\s+\S+$/.test(normalized)) {
    const target = normalized.slice('tracert '.length);
    lines.push(`Tracing route to ${target} over a maximum of 3 hops:`, '  1     1 ms     1 ms     1 ms  192.168.1.1', '  2    10 ms    11 ms    10 ms  10.0.0.1', `  3    18 ms    17 ms    18 ms  ${target}`, 'Trace complete.');
    feedback = 'A rota simulada mostra os saltos entre o computador e o destino; asteriscos reais podem indicar ausência de resposta ICMP, não necessariamente falha total.';
  } else if (/^nslookup\s+\S+$/.test(normalized) || /^resolve-dnsname\s+\S+$/.test(normalized)) {
    const domain = normalized.replace(/^(nslookup|resolve-dnsname)\s+/, '');
    lines.push('Server:  dns.rede.local', 'Address: 192.168.1.1', '', `Name:    ${domain}`, 'Address: 93.184.216.34');
    feedback = 'A resolução simulada retornou um endereço. Se falhar no ambiente real, investigue servidor DNS, sufixo, cache e conectividade.';
  } else if (normalized === 'netstat -an' || normalized === 'netstat -ano') {
    lines.push('Active Connections', '  Proto  Local Address          Foreign Address        State', '  TCP    192.168.1.25:51544      142.250.72.14:443      ESTABLISHED', '  TCP    192.168.1.25:51545      10.0.0.20:443          TIME_WAIT', '  UDP    0.0.0.0:5353            *:*');
    feedback = 'Use estado, endereço local e remoto como pistas. Uma conexão LISTENING/ESTABLISHED não prova sozinha que a aplicação esteja saudável.';
  } else if (/^(test-netconnection|tnc)\s+\S+\s+-port\s+\d+$/.test(normalized)) {
    const [, host, port] = normalized.match(/^(?:test-netconnection|tnc)\s+(\S+)\s+-port\s+(\d+)$/) || [];
    lines.push(`ComputerName     : ${host}`, `RemotePort       : ${port}`, 'NameResolutionResults : 10.0.0.20', 'TcpTestSucceeded : True');
    feedback = 'O teste TCP simulado valida a porta informada. Ping e teste de porta verificam camadas diferentes.';
  } else if (normalized === 'get-netipconfiguration') {
    lines.push('InterfaceAlias       : Ethernet', 'IPv4Address          : 192.168.1.25', 'IPv4DefaultGateway   : 192.168.1.1', 'DNSServer             : 192.168.1.1');
    feedback = 'O cmdlet mostra a configuração IP efetiva da interface; compare endereço, gateway e DNS com o segmento esperado.';
  } else if (normalized === 'get-netroute') {
    lines.push('ifIndex DestinationPrefix NextHop      RouteMetric', '7       0.0.0.0/0       192.168.1.1  25', '7       192.168.1.0/24  0.0.0.0     256');
    feedback = 'A rota 0.0.0.0/0 é a rota padrão. Verifique se o próximo salto corresponde ao gateway da rede.';
  } else if (/^get-nettcpconnection(?: -state established)?$/.test(normalized)) {
    lines.push('LocalAddress LocalPort RemoteAddress  RemotePort State       OwningProcess', '192.168.1.25 51544     142.250.72.14  443        Established 4312');
    feedback = 'A saída é um retrato didático de conexões locais. Estado Established não confirma que a aplicação esteja respondendo corretamente.';
  } else if (normalized === 'ipconfig /flushdns') {
    lines.push('Successfully flushed the DNS Resolver Cache.');
    feedback = 'O cache DNS local foi limpo na simulação; depois, teste novamente a resolução do nome.';
  } else {
    isRecognized = false;
  }

  appendTerminalLine(`> ${command}`);
  if (isRecognized) {
    lines.forEach((line) => appendTerminalLine(line));
    if (terminalStatus) terminalStatus.textContent = 'Comando reconhecido (simulado)';
    if (terminalFeedback) terminalFeedback.textContent = feedback;
    state.modules.diagnostico = true;
    saveState();
    updateProgressVisuals();
    return;
  }

  appendTerminalLine('Comando não reconhecido pelo simulador. Digite help para consultar os comandos disponíveis.');
  if (terminalStatus) terminalStatus.textContent = 'Comando não reconhecido';
  if (terminalFeedback) terminalFeedback.textContent = 'Este laboratório aceita um conjunto didático de comandos; ele não executa comandos no Windows real.';
}

if (terminalForm && terminalInput) {
  terminalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    runCommand(terminalInput.value);
    terminalInput.value = '';
  });
}

const quizData = [
  {
    question: 'O que indica um endereço IPv4 começando em 169.254.x.x?',
    options: [
      'IP válido obtido por DHCP',
      'Rede pública com roteamento correto',
      'Falha de configuração de DHCP ou de endereço de rede',
      'Servidor DNS respondendo corretamente'
    ],
    correct: 'Falha de configuração de DHCP ou de endereço de rede',
    explanation: 'Esse intervalo é típico de APIPA, indicando que o host não conseguiu obter um endereço da rede.'
  },
  {
    question: 'Qual é a melhor primeira hipótese quando a internet funciona, mas um sistema interno pelo nome não abre?',
    options: [
      'Problema de memória do computador',
      'Possível falha de DNS ou resolução de nomes',
      'Falta de energia no roteador',
      'Erro no sistema operacional'
    ],
    correct: 'Possível falha de DNS ou resolução de nomes',
    explanation: 'Se a internet funciona e o problema é específico para um nome interno, DNS e resolução de nomes são as hipóteses mais prováveis.'
  },
  {
    question: 'Qual comando é útil para testar a conectividade de um serviço na porta 443?',
    options: [
      'ipconfig',
      'tracert',
      'Test-NetConnection',
      'mstsc'
    ],
    correct: 'Test-NetConnection',
    explanation: 'O Test-NetConnection verifica conectividade, porta e destino, sendo ideal para diagnóstico de rede e portas.'
  },
  {
    question: 'Qual ação seria mais correta ao encontrar um timeout em uma conexão TCP?',
    options: [
      'Concluir que o servidor caiu imediatamente',
      'Ignorar o problema e reiniciar o computador',
      'Investigar roteamento, firewall, serviço e disponibilidade do host',
      'Trocar o cabo de rede sem confirmar'
    ],
    correct: 'Investigar roteamento, firewall, serviço e disponibilidade do host',
    explanation: 'Timeout indica que a requisição não chegou a resposta adequada; há várias causas possíveis, não apenas uma.'
  }
];

const quizContainer = document.getElementById('quiz');
const resultBox = document.getElementById('quiz-result');
const submitButton = document.getElementById('submit-quiz');

if (quizContainer) {
  quizData.forEach((item, index) => {
    const questionWrap = document.createElement('div');
    questionWrap.className = 'quiz-question';

    const title = document.createElement('h3');
    title.textContent = `${index + 1}. ${item.question}`;
    questionWrap.appendChild(title);

    item.options.forEach((option) => {
      const label = document.createElement('label');
      label.className = 'quiz-option';
      label.innerHTML = `<input type="radio" name="q-${index}" value="${option}" />${option}`;
      questionWrap.appendChild(label);
    });

    quizContainer.appendChild(questionWrap);
  });
}

if (submitButton) {
  submitButton.addEventListener('click', () => {
    let score = 0;
    const total = quizData.length;

    quizData.forEach((item, index) => {
      const selected = document.querySelector(`input[name="q-${index}"]:checked`);
      if (selected && selected.value === item.correct) {
        score += 1;
      }
    });

    const percentage = Math.round((score / total) * 100);
    const message = `Você acertou ${score} de ${total} questões (${percentage}%).`;

    if (resultBox) {
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <strong>${message}</strong>
        <p>Revise os pontos principais e continue praticando. A melhor forma de aprender redes é observar o cenário, formular hipótese e validar com testes.</p>
      `;
    }
  });
}

updateProgressVisuals();

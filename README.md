# NODE / STUDY — MVP local de estudos em TI

Aplicação de estudo local-first com workspace, trilha de Redes, aulas, prática de troubleshooting, terminal didático e progresso salvo no navegador.

## Executar

Na pasta do projeto, inicie um servidor estático:

```powershell
python -m http.server 9002
```

Abra `http://localhost:9002/`. Se a porta estiver ocupada, use outra e atualize o endereço.

## Abrir pelo navegador

O GitHub Pages publica a aplicação em:

`https://lincon-ricardo.github.io/plataforma-estudos-ti/`

O workflow `.github/workflows/pages.yml` publica automaticamente quando há push no branch `main`. A primeira publicação pode levar alguns minutos. Perfil e progresso ficam no armazenamento local do navegador usado para abrir o site.

## O que funciona neste MVP

- Perfis locais separados por nome, retomada do usuário anterior e preferências de tema.
- Avaliação diagnóstica inicial opcional com 10 questões, resultado por cinco áreas e recomendação de módulos; é possível pular para o dashboard e fazê-la mais tarde. Respostas parciais são retomadas no navegador.
- Dashboard com próxima aula, progresso, XP e roteiro de estudo.
- Roadmap com 12 trilhas; a trilha de Redes para Suporte N1/N2 tem 23 módulos.
- Aulas com conceito, exemplo, comando, interpretação, checkpoint, anotações, favoritos e conclusão.
- Questionários corrigidos com justificativas e referências Microsoft Learn/IETF nos quatro módulos iniciais de Redes (Fundamentos, OSI/TCP-IP, IPv4 e Subnetting); tentativas, notas e revisão espaçada de 1, 3, 7, 14 e 30 dias ficam no perfil local. A aprovação teórica é de 80%, e a recompensa de XP por aprovação é concedida uma única vez por módulo.
- Dashboard e página de progresso mostram tentativas e resultados reais dos questionários disponíveis, sem estimar domínio de temas ainda não avaliados.
- Troubleshooting Lab com quatro incidentes, testes de evidência, hipótese e documentação.
- Desafio diário com feedback por hipótese e justificativa.
- Calculadora de sub-redes IPv4 com rede, hosts, broadcast, máscara e prefixo.
- Terminal didático com respostas simuladas para comandos de rede e PowerShell.
- Projetos com checklist, notas, progresso e indicadores que não confundem XP ou questionários com domínio prático.
- Tema escuro/claro, sidebar responsiva, navegação por teclado e suporte a preferência por movimento reduzido.
- Gerador opcional de PDF em `curso_redes_n1_n2.py`; o PDF é um artefato regenerável e fica ignorado pelo Git.

Para gerar o PDF localmente, instale a dependência e execute o script:

```powershell
pip install -r requirements.txt
python curso_redes_n1_n2.py
```

## Armazenamento e segurança

O MVP guarda cada perfil local, progresso, tentativas de questionários, agenda de revisão, notas, favoritos, projetos e preferências no `localStorage` do navegador. Digitar o mesmo nome recupera aquele perfil neste navegador; perfis não sincronizam entre dispositivos.

A tela de entrada separa e recupera perfis pelo nome, mas isso não é autenticação segura: qualquer pessoa com acesso a este navegador pode digitar o nome e abrir os dados locais daquele perfil. Não há senha, API, PostgreSQL/SQLite, recuperação de senha, painel administrativo nem controle de acesso. Como esta versão é estática, o conteúdo dos questionários e seus gabaritos é entregue ao navegador; não use estes testes para avaliações sigilosas. Não armazene dados pessoais, credenciais ou informações de incidentes de uma empresa real. Para publicação multiusuário e gabaritos protegidos, a próxima etapa é implementar backend com autenticação, autorização, API e banco de dados.

Os resultados dos questionários medem somente o desempenho teórico registrado. Eles não certificam competência prática; laboratórios e projetos precisam de critérios próprios de avaliação.

O terminal e os incidentes são simulações educativas. Nenhum comando é executado no sistema operacional; os resultados não devem ser usados como evidência operacional real.

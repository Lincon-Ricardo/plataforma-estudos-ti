# NODE / STUDY — MVP local de estudos em TI

Aplicação de estudo local-first com workspace, trilha de Redes, aulas, prática de troubleshooting, terminal didático e progresso salvo no navegador.

## Executar

Na pasta do projeto, inicie um servidor estático:

```powershell
python -m http.server 9002
```

Abra `http://localhost:9002/`. Se a porta estiver ocupada, use outra e atualize o endereço.

## O que funciona neste MVP

- Perfis locais separados por nome, retomada do usuário anterior e preferências de tema.
- Avaliação diagnóstica inicial com 10 questões, resultado por cinco áreas e recomendação de módulos; respostas parciais são retomadas no navegador.
- Dashboard com próxima aula, progresso, XP e roteiro de estudo.
- Roadmap com 12 trilhas; a trilha de Redes para Suporte N1/N2 tem 23 módulos.
- Aulas com conceito, exemplo, comando, interpretação, checkpoint, anotações, favoritos e conclusão.
- Troubleshooting Lab com quatro incidentes, testes de evidência, hipótese e documentação.
- Desafio diário com feedback por hipótese e justificativa.
- Calculadora de sub-redes IPv4 com rede, hosts, broadcast, máscara e prefixo.
- Terminal didático com respostas simuladas para comandos de rede e PowerShell.
- Projetos com checklist, revisão espaçada, notas, mapa de skills e progresso.
- Tema escuro/claro, sidebar responsiva, navegação por teclado e suporte a preferência por movimento reduzido.

## Armazenamento e segurança

O MVP guarda cada perfil local, progresso, notas, favoritos, projetos e preferências no `localStorage` do navegador. Digitar o mesmo nome recupera aquele perfil neste navegador; perfis não sincronizam entre dispositivos.

A tela de entrada separa e recupera perfis pelo nome, mas isso não é autenticação segura: qualquer pessoa com acesso a este navegador pode digitar o nome e abrir os dados locais daquele perfil. Não há senha, API, PostgreSQL/SQLite, recuperação de senha, painel administrativo nem controle de acesso. Não armazene dados pessoais, credenciais ou informações de incidentes de uma empresa real. Para publicação multiusuário, a próxima etapa é implementar backend com autenticação, autorização, API e banco de dados.

O terminal e os incidentes são simulações educativas. Nenhum comando é executado no sistema operacional; os resultados não devem ser usados como evidência operacional real.

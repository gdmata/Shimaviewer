# Especificações do Projeto

## Perfis de Usuários

| **Cliente** | |
| --- | --- |
| **Descrição:** | Pessoa com alta demanda na agenda e pouco tempo disponível, que busca praticidade para cuidar da beleza e bem-estar por meio de um plano de assinatura e agendamentos flexíveis. |
| **Necessidades:** | 1. Simplicidade e rapidez para agendar serviços ou combos. |
| | 2. Evitar ligações ou mensagens manuais para verificar a disponibilidade de horários. |
| | 3. Acompanhar o saldo de utilizações e benefícios disponíveis no seu plano contratado. |
| | 4. Realizar check-in de forma prática via QR Code no estabelecimento. |
| | 5. Visualizar informações dos estabelecimentos, portfólio de fotos dos profissionais, preços e avaliações de outros usuários. |
| | 6. Organizar sua própria rotina, podendo remarcar ou cancelar agendamentos dentro do prazo. |

| **Profissional / Estabelecimento** | |
| --- | --- |
| **Descrição:** | Dono de salão, gerente ou profissional autônomo parceiro que busca atrair novos clientes, fidelizar assinantes e organizar sua agenda de trabalho. |
| **Necessidades:** | 1. Cadastrar e gerenciar as informações do estabelecimento na plataforma. |
| | 2. Cadastrar o catálogo de serviços individuais e combos (ex: Corte + Tratamento), informando preços e durações. |
| | 3. Cadastrar e gerenciar a equipe de profissionais e os respectivos portfólios de fotos dos serviços realizados. |
| | 4. Configurar e gerenciar a disponibilidade de datas e horários de atendimento, evitando horários sobrepostos. |
| | 5. Visualizar a lista de clientes agendados e acompanhar a realização dos atendimentos. |
| | 6. Visualizar relatórios de agendamentos, faturamento e horários de maior ou menor movimento para identificar gargalos e planejar melhorias. |
| | 7. Criar campanhas de destaque ou incentivos de agendamento para os horários de baixo movimento, visando otimizar a ocupação da equipe. |

| **Administrador da Plataforma** | |
| --- | --- |
| **Descrição:** | Gestor responsável por administrar o ecossistema geral do aplicativo, controlando os planos de assinatura e a rede de parceiros. |
| **Necessidades:** | 1. Cadastrar, editar e gerenciar os planos de assinatura disponíveis na plataforma (ex: Básico, Plus, Premium). |
| | 2. Definir quais benefícios, quantidades e categorias de serviços estão associados a cada plano. |
| | 3. Cadastrar, aprovar, editar ou remover os estabelecimentos parceiros participantes do sistema. |
| | 4. Gerenciar a base geral de usuários cadastrados na plataforma. |

## Histórias de Usuários

Com base na análise das personas foram identificadas as seguintes histórias de usuários:

| EU COMO... `PERSONA` | QUERO/PRECISO ... `FUNCIONALIDADE` | PARA ... `MOTIVO/VALOR` |
| --- | --- | --- |
| Cliente | visualizar os planos de assinatura disponíveis e contratar o que melhor se adapta às minhas necessidades | ter direito aos benefícios e limites de utilizações mensais nos serviços. |
| Cliente | acompanhar o saldo de utilizações e benefícios disponíveis no meu plano | saber exatamente o que ainda posso agendar no mês. |
| Cliente | pesquisar e filtrar estabelecimentos por localização, serviço (incluindo combos) e disponibilidade | encontrar um salão que atenda às minhas preferências. |
| Cliente | escolher o serviço, o profissional, a data e o horário do atendimento | poder agendar de acordo com minha disponibilidade e sem precisar ligar. |
| Cliente | acumular pontos ou receber vantagens por meus atendimentos | ser recompensado por continuar frequentando o estabelecimento. |
| Cliente | realizar o check-in por meio de um QR Code ao chegar no estabelecimento | confirmar minha presença e registrar a utilização automática do meu benefício. |
| Cliente | cancelar ou remarcar meus agendamentos dentro do prazo permitido | flexibilizar minha rotina em caso de imprevistos. |
| Cliente | receber lembretes sobre meu agendamento | não esquecer o horário e evitar perder meu atendimento. |
| Cliente | avaliar o atendimento e deixar um comentário depois do serviço | compartilhar minha experiência e ajudar o estabelecimento a melhorar a qualidade. |
| Cliente | encontrar uma interface simples e fácil de entender | conseguir realizar meu agendamento sem dificuldades. |
| Cliente | que meus dados pessoais e informações de agendamento sejam protegidos | ter segurança ao utilizar o sistema. |
| Profissional / Estabelecimento | acessar o sistema por meio de uma autenticação segura | garantir que apenas pessoas autorizadas tenham acesso às informações do negócio. |
| Profissional / Estabelecimento | cadastrar e gerenciar os serviços e combos oferecidos (serviços ou combos estéticos), definindo preços e durações | manter o catálogo do salão sempre atualizado. |
| Profissional / Estabelecimento | visualizar relatórios de agendamentos, faturamento e horários de maior ou menor movimento | identificar gargalos na agenda e entender o comportamento dos clientes. |
| Profissional / Estabelecimento | utilizar uma interface prática para gerenciar meus agendamentos e visualizar compromissos do dia | conseguir organizar minha agenda rapidamente e evitar conflitos de horários ou sobreposições. |
| Profissional / Estabelecimento | cadastrar e consultar os dados dos meus clientes, como nome, telefone e histórico de serviços | conhecer melhor cada cliente e oferecer um atendimento personalizado. |
| Profissional / Estabelecimento | que o sistema funcione em diferentes dispositivos e mantenha um bom desempenho durante os atendimentos | conseguir consultar e atualizar minha agenda sem travamentos mesmo longe do computador. |
| Profissional / Estabelecimento | visualizar relatórios de faturamento, serviços mais realizados e horários de maior ou menor movimento | identificar gargalos na agenda e planejar estratégias para os horários ociosos. |
| Profissional / Estabelecimento | criar campanhas de destaque ou incentivos de agendamento | otimizar a ocupação da equipe nos horários de baixo movimento. |
| Administrador da Plataforma | cadastrar, editar e gerenciar os planos de assinatura e seus respectivos benefícios e limites | manter as regras de acesso dos clientes atualizadas no sistema. |
| Administrador da Plataforma | cadastrar, aprovar, editar ou remover os estabelecimentos parceiros participantes | controlar e expandir a rede de salões disponíveis na plataforma. |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto.

### Requisitos Funcionais

| ID | Descrição do Requisito | Prioridade |
| --- | --- | --- |
| RF-01 | O sistema deve permitir ao usuário cadastrar uma conta. | ALTA |
| RF-02 | O sistema deve permitir ao usuário fazer o login da sua conta. | ALTA |
| RF-03 | O sistema deve permitir ao usuário visualizar e gerenciar as informações cadastradas em seu perfil. | MÉDIA |
| RF-04 | O sistema deve permitir ao cliente visualizar os planos disponíveis para contratação. | ALTA |
| RF-05 | O sistema deve permitir ao cliente contratar um plano de serviços. | ALTA |
| RF-06 | O sistema deve permitir ao cliente visualizar os benefícios e a quantidade de utilizações disponíveis em seu plano. | ALTA |
| RF-07 | O sistema deve permitir ao cliente pesquisar e localizar estabelecimentos participantes da plataforma. | ALTA |
| RF-08 | O sistema deve oferecer uma funcionalidade de filtro/pesquisa para permitir ao cliente localizar estabelecimentos por localização, serviço e disponibilidade. | ALTA |
| RF-09 | O sistema deve permitir ao cliente visualizar as informações dos estabelecimentos participantes. | ALTA |
| RF-10 | O sistema deve apresentar os serviços disponíveis em cada estabelecimento, incluindo nome, descrição, duração e condições de utilização. | ALTA |
| RF-11 | O sistema deve permitir ao cliente visualizar as informações dos profissionais disponíveis em cada estabelecimento. | MÉDIA |
| RF-12 | O sistema deve apresentar o portfólio de trabalhos realizados pelos profissionais. | BAIXA |
| RF-13 | O sistema deve apresentar as datas e horários disponíveis para os serviços oferecidos pelos estabelecimentos. | ALTA |
| RF-14 | O sistema deve permitir ao cliente realizar um agendamento selecionando o estabelecimento, serviço, profissional, data e horário disponíveis. | ALTA |
| RF-15 | O sistema deve verificar se o serviço selecionado está disponível no plano contratado pelo cliente. | ALTA |
| RF-16 | O sistema deve permitir ao cliente realizar o check-in no estabelecimento por meio da leitura de um QR Code. | ALTA |
| RF-17 | O sistema deve registrar a realização do atendimento após a confirmação do check-in. | ALTA |
| RF-18 | O sistema deve identificar como não comparecimento os agendamentos que não possuírem check-in ou cancelamento dentro do prazo estabelecido. | ALTA |
| RF-19 | O sistema deve registrar a utilização do benefício após a realização do atendimento ou em caso de não comparecimento sem cancelamento dentro do prazo estabelecido. | ALTA |
| RF-20 | O sistema deve permitir ao cliente visualizar seus agendamentos. | ALTA |
| RF-21 | O sistema deve permitir ao cliente cancelar ou remarcar seus agendamentos. | ALTA |
| RF-22 | O sistema deve permitir ao cliente visualizar seu histórico de utilização dos benefícios. | MÉDIA |
| RF-23 | O sistema deve permitir ao cliente avaliar o estabelecimento, o profissional e o serviço após o atendimento. | MÉDIA |
| RF-24 | O sistema deve permitir ao cliente visualizar avaliações de outros usuários sobre os estabelecimentos e serviços. | MÉDIA |
| RF-25 | O sistema deve permitir ao estabelecimento cadastrar e gerenciar suas informações na plataforma. | ALTA |
| RF-26 | O sistema deve permitir ao estabelecimento cadastrar e gerenciar os serviços oferecidos. | ALTA |
| RF-27 | O sistema deve permitir ao estabelecimento cadastrar e gerenciar seus profissionais. | ALTA |
| RF-28 | O sistema deve permitir ao estabelecimento gerenciar a disponibilidade de datas e horários dos profissionais. | ALTA |
| RF-29 | O sistema deve permitir ao estabelecimento visualizar e gerenciar os agendamentos realizados. | ALTA |
| RF-30 | O sistema deve permitir ao administrador cadastrar e gerenciar os planos disponíveis na plataforma. | ALTA |
| RF-31 | O sistema deve permitir ao administrador cadastrar e gerenciar os benefícios associados aos planos. | ALTA |
| RF-32 | O sistema deve permitir ao administrador cadastrar, editar e remover estabelecimentos participantes da plataforma. | ALTA |
| RF-33 | O sistema deve permitir ao administrador gerenciar os usuários cadastrados na plataforma. | ALTA |
| RF-34 | O sistema deve enviar notificações ao cliente e ao estabelecimento sobre agendamentos, alterações, cancelamentos e lembretes de horário. | MÉDIA |
| RF-35 | O sistema deve permitir ao estabelecimento visualizar relatórios gerenciais de agendamentos, faturamento e horários de pico ou ociosidade. | MÉDIA |
| RF-36 | O sistema deve permitir ao estabelecimento criar e gerenciar campanhas de destaque para horários ociosos. | MÉDIA |


### Requisitos não Funcionais

| ID | Descrição do Requisito | Prioridade |
| --- | --- | --- |
| RNF-01 | O sistema deve proteger os dados pessoais dos usuários e garantir a segurança das informações utilizadas no processo de autenticação. | ALTA |
| RNF-02 | O sistema deve ser responsivo, permitindo sua utilização de forma adequada em celulares, tablets e computadores. | ALTA |
| RNF-03 | O sistema deve apresentar um bom nível de usabilidade, permitindo que o usuário realize as principais ações de forma simples e intuitiva. | ALTA |
| RNF-04 | O sistema deve apresentar um bom desempenho, respondendo às solicitações e ações dos usuários em tempo adequado. | MÉDIA |
| RNF-05 | O sistema deve ser compatível com os principais navegadores do mercado, incluindo Google Chrome, Mozilla Firefox e Microsoft Edge. | ALTA |
| RNF-06 | O sistema deve apresentar um bom nível de contraste entre os elementos da interface, facilitando a leitura e a utilização do sistema. | MÉDIA |
| RNF-07 | O sistema deve estar disponível para acesso público pela Internet. | ALTA |
| RNF-08 | O sistema deve manter a disponibilidade das informações de agendamento, serviços e horários cadastrados pelos usuários autorizados. | MÉDIA |
| RNF-09 | O sistema deve permitir a personalização de elementos visuais da interface, como a escolha entre tema claro e escuro. | BAIXA |
| RNF-10 | O sistema da aplicação deve processar a leitura e validação do QR Code de check-in de forma fluida e sem atrasos perceptíveis. | MÉDIA |
| RNF-11 | O sistema deve garantir a integridade visual e o armazenamento correto do estado local dos agendamentos e saldo de benefícios do usuário durante a sessão. | ALTA |

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| Não pode ser desenvolvido um módulo de backend        |
|03| As informações de estabelecimentos e serviços oferecidos deverão utilizar dados mockados e fictícios em arquivos JSON ou consumir APIs públicas gratuitas.|

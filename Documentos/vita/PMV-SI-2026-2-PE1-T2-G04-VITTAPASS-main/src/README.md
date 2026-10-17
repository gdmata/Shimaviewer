# Código-Fonte VitaPass

Aplicação web acadêmica para descoberta, contratação e utilização de serviços de beleza e estética em uma rede de estabelecimentos parceiros.

> **Versão atual:** `1.0.0`  
> **Natureza:** atividade acadêmica front-end  
> **Status:** protótipo em desenvolvimento  
> **Dados:** arquivo JSON estático e preferência de tema no `localStorage`  
> **Backend:** não será desenvolvido neste projeto

## Visão geral

O VittaPass atende três contextos principais:

- clientes que desejam contratar planos e agendar serviços;
- estabelecimentos e profissionais parceiros;
- administradores responsáveis pelos planos, benefícios e parceiros.

A página inicial apresenta a proposta do produto, categorias, planos, estabelecimentos, funcionamento da plataforma e a frente VittaPass Empresas.

## Funcionalidades implementadas

Na página inicial (`html/index.html`), estão implementados:

- layout responsivo;
- temas claro e escuro;
- persistência local da preferência de tema;
- menu para dispositivos móveis;
- navegação por âncoras com rolagem suave;
- apresentação dos planos Básico, Plus e Premium;
- listagem expansível de estabelecimentos;
- seções para clientes, parceiros e empresas.

O repositório também contém páginas estruturais para:

- cadastro de cliente;
- cadastro de estabelecimento;
- login;
- área inicial do cliente;
- dashboard do estabelecimento.

Algumas dessas páginas ainda representam estruturas ou wireframes e serão padronizadas e integradas nas próximas etapas.

## Fluxos que serão simulados no front-end

As telas poderão representar e simular os seguintes fluxos usando HTML, CSS, JavaScript, dados fictícios e armazenamento local:

- simulação de login e sessão local;
- persistência local dos cadastros;
- simulação da contratação de planos;
- controle e movimentação de créditos;
- pesquisa dinâmica de estabelecimentos;
- disponibilidade de profissionais;
- agendamento, cancelamento e remarcação;
- simulação de leitura e validação de QR Code;
- avaliações e notificações;
- campanhas para horários ociosos;
- relatórios gerenciais calculados no navegador;
- representação visual do fluxo de pagamento.

Como esta é uma atividade exclusivamente front-end, não haverá API, servidor de aplicação ou banco de dados real. Os comportamentos serão simulados no navegador com o arquivo JSON estático e `localStorage`. Autenticação, pagamento e QR Code representarão apenas fluxos de interface, sem segurança ou processamento real.

## Stack

- HTML5;
- CSS3;
- JavaScript;
- CSS Custom Properties;
- `localStorage`;
- JSON para dados mockados.

## Design visual

A página inicial utiliza a fonte Inter e os seguintes tokens principais em `css/styles.css`:

```css
--primary: #3366ff;
--primary-dark: #2c58db;
--secondary: #132761;
```

O tema escuro é aplicado pela classe `dark` no elemento `<html>`. As cores dos componentes são atualizadas por variáveis CSS, evitando duplicação de regras.

## Modelo de dados e persistência

A estrutura dos objetos está documentada em:

- [`../docs/modelo-dados-json.md`](../docs/modelo-dados-json.md)

A base fictícia está em:

- [`data/db.json`](data/db.json)

O arquivo contém coleções de usuários, planos, créditos, estabelecimentos, serviços, profissionais, disponibilidades, agendamentos, check-ins, avaliações, notificações e campanhas.

### Estado atual da integração

Nesta etapa, o `db.json` define e exemplifica os dados que serão manipulados pela aplicação, mas ainda não alimenta automaticamente as páginas. A substituição dos dados escritos diretamente no HTML por leitura com `fetch()`, assim como as operações de cadastro, consulta, atualização e exclusão, será realizada e ajustada na próxima etapa.

A única persistência já utilizada pela interface é a preferência de tema, armazenada no navegador pela chave `vittapass-theme`.

## Estrutura atual

```text
src/
├── README.md
├── assets/
│   └── README.md
├── css/
│   └── styles.css
        └── pages
            └── index.css
├── data/
│   └── db.json
├── html/
│   ├── index.html
│   ├── Cadastro/
│   │   ├── cadastro-cliente.html
│   │   ├── cadastro-parceiro.html
│   │
│   ├── Estabelecimento/
│   │   └── dashboard.html
│   ├── Login/
│   │   └── login.html
            login-parceiro.html
│   └── Users/
│       └── home.html
└── js/
    └── script.js
```

## Execução local

Clone o repositório e acesse sua pasta:

```bash
git clone https://github.com/ICEI-PUC-Minas-PMV-SI/PMV-SI-2026-2-PE1-T2-G04-VITTAPASS.git
cd PMV-SI-2026-2-PE1-T2-G04-VITTAPASS
```

Inicie um servidor estático de desenvolvimento na raiz do repositório. Esse comando apenas disponibiliza os arquivos do front-end no navegador; ele não cria um backend para a aplicação:

```bash
python3 -m http.server 8765 --directory src
```

Abra no navegador:

```text
http://127.0.0.1:8765/html/index.html
```

O uso de um servidor estático local é recomendado porque a futura leitura de `data/db.json` com `fetch()` normalmente é bloqueada quando o HTML é aberto diretamente pelo protocolo `file://`. Esse servidor é somente uma ferramenta de desenvolvimento do front-end.

Também é possível usar a extensão Live Server do Visual Studio Code, desde que a pasta `src` seja servida como raiz.

## Limitações atuais

- Os dados da página inicial ainda estão escritos diretamente no HTML.
- O `data/db.json` ainda não é consumido pelo JavaScript.
- Formulários ainda não persistem dados.
- Algumas páginas ainda não compartilham o estilo visual da página inicial.
- Autenticação, pagamento e QR Code são apenas fluxos previstos de interface.
- Os dados presentes no JSON são fictícios e não devem ser tratados como dados reais.

## Repositório

<https://github.com/ICEI-PUC-Minas-PMV-SI/PMV-SI-2026-2-PE1-T2-G04-VITTAPASS>

Projeto desenvolvido para fins acadêmicos no curso de Sistemas de Informação da PUC Minas.

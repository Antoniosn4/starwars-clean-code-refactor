
# README - Prova de Refatoração Clean Code

## Star Wars API - Projeto Refatorado

Este projeto consiste em uma API que consome dados da Star Wars API (SWAPI) e exibe os resultados via terminal e também por uma interface web simples. O código foi originalmente desenvolvido propositalmente com violações dos princípios de Clean Code, para fins de prática de refatoração.

## O que foi refatorado

A refatoração foi realizada com o objetivo de aplicar os princípios de Clean Code, mantendo 100% da funcionalidade original do código, sem qualquer alteração no comportamento final.

As principais melhorias feitas foram:

### Uso de Nomes Significativos
- Funções com nomes genéricos como f e p foram renomeadas para:
  - fetchData() → responsável por realizar requisições para a API.
  - executeFetch() → responsável por coordenar as chamadas de API, processar dados e exibir os resultados.
- Constantes e variáveis foram nomeadas de forma clara e semântica.

### Remoção de Números Mágicos
- Números soltos no código, como:
  - 200, 400, 404, 10000, 1000000000, 3, 4, 3000
- Foram substituídos por constantes nomeadas, por exemplo:
  - STATUS_OK = 200
  - STATUS_NOT_FOUND = 404
  - MAX_STARSHIPS = 3
  - POPULATION_LIMIT = 1000000000

Isso torna o código mais legível, fácil de entender e de manter.

### Redução de Complexidade e Funções Menores
- Funções que estavam muito longas e complexas foram reorganizadas:
  - Dividindo responsabilidades entre fetchData() e executeFetch().
- Mantendo o código modular, mais fácil de entender e de dar manutenção.

### Aplicação de Regras de ESLint
- Foi utilizado o ESLint com regras de Clean Code, incluindo:
  - Limite máximo de linhas por função.
  - Controle da complexidade ciclomática.
  - Padronização de aspas, ponto e vírgula e espaçamentos.
  - Proibição de imports duplicados.
  - Uso obrigatório de const sempre que possível.

### Interface Web Mantida
- A interface HTML foi mantida exatamente igual à do código original, com os mesmos estilos, botões e funcionamento.
- O código server-side continua servindo tanto a API quanto a página HTML, assim como no código base.

## Estrutura do Projeto

swapi.js                → Código fonte Node.js refatorado
package.json             → Gerenciador de dependências
eslint.config.mjs        → Configuração do ESLint (versão 9+)
node_modules/            → Dependências do projeto

## Como executar

1. Instale as dependências:
npm install

2. Execute o servidor:
node swapi.js

3. Acesse no navegador:
http://localhost:3000

## Validação da Refatoração

- Todas as funcionalidades foram mantidas.
- A refatoração seguiu os princípios do livro Clean Code - Robert C. Martin.
- Código mais limpo, legível e fácil de manter.

## Autor

Refatoração realizada por [Seu Nome] como parte da atividade prática da disciplina de programação.

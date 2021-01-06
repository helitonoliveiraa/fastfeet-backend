<h1 align="center">
  <img alt="Fastfeet" title="Fastfeet" src=".github/logo.png" width="200px" />
</h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/heliton1988/bootcamp-gostack-fastfeet?color=%234B0082">

  <a href="https://www.linkedin.com/in/helitonoliveira/">
    <img alt="Made by Héliton Oliveira" src="https://img.shields.io/badge/made%20by-Héliton Oliveira-%234B0082">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%234B0082">

  <a href="https://github.com/heliton1988/bootcamp-gostack-fastfeet/stargazers">
    <img alt="Stargazers" src="https://img.shields.io/github/stars/heliton1988/bootcamp-gostack-fastfeet?style=social">
  </a>
</p>

<p align="center">
  <a href="#memo-sobre">Sobre</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#wrench-ferramentas-utilizadas">Ferramentas utilizadas</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#dizzy-como-usar">Como utilizar</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
  <a href="#pagefacingup-licença">Licença</a>
</p>

<p align="center">
  <strong>Em desenvolvimento...</strong>
  <img src=".github/loading.gif" alt="Loading" width="10px">
</p>

---

## :memo: Sobre

Este é o back-end da aplicação **FastFeet**, que é um app para um transportadora
fictícia.

---

## :wrench: Ferramentas utilizadas

- [Express](https://expressjs.com/pt-br/)
- [Sequelize](https://sequelize.org/)
- [Postgre](https://www.postgresql.org/)
- [Redis](https://redis.io/)
- [Nodemon](https://nodemon.io/)
- [Json web token](http://jwt.io/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [date-fns](https://www.npmjs.com/package/date-fns)
- [multer](https://www.npmjs.com/package/multer)
- [bee-queue](https://github.com/bee-queue/bee-queue)
- [Nodemailer](https://nodemailer.com/about/)
- [sucrase](https://www.npmjs.com/package/sucrase)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [YUP](https://dev.to/szib/yup-1ib0)

---

## :dizzy: Como usar

**Observaçao**: Para clonar e rodar essa aplicação é necessário ter as seguintes
ferramentas instaladas em seu computador;<br />
- `Git`;
- `Node.js v12.16.2` ou superior;
- `yarn v1.22.4` ou superior;
- `Docker`;<br />

Também é necessário configurar e rodar os bancos de dados `Postgres` e `Redis`

### 1 - Primeiro passo, instalar as databases

```bash
  ## Crie a database principal com Postgres
  $ docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

  ## Crie a database com Redis
  $ docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine
```
### 2 - segundo passo

recomenda-se utilizar o software **Postbird**, para que seja possível uma melhor experiencia em manipular os dados.<br />
Para realizar a conexão via **postbird** utilize o `Username: postgres`  | `Password: docker`.<br />
Feito isso, no software **Postbird** crie uma database de nome `fastfeet`.


### 3 - terceiro passo rodar o projeto

Clone o repositório;

```bash
  $ git clone https://github.com/heliton1988/bootcamp-gostack-fastfeet-backend.git
```

Acesse o repositório;

```bash
  $ cd bootcamp-gostack-fastfeet-backend
```

Instale todas as dependências;

```bash
  $ yarn

  # ou

  $ npm install
```

Rode as migrations;

```bash
  $ yarn sequelize db:migrate

  # ou

  $ npm run sequelize db:migrate
```

Rode o seeds para popular o banco de dados;

```bash
  $ yarn sequelize db:seed:all

  # ou

  $ npm run sequelize db:seed:all
```

Rode o server;

```bash
  $ yarn dev

  # ou

  $ npm run dev
```

Rode a fila;

```bash
  $ yarn queue

  # ou

  $ npm run queue
```
---

## :page_facing_up: Licença**

Esse projeto está sob a licença MIT. Veja o arquivo [LICENSE](https://github.com/Rocketseat/bootcamp-gostack-desafio-03/blob/master/LICENSE.md) para mais detalhes.


Feito com 💜 by [Héliton Oliveira](https://www.linkedin.com/in/helitonoliveira/).

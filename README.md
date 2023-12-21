[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/snPWRHYg)

# Examenopdracht Front-end Web Development / Web Services

- Student: Sujan Sapkota
- Studentennummer: 293706ss
- E-mailadres: <mailto:sujan.sapkota@student.hogent.be>

## Requirements

I expect following software to be already installed:

- [NodeJS](https://nodejs.org)
- [Yarn](https://yarnpkg.com)
- [MySQL Community Server](https://dev.mysql.com/downloads/mysql/)

## Before starting/testing this project

Create a .env (development) file with the following template.

```
NODE_ENV=development
TABLE_USERS=users
TABLE_REVIEWS=reviews
TABLE_MOVIES=movies
TABLE_USERTYPES=userTypes
TABLE_GENREMOVIES=genreMovies
TABLE_GENRES=genres
DATABASE_URL="mysql://username:password@host:port/database_name"
```

**VERY IMPORTANT**

In the `.env` file `DATABASE_URL`:

- change the username to your database username.
- password to your database password
- host to host where db is (if local then it's "localhost")
- port to the port where database is running
- database_name to your database name

## Start this project

- Install all dependencies: yarn
- Make sure a .env exists (see above)
- Start the development server: yarn start

## Test this project

- Install all dependencies: yarn
- Make sure a .env.test exists with NODE_ENV=test (see above)
- Make sure (!!) database_name is different than the name used in `.env`
- Start the development server: yarn test

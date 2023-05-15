# Node.js CRUD API Application

This application was developed as part of the free Node.js course by [The Rolling Scopes School](https://rs.school/)

## About this project
Stack: Node.js, TypeScript

Node.js CRUD API - it's a simple REST API application with CRUD operations for users. 
It uses native Node.js modules, in-memory database and is written in TypeScript. 
Application has 2 modes: regular and cluster. 
In cluster mode application there is a load balancer server and one in-memory-database for all its workers. 
In regular mode application uses one server for all requests.

## How to run
1) Clone this project: `git clone https://github.com/AdiletMaksatuly/nodejs-crud-api`
2) Go to project directory `cd nodejs-crud-api`
3) Install dependencies `npm install`
4) Create .env file and add PORT variable to it (e.g. PORT=3000) (optional)
5) Run the application in development regular mode 
`npm run start:dev`.

- You can also run the application in production mode `npm run start:prod` 
- or in cluster mode `npm run start:multi`.


## API

`GET api/users` - to get all users

`GET api/users/${userId}` - to get user by id (uuid)

`POST api/users` - to create record about new user and store it in database

`PUT api/users/${userId}` - to update existing user (**all fields required**)

`DELETE api/users/${userId}` - to delete existing user from database

### User's schema

`username` — name (string, **required**)

`age` — age (number, **required**)

`hobbies` — hobbies (array of strings or empty array, **required**)
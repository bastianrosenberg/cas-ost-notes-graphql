# Notes App

This is a project for the CAS Frontend Engineer OST 2023/2024 using GraphQL

# Technologies

- node.js: [nodejs](https://nodejs.org/en/about)
- routing middleware: [express](https://expressjs.com/en/guide/using-middleware.html)
- api: [graphQL](https://graphql.org/graphql-js/)
- backend: [Mongoose](https://mongoosejs.com/docs/index.html)

## Additional packages

- nodemon (Restart on file change)
- body-parser (Request body parsing)
- socket.io (websockets)
- appollo (handling graphql)

## Get started

- run command `npm install` in the root directory
- install a local mongodb on your pc [mongodb](https://www.mongodb.com/docs/manual/installation/)
- create a `.env` file in the root directory with an entry pointing to your mongodb collection
  e.g. `DATABASE_URL="mongodb://localhost/notes"`
- `npm run start` (this will start the server and client with nodemon)

## What can I do

- Create Note
- Edit / complete or delete note
- Open Create-Dialog and shrink / expand browser (css: media-query)
- Set date of some notes to date before today (css)
- Search, sort and filter notes
- Switch between themes
- Open another browser window with the same url. Create, update, delete, complete and activate notes and switch theme in one and watch the other window (ws)
- give studend a good grade😉

/* eslint-disable no-console */
import { ApolloServer } from "apollo-server";
import { config } from "dotenv";
import mongoose from "mongoose";
import noteResolver from "./api/note/resolver.js";
import noteTypeDefs from "./api/note/typeDef.js";

if (process.env.NODE_ENV !== "production") {
  config();
}

const server = new ApolloServer({
  typeDefs: noteTypeDefs,
  resolvers: noteResolver,
});

mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;

db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Connected to Mongoose"));

server
  .listen({ port: 9000 })
  .then(({ url }) => console.log(`Server running at ${url}`));

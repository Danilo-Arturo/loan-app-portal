import { readFileSync } from "node:fs";
import { ApolloServer } from "@apollo/server";

const typeDefs = readFileSync(
  new URL("./schema.graphql", import.meta.url),
  "utf8"
);

const server = new ApolloServer({
  typeDefs,
  resolvers: {},
});
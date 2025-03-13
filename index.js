import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import "dotenv/config";
import dbConnect from "./dbConnect.js";
import typeDefs from "./schema/typeDefs.js";
import resolvers from './schema/resolvers.js';
import context from './schema/context.js';

const server = new ApolloServer({ typeDefs, resolvers })
const port = process.env.port || 4000

dbConnect()
const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: context
})

console.log(`Server ready: ${url}`)

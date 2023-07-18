require("dotenv").config();

import http from "http";
import app from "./app";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import config from "./config";

import context from "./context";
import dbDataSource from "./db";
import permissions from "./permissions";
import { resolvers, typeDefs } from "./schema";



async function bootstrap() {
  await dbDataSource.initialize();
  const httpServer = http.createServer(app);

  const schema: any = makeExecutableSchema({ typeDefs, resolvers });

  const middlewareSchema = applyMiddleware(schema, permissions);

  const server = new ApolloServer({
    schema: middlewareSchema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
    csrfPrevention: true,
    cache: "bounded",
  });

  await server.start();

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 10 }),
    expressMiddleware(server, { context })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.port }, resolve)
  ).then(() => {
    console.log(`🚀 Server ready at http://localhost:${config.port}/graphql`);
  });
}

bootstrap();

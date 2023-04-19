import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import RedisStore from "connect-redis";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import { writeFileSync } from "fs";
import type { GraphQLSchema } from "graphql";
import { applyMiddleware } from "graphql-middleware";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import http from "http";
import mongoose from "mongoose";
import path from "path";
import config from "./config";
import context, { redis } from "./context";
import cors from "./middleware/cors";
import originMiddleware from "./middleware/originMiddleware";
import permissions from "./permissions";
import { resolvers, typeDefs } from "./schema";


/** @ts-ignore */
const redisStore = new RedisStore({
  /** @ts-ignore */
  client: redis,
  prefix: config.session_prefix,
  ttl: 60 * 60 * 24 * 7,
});

async function bootstrap() {
  const app = express();

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: false }));
  app.use(cors);
  app.use(express.static(path.resolve(__dirname, "../public")));
  app.use(cookieParser());
  app.use(originMiddleware);

  let production = false;

  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    production = true;
  }

  const sessionMiddleware = session({
    name: config.session_name,
    secret: config.session_key,
    resave: false,
    store: redisStore,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 7 * 1000,
      sameSite: production ? "none" : false,
      httpOnly: true,
      secure: production,
    },
  });

  app.use(sessionMiddleware);

  const httpServer = http.createServer(app);

  const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const middlewareSchema = applyMiddleware(schema, permissions);
  const plugins = [ApolloServerPluginDrainHttpServer({ httpServer })];

  const server = new ApolloServer({
    schema: middlewareSchema,
    plugins,
    csrfPrevention: true,
    cache: "bounded",
  });

  await server.start();

  await mongoose
    .connect(config.mongodb_uri!)
    .then(() => console.log("Database connected successfully"))
    .catch((e) => {
      throw new Error("Something went wrong when connecting to Database");
    });

  app.use(
    "/graphql",
    graphqlUploadExpress({ maxFileSize: 10 * 1024 * 1024, maxFiles: 10 }),
    expressMiddleware(server, { context })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: config.port }, resolve)
  ).then(() =>
    console.log(`🚀 Server ready at http://localhost:${config.port}/graphql`)
  );
}

bootstrap();

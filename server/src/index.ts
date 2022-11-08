import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import session, { SessionOptions } from "express-session";
import { buildSchema, print } from "graphql";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import mongoose from "mongoose";
import path from "path";
import config from "./config";
import cors from "./middleware/cors";
import resolvers from "./resolvers";
import typeDefs from "./type-defs";

export const MemoryStore = MongoStore.create({
  mongoUrl: config.mongodb_uri,
  ttl: 14 * 24 * 60 * 60,
  autoRemove: "native",
});

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: false }));
app.use(cors);
app.use(cookieParser());

let production = false;

let sessionOptions: SessionOptions = {
  name: "auth",
  secret: config.session_key,
  resave: false,
  store: MemoryStore,
  saveUninitialized: false,
  cookie: {
    maxAge: 604800000,
    sameSite: "none",
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  production = true;
}

app.use((req, res, next) => {
  const allowports = config.allowport.split(",");
  if (allowports.find((port) => port === req.header("Origin"))) {
    let options: SessionOptions = {
      name:
        req.headers.origin === config.admin_url ? "auth_admin" : "auth",
      secret: config.session_key,
      resave: false,
      store: MemoryStore,
      saveUninitialized: false,
      cookie: {
        maxAge: 604800000,
        sameSite: production ? "none" : false,
        httpOnly: true,
        secure: production,
      },
    };
    const sessionHandler = session(options);
    return sessionHandler(req, res, next);
  } else {
    next();
  }
});

app.use(express.static(path.resolve(__dirname, "../public")));

export const schema = buildSchema(print(typeDefs));

mongoose
  .connect(config.mongodb_uri)
  .then(() => {
    app.use(
      "/graphql",
      graphqlUploadExpress({ maxFileSize: 2 * 1024 * 1024, maxFiles: 1 }),
      graphqlHTTP({
        schema,
        rootValue: resolvers,
        graphiql: true,
      })
    );
    app.listen(config.port, () =>
      console.log(
        `\nServer started at: http://localhost:${config.port}/graphql\n`
      )
    );
  })
  .catch((err) => console.error(err));

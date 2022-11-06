import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import express from "express";
import { graphqlHTTP } from "express-graphql";
import session from "express-session";
import { buildSchema, print } from "graphql";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import mongoose from "mongoose";
import path from "path";
import config from "./config";
import cors from "./middleware/cors";
import resolvers from "./resolvers";
import typeDefs from "./type-defs";
// import type { ReqBody } from "./typing";

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
// app.use((req: ReqBody, res, next) => {
//   let options = {
//     name: "auth",
//     secret: config.session_key,
//     resave: false,
//     store: MemoryStore,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 604800000,
//       httpOnly: true,
//     },
//   };

//   const sessionHandler = session(options);
//   return sessionHandler(req, res, next);
// });
app.use(
  session({
    name: "auth",
    secret: config.session_key,
    resave: false,
    store: MemoryStore,
    saveUninitialized: false,
    cookie: {
      maxAge: 604800000,
      httpOnly: true,
      secure: true
    },
  })
);


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

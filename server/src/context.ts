import type { Request, Response } from "express";
import Redis from "ioredis";
import type { Context } from "../typing.d";
import config from "./config";
import { db } from "./db/entities";
import { addressLoader, productLoader, userLoader } from "./loaders";
import authenticated from "./middleware/authenticated";

interface Props {
  res: Response;
  req: Request;
}

const options =
  process.env.NODE_ENV !== "production"
    ? {
        password: config.redis_password,
        host: config.redis_host,
        port: config.redis_port,
      }
    : config.redis_uri;
const redis = new Redis(options as any);

const context = async ({ req, res }: Props): Promise<Context> => {
  const user = await authenticated(req);

  const isAdmin = user
    ? user.level !== null && req.headers.origin === config.allowedOrigins[1]
    : false;

  return {
    req,
    res,
    redis,
    user,
    isAdmin,
    db,
    userLoader,
    productLoader,
    addressLoader,
  };
};

export { redis };

export default context;

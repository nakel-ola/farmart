import type { Request, Response } from "express";
import Redis from "ioredis";
import type { Context } from "../typing";
import config from "./config";
import { addressLoader, productLoader, userLoader } from "./loaders";
import authenticated from "./middleware/authenticated";
import db from "./models";

const redis = new Redis({
  host: config.redis_host!,
  port: config.redis_port!,
  password: config.redis_password!,
});

interface Props {
  res: Response;
  req: Request;
}

const userSelect = {
  birthday: 1,
  email: 1,
  gender: 1,
  name: 1,
  phoneNumber: 1,
  photoUrl: 1,
  blocked: 1,
  level: 1,
  updatedAt: 1,
  createdAt: 1,
};
const context = async ({ req, res }: Props): Promise<Context> => {
  const user = await authenticated(req);
  return {
    req,
    res,
    db,
    redis,
    user,
    userLoader,
    addressLoader,
    productLoader,
  };
};

export { redis, db, userSelect };
export default context;

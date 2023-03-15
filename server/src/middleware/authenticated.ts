import cookie from "cookie";
import { signedCookie } from "cookie-parser";
import type { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import type { User } from "../../typing";
import config from "../config";
import { redis } from "../context";
import redisGet from "../helper/redisGet";
import { userLoader } from "../loaders";

const authenticated = async (req: Request): Promise<User | null> => {
  try {
    if (!req.headers.cookie) return null;

    const token = await getToken(req.headers.cookie!);

    if (!token) return null;

    const decodedToken = verify(token, config.jwt_key!) as JwtPayload;

    if (!decodedToken) return null;

    let key = `auth-user:${decodedToken.sub}`;

    const redisUser = await redisGet<User>(key);

    if (redisUser) return redisUser;

    const user = await userLoader.load(decodedToken.sub!);

    await redis.setex(key, 3600, JSON.stringify(user));
    return user;
  } catch (error) {
    console.log(error);
  }
  return null;
};

const getToken = async (headerCookie: string) => {
  const parser = cookie.parse(headerCookie);

  const key = signedCookie(parser[config.session_name], config.session_key);
  const redisKey = `${config.session_prefix}${key}`;

  const token = await redisGet(redisKey);

  if (!token) return null;

  return token?.auth;
};

export default authenticated;

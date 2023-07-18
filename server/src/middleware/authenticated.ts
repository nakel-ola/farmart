import type { Request } from "express";
import { JwtPayload, verify } from "jsonwebtoken";
import { ObjectId } from "mongodb";
import type { UserType } from "../../typing.d";
import config from "../config";
import { redis } from "../context";
import { userLoader } from "../loaders";
import redisGet from "../utils/redisGet";

const authenticated = async (
  req: Request
): Promise<Omit<UserType, "password"> | null> => {
  try {
    if (!req.headers["x-access-token"]) return null;

    const token = req.headers["x-access-token"] as any;

    const decodedToken = verify(token, config.jwt_secret!) as JwtPayload;

    if (!decodedToken) return null;

    let key = `auth-user:${decodedToken.sub}`;

    const redisUser = await redisGet<UserType>(key);

    if (redisUser) return redisUser;

    const user = await userLoader.load(decodedToken.sub as any);

    
    await redis.setex(key, 3600, JSON.stringify(user));

    return user;
  } catch (error) {
    console.log(error);
  }
  return null;
};

export default authenticated;

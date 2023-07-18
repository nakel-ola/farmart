import { sign } from "jsonwebtoken";
import config from "../config";

const signToken = (userId: string, email: string, expires?: string): string => {
  const payload = {
    sub: userId,
    email,
  };

  const secret = config.jwt_key!;
  const expiresIn = expires ?? config.expiresIn;

  const token = sign(payload, secret, { expiresIn });

  return token;
};

export default signToken;

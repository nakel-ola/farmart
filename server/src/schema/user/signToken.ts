import { sign } from "jsonwebtoken";
import config from "../../config";

const signToken = (userId: string, email: string, expires?: string): string => {
  const payload = {
    sub: userId,
    email,
  };

  const secret = config.jwt_secret!;
  const expiresIn = expires ?? config.expires_in;

  const token = sign(payload, secret, { expiresIn });

  return token;
};

export default signToken;

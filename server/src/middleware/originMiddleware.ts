import type { NextFunction, Request, Response } from "express";
import config from "../config";

const originMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [config.client_url!, config.admin_url!];
  const origin = req.headers.origin!;

  const isAllow = allowedOrigins.includes(origin);

  if (isAllow) res.setHeader("Access-Control-Allow-Origin", origin);
  return next();
};

export default originMiddleware;

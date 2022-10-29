import type { Request, Response } from "express";

export interface ReqBody extends Request {
  req: Request;
  res: Response;
  userId: string;
  blocked: boolean;
  admin: boolean;
  level?: string;
  cookie: any;
}

export type Func<T = any> = (
  args: T,
  req: ReqBody,
  res: Response,
  context: any,
  info: any
) => any;

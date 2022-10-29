import cookie from "cookie";
import cookieParser from "cookie-parser";
import type { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import mongoose from "mongoose";
import xss from "xss";
import config from "../config";
import type { Func, ReqBody } from "../typing";
import type { ErrorMsg } from "../typing/custom";
import { MemoryStore } from "./../index";

const authenticated =
  <T = any>(fn: Func) =>
  async (
    args: T,
    req: ReqBody,
    res: Response,
    context: any,
    info: any
  ): Promise<Func<T> | ErrorMsg> => {
    try {
      let errorMsg = {
        __typename: "ErrorMsg",
        error: "You don't have permission",
      };

      if (req.headers.cookie) {
        let parse = cookie.parse(req.headers.cookie);
        // console.log(parse);

        if (req.admin && parse.grocery_admin) {
          const data = await getDb(parse.grocery_admin ?? "", req.admin);
          req.userId = data.id;
          req.level = data.level;
          return fn(args, req, res, context, info);
        } else if (!req.admin && parse.grocery) {
          const data = await getDb(parse.grocery ?? "", req.admin);
          req.userId = data.id;
          req.blocked = data.block;
          return fn(args, req, res, context, info);
        } else {
          return errorMsg;
        }
      }

      return errorMsg;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  };

const getDb = (value: string, admin: boolean) =>
  new Promise<JwtPayload>((resolve, reject) => {
    var data = cookieParser.signedCookie(value, config.session_key);

    MemoryStore.get(data as string, async (err, session) => {
      if (err) reject(err?.message);
      var decodedToken = jwt.verify(
        xss(
          admin
            ? (session as any)?.grocery_admin
            : (session as any)?.grocery ?? ""
        ),
        config.jwt_key
      ) as JwtPayload;
      if (!mongoose.Types.ObjectId.isValid(decodedToken?.id)) {
        reject("User ID must be a valid");
      }
      resolve(decodedToken);
    });
  });
export default authenticated;

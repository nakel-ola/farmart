import mongoose from "mongoose";
import xss from "xss";
import { nanoidV2 } from "../helper";
import authenticated from "../middleware/authenticated";
import db from "../models";
import type { ReqBody } from "../typing";
import type {
  CouponsArgs,
  CouponType,
  CreateCouponType,
  VerifyCouponArgs,
} from "../typing/coupon";
import type { Msg } from "../typing/custom";

let alphabet = "useandom26T198340PX75pxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict";

const verifyCoupon = authenticated(
  async (args: VerifyCouponArgs, req: ReqBody): Promise<CouponType> => {
    try {
      let userId = xss(req.userId),
        input = args.input,
        coupon = xss(input.coupon),
        email = xss(input.email);

      const data = (await db.couponSchema.findOne({
        userId,
        email,
        coupon,
      })) as any;

      if (!data) {
        throw new Error("Invalid coupon code");
      }

      return data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const coupons = authenticated(
  async (args: CouponsArgs, req: ReqBody): Promise<CouponType[]> => {
    try {
      let userId = xss(req.userId),
        customerId = xss(args?.customerId);
      const data = db.couponSchema.find(
        customerId ? { userId: customerId } : { userId }
      ) as any;
      return data ?? [];
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const createCoupon = authenticated(
  async (args: CreateCouponType, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        discount = xss(args.input.discount.toString()),
        email = xss(args.input.email),
        description = xss(args.input.description),
        userId = xss(args.input.userId),
        expiresIn = args.input.expiresIn,
        code = nanoidV2(alphabet, 9);

      if (!admin) {
        throw new Error("You don't have permission to create coupon");
      }

      const data = await db.couponSchema.create({
        discount,
        email,
        description,
        userId,
        code,
        expiresIn,
      });

      if (data) {
        return {
          msg: "Coupon created successfully",
        };
      }
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

const deleteCoupon = authenticated(
  async (args: { id: string }, req: ReqBody): Promise<Msg> => {
    try {
      const admin = req.admin,
        id = args.id;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("User ID must be a valid");
      }

      if (!admin) {
        throw new Error("You don't have permission to create coupon");
      }

      const data = await db.couponSchema.deleteOne({ _id: id });

      if (data) {
        return {
          msg: "Coupon deleted successfully",
        };
      }
    } catch (err) {
      console.log(err);
      throw new Error(err.message);
    }
  }
);

export default {
  verifyCoupon,
  coupons,
  createCoupon,
  deleteCoupon,
};

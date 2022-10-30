import { merge } from "lodash";
import mongoose from "mongoose";
import xss from "xss";
import calculateDiscount from "../helper/calculateDiscount";
import { nanoid } from "../helper/index";
import authenticated from "../middleware/authenticated";
import db from "../models";
import type { ReqBody } from "../typing";
import type { CouponType } from "../typing/coupon";
import type { Msg } from "../typing/custom";
import type {
  CreateOrderArgs,
  CreateOrderType,
  FilterByIdArgs,
  FilterByStatusArgs,
  OrderArgs,
  OrderDataType,
  OrderProductInput,
  OrdersArgs,
  OrderType,
  UpdateProgressArgs,
} from "../typing/order";

const createOrder = authenticated(
  async (args: CreateOrderArgs, req: ReqBody): Promise<CreateOrderType> => {
    try {
      const input = args.input,
        userId = xss(req.userId),
        paymentMethod = xss(input.paymentMethod),
        deliveryMethod = xss(input.deliveryMethod),
        shippingFee = input.shippingFee ? xss(input.shippingFee) : null,
        pickup = input.pickup ? xss(input.pickup) : null,
        address = input.address
          ? {
              id: xss(input.address.id!),
              name: xss(input.address.name),
              street: xss(input.address.street),
              city: xss(input.address.city),
              state: xss(input.address.state),
              phoneNumber: xss(input.address.phoneNumber),
              phoneNumber2: xss(input.address.phoneNumber2),
              country: xss(input.address.country),
              info: xss(input.address.info),
            }
          : null,
        coupon = input.coupon
          ? {
              id: xss(input.coupon.id),
              email: xss(input.coupon.email),
              discount: xss(`${input.coupon.discount}`),
              code: xss(input.coupon.code),
              userId: xss(input.coupon.userId),
              description: xss(input.coupon.description),
              expiresIn: xss(`${input.coupon.expiresIn}`),
            }
          : null,
        products = input.products.map((p) => ({
          id: xss(p.id),
          price: xss(p.price),
          quantity: Number(xss(p.quantity.toString())),
        })),
        totalPrice = xss(input.totalPrice),
        phoneNumber = input.phoneNumber ? xss(input.phoneNumber) : null,
        progress = [
          {
            name: "pending",
            checked: true,
          },
          {
            name: "canceled",
            checked: false,
          },
          {
            name: "delivered",
            checked: false,
          },
        ],
        orderId = nanoid(15),
        trackingId = nanoid(),
        paymentId = nanoid(),
        status = "pending";

      let price = Number(
        calculateDiscount(
          Number(totalPrice),
          coupon ? Number(coupon.discount) : 0
        ) + Number(shippingFee) ?? 0
      ).toFixed(2);

      const data = {
        orderId,
        userId,
        totalPrice: price,
        status,
        paymentMethod,
        deliveryMethod,
        address,
        products,
        trackingId,
        paymentId,
        progress,
        pickup,
        shippingFee,
        coupon,
        phoneNumber,
      };

      const newData = await db.orderSchema.create(data);

      if (newData) {
        await decrementProduct(products);
        if (coupon) {
          await deleteCoupon(coupon.id);
        }
        return {
          id: newData._id.toString(),
          orderId,
          trackingId,
          userId,
        };
      }
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
);

const decrementProduct = async (data: OrderProductInput[]) => {
  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    await db.productSchema.updateOne(
      { id: element.id },
      {
        $inc: { stock: -Number(element.quantity) },
      }
    );
  }
};

const deleteCoupon = async (id: string) => {
  await db.couponSchema.findByIdAndDelete(id);
};

const orders = authenticated(
  async (args: OrdersArgs, req: ReqBody): Promise<OrderDataType> => {
    try {
      let userId = xss(req.userId),
        admin = req.admin,
        page = Number(xss(args.input.page.toString() ?? "1")),
        status = xss(args.input.status),
        customerId = xss(args.input.customerId),
        limit = Number(xss(args.input.limit.toString() ?? "10")),
        start = (page - 1) * limit,
        end = limit + start;

      if (!status) {
        const orders = await (admin
          ? customerId
            ? db.orderSchema.find({ userId: customerId })
            : db.orderSchema.find()
          : db.orderSchema.find({ userId }));

        return {
          __typename: "OrderData",
          status,
          page,
          totalItems: orders.length,
          results: orders.slice(start, end) as any,
        };
      }

      const orders = await (admin
        ? db.orderSchema.find({ status })
        : db.orderSchema.find({ userId, status }));

      return {
        __typename: "OrderData",
        status,
        page,
        totalItems: orders.length,
        results: orders.slice(start, end) as any,
      };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const order = authenticated(
  async (args: OrderArgs, req: ReqBody): Promise<OrderType> => {
    try {
      let userId = xss(req.userId),
        orderId = xss(args.id),
        admin = req.admin;
      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("User ID must be a valid");
      }

      const order = await (admin
        ? db.orderSchema.findOne({ _id: orderId })
        : db.orderSchema.findOne({ userId, _id: orderId }));

      const data = merge({ __typename: "Order" }, order) as any;

      return data;
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const updateProgress = authenticated(
  async (args: UpdateProgressArgs, req: ReqBody): Promise<Msg> => {
    try {
      let admin = req.admin,
        orderId = xss(args.input.id),
        name = xss(args.input.name);

      if (name !== "canceled" && !admin) {
        throw Error("You don't have permission to edit this order");
      }

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        throw new Error("User ID must be a valid");
      }

      await db.orderSchema.updateOne(
        { _id: orderId, "progress.name": name },
        {
          status: name,
          $set: { "progress.$.name": name, "progress.$.checked": true },
        }
      );

      return { msg: "Update successful" };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const filterById = authenticated(
  async (args: FilterByIdArgs, req: ReqBody): Promise<OrderDataType> => {
    try {
      let userId = xss(req.userId),
        admin = req.admin,
        orderId = xss(args.input.orderId),
        page = Number(xss(args.input.page.toString() ?? "1")),
        limit = Number(xss(args.input.limit.toString() ?? "10")),
        start = (page - 1) * limit,
        end = limit + start;

      const orders = await (admin
        ? db.orderSchema.find({ orderId: new RegExp(orderId, "i") })
        : db.orderSchema.find({ orderId: new RegExp(orderId, "i"), userId }));

      return {
        __typename: "OrderData",
        status: "",
        page,
        totalItems: orders.length,
        results: orders.slice(start, end) as any,
      };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const filterByStatus = authenticated(
  async (args: FilterByStatusArgs, req: ReqBody): Promise<OrderDataType> => {
    try {
      let userId = xss(req.userId),
        admin = req.admin,
        page = Number(xss(args.input.page.toString() ?? "1")),
        status = xss(args.input.status),
        limit = Number(xss(args.input.limit.toString() ?? "10")),
        start = (page - 1) * limit,
        end = limit + start;

      let isAll = status === "all";

      let orders;

      if (admin) {
        if (isAll) {
          orders = await db.orderSchema.find();
        } else {
          orders = await db.orderSchema.find({
            progress: {
              $elemMatch: {
                name: status,
                checked: true,
              },
            },
          });
        }
      } else {
        if (isAll) {
          orders = await db.orderSchema.find({ userId });
        } else {
          orders = await db.orderSchema.find({
            userId,
            progress: {
              $elemMatch: {
                name: status,
                checked: true,
              },
            },
          });
        }
      }

      return {
        __typename: "OrderData",
        status,
        page,
        totalItems: orders.length,
        results: orders.slice(start, end),
      };
    } catch (e) {
      console.log(e);
      throw new Error(e.message);
    }
  }
);

const ordersSummary = authenticated(async (_, req: ReqBody) => {
  try {
    
    const admin = req.admin;

    if (!admin) {
      throw new Error("You don,t have permission");
    }
    
    const orders = await db.orderSchema.find();

    const data = {
      __typename: "OrderSummary",
      pending: orders.filter(order => order.status === "pending").length,
      delivered: orders.filter(order => order.status === "delivered").length,
      canceled: orders.filter(order => order.status === "canceled").length,
    };

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
});

const ordersStatistics = authenticated(async (_, req: ReqBody) => {
  try {
    const admin = req.admin;

    if (!admin) {
      throw new Error("You don,t have permission");
    }
    
    const orders = await db.orderSchema.find({}, { totalPrice: 1, progress: 1, createdAt: 1, updatedAt: 1});

    let totals = orders.map((order) => Number(order.totalPrice));

    const data = {
      __typename: "OrderStatistics",
      min: 0,
      max: Math.round(Math.max(...totals)),
      week: [0, 86, 28, 115, 48, 210, 136],
      month: [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message);
  }
})

export default {
  createOrder,
  orders,
  order,
  updateProgress,
  filterById,
  filterByStatus,
  ordersSummary,
  ordersStatistics
};

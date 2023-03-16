import type {
  AddressType,
  CouponType,
  OrderProductType,
  ResolverFn,
} from "../../../../typing";
import calculateDiscount from "../../../helper/calculateDiscount";
import clean from "../../../helper/clean";
import getdel from "../../../helper/getdel";
import { nanoid } from "../../../helper/nanoid";
import db from "../../../models";

interface Args {
  input: {
    totalPrice: string;
    coupon: CouponType & { id: string };
    shippingFee: string;
    paymentMethod: string;
    deliveryMethod: string;
    address: AddressType;
    products: OrderProductType[];
    paymentId: string;
    pickup: string;
    phoneNumber: string;
  };
}
const createOrder: ResolverFn<Args> = async (_, args, ctx) => {
  try {
    const { totalPrice, coupon, shippingFee, products, ...others } = args.input;
    const { user, req, db, redis } = ctx;

    const userId = user?._id.toString();

    const price = Number(
      calculateDiscount(
        Number(totalPrice),
        coupon ? Number(coupon.discount) : 0
      ) + Number(shippingFee) ?? 0
    ).toFixed(2);

    const trackingId = nanoid(),
      orderId = nanoid(15);

    const data = clean({
      orderId,
      userId,
      totalPrice: price,
      status: "pending",
      trackingId,
      progress: defaultProgress,
      shippingFee,
      coupon,
      products,
      ...others,
    });

    const newData = await db.orders.create(data);

    if (!newData) throw new Error("Something went wrong");

    await decrementProduct(products);
    if (coupon) await deleteCoupon(coupon.id);

    // getting cache data from redis if available
    await getdel([
      `filterById:${userId}*`,
      `filterByStatus:${userId}*`,
      `order:${userId}*`,
      `orders:${userId}*`,
      "orders-statistics",
      "order-summary",
    ]);

    return {
      id: newData._id.toString(),
      orderId,
      trackingId,
      userId,
    };
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

const decrementProduct = async (data: OrderProductType[]) => {
  for (let i = 0; i < data.length; i++) {
    const element = data[i];

    await db.products.updateOne(
      { id: element.productId },
      {
        $inc: { stock: -Number(element.quantity) },
      }
    );
  }
};

const deleteCoupon = async (id: string) => {
  await db.coupons.findByIdAndDelete(id);
};

const defaultProgress = [
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
];
export default createOrder;

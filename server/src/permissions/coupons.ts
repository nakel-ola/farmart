import { and, inputRule } from "graphql-shield";
import { isAdmin, isAuthenticated, isDashboard, isEditor } from "./user";

const deleteCouponInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      id: yup.string().required(),
      userId: yup.string().required(),
    }),
  })
);

const createCouponInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup.string().required(),
      discount: yup.string().required(),
      description: yup.string().nullable(),
      userId: yup.string().required(),
      expiresIn: yup.string().nullable(),
    }),
  })
);

const verifyCouponInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup.string().email().required(),
      coupon: yup.string().required(),
    }),
  })
);

const couponInput = inputRule()((yup) =>
  yup.object({
    customerId: yup.string().nullable(),
  })
);

const queries = {
  verifyCoupon: and(verifyCouponInput, isAuthenticated),
  coupons: and(couponInput, isAuthenticated),
};

const mutations = {
  deleteCoupon: and(
    isDashboard,
    deleteCouponInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  createCoupon: and(
    isDashboard,
    createCouponInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
};

export default { queries, mutations };

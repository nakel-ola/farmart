import { and, inputRule } from "graphql-shield";
import { isAdmin, isAuthenticated, isDashboard } from "./user";

const ordersInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      page: yup.number().integer().nullable(),
      limit: yup.number().integer().nullable(),
      customerId: yup.string().nullable(),
      status: yup.string().nullable(),
    }),
  })
);

const orderInput = inputRule()((yup) =>
  yup.object({
    id: yup.string().required(),
  })
);

const filterByIdInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      page: yup.number().integer().nullable(),
      limit: yup.number().integer().nullable(),
      orderId: yup.string().required(),
    }),
  })
);

const filterByStatusInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      page: yup.number().integer().nullable(),
      limit: yup.number().integer().nullable(),
      status: yup.string().required(),
    }),
  })
);

const createOrderInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      totalPrice: yup.string().required(),
      address: yup.object({
        id: yup.string().required(),
        userId: yup.string().required(),
        name: yup.string().required(),
        street: yup.string().required(),
        city: yup.string().required(),
        state: yup.string().required(),
        country: yup.string().required(),
        default: yup.boolean().required(),
        info: yup.string().nullable(),
        phoneNumber: yup.string().required(),
        phoneNumber2: yup.string().nullable(),
      }),
      pickup: yup.string().nullable(),
      coupon: yup
        .object({
          id: yup.string().required(),
          email: yup.string().required(),
          discount: yup.string().required(),
          code: yup.string().required(),
          userId: yup.string().required(),
          description: yup.string().nullable(),
          expiresIn: yup.string().nullable(),
          createdAt: yup.date().nullable(),
          updatedAt: yup.date().nullable(),
        })
        .nullable(),
      paymentMethod: yup.string().required(),
      shippingFee: yup.string().nullable(),
      phoneNumber: yup.string().nullable(),
      deliveryMethod: yup.string().required(),
      products: yup.array().of(
        yup.object({
          id: yup.string().required(),
          price: yup.string().required(),
          quantity: yup.number().integer().required(),
        })
      ),
      paymentId: yup.string().required(),
    }),
  })
);

const updateProgress = inputRule()((yup) =>
  yup.object({
    input: yup
      .object({
        id: yup.string().required(),
        name: yup.string().required(),
      })
      .required(),
  })
);

const queries = {
  orders: and(ordersInput, isAuthenticated),
  order: and(orderInput, isAuthenticated),
  filterById: and(filterByIdInput, isAuthenticated),
  filterByStatus: and(filterByStatusInput, isAuthenticated),
  ordersSummary: and(isDashboard, isAuthenticated, isAdmin),
  ordersStatistics: and(isDashboard, isAuthenticated, isAdmin),
};

const mutations = {
  createOrder: and(createOrderInput, isAuthenticated),
  updateProgress: and(updateProgress, isAuthenticated),
};

export default { mutations, queries };

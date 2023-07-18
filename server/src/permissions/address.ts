import { and, inputRule } from "graphql-shield";
import { isAuthenticated } from "./user";

const addressInput = inputRule()((yup) =>
  yup.object({
    id: yup.string().required(),
  })
);

const createAddressInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      name: yup.string().required(),
      street: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      country: yup.string().required(),
      info: yup.string().nullable(),
      phoneNumber: yup.string().required(),
      phoneNumber2: yup.string().nullable(),
    }),
  })
);

const updateAddressInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      id: yup.string().required(),
      userId: yup.string().required(),
      name: yup.string().required(),
      street: yup.string().required(),
      city: yup.string().required(),
      state: yup.string().required(),
      country: yup.string().required(),
      info: yup.string().nullable(),
      phoneNumber: yup.string().required(),
      phoneNumber2: yup.string().nullable(),
      default: yup.boolean().nullable()
    }),
  })
);

const deleteAddressInput = inputRule()((yup) =>
  yup.object({
    id: yup.string().required(),
  })
);

const queries = {
  addresses: and(isAuthenticated),
  address: and(addressInput, isAuthenticated),
};

const mutations = {
  createAddress: and(createAddressInput, isAuthenticated),
  updateAddress: and(updateAddressInput, isAuthenticated),
  deleteAddress: and(deleteAddressInput, isAuthenticated),
};

export default { mutations, queries };


import { and, inputRule } from "graphql-shield";
import { isAdmin, isAuthenticated, isDashboard, isEditor } from "./user";

const inboxesInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      page: yup.number().integer().nullable(),
      limit: yup.number().integer().nullable(),
      customerId: yup.string().nullable(),
    }),
  })
);

const createInboxInput = inputRule()((yup) =>
  yup
    .object({
      input: yup
        .object({
          title: yup.string().required(),
          description: yup.string().required(),
          userId: yup.string().required(),
        })
        .required(),
    })
    .required()
);
const updateInboxInput = inputRule()((yup) =>
  yup
    .object({
      input: yup
        .object({
          title: yup.string().required(),
          description: yup.string().required(),
          userId: yup.string().required(),
          id: yup.string().required(),
        })
        .required(),
    })
    .required()
);

const inboxesQuery = {
  inboxes: and(inboxesInput, isAuthenticated),
};

const inboxesMutation = {
  createInbox: and(
    isDashboard,
    createInboxInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  updateInbox: and(
    isDashboard,
    updateInboxInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
};

export { inboxesMutation, inboxesQuery };

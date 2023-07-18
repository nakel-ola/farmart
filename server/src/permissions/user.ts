import type { GraphQLResolveInfo } from "graphql";
import { and, inputRule, not, race, rule } from "graphql-shield";
import type { Context } from "../../typing";

const registerInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      name: yup
        .string()
        .min(5, "your name must be at least 5 characters")
        .required(),
      email: yup.string().email("Invalid email address").required(),
      phoneNumber: yup.string().min(10).max(11).required(),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required(),
      inviteCode: yup.string().nullable(),
    }),
  })
);

const loginInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup.string().email("Invalid email address").required(),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required(),
    }),
  })
);

const forgetPasswordInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      name: yup
        .string()
        .min(5, "your name must be at least 5 characters")
        .required(),
      email: yup.string().email("Invalid email address").required(),
    }),
  })
);

const validateCodeInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      name: yup
        .string()
        .min(5, "your name must be at least 5 characters")
        .required(),
      email: yup.string().email("Invalid email address").required(),
      validationToken: yup.string().length(5).required(),
    }),
  })
);

const changePasswordInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      name: yup
        .string()
        .min(5, "your name must be at least 5 characters")
        .required(),
      email: yup.string().email("Invalid email address").required(),
      validationToken: yup.string().length(5).required(),
      password: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required(),
    }),
  })
);

const updatePasswordInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      oldPassword: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required(),
      newPassword: yup
        .string()
        .min(8, "Password must be at least 8 characters")
        .required(),
    }),
  })
);

const updateUserInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      uid: yup.string().nullable(),
      name: yup
        .string()
        .min(5, "your name must be at least 5 characters")
        .nullable(),
      phoneNumber: yup.string().min(10).max(11).nullable(),
      gender: yup.string().oneOf(["male", "female"]).nullable(),
      birthday: yup.date().nullable(),
      photoUrl: yup.string().nullable(),
    }),
  })
);

const blockUserInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup.string().email("Invalid email address").required(),
      blocked: yup.boolean().required(),
      customerId: yup.string().uuid(),
    }),
  })
);

const userInput = inputRule()((yup) =>
  yup.object({ uid: yup.string().nullable() })
);

const createEmployeeInviteInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      email: yup.string().email().required(),
      level: yup.string().oneOf(["Gold", "Silver", "Bronze"]).required(),
    }),
  })
);

const deleteEmployeeInput = inputRule()((yup) =>
  yup.object({ id: yup.string() })
);

const usersInput = inputRule()((yup) =>
  yup.object({
    input: yup.object({
      employee: yup.boolean().nullable(),
      offset: yup.number().integer().nullable(),
      limit: yup.number().integer().nullable(),
    }),
  })
);

const isAuthenticated = rule()(
  async (_: any, args: any, ctx: Context) => ctx.user !== null
);

const isAdmin = rule()(
  (_: any, args: any, ctx: Context) => ctx.user?.level !== null
);

const isEditor = rule()((_: any, args: any, ctx: Context) => {
  if (ctx.user?.level === "Gold" || ctx.user?.level === "Silver") return true;
  return false;
});

const isDashboard = rule()((_: any, args: any, ctx: Context) => ctx.isAdmin);

const ONE_DAY = 60 * 60 * 24;
const rateLimit = rule()(
  async (_: any, args: any, ctx: Context, info: GraphQLResolveInfo) => {
    const { req, redis } = ctx;
    const key = `rate-limit:${info.fieldName}:${req.ip}`;

    const current = await redis.incr(key);

    if (current > 10) return false;
    else if (current === 1) await redis.expire(key, ONE_DAY);

    return true;
  }
);

const mutations = {
  register: and(registerInput, rateLimit, not(isAuthenticated)),
  login: and(loginInput, rateLimit, not(isAuthenticated)),
  forgetPassword: and(forgetPasswordInput, rateLimit, not(isAuthenticated)),
  validateCode: and(validateCodeInput, not(isAuthenticated)),
  changePassword: and(changePasswordInput, not(isAuthenticated)),
  updatePassword: and(updatePasswordInput, isAuthenticated),

  updateUser: and(updateUserInput, isAuthenticated),
  blockUser: and(blockUserInput, isAuthenticated),

  createEmployeeInvite: and(
    isDashboard,
    createEmployeeInviteInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  deleteEmployeeInvite: and(
    isDashboard,
    deleteEmployeeInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
  deleteEmployee: and(
    isDashboard,
    deleteEmployeeInput,
    isAuthenticated,
    isAdmin,
    isEditor
  ),
};

const queries = {
  user: and(userInput, isAuthenticated),
  users: and(usersInput, isAuthenticated),
  employeeInvites: and(isDashboard, isAuthenticated, isAdmin),
};
export { isAdmin, isAuthenticated, isDashboard, isEditor };

export default {
  mutations,
  queries,
};

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isEditor = exports.isDashboard = exports.isAdmin = exports.userQuery = exports.userMutation = exports.isAuthenticated = void 0;
const graphql_shield_1 = require("graphql-shield");
const registerInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
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
}));
const loginInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        email: yup.string().email("Invalid email address").required(),
        password: yup
            .string()
            .min(8, "Password must be at least 8 characters")
            .required(),
    }),
}));
const forgetPasswordInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        name: yup
            .string()
            .min(5, "your name must be at least 5 characters")
            .required(),
        email: yup.string().email("Invalid email address").required(),
    }),
}));
const validateCodeInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        name: yup
            .string()
            .min(5, "your name must be at least 5 characters")
            .required(),
        email: yup.string().email("Invalid email address").required(),
        validationToken: yup.string().length(5).required(),
    }),
}));
const changePasswordInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
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
}));
const updatePasswordInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
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
}));
const updateUserInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
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
}));
const blockUserInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        email: yup.string().email("Invalid email address").required(),
        blocked: yup.boolean().required(),
        customerId: yup.string().uuid(),
    }),
}));
const userInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({ uid: yup.string().nullable() }));
const createEmployeeInviteInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        email: yup.string().email().required(),
        level: yup.string().oneOf(["Gold", "Silver", "Bronze"]).required(),
    }),
}));
const deleteEmployeeInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({ id: yup.string() }));
const usersInput = (0, graphql_shield_1.inputRule)()((yup) => yup.object({
    input: yup.object({
        employee: yup.boolean().nullable(),
        offset: yup.number().integer().nullable(),
        limit: yup.number().integer().nullable(),
    }),
}));
const isAuthenticated = (0, graphql_shield_1.rule)()((_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () { return ctx.user !== null; }));
exports.isAuthenticated = isAuthenticated;
const isAdmin = (0, graphql_shield_1.rule)()((_, args, ctx) => { var _a; return ((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.level) !== null; });
exports.isAdmin = isAdmin;
const isEditor = (0, graphql_shield_1.rule)()((_, args, ctx) => {
    var _a, _b;
    if (((_a = ctx.user) === null || _a === void 0 ? void 0 : _a.level) === "Gold" || ((_b = ctx.user) === null || _b === void 0 ? void 0 : _b.level) === "Silver")
        return true;
    return false;
});
exports.isEditor = isEditor;
const isDashboard = (0, graphql_shield_1.rule)()((_, args, ctx) => { var _a; return (_a = ctx.req.admin) !== null && _a !== void 0 ? _a : false; });
exports.isDashboard = isDashboard;
const ONE_DAY = 60 * 60 * 24;
const rateLimit = (0, graphql_shield_1.rule)()((_, args, ctx, info) => __awaiter(void 0, void 0, void 0, function* () {
    const { req, redis } = ctx;
    const key = `rate-limit:${info.fieldName}:${req.ip}`;
    const current = yield redis.incr(key);
    if (current > 10)
        return false;
    else if (current === 1)
        yield redis.expire(key, ONE_DAY);
    return true;
}));
const userMutation = {
    register: (0, graphql_shield_1.and)(registerInput, rateLimit, (0, graphql_shield_1.not)(isAuthenticated)),
    login: (0, graphql_shield_1.and)(loginInput, rateLimit, (0, graphql_shield_1.not)(isAuthenticated)),
    forgetPassword: (0, graphql_shield_1.and)(forgetPasswordInput, rateLimit, (0, graphql_shield_1.not)(isAuthenticated)),
    validateCode: (0, graphql_shield_1.and)(validateCodeInput, (0, graphql_shield_1.not)(isAuthenticated)),
    changePassword: (0, graphql_shield_1.and)(changePasswordInput, (0, graphql_shield_1.not)(isAuthenticated)),
    updatePassword: (0, graphql_shield_1.and)(updatePasswordInput, isAuthenticated),
    updateUser: (0, graphql_shield_1.and)(updateUserInput, isAuthenticated),
    blockUser: (0, graphql_shield_1.and)(blockUserInput, isAuthenticated),
    createEmployeeInvite: (0, graphql_shield_1.and)(isDashboard, createEmployeeInviteInput, isAuthenticated, isAdmin, isEditor),
    deleteEmployeeInvite: (0, graphql_shield_1.and)(isDashboard, deleteEmployeeInput, isAuthenticated, isAdmin, isEditor),
    deleteEmployee: (0, graphql_shield_1.and)(isDashboard, deleteEmployeeInput, isAuthenticated, isAdmin, isEditor),
};
exports.userMutation = userMutation;
const userQuery = {
    user: (0, graphql_shield_1.and)(userInput, isAuthenticated),
    users: (0, graphql_shield_1.and)(usersInput, isAuthenticated),
    employeeInvites: (0, graphql_shield_1.and)(isDashboard, isAuthenticated, isAdmin),
};
exports.userQuery = userQuery;
//# sourceMappingURL=user.js.map
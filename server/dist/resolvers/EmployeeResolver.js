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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lodash_1 = require("lodash");
const mongoose_1 = __importDefault(require("mongoose"));
require("uuid");
const xss_1 = __importDefault(require("xss"));
const config_1 = __importDefault(require("../config"));
const emailData_1 = require("../data/emailData");
const helper_1 = require("../helper");
require("../helper/clean");
const emailer_1 = __importDefault(require("../helper/emailer"));
const generateCode_1 = __importDefault(require("../helper/generateCode"));
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const employeeRegister = (args, req, res, context, info) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let name = (0, xss_1.default)(args.input.name), email = (0, xss_1.default)(args.input.email), phoneNumber = (0, xss_1.default)(args.input.phoneNumber), inviteCode = (0, xss_1.default)(args.input.inviteCode), password = (0, xss_1.default)(args.input.password);
        const validate = yield verifyInvite({ email, inviteCode });
        if (!validate) {
            throw new Error("Something went wrong");
        }
        const user = yield models_1.default.employeeSchema.findOne({ email }, { email: 1 });
        if (user) {
            throw new Error(`User ${user.email} already exists`);
        }
        const salt = (0, bcryptjs_1.genSaltSync)(config_1.default.saltRounds), hash = (0, bcryptjs_1.hashSync)(password, salt);
        let obj = {
            name,
            email,
            phoneNumber,
            gender: null,
            level: validate.level,
            photoUrl: null,
            birthday: null,
            addresses: [],
            password: hash,
        };
        const newUser = yield models_1.default.employeeSchema.create(obj);
        const token = jsonwebtoken_1.default.sign({ id: newUser._id.toString(), level: validate.level }, config_1.default.jwt_key, { expiresIn: config_1.default.expiresIn });
        req.session.auth_admin = token;
        yield models_1.default.inviteSchema.updateOne({ _id: validate._id, email, inviteCode }, { status: "completed" });
        // await deleteEmployeeInvite(
        //   { id: validate._id.toString() },
        //   req,
        //   res,
        //   context,
        //   info
        // );
        // delete newUser["password"];
        let data = {
            __typename: "Employee",
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            gender: newUser.gender,
            birthday: newUser.birthday,
            phoneNumber: newUser.phoneNumber,
            photoUrl: newUser.photoUrl,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            level: newUser.level,
        };
        console.log(data);
        return data;
    }
    catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
});
const employeeLogin = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = (0, xss_1.default)(args.input.email), password = (0, xss_1.default)(args.input.password);
        const user = yield models_1.default.employeeSchema.findOne({ email });
        if (!user) {
            throw new Error("Something went wrong");
        }
        const isPassword = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!isPassword) {
            throw new Error("Something went wrong");
        }
        let token = jsonwebtoken_1.default.sign({ id: user._id, level: user.level }, config_1.default.jwt_key, {
            expiresIn: config_1.default.expiresIn,
        });
        req.session.auth_admin = token;
        return {
            __typename: "Employee",
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            gender: user.gender,
            birthday: user.birthday,
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            level: user.level,
        };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const employeeForgetPassword = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let name = (0, xss_1.default)(args.input.name), email = (0, xss_1.default)(args.input.email);
        let id = (0, generateCode_1.default)(11111, 99999);
        const user = yield models_1.default.employeeSchema.findOne({ email, name }, { email: 1, name: 1 });
        if (!user) {
            throw new Error("User not found");
        }
        let obj = {
            name,
            email,
            validationToken: id,
            expiresIn: Date.now(),
        };
        yield models_1.default.validateSchema.create(obj);
        yield (0, emailer_1.default)({
            from: '"Grocery Team" noreply@grocery.com',
            to: email,
            subject: "Your Grocery app verification code",
            text: null,
            html: (0, emailData_1.verificationMail)({ code: id, name }),
        });
        console.log(id);
        return { validationToken: id.toString() };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const employeeChangePassword = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let name = (0, xss_1.default)(args.input.name), email = (0, xss_1.default)(args.input.email), password = (0, xss_1.default)(args.input.password), validationToken = (0, xss_1.default)(args.input.validationToken);
        const validate = yield models_1.default.validateSchema.findOne({
            email,
            name,
            validationToken,
        });
        if (!validate) {
            throw new Error("Something want wrong");
        }
        const salt = (0, bcryptjs_1.genSaltSync)(config_1.default.saltRounds);
        const hash = (0, bcryptjs_1.hashSync)(password, salt);
        const user = yield models_1.default.employeeSchema.updateOne({ email, name }, { password: hash });
        if (!user) {
            throw new Error("Something went wrong");
        }
        const newUser = yield models_1.default.employeeSchema.findOne({ email });
        if (!newUser) {
            throw new Error("Something went wrong");
        }
        const token = jsonwebtoken_1.default.sign(Object.assign({ id: newUser._id }, newUser), config_1.default.jwt_key, {
            expiresIn: config_1.default.expiresIn,
        });
        req.session.auth_admin = token;
        yield models_1.default.validateSchema.deleteOne({ email, name });
        yield (0, emailer_1.default)({
            from: '"Grocery Team" noreply@grocery.com',
            to: email,
            subject: "Your password was changed",
            text: null,
            html: (0, emailData_1.passwordChangeMail)({ name, email }),
        });
        return (0, lodash_1.merge)({ __typename: "Employee" }, newUser);
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const employeeUpdatePassword = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId), input = args.input, email = (0, xss_1.default)(input.email), oldPassword = (0, xss_1.default)(input.oldPassword), newPassword = (0, xss_1.default)(input.newPassword);
        const user = yield models_1.default.employeeSchema.findOne({ _id: userId, email });
        if (!user) {
            throw new Error("Something went wrong");
        }
        const isPassword = (0, bcryptjs_1.compareSync)(oldPassword, user.password);
        if (!isPassword) {
            throw new Error("Something went wrong");
        }
        const salt = (0, bcryptjs_1.genSaltSync)(config_1.default.saltRounds);
        const hash = (0, bcryptjs_1.hashSync)(newPassword, salt);
        const newUser = yield models_1.default.employeeSchema.updateOne({ _id: userId, email }, { password: hash });
        if (!newUser) {
            throw new Error("Something went wrong");
        }
        req.res.clearCookie("auth");
        req.session.destroy((err) => {
            if (err) {
                throw new Error(err.message);
            }
        });
        yield (0, emailer_1.default)({
            from: '"Grocery Team" noreply@grocery.com',
            to: email,
            subject: "	Your password was changed",
            text: null,
            html: (0, emailData_1.passwordChangeMail)({ name: user.name, email }),
        });
        const token = jsonwebtoken_1.default.sign({
            id: user._id,
            name: user.name,
            email,
            photoUrl: user.photoUrl,
            birthday: user.birthday,
            gender: user.gender,
            phoneNumber: user.phoneNumber,
            level: user.level,
        }, config_1.default.jwt_key, { expiresIn: config_1.default.expiresIn });
        req.session.grocery = token;
        return {
            __typename: "Employee",
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            gender: user.gender,
            birthday: user.birthday,
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            level: user.level,
        };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const employeeModifyUser = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId), input = args.input, employeeId = (0, xss_1.default)(input.employeeId), email = (0, xss_1.default)(input.email), name = (0, xss_1.default)(input.name), gender = (0, xss_1.default)(input.gender), birthday = input.birthday, level = (0, xss_1.default)(input.level), phoneNumber = (0, xss_1.default)(input.phoneNumber);
        const user = yield models_1.default.employeeSchema.updateOne({ _id: employeeId !== null && employeeId !== void 0 ? employeeId : userId, email }, { name, gender, birthday, phoneNumber, level });
        if (!user) {
            throw new Error("Something went wrong");
        }
        return { msg: "Successfully updated" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const employees = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let isAdmin = req.admin, page = Number((0, xss_1.default)((_a = args.input.page.toString()) !== null && _a !== void 0 ? _a : "1")), limit = Number((0, xss_1.default)((_b = args.input.limit.toString()) !== null && _b !== void 0 ? _b : "10")), start = (page - 1) * limit, end = limit + start;
        if (!isAdmin) {
            throw new Error("Can't get any users for you");
        }
        const newUser = yield models_1.default.employeeSchema.find({}, {
            birthday: 1,
            email: 1,
            gender: 1,
            name: 1,
            phoneNumber: 1,
            photoUrl: 1,
            level: 1,
            updatedAt: 1,
            createdAt: 1,
        });
        return {
            __typename: "EmployeeData",
            page,
            totalItems: newUser.length,
            results: newUser.slice(start, end),
        };
    }
    catch (e) {
        console.log(e);
    }
}));
const employee = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.userId, admin = req.admin, employeeId = args.employeeId;
        if (!mongoose_1.default.Types.ObjectId.isValid(employeeId !== null && employeeId !== void 0 ? employeeId : userId)) {
            throw new Error("No such user");
        }
        if (employeeId && !admin) {
            throw new Error("You don't have permission to acccess this user");
        }
        const user = yield models_1.default.employeeSchema.findOne({ _id: employeeId !== null && employeeId !== void 0 ? employeeId : userId }, {
            birthday: 1,
            email: 1,
            gender: 1,
            name: 1,
            phoneNumber: 1,
            photoUrl: 1,
            level: 1,
            updatedAt: 1,
            createdAt: 1,
        });
        if (!user) {
            throw new Error("Something went wrong");
        }
        return {
            __typename: "Employee",
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            gender: user.gender,
            birthday: user.birthday,
            phoneNumber: user.phoneNumber,
            photoUrl: user.photoUrl,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            level: user.level,
        };
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const updateEmployeePhotoUrl = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.userId, image = args.image;
        const newImage = yield (0, ImageUpload_1.default)(image.file);
        yield models_1.default.employeeSchema.updateOne({ _id: userId }, {
            photoUrl: newImage.url,
        });
        return {
            msg: "PhotoUrl updated successfully",
        };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const createEmployeeInvite = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, email = (0, xss_1.default)(args.input.email), level = (0, xss_1.default)(args.input.level), inviteCode = (0, helper_1.nanoid)(5), status = "pending";
        if (!admin) {
            throw new Error("You don't have permission to invite an employee");
        }
        let link = `${config_1.default.admin_url}/?type=sign&code=${inviteCode}`;
        yield models_1.default.inviteSchema.create({ email, level, status, inviteCode });
        //  http://localhost:3001/?type=sign&code=ZSX8E
        // invitationMail
        console.log(link);
        yield (0, emailer_1.default)({
            from: '"Grocery Team" noreply@grocery.com',
            to: email,
            subject: "Your Grocery app verification code",
            text: null,
            html: (0, emailData_1.invitationMail)({ link }),
        });
        return { msg: "Invite sent successfully" };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const deleteEmployeeInvite = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, id = (0, xss_1.default)(args.id);
        if (!admin) {
            throw new Error("You don't have permission");
        }
        yield models_1.default.inviteSchema.deleteOne({ _id: id });
        return { msg: "Invite deleted successfully" };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const verifyInvite = ({ email, inviteCode, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield models_1.default.inviteSchema.findOne({ email, inviteCode });
        if (!data) {
            return false;
        }
        return data;
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
});
const employeeInvites = (0, authenticated_1.default)((_, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin;
        if (!admin) {
            throw new Error("You have permission");
        }
        const data = yield models_1.default.inviteSchema.find({});
        return data.map((value) => (0, lodash_1.merge)({ __typename: "EmployeeInvite" }, value));
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const logout = (0, authenticated_1.default)((_, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.res.clearCookie(req.admin ? "auth_admin" : "auth");
        req.session.destroy((err) => {
            if (err) {
                throw new Error(err.message);
            }
        });
        return { msg: "Logout successful" };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
exports.default = {
    employeeRegister,
    employeeLogin,
    employeeForgetPassword,
    employeeChangePassword,
    employeeUpdatePassword,
    employeeModifyUser,
    employees,
    employee,
    updateEmployeePhotoUrl,
    createEmployeeInvite,
    deleteEmployeeInvite,
    employeeInvites,
    logout,
};

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
require("../helper");
const emailer_1 = __importDefault(require("../helper/emailer"));
const generateCode_1 = __importDefault(require("../helper/generateCode"));
const ImageUpload_1 = __importDefault(require("../helper/ImageUpload"));
const authenticated_1 = __importDefault(require("../middleware/authenticated"));
const models_1 = __importDefault(require("../models"));
const register = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let name = (0, xss_1.default)(args.input.name), email = (0, xss_1.default)(args.input.email), phoneNumber = (0, xss_1.default)(args.input.phoneNumber), password = (0, xss_1.default)(args.input.password);
        const user = yield models_1.default.userSchema.findOne({ email }, { email: 1 });
        if (user) {
            throw new Error(`User ${user.email} already exists`);
        }
        const salt = (0, bcryptjs_1.genSaltSync)(config_1.default.saltRounds), hash = (0, bcryptjs_1.hashSync)(password, salt);
        let obj = {
            name,
            email,
            phoneNumber,
            password: hash,
            gender: null,
            photoUrl: null,
            birthday: null,
            addresses: [],
            blocked: false,
        };
        const newUser = yield models_1.default.userSchema.create(obj);
        const token = jsonwebtoken_1.default.sign({ id: newUser._id.toString(), blocked: false }, config_1.default.jwt_key, { expiresIn: config_1.default.expiresIn });
        req.session.auth = token;
        yield (0, emailer_1.default)({
            from: '"Grocery Team" noreply@grocery.com',
            to: email,
            subject: "Welcome to the Grocery family!",
            text: "",
            html: (0, emailData_1.welcomeMsg)({ name }),
        });
        return (0, lodash_1.merge)({ __typename: "User" }, {
            id: newUser._id.toString(),
            email: newUser.email,
            name: newUser.name,
            gender: newUser.gender,
            birthday: newUser.birthday,
            phoneNumber: newUser.phoneNumber,
            photoUrl: newUser.photoUrl,
            createdAt: newUser.createdAt,
            updatedAt: newUser.updatedAt,
            blocked: newUser.blocked,
        });
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const login = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let email = (0, xss_1.default)(args.input.email), password = (0, xss_1.default)(args.input.password);
        const user = yield models_1.default.userSchema.findOne({ email });
        if (!user || (user === null || user === void 0 ? void 0 : user.blocked)) {
            throw new Error("Something went wrong");
        }
        const isPassword = (0, bcryptjs_1.compareSync)(password, user.password);
        if (!isPassword) {
            throw new Error("Something went wrong");
        }
        let token = jsonwebtoken_1.default.sign({
            id: user._id.toString(),
            blocked: user.blocked,
        }, config_1.default.jwt_key, { expiresIn: config_1.default.expiresIn });
        req.session.auth = token;
        return (0, lodash_1.merge)({ __typename: "User" }, user);
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const forgetPassword = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let name = (0, xss_1.default)(args.input.name), email = (0, xss_1.default)(args.input.email);
        // let id = nanoidV2("0123456789", 5, 8);
        let id = (0, generateCode_1.default)(11111, 99999);
        const user = yield models_1.default.userSchema.findOne({ email, name });
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
const validateCode = (args) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let name = (0, xss_1.default)(args.input.name), email = (0, xss_1.default)(args.input.email), validationToken = (0, xss_1.default)(args.input.validationToken);
        const validate = yield models_1.default.validateSchema.findOne({
            email,
            name,
            validationToken,
        });
        if (!validate) {
            return { validate: false };
        }
        return { validate: true };
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const changePassword = (args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let name = (0, xss_1.default)(args.input.name), email = (0, xss_1.default)(args.input.email), password = (0, xss_1.default)(args.input.password);
        const salt = (0, bcryptjs_1.genSaltSync)(config_1.default.saltRounds);
        const hash = (0, bcryptjs_1.hashSync)(password, salt);
        const user = yield models_1.default.userSchema.updateOne({ email, name }, { password: hash });
        if (!user) {
            throw new Error("Something went wrong");
        }
        const newUser = yield models_1.default.userSchema.findOne({ email });
        if (!newUser) {
            throw new Error("Something went wrong");
        }
        const token = jsonwebtoken_1.default.sign({ id: newUser._id, blocked: newUser.blocked }, config_1.default.jwt_key, { expiresIn: config_1.default.expiresIn });
        req.session.auth = token;
        yield models_1.default.validateSchema.deleteOne({ email, name });
        yield (0, emailer_1.default)({
            from: '"Grocery Team" noreply@grocery.com',
            to: email,
            subject: "Your password was changed",
            text: null,
            html: (0, emailData_1.passwordChangeMail)({ name, email }),
        });
        return (0, lodash_1.merge)({ __typename: "User" }, newUser);
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
});
const modifyUser = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId), input = args.input, email = (0, xss_1.default)(input.email), name = (0, xss_1.default)(input.name), gender = input.gender ? (0, xss_1.default)(input.gender) : null, birthday = input.birthday ? (0, xss_1.default)(input.birthday) : null, phoneNumber = input.phoneNumber ? (0, xss_1.default)(input.phoneNumber) : null;
        const user = yield models_1.default.userSchema.updateOne({ _id: userId, email }, { name, gender, birthday, phoneNumber });
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
const updatePassword = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = (0, xss_1.default)(req.userId), input = args.input, email = (0, xss_1.default)(input.email), oldPassword = (0, xss_1.default)(input.oldPassword), newPassword = (0, xss_1.default)(input.newPassword);
        const user = yield models_1.default.userSchema.findOne({ _id: userId, email });
        if (!user) {
            throw new Error("Something went wrong");
        }
        const isPassword = (0, bcryptjs_1.compareSync)(oldPassword, user.password);
        if (!isPassword) {
            throw new Error("Something went wrong");
        }
        const salt = (0, bcryptjs_1.genSaltSync)(config_1.default.saltRounds);
        const hash = (0, bcryptjs_1.hashSync)(newPassword, salt);
        const newUser = yield models_1.default.userSchema.updateOne({ _id: userId, email }, { password: hash });
        if (!newUser) {
            throw new Error("Something went wrong");
        }
        req.res.clearCookie("auth");
        req.session.destroy((err) => {
            if (err) {
                throw new Error(err.message);
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user._id, name: user.name, email, photoUrl: user.photoUrl }, config_1.default.jwt_key, { expiresIn: config_1.default.expiresIn });
        req.session.auth = token;
        // await emailer({
        //   from: '"Grocery Team" noreply@grocery.com',
        //   to: email,
        //   subject: "	Your password was changed",
        //   text: null,
        //   html: passwordChangeMail({ name: user.name, email }),
        // });
        return (0, lodash_1.merge)({ __typename: "User" }, user);
    }
    catch (e) {
        console.log(e);
        throw new Error(e.message);
    }
}));
const user = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.userId, admin = req.admin, customerId = args.customerId;
        if (!mongoose_1.default.Types.ObjectId.isValid(customerId !== null && customerId !== void 0 ? customerId : userId)) {
            throw new Error("No such user");
        }
        if (customerId && !admin) {
            throw new Error("You don't have permission to acccess this user");
        }
        const user = yield models_1.default.userSchema.findOne({ _id: customerId !== null && customerId !== void 0 ? customerId : userId }, {
            birthday: 1,
            email: 1,
            gender: 1,
            name: 1,
            phoneNumber: 1,
            photoUrl: 1,
            blocked: 1,
            updatedAt: 1,
            createdAt: 1,
        });
        if (!user) {
            throw new Error("Something went wrong");
        }
        return (0, lodash_1.merge)({ __typename: "User" }, user);
    }
    catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}));
const users = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        let isAdmin = req.admin, admin = Boolean((0, xss_1.default)(`${args.input.admin}`)), page = Number((0, xss_1.default)(`${(_a = args.input.page) !== null && _a !== void 0 ? _a : 1}`)), limit = Number((0, xss_1.default)(`${(_b = args.input.limit) !== null && _b !== void 0 ? _b : 10}`)), start = (page - 1) * limit, end = limit + start;
        if (!isAdmin) {
            throw new Error("Can't get any users for you");
        }
        const newUser = yield models_1.default.userSchema.find({ admin }, {
            birthday: 1,
            email: 1,
            gender: 1,
            name: 1,
            phoneNumber: 1,
            photoUrl: 1,
            blocked: 1,
            updatedAt: 1,
            createdAt: 1,
        });
        return {
            __typename: "UsersData",
            page,
            totalItems: newUser.length,
            results: newUser.slice(start, end),
        };
    }
    catch (e) {
        console.log(e);
    }
}));
const blockUser = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let admin = req.admin, customerId = (0, xss_1.default)(args.input.customerId), email = (0, xss_1.default)(args.input.email), blocked = Boolean((0, xss_1.default)(`${args.input.blocked}`));
        if (!admin) {
            throw Error("You don't have permission to block this user");
        }
        const user = yield models_1.default.userSchema.updateOne({ _id: customerId, email }, { blocked });
        if (!user) {
            throw new Error("Something went wrong");
        }
        return { msg: "User Blocked successfully" };
    }
    catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
}));
const updatePhotoUrl = (0, authenticated_1.default)((args, req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let userId = req.userId, image = args.image;
        const newImage = yield (0, ImageUpload_1.default)(image.file);
        yield models_1.default.userSchema.updateOne({ _id: userId }, {
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
exports.default = {
    register,
    login,
    forgetPassword,
    changePassword,
    updatePassword,
    modifyUser,
    user,
    users,
    blockUser,
    updatePhotoUrl,
    validateCode,
};

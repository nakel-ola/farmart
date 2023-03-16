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
const config_1 = __importDefault(require("../../../config"));
const emailData_1 = require("../../../data/emailData");
const emailer_1 = __importDefault(require("../../../helper/emailer"));
const exceptions_1 = require("../../../helper/exceptions");
const generateHash_1 = __importDefault(require("../../../helper/generateHash"));
const signToken_1 = __importDefault(require("../../../helper/signToken"));
const register = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, name, password, phoneNumber, inviteCode } = args.input;
        const { db, req } = ctx;
        let validate = null;
        if (req.admin && !inviteCode)
            throw new Error("Invite code is required");
        if (req.admin) {
            validate = yield db.invites.findOne({ email, inviteCode });
            if (!validate)
                throw new Error("Something went wrong");
        }
        const user = yield db.users.findOne({ email }, { email: 1 });
        if (user)
            throw (0, exceptions_1.ForbiddenException)(`User ${user.email} already exists`);
        const hash = (0, generateHash_1.default)(password);
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
            level: req.admin ? validate === null || validate === void 0 ? void 0 : validate.level : null,
        };
        const newUser = yield db.users.create(obj);
        const token = (0, signToken_1.default)(newUser._id.toString(), email);
        req.session.auth = token;
        yield (0, emailer_1.default)({
            from: config_1.default.email_from,
            to: email,
            subject: `Welcome to the ${config_1.default.app_name} family!`,
            text: "",
            html: (0, emailData_1.welcomeMsg)({ name }),
        });
        return { message: "Registration successful" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = register;

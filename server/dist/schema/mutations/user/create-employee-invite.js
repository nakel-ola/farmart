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
require("../../../data/emailData");
require("../../../helper/emailer");
const nanoid_1 = require("../../../helper/nanoid");
const createEmployeeInvite = (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, level } = args.input;
        const { db, redis } = ctx;
        const inviteCode = (0, nanoid_1.nanoid)(5), status = "pending";
        let link = `${config_1.default.admin_url}/?type=sign&code=${inviteCode}`;
        yield db.invites.create({ email, level, status, inviteCode });
        console.log(link);
        // await emailer({
        //   from: config.email_from,
        //   to: email,
        //   subject: `Your ${config.app_name} app verification code`,
        //   html: invitationMail({ link }),
        // });
        yield redis.del("employee-invites");
        return { message: "Invite sent successfully" };
    }
    catch (error) {
        console.log(error);
        throw new Error(error);
    }
});
exports.default = createEmployeeInvite;

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
exports.sendMail = void 0;
const googleapis_1 = require("googleapis");
const mail_composer_1 = __importDefault(require("nodemailer/lib/mail-composer"));
const gcredentials_json_1 = __importDefault(require("../data/gcredentials.json"));
const token_json_1 = __importDefault(require("../data/token.json"));
const getGmailService = () => {
    const { client_secret, client_id, redirect_uris } = gcredentials_json_1.default.web;
    const oAuth2Client = new googleapis_1.google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
    oAuth2Client.setCredentials(token_json_1.default);
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth: oAuth2Client });
    return gmail;
};
const encodeMessage = (message) => {
    return Buffer.from(message).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};
const createMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const mailComposer = new mail_composer_1.default(options);
    const message = yield mailComposer.compile().build();
    return encodeMessage(message);
});
const sendMail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const gmail = getGmailService();
    const rawMessage = yield createMail(options);
    const { data: { id } = {} } = yield gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw: rawMessage
        }
    });
    return id;
});
exports.sendMail = sendMail;
